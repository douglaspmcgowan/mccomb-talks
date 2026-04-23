"""
Psych Battery main loop.

- Every 5 minutes: fetch from each configured source, normalize, tick Model B,
  compute display-energy via Model D, write state to disk.
- Serves `/state` (JSON) and `/log` (recovery log form) via Flask on :7070.

Run with:
    python -m integrations.models.main

Environment (loaded from ~/.psych-battery/secrets.env):
    OPENAI_API_KEY_HADM=...
    SLACK_USER_TOKEN=xoxp-...
    TODOIST_API_TOKEN=...
    ZOOM_ACCOUNT_ID=...
    ZOOM_CLIENT_ID=...
    ZOOM_CLIENT_SECRET=...
"""

from __future__ import annotations
import datetime as dt
import json
import logging
import os
import pathlib
import threading
import time
from typing import Any

from flask import Flask, jsonify, request, send_from_directory

from .model_b import DEFAULT_PARAMS, display_energy, tick_B
from .model_d import Chronotype, expected_energy
from .feature_normalizer import normalize


# ── constants ──
STATE_DIR = pathlib.Path.home() / ".psych-battery"
STATE_DIR.mkdir(parents=True, exist_ok=True)
STATE_FILE = STATE_DIR / "state.json"
SECRETS_FILE = STATE_DIR / "secrets.env"

TICK_SECONDS = 5 * 60

log = logging.getLogger("psych_battery")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")


# ── secrets loader (no printing values; just loads into os.environ) ──
def load_secrets() -> None:
    if not SECRETS_FILE.exists():
        log.warning("No secrets file at %s — some integrations will be skipped.", SECRETS_FILE)
        return
    for line in SECRETS_FILE.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        k, v = line.split("=", 1)
        k = k.strip()
        v = v.strip().strip('"').strip("'")
        if v:
            os.environ.setdefault(k, v)


# ── source fetchers (imported lazily so missing optional deps don't crash startup) ──
def _safe_fetch(name: str, fn, *args, **kwargs) -> dict[str, Any]:
    try:
        return fn(*args, **kwargs) or {}
    except Exception as e:
        log.warning("Source %s failed: %s", name, e)
        return {}


def fetch_all(since: dt.datetime, until: dt.datetime) -> dict[str, dict[str, Any]]:
    """Call every configured integration's fetch_recent, returning a raw dict."""
    raw: dict[str, dict[str, Any]] = {}

    try:
        from integrations.activitywatch.aw import fetch_recent as aw_fetch
        raw["activitywatch"] = _safe_fetch("activitywatch", aw_fetch, since, until)
    except ImportError:
        pass

    try:
        from integrations.slack.slack import fetch_recent as slack_fetch
        raw["slack"] = _safe_fetch("slack", slack_fetch, since, until)
    except ImportError:
        pass

    try:
        from integrations.gcal.gcal import fetch_recent as gcal_fetch
        raw["gcal"] = _safe_fetch("gcal", gcal_fetch, since, until)
    except ImportError:
        pass

    try:
        from integrations.todoist.todoist import fetch_recent as todoist_fetch
        raw["todoist"] = _safe_fetch("todoist", todoist_fetch, since, until)
    except ImportError:
        pass

    try:
        from integrations.zoom.zoom import fetch_recent as zoom_fetch
        raw["zoom"] = _safe_fetch("zoom", zoom_fetch, since, until)
    except ImportError:
        pass

    try:
        from integrations.apple_health.health_watcher import fetch_recent as ah_fetch
        raw["apple_health"] = _safe_fetch("apple_health", ah_fetch, since, until)
    except ImportError:
        pass

    try:
        from integrations.keystrokes.keystrokes import fetch_recent as kb_fetch
        raw["keystrokes"] = _safe_fetch("keystrokes", kb_fetch, since, until)
    except ImportError:
        pass

    try:
        from integrations.recovery_log.recovery_log import fetch_recent as rl_fetch
        raw["recovery_log"] = _safe_fetch("recovery_log", rl_fetch, since, until)
    except ImportError:
        pass

    try:
        from integrations.proximity.receiver import fetch_recent as prox_fetch
        raw["proximity"] = _safe_fetch("proximity", prox_fetch, since, until)
    except ImportError:
        pass

    return raw


