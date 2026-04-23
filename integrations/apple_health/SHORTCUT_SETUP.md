# Apple Health iOS Shortcut — setup

This Shortcut runs every night on your iPhone, pulls a day's worth of Health
data, and writes a JSON file to iCloud Drive. The Psych Battery watcher on
your laptop reads those files.

## One-time setup

1. On your iPhone, open **Shortcuts**.
2. Tap **+** to create a new Shortcut. Name it "PsychBattery Health Export."
3. Add these actions in order:

   **a. Get Health Sample** — type: *Sleep Analysis*, from: *Yesterday at 6 PM*, to: *Today at 12 PM*. Set **Calculate**: *Total Time in Bed*.
   - Save result to variable: `SleepTotal`

   **b. Get Health Sample** — type: *Heart Rate Variability*, from: *Yesterday at 6 PM*, to: *Today at 12 PM*. **Calculate**: *Average*.
   - Save to variable: `HRV`

   **c. Get Health Sample** — type: *Steps*, from: *Today at 12 AM*, to: *Now*. **Calculate**: *Sum*.
   - Save to variable: `Steps`

   **d. Get Health Sample** — type: *Active Energy*, from: *Today at 12 AM*, to: *Now*. **Calculate**: *Sum*.
   - Save to variable: `ActiveKcal`

   **e. Text** — build the JSON:
   ```
   {
     "date": "<today's date as YYYY-MM-DD>",
     "sleep_total_h": <SleepTotal in hours>,
     "sleep_continuous_h": <SleepTotal in hours>,
     "hrv_sdnn_ms": <HRV>,
     "steps": <Steps>,
     "active_kcal": <ActiveKcal>
   }
   ```
   (Use the magic-variable picker to insert each value.)

   **f. Save File** — destination: *iCloud Drive*, folder: *PsychBattery/*, filename: `health-<today's date>.json`. Check *Overwrite if file exists*.

4. Run the Shortcut once manually. Confirm the file appears in iCloud Drive.

## Schedule it

1. Shortcuts app → **Automation** tab → **+**.
2. **Personal Automation** → **Time of Day** → 6:00 AM, daily.
3. Action: *Run Shortcut* → pick "PsychBattery Health Export."
4. Uncheck "Ask Before Running."

## On the laptop

iCloud Drive should sync the PsychBattery folder automatically. The default
watcher looks for files at:

```
~/Library/Mobile Documents/com~apple~CloudDocs/PsychBattery/health-YYYY-MM-DD.json
```

If your iCloud Drive is mounted elsewhere, set `HEALTH_JSON_DIR` in
`~/.psych-battery/secrets.env`.

## Notes

- **`sleep_continuous_h` approximation**: the basic Shortcut sets continuous =
  total. If you want an accurate "longest single block," replace the sleep
  action with *Get Health Sample: In Bed* and iterate through segments. For
  v1, the approximation is fine.
- **Timezone**: everything is the iPhone's local zone. The watcher on the
  laptop assumes the same zone.
- **Backfill**: if the Shortcut fails one night, the next night's file just
  appears. There's no retry — just let it run.
- **Privacy**: the files stay in iCloud Drive, never leave your Apple ID
  without your consent.
