/*
 * Psych Battery — ESP32 BLE beacon.
 *
 * Advertises a fixed service UUID continuously at low power. The receiver
 * (laptop running integrations/proximity/receiver.py) scans for this UUID
 * and infers nearness from RSSI.
 *
 * Build target: ESP32 (any variant). Board support via Arduino-ESP32 v2.x+.
 *
 * To flash:
 *   1. Install Arduino IDE and add ESP32 board support
 *      (https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json)
 *   2. Tools → Board → ESP32 Dev Module (or whatever your board is)
 *   3. Generate a new UUID at https://www.uuidgenerator.net/
 *      and paste it into BEACON_UUID below. Each battery device needs a
 *      UNIQUE UUID.
 *   4. Upload.
 *   5. Add the UUID to integrations/proximity/config.yaml on the receiver.
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <BLEAdvertising.h>

// ── EDIT THIS PER DEVICE ──
#define BEACON_UUID  "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
#define DEVICE_NAME  "PsychBattery-A"

void setup() {
  Serial.begin(115200);
  Serial.println("PsychBattery BLE beacon starting...");

  BLEDevice::init(DEVICE_NAME);

  // Set to lowest TX power (-12 dBm). More than enough for 10m indoor range,
  // and keeps battery drain low.
  BLEDevice::setPower(ESP_PWR_LVL_N12);

  BLEServer *server = BLEDevice::createServer();

  BLEAdvertising *advertising = BLEDevice::getAdvertising();
  advertising->addServiceUUID(BEACON_UUID);
  advertising->setScanResponse(false);
  advertising->setMinPreferred(0x06);    // iOS helper defaults
  advertising->setMinPreferred(0x12);

  BLEDevice::startAdvertising();

  Serial.print("Advertising UUID: ");
  Serial.println(BEACON_UUID);
}

void loop() {
  // Advertising runs in the background. Sleep 10s between status prints.
  delay(10000);
  Serial.println("Still advertising.");
}
