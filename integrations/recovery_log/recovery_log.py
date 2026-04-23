"""
Recovery log — time outside, walks, with-people, detach blocks.

Entries are written to ~/.psych-battery/state.json by the Flask /log endpoint
(see integrations/models/main.py).

fetch_recent(since, until) returns:
  outside_log_min, walk_outside_min, with_people_log_min, detach_log_min
"""

from __future__ import annotations
import datetime as dt
import json
import pathlib
from typing import Any


STATE_FILE = pathlib.Path.home() / ".psych-battery" / "state.json"


def _load_log() -> list[dict[str, Any]]:
    if not STATE_FILE.exists():
        return []
    try:
        return json.loads(STATE_FILE.read_text()).get("recovery_log", [])
    except Exception:
        return []


def fetch_recent(since: dt.datetime, until: dt.datetime) -> dict[str, Any]:
    entries = _load_log()
    kinds = {"outside": 0.0, "walk": 0.0, "with_people": 0.0, "detach": 0.0}
    for e in entries:
        try:
            t = dt.datetime.fromisoformat(e["at"])
        except Exception:
            continue
        if since <= t <= until:
            k = e.get("kind")
            m = float(e.get("minutes", 0))
            if k in kinds:
                kinds[k] += m
    return {
        "outside_log_min":      kinds["outside"] + kinds["walk"],
        "walk_outside_min":     kinds["walk"],
        "with_people_log_min":  kinds["with_people"],
        "detach_log_min":       kinds["detach"],
    }
