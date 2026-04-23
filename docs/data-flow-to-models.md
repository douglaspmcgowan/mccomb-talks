# Data flow — how each signal factors into Models B and D

> **Status:** this is the authoritative mapping. Code in `integrations/models/feature_normalizer.py` implements this table.

The pipeline:

```
raw source  →  fetch_recent()  →  raw dict  →  feature_normalizer.collect()  →  normalized feats  →  tick_B(E, S, feats)
```

Model D doesn't consume signals — it only consumes the current time and the user's chronotype.

---

## The big table

For each signal: which raw source produces it, how it's normalized, and which Model B term it feeds (drain / recover / load / detach). Blank = not used.

| Normalized feature | Raw source(s) | Normalization | B term | B weight | Notes |
|---|---|---|---|---|---|
| `meeting_video_min` | gcal + Zoom | max(gcal_video, zoom_actual) per tick | drain | 0.30 | Bailenson 2021 Zoom-fatigue weighting |
| `meeting_f2f_min` | gcal | direct | drain | 0.15 | In-person is half as draining as video |
| `context_switches` | ActivityWatch | direct count | drain | 0.40 | Mark et al., heavy-tailed cost |
| `kpm_p95_over_base` | keystrokes | (p95 kpm this tick) / (personal baseline p95) − 1, clipped to [0, 2] | drain | 0.10 | Bursty typing = cognitive load proxy |
| `focus_block_min` | ActivityWatch | direct, but only ≥25 min blocks count | recover | 0.25 | Flow / Csikszentmihalyi |
| `walk_outside_min` | recovery_log (manual) | direct | recover | 0.80 | Kaplan attention restoration |
| `social_voice_min` | gcal (1:1 meetings) + Zoom | meetings with ≤2 attendees | recover | 0.40 | Holt-Lunstad connection |
| `afk_10plus_min` | ActivityWatch idle | direct, only ≥10 min blocks | recover | 0.15 | Small-break recovery |
| `outside_log_min` | recovery_log (manual) | direct | recover | 0.70 | Combines with walk_outside (user-chosen granularity) |
| `with_people_min` | proximity (BLE, both ESP32 + iPhone options) | min(esp32_min, iphone_min) — whichever fires first | recover | 0.30 | Affiliation proxy; same weight regardless of who |
| `sleep_debt_h` | Apple Health | max(0, 7.0 − health_sleep_total_h) | load | 2.0 | Van Dongen dose-response |
| `after_hours_frac` | ActivityWatch + gcal | frac of active time after 18:00 local | load | 5.0 | Chronic allostatic activation |
| `fragmentation_dev` | ActivityWatch | session-length stddev / personal baseline − 1 | load | 3.0 | Attention residue proxy |
| `hrv_z` | Apple Health | nightly HRV z-score vs 14-day rolling baseline | load | 4.0 (only negative side) | Thayer neurovisceral integration |
| `zoom_back_to_back_frac` | Zoom + gcal | frac of last 3h in video calls | load | 2.5 | Zoom fatigue density |
| `continuous_sleep_h` | Apple Health | direct | detach | 1.0 | Single-block sleep restoration |
| `detach_block_min` | ActivityWatch AFK + recovery_log | direct, only ≥60 min non-screen blocks | detach | 2.0 | DRAMMA detachment |
| `todoist_completed_today` | Todoist | count since midnight | — | — | Not in B; feeds **Fulfillment accent** signal separately |
| `todoist_overdue_count` | Todoist | direct | load | 1.5 | Cognitive residue from undone tasks |

---

## How Model D enters

Model D does not consume signals. It consumes `now` and `user.chronotype`. It outputs `E_expected(now)` which replaces Model B's default `E_rest` parameter at each tick.

```python
# pseudocode for the main loop
E_rest_now = model_d.expected_energy(now, user.chronotype)
feats      = feature_normalizer.collect(last_tick, now)
E, S       = model_b.tick_B(prev_E, prev_S, feats, params={**P, 'E_rest': E_rest_now})
E_display  = clip01(E_rest_now + (E - 70))
```

