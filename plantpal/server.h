#include <functional>
#include <WebServer.h>


class ConfigServer {
private:
    typedef std::function<void(String ssid, String pass)> WifiChangeHandler;
    typedef std::function<void(String payload)> PlantCreateHandler;

    WifiChangeHandler changeWifiCallback;
    PlantCreateHandler plantCreateCallback;

    bool running = false;
    WebServer* server;
    void createServer();
public:
    ConfigServer();
    void begin();
    void onChangeWifi(WifiChangeHandler fn);
    void onChangeWifi(PlantCreateHandler fn);
    void handleClient();
    void end();
    bool ended();
};

