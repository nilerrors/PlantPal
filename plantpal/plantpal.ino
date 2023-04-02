#include <WiFi.h>
#include <DNSServer.h>
#include <ArduinoJson.h>
#include "src/server.h"
#include "src/credentials.h"
#include "src/consts.h"
#include "src/flowmeter.h"


FlowMeter flow_meter = {FLOW_METER_PIN, 0, 0, false, 0};

void IRAM_ATTR pulseCounter() {
  flow_meter.pulses_count++;
  flow_meter.running = true;
}

unsigned long last_time = 0;


IPAddress local_IP(8, 8, 8, 8);
IPAddress gateway = local_IP;
IPAddress subnet(255, 255, 255, 0);
const byte DNS_PORT = 53;


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

    pinMode(WATER_PUMP_PIN, OUTPUT);
    pinMode(FLOW_METER_PIN, INPUT_PULLUP);
    attachInterrupt(digitalPinToInterrupt(flow_meter.PIN), pulseCounter, FALLING);
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

    if ((millis() - last_time) > INTERVAL) {
        /*
        * moisture_sensor
        */
        int moisture_analog = analogRead(MOISTURE_SENSOR_PIN);
        Serial.println(moisture_analog);
        int moisture_percentage = map(moisture_analog, MOISTURE_NONE, MOISTURE_WET, 0, 100);
        if (moisture_percentage > 100) moisture_percentage = 100;
        if (moisture_percentage < 0) moisture_percentage = 0;

        Serial.print("Moisture = ");
        Serial.print(moisture_percentage);
        Serial.println("%");


        if (moisture_percentage < IRRIGATION_THRESHOLD_PERCENTAGE) {
            // start pomp
            Serial.println("Start pomp");
            digitalWrite(WATER_PUMP_PIN, HIGH);
        }


        /*
        * flow meter
        */
        if (flow_meter.running) {
            uint8_t pulse_count = flow_meter.pulses_count;
            float flow_rate = ((1000.0 / (millis() - flow_meter.last_running)) * pulse_count) / CALBRATION_FACTOR;
            Serial.print("Flow Rate: ");
            Serial.println(flow_rate);
            flow_meter.last_running = millis();
            flow_meter.running = false;

            float flow_milli_litres = (flow_rate / 60) * 1000;
            Serial.print("Flow Milli Litres: ");
            Serial.println(flow_milli_litres);
            flow_meter.total_milli_litres += flow_milli_litres;

            Serial.print("Total milli Litres: ");
            Serial.println(flow_meter.total_milli_litres);

            if (flow_meter.total_milli_litres >= IRRIGATION_AMOUNT) {
                flow_meter.total_milli_litres = 0;
                // stop pomp
                Serial.println("Stop pomp");
                digitalWrite(WATER_PUMP_PIN, LOW);
            }
        }

        last_time = millis();
    }
}
