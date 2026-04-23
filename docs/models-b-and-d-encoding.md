# Models B and D — encoding plan and prediction algorithm

> **Status:** this is the v1 design. Code lives in `integrations/models/`.

The battery runs two models stacked:

- **Model D** provides a *baseline expected-energy curve* for the user based on their chronotype and time of day. This is the prior.
- **Model B** provides the *dynamical update* on top of that prior — how energy and stress respond to today's events.

Display energy = `E_expected(t)  +  ΔE_B(t)`  where `ΔE_B` is Model B's deviation from the prior.

---

## Model B — two-compartment dynamical

### State

Two scalars, each ∈ [0, 100]:
- **E** — Energy. Fast time constant (~2 h).
- **S** — Stress. Slow time constant (~3 days).

### Parameters (with defaults)

| Name | Default | Meaning |
|------|---------|---------|
| `tauE_min` | 120 | Energy recovery time constant (minutes) — how fast E relaxes toward its rest level when nothing is happening |
| `tauS_days` | 3.0 | Stress decay time constant (days) — how long stress lingers after a rough week |
| `alpha` | 0.05 | Coupling: how much stress drains energy per unit S per hour |
| `beta` | 1.5 | Detach effectiveness: how fast rest actually reduces S |
| `E_rest` | 70 | Energy resting level. E decays toward this, not toward 0 |
| `dt_min` | 5 | Tick cadence (minutes) |

These are calibration-window defaults. Per-user fits happen after 2 weeks of data (see "Per-user fitting" below).

### Governing equations (continuous)

```
dE/dt = recover(t) − drain(t) − α · S(t)
dS/dt = load(t)    − β · detach(t)
```

- `drain` — the rate at which today's events are depleting E right now (meetings, context switches, high-density messaging bursts).
- `recover` — rate at which today's events are restoring E (focus blocks, walks, social voice time, AFK > 10 min).
- `load` — rate at which today's events are contributing to chronic stress (sleep debt, after-hours work, schedule fragmentation, low HRV).
- `detach` — rate at which genuine off-work blocks are unwinding S (continuous sleep, uninterrupted non-screen time).

### Numerical integration (discrete tick)

Fixed-step Euler at 5-minute ticks. RK4 isn't worth it at this noise level.

```python
def tick_B(E, S, feats, params=P, dt_min=5):
    # E-axis event terms (per-hour rates, scaled to dt)
    drain_h   = (feats['meeting_video_min']  * 0.30
               + feats['meeting_f2f_min']    * 0.15
               + feats['context_switches']   * 0.40
               + feats['kpm_p95_over_base']  * 0.10)
    recover_h = (feats['focus_block_min']    * 0.25
               + feats['walk_outside_min']   * 0.80
               + feats['social_voice_min']   * 0.40
               + feats['afk_10plus_min']     * 0.15
               + feats['outside_log_min']    * 0.70
               + feats['with_people_min']    * 0.30)
    dE_event = (recover_h - drain_h) * (dt_min / 60)
    dE_relax = (params['E_rest'] - E) * (dt_min / params['tauE_min'])   # toward rest
    dE_stress = -params['alpha'] * S * (dt_min / 60)
    E_new = clip01(E + dE_event + dE_relax + dE_stress)

    # S-axis terms (slower cadence matters — tauS is in days)
    load_d   = (feats['sleep_debt_h']            * 2.0
              + feats['after_hours_frac']        * 5.0
              + feats['fragmentation_dev']       * 3.0
              + max(0.0, -feats['hrv_z'])        * 4.0
              + feats['zoom_back_to_back_frac']  * 2.5)
    detach_d = (feats['continuous_sleep_h']      * 1.0
              + feats['detach_block_min'] / 60   * 2.0
              + feats['outside_log_min'] / 60    * 1.2)
    dS = (load_d - params['beta'] * detach_d) * (dt_min / (params['tauS_days']*1440))
    S_new = clip01(S + dS)

    return E_new, S_new
```

`clip01` clamps to [0, 100]. The `dE_relax` term is the natural exponential return to `E_rest` — without any events, E eventually levels off at 70, not at 0.

### Feature normalization

Raw signals are normalized to per-5-minute *magnitudes* before being fed to `tick_B`:

| Feature | Raw source | Units | Normalization |
|---------|------------|-------|---------------|
| `meeting_video_min` | gcal + Zoom | minutes in video meetings in the tick | no transform |
| `meeting_f2f_min` | gcal (in-person flag) | minutes | no transform |
| `context_switches` | ActivityWatch | app-changes in the tick | no transform |
| `focus_block_min` | ActivityWatch | minutes in a ≥25 min uninterrupted session | no transform |
| `walk_outside_min` | recovery_log | minutes logged | no transform |
| `social_voice_min` | gcal (1:1 flag) + Zoom | minutes | no transform |
| `afk_10plus_min` | ActivityWatch idle | minutes | no transform |
| `outside_log_min` | recovery_log | minutes logged | no transform |
| `with_people_min` | proximity (BLE) | minutes another battery is nearby | no transform |
| `sleep_debt_h` | Apple Health | hours last night below 7h target | clipped ≥ 0 |
| `after_hours_frac` | ActivityWatch + gcal | frac of tick that's "after-hours" | 0–1 |
| `fragmentation_dev` | ActivityWatch | stddev(session length) / personal baseline − 1 | z-ish |
| `hrv_z` | Apple Health | nightly HRV z-score vs 14-day personal rolling baseline | z-score |
| `zoom_back_to_back_frac` | Zoom + gcal | frac of the last 3 hr in video-call | 0–1 |
| `continuous_sleep_h` | Apple Health | hours continuous last night | no transform |
| `detach_block_min` | ActivityWatch (AFK) + recovery_log | min in a ≥60 min non-screen block | no transform |
| `kpm_p95_over_base` | keystrokes | (p95 kpm this tick) / (personal baseline p95) − 1 | 0-ish |

