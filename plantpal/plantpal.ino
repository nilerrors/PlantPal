#include <WiFi.h>
#include "server.h"
#include "credentials.h"


#define proto_ssid "ESPCONF"
#define proto_password "esp12345"


IPAddress local_IP(192, 168, 1, 1);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);


ConfigServer server;
Credentials credentials;


void setup() {
    Serial.begin(115200);

    bool startConfigServer = credentials.wifiNotWritten();

    if (startConfigServer) {
        WiFi.mode(WIFI_AP_STA);

        Serial.print("Setting soft-AP configuration ... ");
        bool configReady = WiFi.softAPConfig(local_IP, gateway, subnet);
        Serial.println(configReady ? "Ready" : "Failed!");

        Serial.print("Setting soft-AP ... ");
        bool settingReady = WiFi.softAP(proto_ssid, proto_password);
        Serial.println(settingReady ? "Ready" : "Failed!");

        Serial.print("IP Address = ");
        Serial.println(WiFi.softAPIP());

        Serial.print("Setting up Web Server ... ");
        server.onChangeWifi([&](String ssid, String pass) {
          credentials.writeWiFi(ssid, pass);
          Serial.println("Wifi is written");
        });
        server.begin();
        Serial.println("Done");

        while (!server.ended()) {
            server.handleClient();
        }
    }
    else {
        String ssid, pass;
        credentials.readWiFi(&ssid, &pass);
        WiFi.begin(ssid.c_str(), pass.c_str());
        Serial.print("Connecting to WiFi ");
        int times;
        while (!WiFi.status() != WL_CONNECTED) {
          times++;
          if (times > 60000) { // 60000 -> 60sec
            Serial.println(" Could not connect");
            credentials.writeWiFi("", "");
            Serial.println("Wifi network credentials need to be updated.");
            Serial.println("Restarting ESP");
            ESP.restart();            
          }
          Serial.print(".");
          delay(100);
        }
        Serial.println(" Connected");
    }
}

void loop() {
    String ssid, pass;

    credentials.readWiFi(&ssid, &pass);
    Serial.println(ssid.c_str());
    Serial.println(pass.c_str());
    delay(3000);
}
