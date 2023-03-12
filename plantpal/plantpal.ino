#include <WiFi.h>
#include <ArduinoJson.h>
#include "src/server.h"
#include "src/credentials.h"


#define PROTO_SSID "ESPCONF"
#define PROTO_PASSWORD "esp12345"


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
        bool settingReady = WiFi.softAP(PROTO_SSID, PROTO_PASSWORD);
        Serial.println(settingReady ? "Ready" : "Failed!");

        Serial.print("IP Address = ");
        Serial.println(WiFi.softAPIP());

        Serial.print("Setting up Web Server ... ");
        server.onChangeWifi([&](String ssid, String pass) {
          credentials.writeWiFi(ssid, pass);
          Serial.println("Wifi is written");
        });
        server.onPlantCreate([&](String payload) {
          StaticJsonDocument<512> doc;
          deserializeJson(doc, payload.c_str());

          String plant_id = doc["id"].as<String>();
          int32_t water_amount = doc["water_amount"].as<signed int>();

          credentials.writePlant(plant_id, water_amount);
        });
        server.begin();

        while (!server.ended()) {
            server.handleClient();
        }
    }
    else {
        String ssid, pass;
        credentials.readWiFi(&ssid, &pass);
        WiFi.begin(ssid.c_str(), pass.c_str());
        Serial.print("Connecting to WiFi ");
        int times = 0;
        while (!WiFi.status() != WL_CONNECTED) {
          times++;
          if (times > 20) { // 60000 -> 60sec
            Serial.println(" Could not connect");
            credentials.writeWiFi("", "");
            Serial.println("Wifi network credentials need to be updated.");
            Serial.println("Restarting ESP");
            ESP.restart();            
          }
          Serial.print(".");
          delay(1000);
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