The normalization is the integration job — code lives in `integrations/models/feature_normalizer.py`.

### Coupling with Model D

Model B outputs `E` and `S`. The display energy is *not* `E` directly — it's
```
E_display(t) = clip01( E_expected(t, chronotype) + (E - E_rest) )
```
i.e., Model D provides the expected energy for this time of day, and Model B tells us how far off we are from typical. S is displayed unchanged (it's already slow enough that chronotype effects are weak).

### Per-user fitting

**Phase 0 (day 1–3):** use defaults above. Display has low confidence indicator.

**Phase 1 (day 4–14):** "warm" calibration. For each feature, compute the user's personal baseline from ActivityWatch/Apple Health. Baselines used: mean focus-block duration, p95 kpm, mean sleep duration, mean meeting minutes per day, etc. Swap these into the normalization step.

**Phase 2 (day 15+):** "stable" personalization. Fit `tauE_min`, `alpha`, and `beta` from 2 weeks of (features → self-reported energy ratings). Solve by least squares on the one-step-ahead prediction error. This is a tiny nonlinear fit — scipy.optimize is fine. Survey prompt is a once-daily "what was your energy today?" 1–10 slider, used only for fitting, not display.

### Cold-start alternative: don't fit, just track

If the user never takes the survey, parameters stay at defaults and only *feature baselines* get personalized (no dynamics-parameter fitting). The model is still useful — just slightly miscalibrated on an individual-dynamics level. This is the expected mode for most users.

---

## Model D — circadian + ultradian prior

### Input

Single survey: **Munich Chronotype Questionnaire (MCTQ)**, 5 items. Yields `MSF_sc` (mid-sleep on free days, sleep-corrected), a number like 4.2 (= 04:12 AM).

### Mapping from MSF_sc to chronotype bucket

Per Facer-Childs et al. 2018, peak-cognitive-performance time is correlated with MSF_sc:
- `MSF_sc < 3.5` → **lark** (peak ≈ 13:52)
- `3.5 ≤ MSF_sc < 5.5` → **intermediate** (peak ≈ 16:00)
- `MSF_sc ≥ 5.5` → **owl** (peak ≈ 20:59)

### Prior function

```python
def expected_energy(t, chronotype):
    peak_h = {
        'lark':         13.87,  # 13:52
        'intermediate': 16.00,
        'owl':          20.98,  # 20:59
    }[chronotype]
    hour_of_day = t.hour + t.minute / 60 + t.second / 3600

    # broad circadian envelope: cosine peaked at peak_h, amplitude 30
    envelope = 50 + 30 * math.cos(2 * math.pi * (hour_of_day - peak_h) / 24)

    # ultradian BRAC ripple (~90 min)
    ripple = 5 * math.sin(2 * math.pi * hour_of_day / 1.5)

    return envelope + ripple
```

Envelope mean 50, amplitude 30 → ranges from 20 to 80 across the day. Ripple adds ±5 → realistic 90-min alertness oscillation on top.

### What Model D outputs

A single scalar `E_expected(t)` that Model B's `E_rest` can be swapped for. In other words: the resting level that B's `dE_relax` term pulls toward isn't a constant 70 — it's the chronotype-and-time-of-day expected energy.

```python
E_rest_now = expected_energy(t, user.chronotype)
# ... pass E_rest_now into tick_B(...)
```

### Cold-start before the survey is taken

Use `chronotype = 'intermediate'` with a wide uncertainty flag. The battery still functions, just with a less personalized prior. Prompt the user to complete the 5-item survey within the first few days.

### Why we don't fit the peak hour per user

You could imagine fitting each user's peak time from their observed data. Don't — chronotype is a psychophysical property with decades of literature, and fitting it from noisy computer-use data over a few weeks will go wrong more often than the survey does. Stick with MCTQ.

---

## How B and D stack: the full prediction loop

```
every 5 minutes:
  feats      = feature_normalizer.collect(now - 5min, now)    # from integrations/*
  E_rest_now = model_d.expected_energy(now, user.chronotype)  # Model D prior
  params     = {...defaults..., 'E_rest': E_rest_now}
  E, S       = model_b.tick_B(prev_E, prev_S, feats, params)  # Model B dynamics
  E_display  = clip01(E_rest_now + (E - 70))                  # render vs. baseline 70
  send_to_battery(E_display, S)
```

The main loop lives in `integrations/models/main.py`.

---

## Open questions

1. How aggressive should the Phase-2 personalization be? Fitting 3 parameters from ~2 weeks of data on one user is statistically thin. We may want to keep Phase 0 defaults with only feature-baseline personalization indefinitely for most users.
2. The `with_people_min` recovery term is crude — same weight regardless of who the person is. Eventually we'll want to distinguish "with partner" (big recovery) from "with stranger at conference" (often depleting). For v1: one weight.
3. The MCTQ peak-time mapping assumes a population regression. Individuals vary. If the user can tell you their peak ("I do my best thinking around 10 am"), override the MCTQ-derived peak directly.
