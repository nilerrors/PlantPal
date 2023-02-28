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

    server->on("/change_wifi", HTTP_POST, [&]() {
        if (!server->hasArg("ssid") || !server->hasArg("pass")) {
            request_error error;
            error.title = "400 Bad Request";
            error.content = "";
            server->send(400, "text/html", responses.change_wifi(error));
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
                    server->send(200, "text/html", "Could not connect to network");
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

            server->send(200, "text/html", responses.change_wifi(data));
            delay(3000);

            WiFi.mode(WIFI_STA);
            end();
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
