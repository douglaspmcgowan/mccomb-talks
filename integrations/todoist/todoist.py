"""
Todoist integration — completed tasks today, overdue count.

Auth: personal API token `TODOIST_API_TOKEN` from Todoist settings.

fetch_recent(since, until) returns:
  todoist_completed_today, todoist_overdue_count, todoist_completed_in_window
"""

from __future__ import annotations
import argparse
import datetime as dt
import os
from typing import Any

import requests


API_BASE = "https://api.todoist.com/rest/v2"
SYNC_BASE = "https://api.todoist.com/sync/v9"   # for completed-items history


def _headers() -> dict[str, str]:
    token = os.environ.get("TODOIST_API_TOKEN")
    if not token:
        raise RuntimeError("TODOIST_API_TOKEN not set.")
    return {"Authorization": f"Bearer {token}"}


def fetch_recent(since: dt.datetime, until: dt.datetime) -> dict[str, Any]:
    h = _headers()

    # overdue: current open tasks with due < today
    r = requests.get(f"{API_BASE}/tasks", headers=h, params={"filter": "overdue"}, timeout=10)
    r.raise_for_status()
    overdue = len(r.json())

    # completed items — use Sync API's completed endpoint
    since_iso = since.strftime("%Y-%m-%dT%H:%M:%S")
    until_iso = until.strftime("%Y-%m-%dT%H:%M:%S")
    r2 = requests.get(
        f"{SYNC_BASE}/completed/get_all",
        headers=h,
        params={"since": since_iso, "until": until_iso, "limit": 200},
        timeout=10,
    )
    if r2.status_code == 200:
        completed_in_window = len(r2.json().get("items", []))
    else:
        completed_in_window = 0

    # today's count (since midnight local)
    midnight = dt.datetime.combine(dt.date.today(), dt.time.min)
    r3 = requests.get(
        f"{SYNC_BASE}/completed/get_all",
        headers=h,
        params={"since": midnight.strftime("%Y-%m-%dT%H:%M:%S"), "limit": 500},
        timeout=10,
    )
    if r3.status_code == 200:
        completed_today = len(r3.json().get("items", []))
    else:
        completed_today = 0

    return {
        "todoist_overdue_count":       float(overdue),
        "todoist_completed_in_window": float(completed_in_window),
        "todoist_completed_today":     float(completed_today),
    }


def _cli():
    p = argparse.ArgumentParser()
    p.add_argument("--test", action="store_true")
    args = p.parse_args()
    if args.test:
        now = dt.datetime.now()
        print(fetch_recent(now - dt.timedelta(hours=1), now))


if __name__ == "__main__":
    _cli()
