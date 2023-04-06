#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Preferences.h>


char* chip_id();

class Plant {
private:
  Preferences _prefs;
  HTTPClient _http;
public:
  String ID();
  uint16_t waterAmount();
  bool autoIrrigation();
  uint8_t moisturePercentageThreshold();

  bool shouldIrrigate();
  bool fetch();
};
