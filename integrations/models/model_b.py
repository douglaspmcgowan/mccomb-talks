"""
Model B — two-compartment dynamical model for Energy (E) and Stress (S).

One tick = one fixed-step Euler integration step at `dt_min` minutes.
E has a fast time constant (~2 h). S has a slow time constant (~3 d).
E is also taxed by the current S level (coupling term).

See docs/models-b-and-d-encoding.md for the full derivation and parameter table.
"""

from __future__ import annotations
import math
from typing import Any


DEFAULT_PARAMS: dict[str, float] = {
    "tauE_min": 120.0,     # energy recovery time constant (minutes)
    "tauS_days": 3.0,      # stress decay time constant (days)
    "alpha": 0.05,         # E is drained by alpha * S per hour
    "beta": 1.5,           # detach effectiveness multiplier on S reduction
    "E_rest": 70.0,        # default resting energy — overridden by Model D at runtime
    "dt_min": 5.0,         # default tick cadence
}


def _clip01(x: float, lo: float = 0.0, hi: float = 100.0) -> float:
    return max(lo, min(hi, x))


def tick_B(
    E: float,
    S: float,
    feats: dict[str, float],
    params: dict[str, float] | None = None,
) -> tuple[float, float]:
    """
    Advance (E, S) one tick.

    feats keys (all floats, all referring to THIS tick's window):
      drain-side (E):
        meeting_video_min, meeting_f2f_min, context_switches, kpm_p95_over_base
      recover-side (E):
        focus_block_min, walk_outside_min, social_voice_min, afk_10plus_min,
        outside_log_min, with_people_min
      load-side (S):
        sleep_debt_h, after_hours_frac, fragmentation_dev, hrv_z,
        zoom_back_to_back_frac, todoist_overdue_count
      detach-side (S):
        continuous_sleep_h, detach_block_min

    Missing keys default to 0.0. See data-flow-to-models.md for units and sources.
    """
    p = {**DEFAULT_PARAMS, **(params or {})}
    dt_min = float(p["dt_min"])

    g = lambda k: float(feats.get(k, 0.0))   # safe-get defaulting to 0.0

    # ── E-axis ──
    drain_per_h = (
        g("meeting_video_min")  * 0.30
        + g("meeting_f2f_min")  * 0.15
        + g("context_switches") * 0.40
        + g("kpm_p95_over_base") * 0.10
    )
    recover_per_h = (
        g("focus_block_min")   * 0.25
        + g("walk_outside_min") * 0.80
        + g("social_voice_min") * 0.40
        + g("afk_10plus_min")   * 0.15
        + g("outside_log_min")  * 0.70
        + g("with_people_min")  * 0.30
    )
    dE_event  = (recover_per_h - drain_per_h) * (dt_min / 60.0)
    dE_relax  = (p["E_rest"] - E) * (dt_min / p["tauE_min"])         # toward Model-D baseline
    dE_stress = -p["alpha"] * S * (dt_min / 60.0)
    E_new = _clip01(E + dE_event + dE_relax + dE_stress)

    # ── S-axis (units are per-day; scale dt to days) ──
    hrv_penalty = max(0.0, -g("hrv_z"))      # only negative z-scores count
    load_per_d = (
        g("sleep_debt_h")             * 2.0
        + g("after_hours_frac")       * 5.0
        + g("fragmentation_dev")      * 3.0
        + hrv_penalty                 * 4.0
        + g("zoom_back_to_back_frac") * 2.5
        + g("todoist_overdue_count")  * 1.5
    )
    detach_per_d = (
        g("continuous_sleep_h")            * 1.0
        + g("detach_block_min") / 60.0     * 2.0
        + g("outside_log_min") / 60.0      * 1.2
    )
    dS = (load_per_d - p["beta"] * detach_per_d) * (dt_min / (p["tauS_days"] * 1440.0))
    S_new = _clip01(S + dS)

    return E_new, S_new


def display_energy(E: float, E_rest_now: float, E_rest_default: float = 70.0) -> float:
    """Convert internal E to display-E anchored around the Model-D prior."""
    return _clip01(E_rest_now + (E - E_rest_default))


if __name__ == "__main__":
    # tiny sanity check
    E, S = 70.0, 30.0
    feats = {
        "meeting_video_min": 2,   # 2 min of video meeting in this 5-min tick
        "focus_block_min": 3,
        "after_hours_frac": 0.0,
    }
    for i in range(20):
        E, S = tick_B(E, S, feats)
    print(f"After 20 ticks with those feats: E={E:.2f}, S={S:.2f}")
