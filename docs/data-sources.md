# Data sources — integration reference

> **Status:** initial designs + starter code in `integrations/`. Code is functional but not hardened. See `setup.md` for how to connect each one.

Every source below follows the same contract: each integration exports a function `fetch_recent(since: datetime, until: datetime) -> dict`. The dict keys are *raw metrics* — named in `data-flow-to-models.md` under "Raw source fields." The feature normalizer at `integrations/models/feature_normalizer.py` is the single place that converts raw → model features.

Privacy rule repeated everywhere: **never store content.** Counts, timestamps, durations, and hashed IDs only. If a PR adds a string field named `text`, `subject`, `body`, or `title`, reject it.

---

## 1. Slack — message volume and timing

**Goal:** counts, not content. Per-channel message counts per 15-min bucket. Timing variance (bursty vs steady). After-hours flag.

**API:** Slack Web API — `conversations.list` + `conversations.history`.

**Auth:** User token (`xoxp-...`) with scopes `channels:history`, `groups:history`, `im:history`, `mpim:history`, `users:read`. For a workspace you're not an admin of, you can still auth as yourself with a user token — you just see what you'd see in your client.

**Rate limits:** Tier 3 (~50 req/min). Pulling a 15-min window of history per channel is well under this for a solo user.

**Poll cadence:** every 5 min.

**Raw fields returned:**
- `slack_msg_count` — total messages sent by user in the window
- `slack_msg_received_count` — messages received (mentions + DMs)
- `slack_after_hours_frac` — fraction of messages outside 9–18 local time
- `slack_burst_score` — coefficient of variation of inter-message intervals (high = bursty)

**Gotchas:**
- Slack tokens expire; refresh logic needed if the battery runs long-term.
- DMs require separate scope from channels. Starter code pulls channels only — extend if you want DMs.
- Workspace admin might block bot apps; a *user* token works around this.

**Starter code:** `integrations/slack/slack.py`.

---

## 2. ActivityWatch — working time, focus, idle, app context

**Goal:** the big one. Minutes per app, context-switch count, focus-block detection, AFK (away-from-keyboard) blocks.

**API:** ActivityWatch runs a local server at `http://localhost:5600`. Python client: `pip install aw-client`.

**Auth:** none (localhost only).

**Rate limits:** none.

**Poll cadence:** every 5 min.

**Raw fields returned:**
- `aw_focus_block_min` — minutes in uninterrupted ≥25 min sessions
- `aw_context_switches` — count of app changes
- `aw_afk_min` — minutes idle (no mouse/keyboard)
- `aw_afk_10plus_min` — minutes in blocks ≥10 min of idle
- `aw_detach_block_min` — minutes in blocks ≥60 min of no screen activity
- `aw_active_min` — minutes of active screen use
- `aw_fragmentation_stddev` — stddev of session length in the window

**Gotchas:**
- macOS requires Accessibility permissions for window-title tracking. These can break silently after OS updates.
- ActivityWatch's browser extension is needed for per-domain time. Not needed for the signals we use (we only use app-level counts).

**Starter code:** `integrations/activitywatch/aw.py`.

---

## 3. Google Calendar — meetings, scheduled work hours

**Goal:** meeting minutes (split video vs in-person), back-to-back meeting density, after-hours meetings, "should be working" windows.

**API:** Google Calendar API v3 — `events.list`.

**Auth:** OAuth 2.0. Desktop app credential. Scope `https://www.googleapis.com/auth/calendar.readonly`. Token stored at `~/.psych-battery/gcal-token.json`.

**Rate limits:** 500 queries / 100 sec / user. Nothing we hit.

**Poll cadence:** every 15 min. Calendar doesn't change minute-to-minute.

**Raw fields returned:**
- `gcal_meeting_video_min` — minutes in video meetings
- `gcal_meeting_f2f_min` — minutes in in-person meetings (inferred: no video link in event)
- `gcal_attendee_count` — total attendees in active meetings
- `gcal_back_to_back_frac` — frac of last 3h in meetings
- `gcal_after_hours_frac` — frac of meetings outside 9–18 local

**Gotchas:**
- Video vs in-person is inferred from whether the event has a Hangouts/Zoom/Meet link. Not perfect.
- Recurring event instances need expansion — use `singleEvents=True`.

**Starter code:** `integrations/gcal/gcal.py`.

---

## 4. Keystrokes and clicks per minute (proceed with caution)

**Goal:** aggregate typing cadence — mean kpm, p95 kpm, pause-distribution shape. Never records which keys are pressed.

**API:** `pynput` (Python).

**Auth:** needs Accessibility + Input Monitoring permissions on macOS. Just-run on Windows.

**Rate limits:** n/a.

**Poll cadence:** continuous listener; aggregates every 1 min to SQLite.

**Raw fields returned:**
- `kb_keystrokes_per_min` — mean kpm across the window
- `kb_p95_kpm` — 95th percentile of per-minute counts (captures bursts)
- `mouse_clicks_per_min` — mean
- `kb_pause_p50_ms` — median inter-keystroke pause

**Gotchas:**
- pynput's macOS listener fails silently when permissions break. Wrap every run in a health-check that tests whether events are actually being received in the first 60 sec.
- High risk, low reward per the existing Tech Stack note. Starter code is here but marked `SKIP_FOR_PHASE_1 = True` by default.

**Starter code:** `integrations/keystrokes/keystrokes.py`.

---

## 5. Todoist — task completions, overdue pressure

**Goal:** "did I finish things today?" signal (positive) and "how much am I behind?" signal (negative).

**API:** Todoist REST v2 — `GET /tasks?filter=completed`, `GET /tasks?filter=overdue`.

