#include <Arduino.h>
#include <HTTPClient.h>
#include <Preferences.h>
#include <WiFi.h>

class Plant {
private:
  Preferences _prefs;
  HTTPClient _http;

  String credentials();

  String getID();
  uint16_t getWaterAmount();
  bool getAutoIrrigation();
  uint8_t getMoisturePercentageThreshold();

public:
  void init() {
    this->ID = this->getID();
    this->waterAmount = this->getWaterAmount();
    this->autoIrrigation = this->getAutoIrrigation();
    this->moisturePercentageThreshold = this->getMoisturePercentageThreshold();
  }
  String ID;
  uint16_t waterAmount;
  bool autoIrrigation;
  uint8_t moisturePercentageThreshold;

  bool isCreated();
  bool create(String id);
  bool shouldIrrigate(uint8_t moisture_percentage = 255);
  bool setMoisturePercentage(uint8_t percentage);
  bool fetch();
};
