#include "credentials.h"


void Credentials::begin() {
  if (!preferences.begin("plantpal")) {
    Serial.println("Preferences could not begin");
    return;
  }
}

void Credentials::end() {
  preferences.end();
}

void Credentials::readWiFi(String *ssid, String *pass) {
    begin();
    *ssid = preferences.getString("ssid");
    *pass = preferences.getString("pass");
    end();
}

void Credentials::writeWiFi(String ssid, String pass) {
    begin();
    preferences.putString("ssid", ssid);
    preferences.putString("pass", pass);
    end();
}

bool Credentials::wifiNotWritten() {
    String ssid, pass;
    readWiFi(&ssid, &pass);
    return ssid == "" || pass == "";
}


void Credentials::readPlant(String *id, int32_t *water_amount) {
    begin();
    *id = preferences.getString("plant_id");
    *water_amount = preferences.getInt("water_amount");
    end();
}

void Credentials::writePlant(String id, int32_t water_amount) {
    begin();
    preferences.putString("plant_id", id);
    preferences.putInt("water_amount", water_amount);
    end();
}