Effect: the battery's "neutral" resting level shifts throughout the day to match the user's chronotype. A lark at 9 am will have a high `E_rest_now`; the same lark at 9 pm will have a low one. Model B's deviations are computed against *this moving baseline*, not a fixed 70.

---

## Why these weights

All weights are **order-of-magnitude defaults** from the literature, not fitted. The fitting-refinement path is documented in `models-b-and-d-encoding.md` § "Per-user fitting."

- `walk_outside_min` at 0.80 is by far the largest recover weight. This is deliberate: Kaplan's attention-restoration effect sizes are unusually robust in the literature (Berman 2008: d ≈ 0.7). Walking outside is genuinely the most restorative recovery event we can measure.
- `context_switches` at 0.40 per switch is large because Mark's distribution is heavy-tailed — a few switches are fine, but 50+ per hour is a severe drain and the linear-in-switches approximation is OK up to the threshold.
- `after_hours_frac` at 5.0 is the largest load weight. The literature on chronic after-hours work and burnout is strongly convergent.
- `hrv_z` is applied *only when negative* (`max(0, -hrv_z)`). A good HRV night doesn't reduce load — it just doesn't add to it. Asymmetric because HRV is a stress *monitor*, not a recovery *delivery*.

---

## What feeds what — another angle

### Drain (energy depletion, fast)

- Video meetings (gcal + Zoom)
- In-person meetings (gcal)
- Context switches (ActivityWatch)
- Keystroke bursts (keystrokes — optional)

### Recover (energy restoration, fast)

- Focus blocks (ActivityWatch)
- Walks outside + generic outside time (recovery_log)
- Voice social time (gcal + Zoom)
- AFK breaks (ActivityWatch)
- With people proximity (BLE)

### Load (stress accumulation, slow)

- Sleep debt (Apple Health)
- After-hours work fraction (ActivityWatch + gcal)
- Fragmentation (ActivityWatch)
- Low HRV (Apple Health)
- Back-to-back video calls (Zoom + gcal)
- Overdue tasks (Todoist)

### Detach (stress unwinding, slow)

- Continuous sleep (Apple Health)
- Long non-screen blocks (ActivityWatch AFK + recovery_log)

### Fulfillment (separate axis, displayed as secondary accent only)

- Task completions (Todoist)
- Long focus blocks (ActivityWatch) — same events that feed `focus_block_min`, weighted separately for the F-axis display

---

## Missing-data handling

Each integration's `fetch_recent()` may return `None` or raise. Feature normalizer rule:

| Source missing | Degradation |
|---|---|
| Apple Health | `sleep_debt_h`, `hrv_z`, `continuous_sleep_h` → 0 (neutral). Flag "health unavailable" in UI. |
| ActivityWatch | **Hard fail.** AW is the backbone. Main loop pauses and retries. |
| gcal | Meeting features → 0. Flag in UI. |
| Zoom | Fall back to gcal video-meeting minutes. |
| Slack | Not currently a B feature, but we log the raw for future. No fail. |
| keystrokes | Set to `SKIP_FOR_PHASE_1`. Defaults to 0. |
| Todoist | `overdue_count` → 0, `completed_today` → 0. |
| recovery_log | No log → 0. Don't impute. |
| Proximity | `with_people_min` → 0 if neither beacon source is working. |

Neutral (= 0) degradation is deliberate. If we don't know whether you slept well, don't guess that you didn't.

---

## Open questions

1. **Fulfillment axis.** Currently task-completions feed a display-only accent, not a Model B state. Should it be a third B compartment? Defer: we don't have good recovery-from-fulfillment data yet.
2. **Double-counting between walk_outside_min and outside_log_min.** User logs one 30-min walk. Does that count as 30 min walk (0.80) or 30 min outside (0.70) or both? v1 rule: `outside_log_min` is any outside time; `walk_outside_min` is only for the "going for a walk" log option. Logged separately in the form.
3. **Proximity weight.** 0.30 is a guess. The research literature on in-person-vs-alone is strong at the population level but noisy at the minute-level. Watch whether this signal actually correlates with user's self-reported energy in Phase 2.
