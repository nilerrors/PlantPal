#include <Arduino.h>
#include "network.h"


typedef struct {
    String title;
    String content;
} request_error;

typedef struct {
    String ssid;
} change_wifi_request;


class Responses
{
public:
    const char* base(String body, String title);
    const char* root(int len, network networks[]);
    const char* change_wifi(String ssid);
    const char* not_found();
};
