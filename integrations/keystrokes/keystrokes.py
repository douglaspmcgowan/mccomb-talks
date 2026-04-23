"""
Keystrokes / clicks per minute — AGGREGATE COUNTS ONLY.

NEVER stores which keys are pressed. The listener increments a counter each
time a key or click event arrives and discards the event. Per-minute counts
are appended to a local SQLite file.

Because pynput is flaky on macOS (Accessibility + Input Monitoring
permissions), this integration is DISABLED by default. Set
  SKIP_FOR_PHASE_1 = False
below and grant permissions before enabling.

fetch_recent(since, until) returns:
  kb_keystrokes_per_min, kb_p95_kpm, mouse_clicks_per_min, kb_pause_p50_ms
"""

from __future__ import annotations
import argparse
import datetime as dt
import os
import pathlib
import sqlite3
import statistics
import threading
import time
from collections import deque
from typing import Any


SKIP_FOR_PHASE_1 = True   # flip to False to enable


STATE_DIR = pathlib.Path.home() / ".psych-battery"
STATE_DIR.mkdir(parents=True, exist_ok=True)
DB_FILE = STATE_DIR / "keystrokes.sqlite"

_bucket_lock = threading.Lock()
_current_bucket = {"minute_iso": None, "keys": 0, "clicks": 0, "last_event_ts": 0.0, "pauses_ms": []}


def _init_db() -> None:
    with sqlite3.connect(DB_FILE) as c:
        c.execute("""
            CREATE TABLE IF NOT EXISTS per_minute (
                minute_iso TEXT PRIMARY KEY,
                keys INTEGER,
                clicks INTEGER,
                pause_median_ms REAL
            )
        """)


def _flush_bucket() -> None:
    with _bucket_lock:
        b = _current_bucket
        if not b["minute_iso"]:
            return
        pause_median = statistics.median(b["pauses_ms"]) if b["pauses_ms"] else 0.0
        with sqlite3.connect(DB_FILE) as c:
            c.execute(
                "INSERT OR REPLACE INTO per_minute VALUES (?, ?, ?, ?)",
                (b["minute_iso"], b["keys"], b["clicks"], pause_median),
            )
        _current_bucket.update({
            "minute_iso": None, "keys": 0, "clicks": 0,
            "last_event_ts": 0.0, "pauses_ms": [],
        })


def _record_event(kind: str) -> None:
    now = time.time()
    minute_iso = dt.datetime.fromtimestamp(now).strftime("%Y-%m-%dT%H:%M")
    with _bucket_lock:
        if _current_bucket["minute_iso"] != minute_iso:
            _flush_bucket_locked()
            _current_bucket["minute_iso"] = minute_iso
        if kind == "key":
            _current_bucket["keys"] += 1
            if _current_bucket["last_event_ts"] > 0:
                _current_bucket["pauses_ms"].append((now - _current_bucket["last_event_ts"]) * 1000)
        elif kind == "click":
            _current_bucket["clicks"] += 1
        _current_bucket["last_event_ts"] = now


def _flush_bucket_locked() -> None:
    """Flush without re-acquiring the lock (caller holds it)."""
    b = _current_bucket
    if not b["minute_iso"]:
        return
    pause_median = statistics.median(b["pauses_ms"]) if b["pauses_ms"] else 0.0
    with sqlite3.connect(DB_FILE) as c:
        c.execute(
            "INSERT OR REPLACE INTO per_minute VALUES (?, ?, ?, ?)",
            (b["minute_iso"], b["keys"], b["clicks"], pause_median),
        )
    _current_bucket.update({
        "minute_iso": None, "keys": 0, "clicks": 0,
        "last_event_ts": 0.0, "pauses_ms": [],
    })


def start_listener() -> None:
    """Start background pynput listeners. Idempotent; safe to call once at startup."""
    if SKIP_FOR_PHASE_1:
        return
    try:
        from pynput import keyboard, mouse
    except ImportError:
        return
    _init_db()

    def on_key(_key):
        _record_event("key")
    def on_click(_x, _y, _button, pressed):
        if pressed:
            _record_event("click")

    keyboard.Listener(on_press=on_key).start()
    mouse.Listener(on_click=on_click).start()


def fetch_recent(since: dt.datetime, until: dt.datetime) -> dict[str, Any]:
    if SKIP_FOR_PHASE_1:
        return {}
    _flush_bucket()
    _init_db()
    since_iso = since.strftime("%Y-%m-%dT%H:%M")
    until_iso = until.strftime("%Y-%m-%dT%H:%M")
    with sqlite3.connect(DB_FILE) as c:
        rows = c.execute(
            "SELECT keys, clicks, pause_median_ms FROM per_minute WHERE minute_iso BETWEEN ? AND ?",
            (since_iso, until_iso),
        ).fetchall()
    if not rows:
        return {}
    keys_per_min = [r[0] for r in rows]
    clicks_per_min = [r[1] for r in rows]
    pauses = [r[2] for r in rows if r[2] > 0]
    p95_kpm = 0.0
    if len(keys_per_min) >= 5:
        sorted_k = sorted(keys_per_min)
        p95_kpm = float(sorted_k[int(0.95 * (len(sorted_k) - 1))])
    return {
        "kb_keystrokes_per_min": float(statistics.mean(keys_per_min)) if keys_per_min else 0.0,
        "kb_p95_kpm":            p95_kpm,
        "mouse_clicks_per_min":  float(statistics.mean(clicks_per_min)) if clicks_per_min else 0.0,
        "kb_pause_p50_ms":       float(statistics.median(pauses)) if pauses else 0.0,
    }


def _cli():
    p = argparse.ArgumentParser()
    p.add_argument("--test", action="store_true", help="Start a listener for 60 seconds")
    args = p.parse_args()
    if args.test:
        if SKIP_FOR_PHASE_1:
            print("SKIP_FOR_PHASE_1 = True. Flip to False in this file to enable.")
            return
        start_listener()
        print("Listening for 60s... type something.")
        time.sleep(60)
        print(fetch_recent(dt.datetime.now() - dt.timedelta(minutes=2), dt.datetime.now()))


if __name__ == "__main__":
    _cli()
