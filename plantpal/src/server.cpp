#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "server.h"
#include "credentials.h"

ConfigServer::ConfigServer() {
    server = new WebServer(80);

    server->on("/", HTTP_GET, [&]() {
        String res = "<h2>WiFi Network Configuration</h2><form method='post' action='/change_wifi'><div><label for='ssid'>SSID: </label><select name='ssid'><option selected='true' disabled>WiFi Network</option>";
        
        int n = WiFi.scanNetworks();
        for (int i = 0; i < n; i++) {
            res += "<option value='" + WiFi.SSID(i) + "'>" + WiFi.SSID(i) + (WiFi.encryptionType(i) == WIFI_AUTH_OPEN ? "" : " {🔑}") + "</option>";
        }

        res += "</select></div><div><label for='pass'>Password: </label><input type='password'name='pass' /></div><div><button type='submit'>Send</button></div></form>";

        response_base(200, res, "Change Wifi Configuration");
        Serial.println("Root");
    });

    server->on("/generate_204", HTTP_GET, [&]() {
        String res = "<a href='/'>Setup</a>";

        response_base(200, res, "Change Wifi Configuration");
        Serial.println("DNS Path");
    });

    server->on("/create_plant", HTTP_POST, [&]() {
        if (!server->hasArg("email") || !server->hasArg("pass")) {
            String res = "<h1>Bad serveruest</h1><hr><p>Data could not be validated</p>";
            response_base(400, res, "400 Bad serveruest");
        }
        else {
            if (WiFi.status() == WL_CONNECTED) {
                HTTPClient http;

                http.begin("https://10.3.41.39:8000/plants_collection/plants/");

                String email = server->arg("email");
                String password = server->arg("pass");

                uint64_t chipid = ESP.getEfuseMac();
                char chipid_str[17];
                sprintf(chipid_str, "%016llX", chipid);

                http.addHeader("Content-Type", "application/json");
                String httpserveruestData = "{\"email\":\"" + email + "\",\"password\":\"" + password + "\",\"chip_id\":\"" + chipid_str + "\"}";

                int httpResponseCode = http.POST(httpserveruestData);

                String payload = "";

                if (httpResponseCode > 0) {
                    payload = http.getString();
                    if (httpResponseCode == 200) {
                        String res = "<h1>Succesfully Created</h1><hr><p>Plant is added to account.</p>" + payload;
                        response_base(200, res, "Plant Created");

                        plantCreateCallback(payload);
                    }
                    else if (httpResponseCode == 401) {
                        String res = "<h1>Unauthorized</h1><hr><p>Account email and password do not correspond.</p>";
                        response_base(401, res, "401 Unauthorized");
                    }
                    else if (httpResponseCode == 409) {

                    }
                    Serial.println(payload);
                }
                else {
                    String res = "<h1>Network Error</h1><hr><p>Could not reach the Database server</p>";
                    response_base(500, res, "500 Internal Server Error");
                }
                
                http.end();
            } else {
                String res = "<h1>Network Error</h1><hr><p>Not connected to network</p>";
                response_base(500, res, "500 Internal Server Error");
                server->send(500, "text/html", res.c_str());
            }
        }
    });

    server->on("/change_wifi", HTTP_POST, [&]() {
        if (!server->hasArg("ssid") || !server->hasArg("pass")) {
            String res = "<h1>Bad serveruest</h1><hr><p>Data could not be validated</p>";
            response_base(400, "<h1>Not Found</h1>", "400 Bad serveruest");
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

            String res = "<h3>Connection Succesful</h3><hr><p>Connected to network with SSID " + ssid + "</p><div id='root'><h2>WiFi Network Configuration</h2><form method='post' action='/create_plant'><div><label for='email'>Email: </label><input type='email' name='email'></div><div><label for='pass'>Password: </label><input type='password' name='pass' /></div><div><button type='submit'>Send</button></div></form></div>";
            response_base(200, res, "Create Plant");
        }
        Serial.println("Credentials Form");
    });

    server->onNotFound([&]() {
        response_base(404, "<h1>Not Found</h1>", "404 Page Not Found");
        Serial.print("Not Found: ");
        Serial.println(server->uri());
    });
}

void ConfigServer::response_base(int statusCode, String body, String title) {
    String res = "<!DOCTYPE html><html><head>\
    <meta charset='UTF-8' />\
    <meta http-equiv='X-UA-Compatible' content='IE=edge' />\
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />\
    <title>" + title + "</title></head>\
    <body>" + body + "</body>";

    server->send(statusCode, "text/html", res.c_str());
}

void ConfigServer::onChangeWifi(WifiChangeHandler fn) {
  changeWifiCallback = fn;
}

void ConfigServer::onPlantCreate(PlantCreateHandler fn) {
  plantCreateCallback = fn;
}

void ConfigServer::start() {
    server->begin();
    Serial.println("Server running");
}

void ConfigServer::handleClient() {
    server->handleClient();
}
