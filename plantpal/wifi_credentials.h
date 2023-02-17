#include <Arduino.h>
#include <Preferences.h>


void readWiFiCredentials(String& ssid, String& pass);
void writeWiFiCredentials(String ssid, String pass);
bool wifiCredentialsNotWritten();
