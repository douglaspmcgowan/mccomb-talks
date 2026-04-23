# Psych Battery — setup guide

> **What this is:** step-by-step instructions to get every data source connected and the main loop running on your laptop.
>
> **Prereqs:** Python 3.11+, a Mac or Windows laptop, admin access to it.

You don't need to do all of these at once. The "minimum viable battery" is Phase 1 only (ActivityWatch + Apple Health + recovery log). Add others as you go.

---

## 0. Repo setup

```bash
cd dpm-research-hub
python -m venv .venv
# Windows: .venv\Scripts\activate
# Mac:     source .venv/bin/activate
pip install -r integrations/requirements.txt
```

Create a secrets file at `~/.psych-battery/secrets.env`:

```
# Required for OpenAI-backed agent components (psych battery only)
OPENAI_API_KEY_HADM=sk-...

# Slack (fill in after step 2)
SLACK_USER_TOKEN=

# Google Calendar (token auto-populated on first OAuth flow — leave blank)

# Todoist (fill in after step 4)
TODOIST_API_TOKEN=

# Zoom (fill in after step 6)
ZOOM_ACCOUNT_ID=
ZOOM_CLIENT_ID=
ZOOM_CLIENT_SECRET=
```

Never commit this file. `.gitignore` already excludes `~/.psych-battery/`.

---

## Phase 1 — minimum viable battery

### 1. ActivityWatch (the backbone)

