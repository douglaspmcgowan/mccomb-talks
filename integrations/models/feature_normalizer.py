"""
Feature normalizer — the single place that converts raw dicts from each source
into the normalized `feats` dict that Model B consumes.

See docs/data-flow-to-models.md for the authoritative mapping.
"""

from __future__ import annotations
import datetime as dt
from typing import Any


def _first(*vals: Any, default: float = 0.0) -> float:
    """Return the first non-None, castable-to-float value."""
    for v in vals:
        if v is None:
            continue
        try:
            return float(v)
        except (TypeError, ValueError):
            continue
    return default


def normalize(
    raw: dict[str, dict[str, Any]],
    baseline: dict[str, float] | None = None,
) -> dict[str, float]:
    """
    Given a dict mapping source-name -> raw-metric-dict, produce the normalized
    feats dict that tick_B() expects.

    Missing sources degrade gracefully (zeros). See data-flow-to-models.md
    "Missing-data handling" table.

    `baseline` supplies per-user personal baselines (kpm p95, focus duration,
    etc.). Defaults to population averages.
    """
    baseline = baseline or {}
    aw  = raw.get("activitywatch", {}) or {}
    kb  = raw.get("keystrokes", {}) or {}
    gc  = raw.get("gcal", {}) or {}
    zm  = raw.get("zoom", {}) or {}
    sl  = raw.get("slack", {}) or {}          # noqa: F841 — captured for logging, not yet used in B
    td  = raw.get("todoist", {}) or {}
    ah  = raw.get("apple_health", {}) or {}
    rl  = raw.get("recovery_log", {}) or {}
    pr  = raw.get("proximity", {}) or {}

    # ── meetings: combine gcal + zoom (prefer zoom's actual) ──
    meeting_video_min = max(
        _first(gc.get("gcal_meeting_video_min")),
        _first(zm.get("zoom_actual_video_min")),
    )
    meeting_f2f_min = _first(gc.get("gcal_meeting_f2f_min"))
    zoom_bb = _first(zm.get("zoom_back_to_back_frac"), gc.get("gcal_back_to_back_frac"))

    # ── ActivityWatch behavioral ──
    context_switches = _first(aw.get("aw_context_switches"))
    focus_block_min  = _first(aw.get("aw_focus_block_min"))
    afk_10plus_min   = _first(aw.get("aw_afk_10plus_min"))
    detach_block_min = _first(aw.get("aw_detach_block_min"))
    # fragmentation: stddev(session length) / personal baseline − 1
    frag_raw = _first(aw.get("aw_fragmentation_stddev"))
    frag_base = baseline.get("fragmentation_stddev_baseline", 10.0)  # minutes
    fragmentation_dev = (frag_raw / frag_base - 1.0) if frag_base > 0 else 0.0

    # ── keystrokes (optional) ──
    p95_kpm   = _first(kb.get("kb_p95_kpm"))
    p95_base  = baseline.get("kpm_p95_baseline", 120.0)
    kpm_over  = max(0.0, min(2.0, (p95_kpm / p95_base - 1.0) if p95_base > 0 else 0.0))

    # ── Apple Health ──
    sleep_total_h     = _first(ah.get("health_sleep_total_h"))
    continuous_sleep_h = _first(ah.get("health_sleep_continuous_h"))
    hrv_z             = _first(ah.get("health_hrv_z"))
    target_sleep_h    = baseline.get("target_sleep_h", 7.0)
    sleep_debt_h      = max(0.0, target_sleep_h - sleep_total_h) if sleep_total_h > 0 else 0.0

    # ── Social proxies (recover side) ──
    # social_voice: 1:1 meetings from gcal + small voice calls from zoom
    social_voice_min = _first(gc.get("gcal_social_voice_min"), zm.get("zoom_social_voice_min"))

    # ── Recovery log ──
    outside_log_min  = _first(rl.get("outside_log_min"))
    walk_outside_min = _first(rl.get("walk_outside_min"))

    # ── Proximity (BLE) ──
    with_people_min = _first(pr.get("with_people_min"))

    # ── Todoist ──
    todoist_overdue = _first(td.get("todoist_overdue_count"))

    # ── After-hours ──
    # ActivityWatch provides active minutes per window, gcal tells us whether the
    # user's schedule considers this on-hours. Simple rule: after 18:00 or before 9:00
    # local, active time is "after hours."
    now_local = dt.datetime.now()
    is_after_hours = (now_local.hour >= 18) or (now_local.hour < 9)
    active_min     = _first(aw.get("aw_active_min"))
    tick_min       = _first(aw.get("aw_tick_min"), default=5.0)
    after_hours_frac = (active_min / tick_min) if (is_after_hours and tick_min > 0) else 0.0

    return {
        # drain (E)
        "meeting_video_min": meeting_video_min,
        "meeting_f2f_min":   meeting_f2f_min,
        "context_switches":  context_switches,
        "kpm_p95_over_base": kpm_over,
        # recover (E)
        "focus_block_min":   focus_block_min,
        "walk_outside_min":  walk_outside_min,
        "social_voice_min":  social_voice_min,
        "afk_10plus_min":    afk_10plus_min,
        "outside_log_min":   outside_log_min,
        "with_people_min":   with_people_min,
        # load (S)
        "sleep_debt_h":          sleep_debt_h,
        "after_hours_frac":      after_hours_frac,
        "fragmentation_dev":     fragmentation_dev,
        "hrv_z":                 hrv_z,
        "zoom_back_to_back_frac": zoom_bb,
        "todoist_overdue_count": todoist_overdue,
        # detach (S)
        "continuous_sleep_h": continuous_sleep_h,
        "detach_block_min":   detach_block_min,
    }


if __name__ == "__main__":
    # sanity check with empty raw
    feats = normalize({})
    print("All-empty feats (expect mostly zeros):", feats)
