"""
Zoom integration — actual meeting minutes + back-to-back density.

Auth: Server-to-Server OAuth. Required env vars:
  ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET

Requires a Pro-or-higher Zoom account with Report API access.
Free accounts: skip this — feature_normalizer falls back to gcal-only.

fetch_recent(since, until) returns:
  zoom_actual_video_min, zoom_back_to_back_frac, zoom_social_voice_min
"""

from __future__ import annotations
import argparse
import base64
import datetime as dt
import os
import time
from typing import Any

import requests


_token_cache: dict[str, Any] = {"token": None, "expires_at": 0}


def _get_access_token() -> str:
    account_id = os.environ.get("ZOOM_ACCOUNT_ID")
    client_id = os.environ.get("ZOOM_CLIENT_ID")
    client_secret = os.environ.get("ZOOM_CLIENT_SECRET")
    if not (account_id and client_id and client_secret):
        raise RuntimeError("ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET must be set.")

    if _token_cache["token"] and time.time() < _token_cache["expires_at"] - 30:
        return _token_cache["token"]

    basic = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    r = requests.post(
        "https://zoom.us/oauth/token",
        headers={"Authorization": f"Basic {basic}"},
        params={"grant_type": "account_credentials", "account_id": account_id},
        timeout=10,
    )
    r.raise_for_status()
    j = r.json()
    _token_cache["token"] = j["access_token"]
    _token_cache["expires_at"] = time.time() + j.get("expires_in", 3600)
    return _token_cache["token"]


def fetch_recent(since: dt.datetime, until: dt.datetime) -> dict[str, Any]:
    tok = _get_access_token()
    h = {"Authorization": f"Bearer {tok}"}

    # Report API: meetings for "me" in the date window (needs date, not datetime)
    from_d = since.date().isoformat()
    to_d = until.date().isoformat()
    r = requests.get(
        "https://api.zoom.us/v2/report/users/me/meetings",
        headers=h,
        params={"from": from_d, "to": to_d, "page_size": 100, "type": "past"},
        timeout=15,
    )
    r.raise_for_status()
    meetings = r.json().get("meetings", [])

    actual_video_min = 0.0
    social_voice_min = 0.0
    bb_min = 0.0
    bb_window_start = until - dt.timedelta(hours=3)

    for m in meetings:
        # start_time and end_time or duration (in minutes)
        start_str = m.get("start_time")
        if not start_str:
            continue
        s = dt.datetime.fromisoformat(start_str.replace("Z", "+00:00"))
        duration_min = float(m.get("duration", 0))
        e = s + dt.timedelta(minutes=duration_min)

        # overlap with our fetch window
        s_o = max(s, since.astimezone(s.tzinfo))
        e_o = min(e, until.astimezone(e.tzinfo))
        if e_o > s_o:
            mins = (e_o - s_o).total_seconds() / 60.0
            actual_video_min += mins
            participants = float(m.get("participants_count", 2))
            if participants <= 2:
                social_voice_min += mins

        # Back-to-back window overlap
        bs_o = max(s, bb_window_start.astimezone(s.tzinfo))
        be_o = min(e, until.astimezone(e.tzinfo))
        if be_o > bs_o:
            bb_min += (be_o - bs_o).total_seconds() / 60.0

    return {
        "zoom_actual_video_min":   actual_video_min,
        "zoom_social_voice_min":   social_voice_min,
        "zoom_back_to_back_frac":  min(1.0, bb_min / (3 * 60)),
    }


def _cli():
    p = argparse.ArgumentParser()
    p.add_argument("--test", action="store_true")
    args = p.parse_args()
    if args.test:
        now = dt.datetime.now()
        print(fetch_recent(now - dt.timedelta(days=1), now))


if __name__ == "__main__":
    _cli()
