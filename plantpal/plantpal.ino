#include <WiFi.h>
#include <DNSServer.h>
#include <ArduinoJson.h>
#include "src/server.h"
#include "src/credentials.h"


#define PROTO_SSID "ESPCONF"
#define PROTO_PASSWORD "esp12345"
#define HOSTNAME "PlantPal"


IPAddress local_IP(8, 8, 8, 8);
IPAddress gateway = local_IP;
IPAddress subnet(255, 255, 255, 0);
const byte DNS_PORT = 53;


#define DATA_REQUEST_DELAY 60 // -> seconds
#define seconds() (millis()/1000)
unsigned long lastTime = 0;


DNSServer dns;
ConfigServer server;
Credentials credentials;


void setup() {
    Serial.begin(115200);

    WiFi.mode(WIFI_AP_STA);
    WiFi.config(INADDR_NONE, INADDR_NONE, INADDR_NONE, INADDR_NONE);
    WiFi.setHostname(HOSTNAME);
    WiFi.softAPConfig(local_IP, gateway, subnet);
    WiFi.softAP(PROTO_SSID, PROTO_PASSWORD);

    Serial.print("IP Address = ");
    Serial.println(WiFi.softAPIP());

    dns.start(DNS_PORT, "*", WiFi.softAPIP());

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
    server.start();

    if (!credentials.wifiNotWritten()) {
        String ssid, pass;
        credentials.readWiFi(&ssid, &pass);
        WiFi.begin(ssid.c_str(), pass.c_str());
        Serial.print("Connecting to WiFi ");
        int times = 0;
        while (WiFi.status() != WL_CONNECTED) {
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
    dns.processNextRequest();
    server.handleClient();

    if (credentials.wifiNotWritten()) {
      return;
    }
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("WiFi not connected\nTrying to reconnect");
      WiFi.reconnect();
      int times = 0;
        while (WiFi.status() != WL_CONNECTED) {
          times++;
          if (times > 30) {
            Serial.println(" Could not connect");
            credentials.writeWiFi("", "");
            Serial.println("Wifi network credentials need to be updated.");
            Serial.println("Restarting ESP");
            ESP.restart();            
          }
          Serial.print(".");
          delay(1000);
        }
    }

    // Main Code
    if ((seconds() - lastTime) > DATA_REQUEST_DELAY) {
      Serial.println("Hi");

      lastTime = seconds();
    }
}
