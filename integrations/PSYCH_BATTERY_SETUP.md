# Psych Battery — setup brief for Claude Code

Paste this entire document into a fresh Claude Code session (or save as `CLAUDE.md`
in the repo root) and ask Claude to "set up Psych Battery end-to-end from this brief."
Everything Claude needs is here.

---

## What this is

Psych Battery is a system that visualizes mental energy as a depleting battery,
driven by passive signals (screen activity, calendar, messaging, etc.) fused by a
two-compartment cognitive-load model.

Three layers:

1. **Integrations + model** — Python. Fetches signals, ticks the E/S model every
   5 min, exposes `/state` and `/log` on `localhost:7070`.
2. **Web UI** — static HTML/JS. Displays battery + metrics + diagnostics + self-log
   + recovery mode. Served locally on `localhost:3131`.
3. **Optional hardware** — ELECROW CrowPanel 5.79" e-ink display. USB Serial
   connection, firmware receives 0-100 charge level from a Python bridge script.

## Repos

- **Backend:** `https://github.com/douglaspmcgowan/dpm-research-hub` (branch `master`)
- **Frontend:** `https://github.com/douglaspmcgowan/psych-battery` (branch `main`)

## Prerequisites

- Python 3.10+
- ActivityWatch installed and running (https://activitywatch.net/downloads/)
- (Optional) Arduino IDE 2.x + ESP32 board package, if using the CrowPanel display

## Step-by-step setup

### 1. Clone both repos

```bash
git clone https://github.com/douglaspmcgowan/dpm-research-hub.git
git clone https://github.com/douglaspmcgowan/psych-battery.git
```

### 2. Install Python dependencies

```bash
cd dpm-research-hub
pip install -r integrations/requirements.txt
```

This installs: flask, requests, pyyaml, aw-client, google-auth*, slack-sdk, bleak,
pynput, numpy, scipy, python-dotenv, pyserial.

### 3. (Optional) Configure secrets

The model server runs without any secrets — it will just skip integrations whose
credentials are missing. If you want Slack/Todoist/Zoom/GCal/Apple Health data
flowing, create `~/.psych-battery/secrets.env`:

```
# Slack
SLACK_USER_TOKEN=xoxp-...

# Todoist
TODOIST_API_TOKEN=...

# Zoom
ZOOM_ACCOUNT_ID=...
ZOOM_CLIENT_ID=...
ZOOM_CLIENT_SECRET=...
```

GCal uses `~/.psych-battery/google_client.json` + first-run OAuth flow. Apple
Health uses the health watcher in `integrations/apple_health/` (separate iOS
shortcut + watcher setup — see that folder's docs if you need it).

### 4. Start the model server

```bash
cd dpm-research-hub
python -m integrations.models.main
```

Expected log line: `Psych Battery starting. State dir: ~/.psych-battery` followed
by a tick every 5 minutes. The server listens on `127.0.0.1:7070`.

Verify: `curl http://localhost:7070/state` should return JSON with E_display,
E_internal, S, last_tick_iso, etc.

### 5. Start the frontend

In a new terminal:

```bash
cd psych-battery
python server.py
```

Open `http://localhost:3131` in a browser. You should see the battery card with
the current energy level. Tap the card to expand to metrics (layer 1) and again
for full diagnostics (layer 2).

### 6. (Optional) CrowPanel display

Physical setup:

1. Plug the CrowPanel into your computer via USB-C.
2. Open Arduino IDE. Boards Manager → install "esp32" by Espressif.
3. Tools → Board → **ESP32S3 Dev Module**. Set:
   - Partition Scheme: **Huge APP (3MB No OTA/1MB SPIFFS)**
   - PSRAM: **OPI PSRAM**
   - USB CDC On Boot: **Enabled**
   - Upload Speed: 921600
4. Download the Elecrow library ZIP from:
   `https://github.com/Elecrow-RD/CrowPanel-ESP32-5.79-E-paper-HMI-Display-with-272-792`
5. From `example/arduino/Demos/5.79_WIFI_refresh/` copy these 6 files into a new
   folder called `psych_battery_crowpanel/`:
   - `EPD.h`, `EPD.cpp`
   - `EPD_Init.h`, `EPD_Init.cpp`
   - `EPDfont.h`
   - `spi.h`, `spi.cpp`
6. Copy `dpm-research-hub/integrations/crowpanel/psych_battery_crowpanel.ino`
   into that same folder.
7. Open the .ino in Arduino IDE, click Upload.
8. Open Serial Monitor at 115200 baud with line ending set to Newline. Type `75`
   and press Enter — display should update to 75%.

To run the bridge continuously:

```bash
cd dpm-research-hub/integrations/crowpanel
python charge_sender.py --port COM3   # adjust port for your OS
```

(`python charge_sender.py --list` will enumerate serial ports if you don't know
which one to pick.)

## Architecture notes for Claude

- **Contract between frontend and backend:** the frontend polls `/state` every
  30s. State shape (from `integrations/models/main.py:state_endpoint`):
  ```
  {
    "E_display": 0..1,          // normalized for display (0=empty, 1=full)
    "E_internal": 0..100,       // raw Model B output
    "S": 0..100,                // stress/load state
    "E_rest_now": 0..100,       // Model D prior at current time
    "last_tick_iso": "...",
    "last_feats": { ... },      // ~18 normalized features
    "phase": 0|1|2,             // warmup state
    "chronotype": "lark"|"intermediate"|"owl"
  }
  ```
- **Self-logging:** frontend POSTs to `/log` with
  `{ kind: "energy_rating"|"stress_rating", value: 1..100 }` or
  `{ kind: "outside"|"walk"|"with_people"|"detach", minutes: N }`.
- **AW proxy:** `psych-battery/server.py` proxies `/aw/*` → `localhost:5600/api/0/*`
  to sidestep CORS. The frontend uses this for the drain breakdown panel and as
  a fallback battery when the model server is unreachable.
- **CORS:** the model server sends `Access-Control-Allow-Origin: *` so the
  frontend can reach it from localhost:3131 (or any origin).
- **State persistence:** `~/.psych-battery/state.json` (JSON, human-readable).
  Delete to reset.

## Common issues

| Symptom | Fix |
|---|---|
| Frontend shows "Model offline" | Model server isn't running. `python -m integrations.models.main` |
| Frontend shows "AW offline" | ActivityWatch isn't running, or port 5600 blocked |
| CrowPanel compile error about UBYTE / GUI_Paint | You copied the wrong files. Use the 6 files listed above — NOT `GUI_Paint.h`, `Debug.h`, or `fonts.h` (those don't exist in this library). |
| CrowPanel only draws half the screen | Using GxEPD2 or wrong driver. Must use Elecrow's `EPD.h`. |
| charge_sender.py "Cannot open port" | Close Arduino Serial Monitor first — only one program can own the port |
| `pip install` fails on `bleak` | Proximity is optional; comment out that line in `integrations/requirements.txt` |

## Files Claude will touch

To get it fully running, Claude should:
1. Clone both repos
2. Install Python deps
3. Start the two Python servers in background processes
4. Verify both endpoints respond (curl /state, curl /aw/buckets)
5. Optionally flash the CrowPanel firmware

Nothing else needs editing unless the user wants to customize drain rules
(in `psych-battery/index.html`, `DRAIN_RULES` near the top) or add secrets.
