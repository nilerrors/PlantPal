#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "server.h"
#include "credentials.h"


const char* response_base(String body, String title) {
    String res = "<!DOCTYPE html><html><head>\
    <meta charset='UTF-8' />\
    <meta http-equiv='X-UA-Compatible' content='IE=edge' />\
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />\
    <title>" + title + "</title></head>\
    <body>";
    res += body;
    res += "</body>";

    return res.c_str();
}


ConfigServer::ConfigServer() {
    AsyncWebServer s(80);
    server = s;

    server.on("/", HTTP_GET, [&](AsyncWebServerRequest *req) {
        String res = "<div id='root'><h2>WiFi Network Configuration</h2><form method='post' action='/change_wifi'><div><label for='ssid'>SSID: </label><select name='ssid'><option selected='true' disabled>WiFi Network</option>";
        
        int n = WiFi.scanNetworks();
        for (int i = 0; i < n; i++) {
            res += "<option value='" + WiFi.SSID(i); + "'>" + WiFi.SSID(i) + (WiFi.encryptionType(i) == WIFI_AUTH_OPEN ? "" : " {🔑}") + "</option>";
        }

        res += "</select></div><div><label for='pass'>Password: </label><input type='password'name='pass' /></div><div><button type='submit'>Send</button></div></form></div>";

        req->send(200, "text/html", response_base(res.c_str(), "Change Wifi Configuration"));
        Serial.println("Root");
    });

    server.on("/create_plant", HTTP_POST, [&](AsyncWebServerRequest *req) {
        if (!req->hasArg("email") || !req->hasArg("pass")) {
            String res = "<h1>Bad Request</h1><hr><p>Data could not be validated</p>";
            req->send(400, "text/html", res.c_str());
        }
        else {
            if (WiFi.status() == WL_CONNECTED) {
                WiFiClient wifiClient;
                HTTPClient http;

                http.begin(wifiClient, "https://10.3.41.39:8000/plants_collection/plants/");

                String email = req->arg("email");
                String password = req->arg("pass");

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
                        req->send(200, "text/html", res.c_str());

                        plantCreateCallback(payload);
                    }
                    else if (httpResponseCode == 401) {
                        String res = "<h1>Unauthorized</h1><hr><p>Account email and password do not correspond.</p>";
                        req->send(401, "text/html", res.c_str());
                    }
                    else if (httpResponseCode == 409) {

                    }
                    Serial.println(payload);
                }
                else {
                    String res = "<h1>Network Error</h1><hr><p>Could not reach the Database server</p>";
                    req->send(500, "text/html", res.c_str());
                }
                
                http.end();
            } else {
                String res = "<h1>Network Error</h1><hr><p>Not connected to network</p>";
                req->send(500, "text/html", res.c_str());
            }
        }
    });

    server.on("/change_wifi", HTTP_POST, [&](AsyncWebServerRequest *req) {
        if (!req->hasArg("ssid") || !req->hasArg("pass")) {
            String res = "<h1>Bad Request</h1><hr><p>Data could not be validated</p>";
            req->send(400, "text/html", res.c_str());
        }
        else {
            String ssid = req->arg("ssid");
            String pass = req->arg("pass");

            Serial.print(ssid);
            Serial.print(" :=: ");
            Serial.println(pass);

            WiFi.begin(ssid.c_str(), pass.c_str());

            int times = 0;
            while (WiFi.status() != WL_CONNECTED) {
                if (times > 10) {
                    String res = "<h1>Network Error</h1><h1><p>Could not connect to network</p>";
                    req->send(500, "text/html", res.c_str());
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

            String res = "<h3>Connection Succesful</h3><hr><p>Connected to network with SSID " + ssid + "</p><div id='root'><h2>WiFi Network Configuration</h2><form method='post' action='/create_plant'><div><label for='email'>Email: </label><input type='email' name='email'></div><div><label for='pass'>Password: </label><input type='password' name='pass' /></div><div><button type='submit'>Send</button></div></form></div>";
            req->send(200, "text/html", response_base(res.c_str(), "Create Plant"));
        }
        Serial.println("Credentials Form");
    });

    server.onNotFound([&](AsyncWebServerRequest *req) {
        req->send(404, "text/html", response_base("<h1>Not Found</h1>", "404 Page Not Found"));
        Serial.println("Not Found");
    });
}

void ConfigServer::onChangeWifi(WifiChangeHandler fn) {
  changeWifiCallback = fn;
}

void ConfigServer::onPlantCreate(PlantCreateHandler fn) {
  plantCreateCallback = fn;
}

void ConfigServer::begin() {
    server.begin();
    Serial.println("Server running");
}