1. Download from https://activitywatch.net/ and install.
2. Launch it. Confirm the tray icon shows "Running."
3. On macOS: System Settings → Privacy & Security → Accessibility → enable `aw-watcher-window`. Same for Input Monitoring.
4. Install browser extension if you want per-domain time (optional; we don't use it in v1).
5. Test: `curl http://localhost:5600/api/0/buckets` should return JSON.

No secrets needed — ActivityWatch is local only.

### 2. Apple Health (HRV, sleep, steps)

1. On your iPhone, open the Shortcuts app.
2. Import the shortcut from `integrations/apple_health/shortcut_export.json` (instructions in `integrations/apple_health/SHORTCUT_SETUP.md`).
3. Set it to run nightly at 6 am via Personal Automation.
4. Confirm it writes to iCloud Drive under `PsychBattery/` — you should see a file like `health-2026-04-22.json` after the first run.
5. On your laptop, make sure iCloud Drive is syncing that folder.
6. Run the watcher once to test: `python -m integrations.apple_health.health_watcher --once`.

### 3. Recovery log (manual)

Nothing to install — the battery server itself serves the form.

1. Start the main loop (see step 11 below).
2. Open `http://localhost:7070/log` in a browser.
3. You'll see a simple form with buttons: "Log 30 min outside," "Log walk," "Log 1 hr with friend," etc.
4. Bookmark it on your phone for quick access.

---

## Phase 2 — meetings and tasks

### 4. Todoist

1. In Todoist: Settings → Integrations → Developer → copy your API token.
2. Paste into `~/.psych-battery/secrets.env` as `TODOIST_API_TOKEN`.
3. Test: `python -m integrations.todoist.todoist --test`.

### 5. Google Calendar

1. Go to https://console.cloud.google.com/.
2. Create a new project (or pick existing). Enable the Google Calendar API.
3. Credentials → Create OAuth Client ID → "Desktop app" → download JSON.
4. Save as `~/.psych-battery/gcal-credentials.json`.
5. Run `python -m integrations.gcal.gcal --auth`. A browser opens for consent; token is saved to `~/.psych-battery/gcal-token.json`.
6. Test: `python -m integrations.gcal.gcal --test`.

### 6. Zoom (optional — requires Pro Zoom account)

1. Go to https://marketplace.zoom.us/ → Develop → Build App → "Server-to-Server OAuth."
2. Fill in scopes: `report:read:admin`, `user:read:admin`.
3. Activate the app.
4. Copy Account ID, Client ID, Client Secret into `~/.psych-battery/secrets.env`.
5. Test: `python -m integrations.zoom.zoom --test`.

If you're on free Zoom, skip this — the code falls back to gcal-only.

---

## Phase 3 — communication and proximity

### 7. Slack

1. Go to https://api.slack.com/apps → Create New App → "From scratch."
2. Give it a name. Pick your workspace.
3. OAuth & Permissions → add user token scopes: `channels:history`, `groups:history`, `im:history`, `mpim:history`, `users:read`.
4. Install to workspace. Copy the *User OAuth Token* (starts with `xoxp-`).
5. Paste into `~/.psych-battery/secrets.env` as `SLACK_USER_TOKEN`.
6. Test: `python -m integrations.slack.slack --test`.

### 8. Proximity — ESP32 beacon (for a second battery)

Do this if you have two battery devices.

1. Flash the sketch at `integrations/proximity/esp32_beacon/beacon.ino` to each ESP32.
2. Edit the `BEACON_UUID` constant to a unique UUID per device (generate one at https://www.uuidgenerator.net/).
3. Each device will advertise continuously at low power.
4. The receiver (your laptop) runs `integrations/proximity/receiver.py` which listens for both UUIDs and logs when either is in range.

Full details: `integrations/proximity/esp32_beacon/README.md`.

### 9. Proximity — iPhone beacon (for solo use)

Do this if you want "with other people" detection without a second device, OR as a complement to #8.

1. On your iPhone, install the "BLE Beacon" app (or equivalent — we test with "Beacon Simulator").
2. Set it to advertise a fixed UUID you choose.
3. Set it to only advertise when outside home Wi-Fi (Shortcut Automation).
4. Add the UUID to `integrations/proximity/iphone_beacon/config.yaml`.

Full details: `integrations/proximity/iphone_beacon/README.md`.

### 10. Keystrokes (optional; skip for Phase 1)

1. `pip install pynput` (already in requirements if you're enabling this).
2. Set `SKIP_FOR_PHASE_1 = False` at the top of `integrations/keystrokes/keystrokes.py`.
3. macOS: grant Accessibility + Input Monitoring.
4. Test: `python -m integrations.keystrokes.keystrokes --test`.

Skip this unless you really want typing-cadence data. It's fragile and the signal is weak.

---

## 11. Running the main loop

```bash
cd dpm-research-hub
python -m integrations.models.main
```

What it does every 5 minutes:
1. Calls `fetch_recent()` on every configured source.
2. Normalizes raw fields into Model B features.
3. Computes Model D's `E_expected(t)`.
4. Runs one Model B tick.
5. Writes display state (E, S, confidence) to `~/.psych-battery/state.json`.
6. Serves the state on `http://localhost:7070/state` for the battery hardware to poll.

First-run: state file is seeded with `E=70, S=30`. After a week of ticks, the per-user baselines will have warmed up.

### Battery hardware wiring (for the e-ink prototype)

The ESP32 in the battery polls `http://<your-laptop-ip>:7070/state` every 30 sec and renders accordingly. See `integrations/models/main.py` docstring for the JSON schema.

---

## Troubleshooting

- **`aw-client` says "connection refused":** ActivityWatch isn't running. Restart it.
- **gcal OAuth loop:** delete `~/.psych-battery/gcal-token.json` and re-run `--auth`.
- **Apple Health file never appears:** check that the Shortcut actually ran (Shortcuts → History). iCloud sync on the laptop side can lag — wait 15 min.
- **Slack 401:** user token expired or scopes missing. Reinstall the app.
- **pynput silent on macOS:** you need *both* Accessibility and Input Monitoring. Each app has to be added explicitly to each permission.

---

## What you *don't* need to set up yet

- Models F and G (Kalman filter, bandit) — docs are at `docs/models-f-and-g.md`. Not wired into the main loop. Add later after several weeks of Model B data.
- Gmail — skipped for v1.
- Outlook / Teams — skipped for v1.
- MCP servers — skipped for v1. Direct API calls are simpler.

---

## Minimum path to a running battery

If you want the *fastest* path to a display that does something:

1. Install ActivityWatch (step 1). ~10 min.
2. Set up Apple Health Shortcut (step 2). ~15 min.
3. Start the main loop (step 11). Leave it running.
4. Open `http://localhost:7070/state` in a browser — you'll see E and S updating.
5. Optional: wire the e-ink battery to poll it.

That's the whole Phase 1. Everything else is incremental.
