"""
Apple Health watcher.

Route: an iOS Shortcut exports selected Health metrics to iCloud Drive nightly.
This watcher reads the JSON file and computes the features we need, including
a 14-day rolling HRV baseline for z-scoring.

Shortcut setup: see integrations/apple_health/SHORTCUT_SETUP.md

JSON schema expected (what the Shortcut writes):
  {
    "date": "2026-04-22",
    "sleep_total_h": 6.8,
    "sleep_continuous_h": 5.2,
    "hrv_sdnn_ms": 42.1,
    "steps": 8342,
    "active_kcal": 540
  }

fetch_recent(since, until) returns:
  health_hrv_ms, health_hrv_z, health_sleep_total_h, health_sleep_continuous_h,
  health_sleep_debt_h, health_steps_today, health_active_kcal_today
"""

from __future__ import annotations
import argparse
import datetime as dt
import json
import os
import pathlib
import statistics
from typing import Any


# Where the Shortcut writes. Default is the macOS iCloud Drive path. Configurable
# via the HEALTH_JSON_DIR env var.
_DEFAULT_ICLOUD = pathlib.Path.home() / "Library" / "Mobile Documents" / "com~apple~CloudDocs" / "PsychBattery"


def _json_dir() -> pathlib.Path:
    override = os.environ.get("HEALTH_JSON_DIR")
    if override:
        return pathlib.Path(override)
    return _DEFAULT_ICLOUD


def _latest_file() -> pathlib.Path | None:
    d = _json_dir()
    if not d.exists():
        return None
    files = sorted(d.glob("health-*.json"))
    return files[-1] if files else None


def _load_last_n(n: int = 14) -> list[dict[str, Any]]:
    d = _json_dir()
    if not d.exists():
        return []
    files = sorted(d.glob("health-*.json"))[-n:]
    out = []
    for f in files:
        try:
            out.append(json.loads(f.read_text()))
        except Exception:
            continue
    return out


def fetch_recent(since: dt.datetime, until: dt.datetime) -> dict[str, Any]:
    latest_file = _latest_file()
    if latest_file is None:
        return {}   # no data yet; normalizer defaults to 0s
    try:
        latest = json.loads(latest_file.read_text())
    except Exception:
        return {}

    history = _load_last_n(14)
    hrv_values = [h.get("hrv_sdnn_ms") for h in history if isinstance(h.get("hrv_sdnn_ms"), (int, float))]
    if len(hrv_values) >= 3:
        mean_h = statistics.mean(hrv_values)
        std_h = statistics.stdev(hrv_values) or 1.0
        hrv_z = (latest.get("hrv_sdnn_ms", mean_h) - mean_h) / std_h
    else:
        hrv_z = 0.0

    target_sleep_h = 7.0
    sleep_total_h = float(latest.get("sleep_total_h", 0.0))
    sleep_continuous_h = float(latest.get("sleep_continuous_h", 0.0))
    sleep_debt_h = max(0.0, target_sleep_h - sleep_total_h) if sleep_total_h > 0 else 0.0

    return {
        "health_hrv_ms":               float(latest.get("hrv_sdnn_ms", 0.0)),
        "health_hrv_z":                float(hrv_z),
        "health_sleep_total_h":        sleep_total_h,
        "health_sleep_continuous_h":   sleep_continuous_h,
        "health_sleep_debt_h":         sleep_debt_h,
        "health_steps_today":          float(latest.get("steps", 0)),
        "health_active_kcal_today":    float(latest.get("active_kcal", 0)),
    }


def _cli():
    p = argparse.ArgumentParser()
    p.add_argument("--once", action="store_true", help="Print the current reading and exit")
    args = p.parse_args()
    if args.once:
        now = dt.datetime.now()
        print(fetch_recent(now - dt.timedelta(hours=24), now))


if __name__ == "__main__":
    _cli()
