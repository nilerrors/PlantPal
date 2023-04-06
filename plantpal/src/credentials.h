#include <Arduino.h>
#include <Preferences.h>

char* chip_id() {
  uint64_t chipid = ESP.getEfuseMac();
  char chipid_str[17];
  sprintf(chipid_str, "%016llX", chipid);
  return chipid_str;
}


class Credentials {
private:
  Preferences preferences;

public:
  void begin();
  void end();

  bool setupDone();
  bool wifiNotWritten();
  void readWiFi(String *ssid, String *pass);
  void writeWiFi(String ssid, String pass);
};
