#include <functional>
// #include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>


class ConfigServer {
private:
    typedef std::function<void(String ssid, String pass)> WifiChangeHandler;
    typedef std::function<void(String payload)> PlantCreateHandler;

    WifiChangeHandler changeWifiCallback;
    PlantCreateHandler plantCreateCallback;

    AsyncWebServer server;
public:
    ConfigServer();
    void begin();
    void onChangeWifi(WifiChangeHandler fn);
    void onPlantCreate(PlantCreateHandler fn);
};

