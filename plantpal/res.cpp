#include <Arduino.h>
#include "res.h"


const char* Responses::base(String body, String title) {
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

const char* Responses::root(int len, network networks[]) {
	String res = "<div id='root'><h2>WiFi Network Configuration</h2><form method='post' action='/change_wifi'><div><label for='ssid'>SSID: </label><select name='ssid'><option selected='true' disabled>WiFi Network</option>";
    for (int i = 0; i < len; i++) {
        res += "<option value='" + networks[i].ssid + "'>" + networks[i].ssid + (networks[i].open ? "" : " {🔑}") + "</option>";
    }
    res += "</select></div><div><label for='pass'>Password: </label><input type='password'name='pass' /></div><div><button type='submit'>Send</button></div></form></div>";

    return this->base(res, "Change WiFi Network");
}

const char* Responses::change_wifi(String ssid) {
    String res = "<h3>Connection Succesful</h3><hr><p>Connected to network with SSID " + ssid + "</p>";
    
    res += "<div id='root'><h2>WiFi Network Configuration</h2><form method='post' action='/create_plant'><div><label for='email'>Email: </label><input type='email' name='email'></div><div><label for='pass'>Password: </label><input type='password' name='pass' /></div><div><button type='submit'>Send</button></div></form></div>";

    return this->base(res, "Create Plant");
}

const char* Responses::not_found() {
    return this->base("<h1>Not Found</h1>", "404 Page Not Found");
}
