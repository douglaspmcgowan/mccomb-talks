"""
Proximity receiver — BLE scanner on the laptop.

Listens for configured BLE beacon UUIDs (either ESP32 batteries or iPhone
beacons) and logs "nearby" minutes when RSSI exceeds the threshold.

Each beacon scan is ~1 second. Results feed with_people_min into Model B.

Configure target UUIDs + thresholds in integrations/proximity/config.yaml:
    beacons:
      - uuid: "aaaaaaaa-...."
        label: "second_battery"
        rssi_threshold: -70
      - uuid: "bbbbbbbb-...."
        label: "iphone"
        rssi_threshold: -75

fetch_recent(since, until) returns:
  with_people_min  (how many minutes during the window any beacon was nearby)
"""

from __future__ import annotations
import argparse
import asyncio
import datetime as dt
import json
import pathlib
import threading
import time
from typing import Any

import yaml


STATE_DIR = pathlib.Path.home() / ".psych-battery"
STATE_DIR.mkdir(parents=True, exist_ok=True)
PROXIMITY_LOG = STATE_DIR / "proximity-log.jsonl"
CONFIG_FILE = pathlib.Path(__file__).parent / "config.yaml"

_SCAN_INTERVAL_SEC = 60   # one scan per minute


def _load_config() -> list[dict[str, Any]]:
    if not CONFIG_FILE.exists():
        return []
    return (yaml.safe_load(CONFIG_FILE.read_text()) or {}).get("beacons", [])


async def _one_scan(beacons: list[dict[str, Any]]) -> dict[str, int]:
    """Return {label: best_rssi_observed} across a ~5s scan."""
    try:
        from bleak import BleakScanner
    except ImportError:
        return {}

    wanted = {b["uuid"].lower(): b for b in beacons}
    found: dict[str, int] = {}

    def _cb(device, advertisement_data):
        uuids = [u.lower() for u in (advertisement_data.service_uuids or [])]
        for u in uuids:
            if u in wanted:
                rssi = advertisement_data.rssi if advertisement_data.rssi is not None else -100
                label = wanted[u]["label"]
                if rssi > found.get(label, -999):
                    found[label] = rssi

    scanner = BleakScanner(detection_callback=_cb)
    await scanner.start()
    await asyncio.sleep(5.0)
    await scanner.stop()
    return found


def _append_log(entry: dict[str, Any]) -> None:
    with PROXIMITY_LOG.open("a") as f:
        f.write(json.dumps(entry) + "\n")


def start_scanner() -> None:
    """Run scans forever in a background thread."""
    beacons = _load_config()
    if not beacons:
        return

    def _run():
        while True:
            try:
                found = asyncio.run(_one_scan(beacons))
            except Exception:
                found = {}
            nearby = []
            for b in beacons:
                rssi = found.get(b["label"])
                thresh = b.get("rssi_threshold", -70)
                if rssi is not None and rssi >= thresh:
                    nearby.append(b["label"])
            if nearby:
                _append_log({
                    "at": dt.datetime.now().isoformat(),
                    "duration_min": _SCAN_INTERVAL_SEC / 60,
                    "labels": nearby,
                })
            time.sleep(_SCAN_INTERVAL_SEC)

    t = threading.Thread(target=_run, daemon=True, name="ble-scanner")
    t.start()


def fetch_recent(since: dt.datetime, until: dt.datetime) -> dict[str, Any]:
    if not PROXIMITY_LOG.exists():
        return {}
    nearby_min = 0.0
    with PROXIMITY_LOG.open() as f:
        for line in f:
            try:
                e = json.loads(line)
                t = dt.datetime.fromisoformat(e["at"])
                if since <= t <= until:
                    nearby_min += float(e.get("duration_min", 0))
            except Exception:
                continue
    return {"with_people_min": nearby_min}


def _cli():
    p = argparse.ArgumentParser()
    p.add_argument("--scan-once", action="store_true", help="One scan + print")
    p.add_argument("--listen", action="store_true", help="Run scanner forever")
    args = p.parse_args()
    beacons = _load_config()
    if args.scan_once:
        print("Config beacons:", beacons)
        found = asyncio.run(_one_scan(beacons))
        print("Scan result:", found)
    elif args.listen:
        start_scanner()
        print(f"Scanner running. Logging to {PROXIMITY_LOG}. Ctrl-C to stop.")
        while True:
            time.sleep(60)


if __name__ == "__main__":
    _cli()
