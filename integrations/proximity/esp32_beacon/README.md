# ESP32 BLE beacon — per-battery setup

Each battery device runs this sketch. The laptop's `receiver.py` scans for any
advertised UUID in `config.yaml`.

## Why this route

- Works between two physical batteries (the "research" path).
- No phone dependency.
- Low power — ESP32 at -12 dBm TX power sips current.

## Flashing

1. Install [Arduino IDE](https://www.arduino.cc/en/software) and add ESP32 board support (instructions in the sketch header).
2. Open `beacon.ino` in Arduino IDE.
3. Generate a unique UUID at https://www.uuidgenerator.net/. Paste into `BEACON_UUID` at the top of the sketch. **Each device needs a unique UUID.**
4. Edit `DEVICE_NAME` to something identifiable (e.g. `PsychBattery-Doug`, `PsychBattery-Alice`).
5. Select your board under Tools → Board → ESP32 Dev Module (or your specific board).
6. Upload.
7. Open Serial Monitor at 115200 baud — you should see "Advertising UUID: ..." every 10 sec.

## Registering with the receiver

On the laptop running Psych Battery, edit `integrations/proximity/config.yaml`:

```yaml
beacons:
  - uuid: "your-new-uuid-here"
    label: "doug_battery"
    rssi_threshold: -70
```

Then start the scanner: `python -m integrations.proximity.receiver --listen`.

## Calibrating the RSSI threshold

-70 dBm is a reasonable default for "within ~5 m indoors." Calibrate:

1. Place the beacon battery and the receiver laptop at the distance you want to count as "nearby" (say 3 m).
2. Run `python -m integrations.proximity.receiver --scan-once` — it prints the observed RSSI.
3. Set `rssi_threshold` to ~5 dB below that value in `config.yaml`.

At −70: roughly 5 m indoors (through walls attenuates fast).
At −75: roughly 10 m / across a room.

## Power draw

At -12 dBm TX power with 1000 ms advertising interval: ~5 mA. A 500 mAh battery
lasts ~100 hours. If you need longer, increase the advertising interval in the
sketch (trade off: receiver has to scan longer to reliably catch it).

## Troubleshooting

- **`BLEDevice` library not found:** Tools → Manage Libraries → install "ESP32 BLE Arduino."
- **Compile errors about `BLE2902`:** make sure you're on Arduino-ESP32 v2.x or newer.
- **Scanner never sees the beacon:** check Serial Monitor to confirm the ESP32 is advertising. Also check the laptop has BLE enabled (macOS: Settings → Bluetooth).
