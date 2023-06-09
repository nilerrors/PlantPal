import { Button, Linking, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import WifiManager from "react-native-wifi-reborn";

import { Text, View } from "../../components/Themed";
import { WiFiNetwork } from "../../components/Forms/WiFiNetwork";
import { WIFI } from "../../constants/Wifi";
import { CreatePlant } from "../../components/Forms/CreatePlant";
import { ChangeWifi } from "../../components/Forms/ChangeWifi";
import { CustomDeviceCredentials } from "../../components/Forms/CustomDeviceCredentials";
import { useNetwork } from "../../contexts/NetworkContext";

export default function Home() {
  const {
    allNetworks,
    allOtherNetworks,
    // ESPNetwork,
    found,
    isCustomNetwork,
    setIsCustomNetwork,
    wifi,
    setWifi,
    connected,
    locationAccess,
    checkNetworkAvailability,
    connectToNetwork,
    clear,
  } = useNetwork();

  const [recheckLoading, setRecheckLoading] = useState(false);
  const [currentForm, setCurrentForm] = useState<
    "connect" | "wifi_cred" | "create_plant" | "change_wifi"
  >("connect");
  const [currentPlantID, setCurrenPlantID] = useState<string>();

  useEffect(() => {
    setCurrentForm((form) => (connected ? form : "wifi_cred"));
  }, [connected]);

  if (locationAccess !== undefined && !locationAccess) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Location access was denied</Text>
        <Text>Location access is needed to access the device.</Text>
        <View style={styles.end}>
          <Button
            title="Change Permissions"
            onPress={() => Linking.openSettings()}
          />
        </View>
      </View>
    );
  }

  if (!found) {
    return (
      <View style={styles.container}>
        <View style={{ width: "100%" }}>
          <Text style={styles.title}>Device not found</Text>
          <Text style={{ textAlign: "center" }}>Device may be OFF</Text>
        </View>
        {!isCustomNetwork ? null : <CustomDeviceCredentials />}
        <View style={styles.end}>
          <View style={{ marginBottom: "2%" }}>
            <Button
              title={
                !isCustomNetwork ? "Custom Device Name" : "Remove Custom Name"
              }
              color="#7393B3"
              onPress={() => {
                if (isCustomNetwork) {
                  setWifi(WIFI);
                } else {
                  setWifi({ ssid: "", pass: "" });
                }
                setIsCustomNetwork(!isCustomNetwork);
              }}
            />
          </View>
          <Button
            title={recheckLoading ? "Loading" : "Recheck if available"}
            disabled={recheckLoading}
            onPress={() => {
              setRecheckLoading(true);
              checkNetworkAvailability().then(() => {
                setRecheckLoading(false);
              });
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!connected ? (
        <>
          <View style={{ width: "100%" }}>
            <Text style={styles.title}>Device found</Text>
            <Text style={{ textAlign: "center" }}>but not connected</Text>
          </View>
          {!isCustomNetwork ? null : <CustomDeviceCredentials />}
        </>
      ) : (
        <>
          {currentForm === "wifi_cred" ? (
            <>
              <WiFiNetwork
                onDeviceConnect={() => setCurrentForm("create_plant")}
              />
            </>
          ) : null}
          {currentForm === "create_plant" ? (
            <>
              <CreatePlant
                onCreatePlant={(id) => {
                  setCurrenPlantID(id);
                  setCurrentForm("change_wifi");
                }}
              />
            </>
          ) : null}
          {currentForm === "change_wifi" ? (
            <>
              <ChangeWifi
                name={currentPlantID ?? wifi.ssid}
                onChangeWifi={() => {
                  clear();
                  setCurrentForm("connect");
                  setCurrenPlantID(undefined);
                }}
              />
            </>
          ) : null}
        </>
      )}
      <View style={styles.end}>
        {!connected ? (
          <>
            <View style={{ marginBottom: "2%" }}>
              <Button
                title={
                  !isCustomNetwork ? "Custom Device Name" : "Remove Custom Name"
                }
                onPress={() => {
                  if (isCustomNetwork) {
                    setWifi(WIFI);
                  } else {
                    setWifi({ ssid: "", pass: "" });
                  }
                  setIsCustomNetwork(!isCustomNetwork);
                }}
                color="#7393B3"
              />
            </View>
            <Button
              title="Connect"
              onPress={() =>
                connectToNetwork().then(() => {
                  setCurrentForm("wifi_cred");
                })
              }
            />
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  end: {
    bottom: "5%",
    position: "absolute",
    width: "60%",
  },
});
