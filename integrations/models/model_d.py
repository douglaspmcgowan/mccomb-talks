"""
Model D — circadian + ultradian baseline prior.

One function: expected_energy(now, chronotype) -> float in [0, 100].

Does not consume signals. Only consumes time-of-day and the user's chronotype
bucket (derived from the 5-item Munich Chronotype Questionnaire).

See docs/models-b-and-d-encoding.md § Model D for derivation.
"""

from __future__ import annotations
import datetime as dt
import math
from typing import Literal


Chronotype = Literal["lark", "intermediate", "owl"]


# Peak-cognitive-performance times from Facer-Childs et al. (2018).
_PEAK_HOUR: dict[Chronotype, float] = {
    "lark":         13.87,  # 13:52
    "intermediate": 16.00,  # 16:00
    "owl":          20.98,  # 20:59
}

# Circadian envelope parameters
_ENV_MEAN = 50.0
_ENV_AMPLITUDE = 30.0

# Ultradian (BRAC) ripple parameters
_RIPPLE_AMPLITUDE = 5.0
_RIPPLE_PERIOD_H = 1.5   # 90-minute basic rest-activity cycle


def _hour_of_day(now: dt.datetime) -> float:
    return now.hour + now.minute / 60.0 + now.second / 3600.0


def expected_energy(now: dt.datetime, chronotype: Chronotype = "intermediate") -> float:
    """
    Returns the baseline expected energy (0-100) for this user at this moment.

    This is what Model B's `E_rest` parameter should be at runtime.
    """
    if chronotype not in _PEAK_HOUR:
        raise ValueError(f"Unknown chronotype {chronotype!r}. Expected one of {list(_PEAK_HOUR)}")

    hod = _hour_of_day(now)
    peak_h = _PEAK_HOUR[chronotype]

    envelope = _ENV_MEAN + _ENV_AMPLITUDE * math.cos(
        2 * math.pi * (hod - peak_h) / 24.0
    )
    ripple = _RIPPLE_AMPLITUDE * math.sin(2 * math.pi * hod / _RIPPLE_PERIOD_H)
    return max(0.0, min(100.0, envelope + ripple))


def chronotype_from_mctq(msf_sc_hours: float) -> Chronotype:
    """
    Convert MCTQ MSF_sc (mid-sleep on free days, sleep-corrected, in hours) to
    chronotype bucket.

    Per Facer-Childs 2018 population regression:
      MSF_sc < 3.5h (e.g. sleeps through 03:30) → lark
      3.5 <= MSF_sc < 5.5 → intermediate
      MSF_sc >= 5.5 → owl
    """
    if msf_sc_hours < 3.5:
        return "lark"
    if msf_sc_hours < 5.5:
        return "intermediate"
    return "owl"


if __name__ == "__main__":
    # Plot a day for each chronotype
    import datetime as dt
    base = dt.datetime(2026, 4, 22, 0, 0)
    print("hour  lark  intermediate  owl")
    for h in range(0, 24, 2):
        now = base.replace(hour=h)
        lark = expected_energy(now, "lark")
        inter = expected_energy(now, "intermediate")
        owl = expected_energy(now, "owl")
        print(f"{h:02d}:00  {lark:5.1f}  {inter:5.1f}         {owl:5.1f}")
