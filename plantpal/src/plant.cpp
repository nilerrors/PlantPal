#include "consts.h"
#include "plant.h"


char* chip_id() {
  uint64_t chipid = ESP.getEfuseMac();
  char chipid_str[17];
  sprintf(chipid_str, "%016llX", chipid);
  return chipid_str;
}

bool Plant::fetch() {
  if (this->ID() == '') {
    Serial.println('Plant not created');
    return false;
  }
  String url = String(SERVER_URL) + '/plants_collection/plants/';
  _http.begin(url.c_str());

  int status_code = 200;
};

bool Plant::shouldIrrigate() {

}


String Plant::ID() {
  if (!_prefs.begin("plantpal_plant")) {
    Serial.println("Preferences could not begin");
    return;
  }
  String id = _prefs.getString("id");
  _prefs.end();

  return id;
}

uint16_t Plant::waterAmount() {
  if (!_prefs.begin("plantpal_plant")) {
    Serial.println("Preferences could not begin");
    return;
  }
  uint16_t water_amount = _prefs.getUShort("water_amount");
  _prefs.end();

  return water_amount;
}

bool Plant::autoIrrigation() {
  if (!_prefs.begin("plantpal_plant")) {
    Serial.println("Preferences could not begin");
    return;
  }
  bool auto_irrigation = _prefs.getBool("auto_irrigation");
  _prefs.end();

  return auto_irrigation;
}

uint8_t Plant::moisturePercentageThreshold() {
  if (!_prefs.begin("plantpal_plant")) {
    Serial.println("Preferences could not begin");
    return;
  }
  uint8_t moisture_percentage_threshold = _prefs.getUChar("moisture_percentage_threshold");
  _prefs.end();

  return moisture_percentage_threshold;
}
