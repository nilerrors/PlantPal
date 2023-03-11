#include <Arduino.h>
#include <Preferences.h>


class Credentials {
private:
  Preferences preferences;

public:
  void begin();
  void end();

  void readWiFi(String *ssid, String *pass);
  void writeWiFi(String ssid, String pass);
  bool wifiNotWritten();

  void readPlant(String *id, int32_t *water_amount);
  void writePlant(String id, int32_t water_amount);
};
