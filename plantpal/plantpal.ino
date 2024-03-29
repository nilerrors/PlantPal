#include "src/consts.h"
#include "src/credentials.h"
#include "src/flowmeter.h"
#include "src/plant.h"
#include "src/server.h"
#include <ArduinoJson.h>
#include <WiFi.h>

volatile FlowMeter flow_meter = {FLOW_METER_PIN, 0, 0, false, 0};

void IRAM_ATTR pulseCounter() {
  flow_meter.pulses_count++;
  flow_meter.running = true;
}

unsigned long last_time = 0;
unsigned long last_irrigation = 0;
unsigned long last_time_pump_check = 0;
unsigned long last_time_plant_fetch = 0;

IPAddress local_IP(192, 168, 1, 1);
IPAddress gateway = local_IP;
IPAddress subnet(255, 255, 255, 0);

ConfigServer server;
Credentials credentials;
Plant plant;

void setup() {
  Serial.begin(115200);
  plant.init();

  WiFi.mode(WIFI_AP_STA);
  WiFi.config(INADDR_NONE, INADDR_NONE, INADDR_NONE, INADDR_NONE);
  WiFi.setHostname(HOSTNAME);
  WiFi.softAPConfig(local_IP, gateway, subnet);
  String localSSID, localPass;
  credentials.readLocalWiFi(&localSSID, &localPass);
  WiFi.softAP(localSSID.c_str(), localPass.c_str());

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

    plant.create(plant_id);
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
      if (times > 20) {
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
    plant.fetch();
  }

  pinMode(WATER_PUMP_PIN, OUTPUT);
  pinMode(FLOW_METER_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(flow_meter.PIN), pulseCounter, RISING);
}

void loop() {
  interrupts();

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
        // credentials.writeWiFi("", "");
        Serial.println("Wifi network credentials need to be updated.");
        Serial.println("Restarting ESP");
        ESP.restart();
      }
      Serial.print(".");
      delay(1000);
    }
  }

  if (!plant.isCreated()) {
    Serial.println("Plant is not created");
    delay(3000);
    return;
  }

  if ((millis() - last_time_plant_fetch) > 30000) {
    plant.fetch();
    last_time_plant_fetch = millis();
    Serial.println("Plant fetched");
  }

  if ((millis() - last_time) > 1000) {
    /*
     * flow meter
     */
    if (flow_meter.running) {
      noInterrupts();
      uint8_t pulse_count = flow_meter.pulses_count;
      float flow_rate =
          ((1000.0 / (millis() - flow_meter.last_running)) * pulse_count) /
          CALIBRATION_FACTOR;
      flow_meter.last_running = millis();
      flow_meter.running = false;

      float flow_milli_litres = (flow_rate / 60) * 1000;
      flow_meter.total_milli_litres += flow_milli_litres;

      Serial.print("Total milli Litres: ");
      Serial.println(flow_meter.total_milli_litres);

      if (flow_meter.total_milli_litres > plant.waterAmount) {
        flow_meter.total_milli_litres = 0;
        flow_meter.pulses_count = 0;
        Serial.println("Stop pomp");
        digitalWrite(WATER_PUMP_PIN, LOW);
      }
      interrupts();
    }

    /*
     * moisture_sensor
     */
    noInterrupts();
    uint16_t moisture_analog = analogRead(MOISTURE_SENSOR_PIN);
    uint8_t moisture_percentage =
        map(moisture_analog, MOISTURE_NONE, MOISTURE_WET, 0, 100);
    if (moisture_percentage > 100)
      moisture_percentage = 100;
    if (moisture_percentage < 0)
      moisture_percentage = 0;

    plant.setMoisturePercentage(moisture_percentage);

    Serial.print("Moisture = ");
    Serial.print(moisture_percentage);
    Serial.println("%");

    if ((millis() - last_irrigation) > 10000) {
      if (plant.autoIrrigation &&
          moisture_percentage < plant.moisturePercentageThreshold) {
        Serial.println("Start pomp hoi");
        digitalWrite(WATER_PUMP_PIN, HIGH);
        delay(100);
      }

      if ((millis() - last_time_pump_check) > 30000) {
        if (plant.shouldIrrigate()) {
          Serial.println("Start pomp hi");
          digitalWrite(WATER_PUMP_PIN, HIGH);
          delay(100);
        }
        last_time_pump_check = millis();
      }

      last_irrigation = millis();
    }

    last_time = millis();
  }
}
