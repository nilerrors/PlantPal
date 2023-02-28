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

  void readPlantID(String *id);
  void writePlantID(String id);
};