**Auth:** Personal API token from Todoist settings. Header: `Authorization: Bearer <token>`.

**Rate limits:** 450 req / 15 min. Not a concern.

**Poll cadence:** every 15 min.

**Raw fields returned:**
- `todoist_completed_today` — completed task count since midnight
- `todoist_overdue_count` — current overdue task count
- `todoist_completed_in_window` — completions in the last tick window

**Gotchas:**
- Todoist's `completed` endpoint is rate-limited more aggressively. Cache.

**Starter code:** `integrations/todoist/todoist.py`.

---

## 6. Recovery — manual log + proximity + Apple Health

This is the composite "recovery" source, decomposed into three sub-components.

### 6a. Time outside — manual log (via app)

**Goal:** minutes outside today. For now, the user logs this manually through a small web form served by the battery server.

**API:** local HTTP POST to the battery server's `/log` endpoint.

**Auth:** none (localhost).

**Raw fields returned:**
- `outside_log_min` — minutes logged outside in the window

**Starter code:** `integrations/recovery_log/recovery_log.py` + `integrations/recovery_log/form.html`.

Future: auto-detect via Wi-Fi leave + weather API. Not in v1.

### 6b. Proximity — two options, both shipped

The battery wants to know "am I with people?" Concretely: is another battery (or person's phone) nearby?

**Option A: ESP32 BLE beacon (physical battery device).** Each battery advertises a BLE service UUID. The receiver (the user's computer or the battery itself) scans and logs RSSI. When another battery's RSSI is above a threshold (~−70 dBm = within ~5 m), log "with_people_min" ticking up. This is the real-research path — it works between two battery devices.

**Option B: iPhone beacon.** The user's iPhone runs a Shortcut-triggered background task that advertises a BLE UUID when the user is outside their home Wi-Fi. The same computer receiver logs when the phone is nearby. This works for "with yourself + wherever you took the phone" — useful as a proxy when a second battery isn't around.

Both options feed the same `with_people_min` field. Starter code at `integrations/proximity/esp32_beacon/` and `integrations/proximity/iphone_beacon/`.

**Gotchas:**
- BLE scanning on macOS requires Core Bluetooth permissions.
- RSSI thresholds vary by device. Calibrate on first run with a known-distance test.
- The iPhone Shortcut approach is battery-hungry; advertise in bursts.

### 6c. Time away from screen — derived from ActivityWatch

Already handled by ActivityWatch's AFK watcher. See source 2. No separate integration.

---

## 7. Zoom — meeting duration, back-to-back density

**Goal:** actual video-call minutes (not scheduled). Overlaps with gcal but gcal only shows scheduled; Zoom shows what really happened.

**API:** Zoom Report API `/report/users/{userId}/meetings`.

**Auth:** Server-to-Server OAuth app. Requires a Zoom account with report permissions (Pro tier or higher, for accounts the user admins).

**Rate limits:** 30 req/sec, 10000/day. Not a concern.

**Poll cadence:** every 30 min. Reports have ~5–10 min delay.

**Raw fields returned:**
- `zoom_actual_video_min` — actual minutes in video meetings
- `zoom_back_to_back_frac` — frac of last 3h in meetings

**Gotchas:**
- Free Zoom accounts don't have Report API access. Free users fall back to gcal-only meeting signals.
- Reports are per-user — the user must be the account holder or have admin-reports permission.

**Starter code:** `integrations/zoom/zoom.py`.

---

## 8. Apple Health — HRV, sleep, steps, active energy

**Goal:** nightly HRV z-score, sleep duration + continuity, step count, active calories.

**API:** no direct Apple Health API. Route: iOS **Shortcut** automation exports JSON to iCloud Drive nightly; a local watcher (`integrations/apple_health/health_watcher.py`) picks up the file and parses it.

**Auth:** user runs the Shortcut on their iPhone. iCloud Drive sync handles the rest.

**Raw fields returned:**
- `health_hrv_ms` — last night's mean HRV (SDNN, milliseconds)
- `health_hrv_z` — z-score vs 14-day personal rolling baseline
- `health_sleep_total_h` — hours asleep
- `health_sleep_continuous_h` — longest continuous sleep block
- `health_sleep_debt_h` — hours below user's target (default 7h)
- `health_steps_today` — today's step count
- `health_active_kcal_today` — active energy burned

**Gotchas:**
- iCloud sync can lag 5–30 min. First poll after sleep might miss the latest night; retry on next tick.
- The 14-day rolling baseline is computed in the watcher, not in the Shortcut.

**Starter code:** `integrations/apple_health/health_watcher.py` + `integrations/apple_health/SHORTCUT_SETUP.md`.

---

## How these connect to the models

See `data-flow-to-models.md` for the full table. Quick summary:

- Slack + ActivityWatch + Zoom + gcal → `drain` and `load` in Model B
- ActivityWatch AFK + recovery_log + proximity → `recover` and `detach` in Model B
- Apple Health → `load` (sleep debt, HRV) and `detach` (continuous sleep)
- Todoist → accent `recover` signal (task completions)
- Time of day → Model D prior (no integration needed, just a clock)

---

## What's explicitly not in v1

- Email volume — skipped for v1. Gmail integration is easy to add if needed; see the existing Tech Stack tab for notes.
- Outlook / Teams — skipped; Gmail/Slack is enough.
- AI token usage — skipped; ActivityWatch's time-on-site for chatgpt.com / claude.ai is enough.
- Browser per-URL tracking — skipped. Per-app time from ActivityWatch is enough and avoids the privacy headache of URL logging.
