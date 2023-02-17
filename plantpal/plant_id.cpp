#include "plant_id.h"


Preferences preferences;


void readPlantID(String &id) {
    preferences.begin("plant", false);
    id = preferences.getString("id", "");
    preferences.end();
}

void writePlantID(String id) {
    preferences.begin("plant", false);
    preferences.putString("id", id);
    preferences.end();
}