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
        server->send(200, "text/html", responses.root());
        Serial.println("Root");
    });

    server->on("/available_networks", HTTP_GET, [&]() {
        int n = WiFi.scanNetworks();
        network* networks = new network[n];
        for (int i = 0; i < n; i++) {
            network netw;
            netw.ssid = WiFi.SSID(i);
            netw.open = WiFi.encryptionType(i) == WIFI_AUTH_OPEN;
            networks[i] = netw;
        }
        server->send(200, "application/json", responses.available_networks(n, networks));
        Serial.println("Available Networks");
    });

    server->on("/create_plant", HTTP_POST, [&]() {
        if (!server->hasArg("email") || !server->hasArg("password")) {
            String res = "{\"message\":\"Bad Request\",\"detail\":\"Data could not be validated\"}";
            server->send(400, "application/json", res.c_str());
        }
        else {
            if (WiFi.status() == WL_CONNECTED) {
                WiFiClient wifiClient;
                HTTPClient http;

                http.begin(wifiClient, "https://10.3.41.39:8000/plants/");

                String email = server->arg("email");
                String password = server->arg("password");

                http.addHeader("Content-Type", "application/json");
                String httpRequestData = "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";

                int httpResponseCode = http.POST(httpRequestData);

                String payload = "";

                if (httpResponseCode > 0) {
                    payload = http.getString();
                    if (httpResponseCode == 200) {
                        Serial.println("Successfully created plant in the database.");

                        String res = "{\"message\":\"Succesfully Created\",\"detail\":\"Plant is added to account.\"}";
                        server->send(200, "application/json", res.c_str());
                    }
                    else if (httpResponseCode == 401) {
                        String res = "{\"message\":\"Unauthorized\",\"detail\":\"Account email and password do not correspond.\"}";
                        server->send(401, "application/json", res.c_str());
                    }
                    Serial.println(payload);
                }
                else {
                    String res = "{\"message\":\"Network Error\",\"detail\":\"Could not reach the Database server\"}";
                    server->send(500, "application/json", res.c_str());
                }
                
                http.end();
            } else {
                String res = "{\"message\":\"Network Error\",\"detail\":\"Not connected to network\"}";
                server->send(500, "application/json", res.c_str());
            }
        }
    });

    server->on("/change_wifi", HTTP_POST, [&]() {
        if (!server->hasArg("ssid") || !server->hasArg("pass")) {
            String res = "{\"message\":\"Bad Request\",\"detail\":\"Data could not be validated\"}";
            server->send(400, "application/json", res.c_str());
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
                    String res = "{\"message\":\"Network Error\",\"detail\":\"Could not connect to network\"}";
                    server->send(500, "application/json", res.c_str());
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

            change_wifi_request data;
            data.ssid = ssid;

            String res = "{\"message\":\"Connection Succesful\",\"detail\":\"Connected to network with SSID "+ ssid + "\"}";
            server->send(200, "application/json", res.c_str());
            delay(3000);

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

void ConfigServer::onChangeWifi(WifiChangeHandler fn) {
  changeWifiCallback = fn;
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
