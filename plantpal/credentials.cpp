#include "credentials.h"


void Credentials::readWiFi(String *ssid, String *password) {
    const bool begin = preferences.begin("wifi", true);
    if (!begin) {
        Serial.println("Preferences for WiFi could not begin");
        return;
    }
    *ssid = preferences.getString("ssid", "");
    *password = preferences.getString("password", "");
    preferences.end();
}

void Credentials::writeWiFi(String ssid, String pass) {
    const bool begin = preferences.begin("wifi", false);
    if (!begin) {
        Serial.println("Preferences for WiFi could not begin");
        return;
    }
    preferences.putString("ssid", ssid);
    preferences.putString("pass", pass);
    preferences.end();
}

bool Credentials::wifiNotWritten() {
    String ssid, pass;
    readWiFi(&ssid, &pass);
    return ssid == "" || pass == "";
}


void Credentials::readPlantID(String *id) {
    const bool begin = preferences.begin("plant", true);
    if (!begin) {
        Serial.println("Preferences for Plant could not begin");
        return;
    }
    *id = preferences.getString("id", "");
    preferences.end();
}

void Credentials::writePlantID(String id) {
    const bool begin = preferences.begin("plant", false);
    if (!begin) {
        Serial.println("Preferences for Plant could not begin");
        return;
    }
    preferences.putString("id", id);
    preferences.end();
}
