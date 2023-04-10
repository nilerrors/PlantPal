#include "credentials.h"

void Credentials::begin() {
  if (!preferences.begin("plantpal_wifi")) {
    Serial.println("Preferences could not begin");
    return;
  }
}

void Credentials::end() { preferences.end(); }

void Credentials::readWiFi(String *ssid, String *pass) {
  if (!preferences.begin("plantpal_wifi")) {
    Serial.println("Preferences could not begin");
    return;
  }
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
