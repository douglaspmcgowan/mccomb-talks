# iPhone BLE beacon — setup

Use this when you only have one battery device but still want a "with people"
signal, or as a complement to the ESP32 path (the phone beacon follows *you*,
the ESP32 follows the battery).

## Why this route

- Works for "I'm with myself wherever I took my phone."
- No second hardware device needed.
- Can be conditionally advertised (e.g. only when away from home Wi-Fi).

## What it actually measures

The iPhone is always with you. The receiver is on your laptop at home (or
wherever you left it). So the laptop seeing the iPhone nearby means "Doug is
in the room with the laptop." Combined with a second battery's ESP32 beacon,
you can tell "Doug with Alice" vs "Doug alone at home" etc.

Less precise than ESP32-to-ESP32 but fine as a proxy.

## Setup

### Option A: a dedicated iOS beacon app (fastest)

1. Install a BLE-beacon advertising app. We recommend **"Beacon Simulator"**
   (free, in the App Store) or **"nRF Connect"** (Nordic Semiconductor, free).
2. Open the app, create a new advertiser. Set:
   - Advertising mode: iBeacon OR generic BLE (either works with our scanner).
   - Service UUID: generate one at https://www.uuidgenerator.net/. Save it.
   - TX power: low.
3. Start advertising. Leave the app running in the background.

**Caveat:** iOS restricts background BLE advertising heavily. Some apps lose
the ability to advertise after ~5–10 minutes in the background. Re-open the
app periodically, or use a Shortcut automation to re-launch it daily.

### Option B: iOS Shortcut + web-advertising service (more persistent)

For v1 we recommend Option A. Option B involves running a small BLE-peripheral
service from within a Shortcut and is finicky. Come back to this if Option A
isn't persistent enough.

## Registering with the receiver

On the laptop, edit `integrations/proximity/config.yaml`:

```yaml
beacons:
  - uuid: "your-iphone-uuid"
    label: "iphone"
    rssi_threshold: -75    # lower (further) threshold than ESP32, phones are weaker
```

Restart the scanner.

## Battery impact on iPhone

BLE advertising at low power is ~1–2% of iPhone battery per day if always on.
If you only advertise when outside home (via a Shortcut Automation gated on
Wi-Fi SSID), it's negligible.

## Troubleshooting

- **Scanner never sees the phone:** iOS may have suspended the advertiser.
  Unlock the phone, open the beacon app, restart advertising.
- **Intermittent detection:** expected. iOS throttles background BLE.
  `rssi_threshold: -80` helps catch weaker reads.
