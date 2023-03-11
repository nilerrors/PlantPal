#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "server.h"
#include "res.h"
#include "credentials.h"


Responses responses;


ConfigServer::ConfigServer() {
    createServer();
}

void ConfigServer::createServer() {
    server = new WebServer();

    server->on("/", HTTP_GET, [&]() {
        int n = WiFi.scanNetworks();
        network* networks = new network[n];
        for (int i = 0; i < n; i++) {
            network netw;
            netw.ssid = WiFi.SSID(i);
            netw.open = WiFi.encryptionType(i) == WIFI_AUTH_OPEN;
            networks[i] = netw;
        }
        server->send(200, "text/html", responses.root(n, networks));
        Serial.println("Root");
    });

    server->on("/create_plant", HTTP_POST, [&]() {
        if (!server->hasArg("email") || !server->hasArg("pass")) {
            String res = "<h1>Bad Request</h1><hr><p>Data could not be validated</p>";
            server->send(400, "text/html", res.c_str());
        }
        else {
            if (WiFi.status() == WL_CONNECTED) {
                WiFiClient wifiClient;
                HTTPClient http;

                http.begin(wifiClient, "https://10.3.41.39:8000/plants_collection/plants/");

                String email = server->arg("email");
                String password = server->arg("pass");

                uint64_t chipid = ESP.getEfuseMac();
                char chipid_str[17];
                sprintf(chipid_str, "%016llX", chipid);

                http.addHeader("Content-Type", "application/json");
                String httpRequestData = "{\"email\":\"" + email + "\",\"password\":\"" + password + "\",\"chip_id\":\"" + chipid_str + "\"}";

                int httpResponseCode = http.POST(httpRequestData);

                String payload = "";

                if (httpResponseCode > 0) {
                    payload = http.getString();
                    if (httpResponseCode == 200) {
                        String res = "<h1>Succesfully Created</h1><hr><p>Plant is added to account.</p>" + payload;
                        server->send(200, "text/html", res.c_str());

                        plantCreateCallback();
                        end();
                    }
                    else if (httpResponseCode == 401) {
                        String res = "<h1>Unauthorized</h1><hr><p>Account email and password do not correspond.</p>";
                        server->send(401, "text/html", res.c_str());
                    }
                    else if (httpResponseCode == 409) {

                    }
                    Serial.println(payload);
                }
                else {
                    String res = "<h1>Network Error</h1><hr><p>Could not reach the Database server</p>";
                    server->send(500, "text/html", res.c_str());
                }
                
                http.end();
            } else {
                String res = "<h1>Network Error</h1><hr><p>Not connected to network</p>";
                server->send(500, "text/html", res.c_str());
            }
        }
    });

    server->on("/change_wifi", HTTP_POST, [&]() {
        if (!server->hasArg("ssid") || !server->hasArg("pass")) {
            String res = "<h1>Bad Request</h1><hr><p>Data could not be validated</p>";
            server->send(400, "text/html", res.c_str());
        }
        else {
            String ssid = server->arg("ssid");
            String pass = server->arg("pass");

            Serial.print(ssid);
            Serial.print(" :=: ");
            Serial.println(pass);

            WiFi.begin(ssid.c_str(), pass.c_str());

            int times = 0;
            while (WiFi.status() != WL_CONNECTED) {
                if (times > 10) {
                    String res = "<h1>Network Error</h1><h1><p>Could not connect to network</p>";
                    server->send(500, "text/html", res.c_str());
                    WiFi.disconnect();
                    return;
                }
                times++;
                Serial.print(".");
                delay(1000);
            }
            Serial.println("Connected");
            Serial.println(WiFi.localIP());

            changeWifiCallback(ssid, pass);

            server->send(200, "text/html", responses.change_wifi(ssid));

            // WiFi.mode(WIFI_STA);
            // end();
        }
        Serial.println("Credentials Form");
    });

    server->onNotFound([&]() {
        server->send(404, "text/html", responses.not_found());
        Serial.println("Not Found");
    });
}

void ConfigServer::respond(int code, const char *content_type, const char *response, const char *title = "") {
    server->send(code, content_type, responses.base(response, title));
}

void ConfigServer::onChangeWifi(WifiChangeHandler fn) {
  changeWifiCallback = fn;
}

void ConfigServer::onPlantCreated(PlantCreateHandler fn) {
  plantCreateCallback = fn;
}

void ConfigServer::begin() {
    server->begin();
    running = true;
    Serial.println("Server running");
}

void ConfigServer::handleClient() {
    if (running) {
        server->handleClient();
    }
}

void ConfigServer::end() {
    delete server;
    running = false;
    Serial.println("Server stopped");
}

bool ConfigServer::ended() {
	return !running;
}
