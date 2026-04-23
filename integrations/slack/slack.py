"""
Slack integration — message counts and timing.

Returns counts and timing variance only. NEVER stores message text.

Auth: user token `SLACK_USER_TOKEN` (xoxp-...) with scopes
  channels:history, groups:history, im:history, mpim:history, users:read

fetch_recent(since, until) returns:
  slack_msg_count, slack_msg_received_count,
  slack_after_hours_frac, slack_burst_score
"""

from __future__ import annotations
import argparse
import datetime as dt
import os
import statistics
from typing import Any

try:
    from slack_sdk import WebClient
    from slack_sdk.errors import SlackApiError
except ImportError:
    WebClient = None
    SlackApiError = Exception


def _client():
    token = os.environ.get("SLACK_USER_TOKEN")
    if not token:
        raise RuntimeError("SLACK_USER_TOKEN not set.")
    if WebClient is None:
        raise RuntimeError("slack-sdk not installed. pip install slack-sdk.")
    return WebClient(token=token)


def _me(c) -> str:
    return c.auth_test()["user_id"]


def _is_after_hours(ts: float) -> bool:
    """9–18 local is 'on hours'; everything else is after-hours."""
    h = dt.datetime.fromtimestamp(ts).hour
    return (h >= 18) or (h < 9)


def fetch_recent(since: dt.datetime, until: dt.datetime) -> dict[str, Any]:
    c = _client()
    me = _me(c)

    # List all channels the user is a member of (public + private + DM + MPIM)
    channels = []
    cursor = None
    while True:
        resp = c.conversations_list(
            types="public_channel,private_channel,im,mpim",
            exclude_archived=True,
            limit=200,
            cursor=cursor,
        )
        for ch in resp["channels"]:
            if ch.get("is_member", True):
                channels.append(ch["id"])
        cursor = resp.get("response_metadata", {}).get("next_cursor")
        if not cursor:
            break

    since_ts = since.timestamp()
    until_ts = until.timestamp()
    sent_ts: list[float] = []
    received_count = 0

    for chan_id in channels:
        try:
            resp = c.conversations_history(
                channel=chan_id,
                oldest=str(since_ts),
                latest=str(until_ts),
                limit=200,
                inclusive=False,
            )
        except SlackApiError:
            continue
        for msg in resp.get("messages", []):
            # Never inspect msg['text']. We only care about sender + timestamp.
            ts = float(msg.get("ts", 0))
            user = msg.get("user")
            if user == me:
                sent_ts.append(ts)
            elif user is not None:
                received_count += 1

    # After-hours fraction (of sent messages)
    if sent_ts:
        after_hours_frac = sum(1 for t in sent_ts if _is_after_hours(t)) / len(sent_ts)
    else:
        after_hours_frac = 0.0

    # Burst score: coefficient of variation of inter-message gaps (higher = more bursty)
    burst_score = 0.0
    if len(sent_ts) >= 3:
        sent_ts.sort()
        gaps = [sent_ts[i+1] - sent_ts[i] for i in range(len(sent_ts)-1)]
        mean_g = statistics.mean(gaps)
        if mean_g > 0:
            burst_score = statistics.stdev(gaps) / mean_g

    return {
        "slack_msg_count":          float(len(sent_ts)),
        "slack_msg_received_count": float(received_count),
        "slack_after_hours_frac":   after_hours_frac,
        "slack_burst_score":        burst_score,
    }


def _cli():
    p = argparse.ArgumentParser()
    p.add_argument("--test", action="store_true", help="Fetch last hour and print")
    args = p.parse_args()
    if args.test:
        now = dt.datetime.now()
        print(fetch_recent(now - dt.timedelta(hours=1), now))


if __name__ == "__main__":
    _cli()
