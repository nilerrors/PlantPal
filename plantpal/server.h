#include <functional>
#include <WebServer.h>


class ConfigServer {
private:
    typedef std::function<void(String ssid, String pass)> WifiChangeHandler;
    bool running = false;
    WebServer* server;
    void createServer();
    WifiChangeHandler changeWifiCallback;
public:
    ConfigServer();
    void begin();
    void onChangeWifi(WifiChangeHandler fn);
    void handleClient();
    void end();
    bool ended();
};