# ── state I/O ──
def load_state() -> dict[str, Any]:
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text())
        except json.JSONDecodeError:
            pass
    return {
        "E": 70.0,
        "S": 30.0,
        "last_tick_iso": None,
        "chronotype": "intermediate",
        "baseline": {},  # per-user baselines accumulate here
        "phase": 0,      # 0 = cold, 1 = warm, 2 = stable
        "recovery_log": [],
    }


def save_state(state: dict[str, Any]) -> None:
    tmp = STATE_FILE.with_suffix(".tmp")
    tmp.write_text(json.dumps(state, indent=2, default=str))
    tmp.replace(STATE_FILE)


# ── Flask server ──
app = Flask(__name__)
_STATE_LOCK = threading.Lock()


@app.get("/state")
def state_endpoint():
    """JSON state for the battery hardware to poll."""
    with _STATE_LOCK:
        st = load_state()
    # surface just the display-relevant fields
    return jsonify({
        "E_display": st.get("E_display", st["E"]),
        "S":         st["S"],
        "phase":     st.get("phase", 0),
        "last_tick": st.get("last_tick_iso"),
        "chronotype": st.get("chronotype", "intermediate"),
    })


@app.get("/log")
def log_form():
    """Serve the recovery-log form."""
    form_path = pathlib.Path(__file__).parent.parent / "recovery_log" / "form.html"
    if form_path.exists():
        return form_path.read_text()
    return "<h1>Recovery log form not found</h1>", 404


@app.post("/log")
def log_post():
    """Accept a recovery-log entry and append to state."""
    data = request.get_json(silent=True) or request.form.to_dict()
    kind = data.get("kind")                      # 'outside' | 'walk' | 'with_people' | 'detach'
    minutes = float(data.get("minutes", 0))
    if kind not in {"outside", "walk", "with_people", "detach"} or minutes <= 0:
        return jsonify({"ok": False, "error": "bad kind or minutes"}), 400

    with _STATE_LOCK:
        st = load_state()
        st.setdefault("recovery_log", []).append({
            "kind": kind,
            "minutes": minutes,
            "at": dt.datetime.now().isoformat(),
        })
        save_state(st)
    log.info("Recovery log: %s +%.1f min", kind, minutes)
    return jsonify({"ok": True})


# ── main tick loop ──
def run_tick() -> None:
    with _STATE_LOCK:
        st = load_state()

    now = dt.datetime.now()
    last_iso = st.get("last_tick_iso")
    last_t = dt.datetime.fromisoformat(last_iso) if last_iso else (now - dt.timedelta(minutes=5))

    # Fetch signals
    raw = fetch_all(last_t, now)
    feats = normalize(raw, baseline=st.get("baseline", {}))

    # Model D: compute current E_rest
    chronotype: Chronotype = st.get("chronotype", "intermediate")  # type: ignore
    E_rest_now = expected_energy(now, chronotype)

    # Model B tick
    params = {**DEFAULT_PARAMS, "E_rest": E_rest_now}
    E_new, S_new = tick_B(st["E"], st["S"], feats, params)

    # Display energy anchored to Model D's current prior
    E_disp = display_energy(E_new, E_rest_now)

    # Update state
    with _STATE_LOCK:
        st = load_state()
        st["E"] = E_new
        st["S"] = S_new
        st["E_display"] = E_disp
        st["last_tick_iso"] = now.isoformat()
        st["last_feats"] = feats
        save_state(st)

    log.info(
        "Tick @ %s | E_internal=%.1f E_display=%.1f S=%.1f | E_rest_now=%.1f",
        now.strftime("%H:%M"), E_new, E_disp, S_new, E_rest_now,
    )


def tick_loop() -> None:
    """Run ticks every TICK_SECONDS in a background thread."""
    while True:
        try:
            run_tick()
        except Exception as e:
            log.exception("Tick failed: %s", e)
        time.sleep(TICK_SECONDS)


def main() -> None:
    load_secrets()
    log.info("Psych Battery starting. State dir: %s", STATE_DIR)

    # Start the tick loop in a thread
    t = threading.Thread(target=tick_loop, daemon=True, name="tick-loop")
    t.start()

    # Serve /state and /log
    app.run(host="127.0.0.1", port=7070)


if __name__ == "__main__":
    main()
