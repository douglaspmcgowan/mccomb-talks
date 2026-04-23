"""
Google Calendar integration — meetings (video vs in-person), back-to-back density.

Auth: OAuth desktop app. Credentials JSON at ~/.psych-battery/gcal-credentials.json
(downloaded from console.cloud.google.com). Token saved to
~/.psych-battery/gcal-token.json on first run.

fetch_recent(since, until) returns:
  gcal_meeting_video_min, gcal_meeting_f2f_min, gcal_attendee_count,
  gcal_back_to_back_frac, gcal_after_hours_frac, gcal_social_voice_min
"""

from __future__ import annotations
import argparse
import datetime as dt
import json
import pathlib
from typing import Any

try:
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build
except ImportError:
    Credentials = None


STATE_DIR = pathlib.Path.home() / ".psych-battery"
CRED_FILE = STATE_DIR / "gcal-credentials.json"
TOKEN_FILE = STATE_DIR / "gcal-token.json"
SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]


def _is_video_meeting(event: dict[str, Any]) -> bool:
    """Heuristic: does the event have a conferencing link?"""
    if event.get("conferenceData"):
        return True
    loc = (event.get("location") or "").lower()
    desc = (event.get("description") or "").lower()   # OK — we only regex, we don't store
    for keyword in ("zoom.us", "meet.google.com", "teams.microsoft.com", "webex.com"):
        if keyword in loc or keyword in desc:
            return True
    return False


def _load_creds():
    if Credentials is None:
        raise RuntimeError("google-auth libraries not installed.")
    if not TOKEN_FILE.exists():
        raise RuntimeError(f"Not authenticated. Run: python -m integrations.gcal.gcal --auth")
    creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
    if not creds.valid and creds.expired and creds.refresh_token:
        creds.refresh(Request())
        TOKEN_FILE.write_text(creds.to_json())
    return creds


def _service():
    return build("calendar", "v3", credentials=_load_creds(), cache_discovery=False)


def auth_flow() -> None:
    """Run the one-time OAuth flow."""
    if not CRED_FILE.exists():
        raise RuntimeError(f"Credentials file missing: {CRED_FILE}")
    flow = InstalledAppFlow.from_client_secrets_file(str(CRED_FILE), SCOPES)
    creds = flow.run_local_server(port=0)
    TOKEN_FILE.write_text(creds.to_json())
    print(f"Saved token to {TOKEN_FILE}")


def _as_utc(t: dt.datetime) -> dt.datetime:
    """Coerce to a tz-aware UTC datetime. Naive inputs are assumed to be LOCAL time."""
    if t.tzinfo is None:
        return t.astimezone(dt.timezone.utc)  # uses local tz, then converts
    return t.astimezone(dt.timezone.utc)


def fetch_recent(since: dt.datetime, until: dt.datetime) -> dict[str, Any]:
    svc = _service()
    since_utc = _as_utc(since)
    until_utc = _as_utc(until)
    # Fetch the union of [since, until] and the trailing 3h so back_to_back can see
    # meetings that ended earlier in the 3h window even on a 5-minute tick.
    query_from = min(since_utc, until_utc - dt.timedelta(hours=3))
    events_result = svc.events().list(
        calendarId="primary",
        timeMin=query_from.isoformat().replace("+00:00", "Z"),
        timeMax=until_utc.isoformat().replace("+00:00", "Z"),
        singleEvents=True,
        orderBy="startTime",
        maxResults=250,
    ).execute()
    events = events_result.get("items", [])

    video_min = 0.0
    f2f_min = 0.0
    social_voice_min = 0.0
    attendee_count = 0
    after_hours_min = 0.0
    total_meeting_min = 0.0

    for ev in events:
        start = ev["start"].get("dateTime")
        end = ev["end"].get("dateTime")
        if not start or not end:
            continue   # all-day events
        s = dt.datetime.fromisoformat(start.replace("Z", "+00:00"))
        e = dt.datetime.fromisoformat(end.replace("Z", "+00:00"))
        # Overlap with the primary [since, until] window for the main metrics
        s_overlap = max(s, since_utc)
        e_overlap = min(e, until_utc)
        if e_overlap <= s_overlap:
            continue
        mins = (e_overlap - s_overlap).total_seconds() / 60.0

        attendees = ev.get("attendees", [])
        attendee_count += len(attendees)
        total_meeting_min += mins
        if _is_video_meeting(ev):
            video_min += mins
        else:
            f2f_min += mins

        # 1:1 social voice: 2 attendees (me + other)
        if len(attendees) == 2:
            social_voice_min += mins

        # After-hours portion (local)
        local_s = s_overlap.astimezone().replace(tzinfo=None)
        hour = local_s.hour
        if hour >= 18 or hour < 9:
            after_hours_min += mins

    # Back-to-back fraction: frac of last 3h in meetings (look backward from `until`)
    bb_window_start = until_utc - dt.timedelta(hours=3)
    bb_min = 0.0
    for ev in events:
        start = ev["start"].get("dateTime")
        end = ev["end"].get("dateTime")
        if not start or not end:
            continue
        s = dt.datetime.fromisoformat(start.replace("Z", "+00:00"))
        e = dt.datetime.fromisoformat(end.replace("Z", "+00:00"))
        s_o = max(s, bb_window_start)
        e_o = min(e, until_utc)
        if e_o > s_o:
            bb_min += (e_o - s_o).total_seconds() / 60.0
    back_to_back_frac = min(1.0, bb_min / (3 * 60))

    after_hours_frac = (after_hours_min / total_meeting_min) if total_meeting_min > 0 else 0.0

    return {
        "gcal_meeting_video_min": video_min,
        "gcal_meeting_f2f_min":   f2f_min,
        "gcal_social_voice_min":  social_voice_min,
        "gcal_attendee_count":    float(attendee_count),
        "gcal_back_to_back_frac": back_to_back_frac,
        "gcal_after_hours_frac":  after_hours_frac,
    }


def _cli():
    p = argparse.ArgumentParser()
    p.add_argument("--auth", action="store_true", help="Run OAuth flow")
    p.add_argument("--test", action="store_true", help="Fetch next 24h and print")
    args = p.parse_args()
    if args.auth:
        auth_flow()
    elif args.test:
        now = dt.datetime.utcnow()
        print(fetch_recent(now, now + dt.timedelta(hours=24)))


if __name__ == "__main__":
    _cli()
