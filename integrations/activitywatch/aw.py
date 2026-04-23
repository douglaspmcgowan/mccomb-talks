"""
ActivityWatch integration — focus blocks, context switches, idle time.

ActivityWatch runs a local server on :5600. We query it for events in the
window and derive the metrics we care about.

fetch_recent(since, until) returns:
  aw_focus_block_min, aw_context_switches, aw_afk_min, aw_afk_10plus_min,
  aw_detach_block_min, aw_active_min, aw_fragmentation_stddev, aw_tick_min

No auth needed (localhost).
"""

from __future__ import annotations
import argparse
import datetime as dt
import statistics
from typing import Any

try:
    from aw_client import ActivityWatchClient
except ImportError:
    ActivityWatchClient = None


_CLIENT = None


def _client():
    global _CLIENT
    if _CLIENT is None:
        if ActivityWatchClient is None:
            raise RuntimeError("aw-client not installed. pip install aw-client.")
        _CLIENT = ActivityWatchClient("psych-battery", testing=False)
    return _CLIENT


def _bucket_ids(prefix: str) -> list[str]:
    """Return all bucket IDs starting with prefix on this host."""
    c = _client()
    buckets = c.get_buckets()
    return [bid for bid in buckets.keys() if bid.startswith(prefix)]


def fetch_recent(since: dt.datetime, until: dt.datetime) -> dict[str, Any]:
    """Return ActivityWatch-derived features for the [since, until) window."""
    c = _client()
    window_min = (until - since).total_seconds() / 60.0

    # Find window and AFK buckets (one per host)
    window_buckets = _bucket_ids("aw-watcher-window")
    afk_buckets    = _bucket_ids("aw-watcher-afk")

    window_events = []
    for bid in window_buckets:
        window_events.extend(c.get_events(bid, start=since, end=until))
    afk_events = []
    for bid in afk_buckets:
        afk_events.extend(c.get_events(bid, start=since, end=until))

    # ── active vs afk minutes ──
    active_sec = 0.0
    afk_sec    = 0.0
    afk_blocks = []   # list of (duration_sec) for contiguous AFK periods
    for e in afk_events:
        dur = float(e.duration.total_seconds()) if hasattr(e.duration, "total_seconds") else float(e.duration)
        status = e.data.get("status", "")
        if status == "afk":
            afk_sec += dur
            afk_blocks.append(dur)
        else:
            active_sec += dur

    afk_10plus_sec = sum(d for d in afk_blocks if d >= 10 * 60)
    detach_sec     = sum(d for d in afk_blocks if d >= 60 * 60)

    # ── context switches (app changes in window bucket) ──
    last_app = None
    context_switches = 0
    session_lengths_sec = []
    current_app_start_sec = 0.0
    for e in window_events:
        app = e.data.get("app", "")
        dur = float(e.duration.total_seconds()) if hasattr(e.duration, "total_seconds") else float(e.duration)
        if app != last_app:
            if last_app is not None and current_app_start_sec > 0:
                session_lengths_sec.append(current_app_start_sec)
            context_switches += 1
            current_app_start_sec = dur
            last_app = app
        else:
            current_app_start_sec += dur
    if current_app_start_sec > 0:
        session_lengths_sec.append(current_app_start_sec)

    # focus blocks = sessions ≥ 25 min
    focus_block_sec = sum(s for s in session_lengths_sec if s >= 25 * 60)

    # fragmentation (stddev of session lengths, in minutes)
    if len(session_lengths_sec) >= 2:
        frag_std = statistics.stdev([s / 60 for s in session_lengths_sec])
    else:
        frag_std = 0.0

    return {
        "aw_active_min":            active_sec / 60,
        "aw_tick_min":              window_min,
        "aw_focus_block_min":       focus_block_sec / 60,
        "aw_context_switches":      float(context_switches),
        "aw_afk_min":               afk_sec / 60,
        "aw_afk_10plus_min":        afk_10plus_sec / 60,
        "aw_detach_block_min":      detach_sec / 60,
        "aw_fragmentation_stddev":  frag_std,
    }


def _cli():
    p = argparse.ArgumentParser()
    p.add_argument("--test", action="store_true", help="Fetch the last hour and print")
    args = p.parse_args()
    if args.test:
        now = dt.datetime.now()
        out = fetch_recent(now - dt.timedelta(hours=1), now)
        for k, v in out.items():
            print(f"  {k}: {v:.2f}" if isinstance(v, float) else f"  {k}: {v}")


if __name__ == "__main__":
    _cli()
