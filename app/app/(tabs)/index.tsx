import { Button, Linking, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import WifiManager from "react-native-wifi-reborn";
import * as Location from "expo-location";

import { Text, View } from "../../components/Themed";
import { WiFiNetwork } from "../../components/Forms/WiFiNetwork";
import { WIFI } from "../../constants/Wifi";

export default function Home() {
  const [allNetworks, setAllNetworks] = useState<WifiManager.WifiEntry[]>([]);
  const [ESPNetwork, setESPNetwork] = useState<
    WifiManager.WifiEntry | null | undefined
  >(null);
  const [connected, setConnected] = useState(false);
  const [locationAccess, setLocationAccess] = useState<boolean>();

  const checkNetworkAvailability = async (first = false) => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      setLocationAccess(false);
      return false;
    }
    setLocationAccess(true);

    const list = (
      first
        ? await WifiManager.loadWifiList()
        : await WifiManager.reScanAndLoadWifiList()
    ).filter((n) => n.SSID != "(hidden SSID)");
    setAllNetworks(list);
    setESPNetwork(
      list.filter((n) => n.SSID === WIFI.ssid).length === 0
        ? undefined
        : list.filter((n) => n.SSID === WIFI.ssid)[0]
    );
  };

  const connectToNetwork = async () => {
    await WifiManager.connectToProtectedSSID(WIFI.ssid, WIFI.pass, false).then(
      () => {
        WifiManager.getCurrentWifiSSID().then((ssid) => {
          setConnected(ssid === WIFI.ssid);
        });
      }
    );
  };

  useEffect(() => {
    checkNetworkAvailability(true);
    const checkNetworkIsAvailable = setInterval(() => {
      checkNetworkAvailability();
    }, 10000);
    return () => clearInterval(checkNetworkIsAvailable);
  }, []);

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

  return (
    <View style={styles.container}>
      {ESPNetwork === undefined ? (
        <>
          <Text style={styles.title}>Network Not Found</Text>
          <Text>Device may be OFF</Text>
        </>
      ) : (
        <>
          {ESPNetwork === null ? null : (
            <>
              <Text style={styles.title}>Device found</Text>
              <Text>{connected ? "and connected" : "but not connected"}</Text>
              {!connected ? null : (
                <>
                  <WiFiNetwork allNetworks={allNetworks} />
                </>
              )}
            </>
          )}
        </>
      )}
      <View style={styles.end}>
        {connected ? null : (
          <>
            <Button
              title={
                ESPNetwork === null
                  ? "Check if available"
                  : ESPNetwork === undefined
                  ? "Recheck if available"
                  : "Connect"
              }
              onPress={() =>
                ESPNetwork === null || ESPNetwork === undefined
                  ? checkNetworkAvailability()
                  : connectToNetwork()
              }
            />
          </>
        )}
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