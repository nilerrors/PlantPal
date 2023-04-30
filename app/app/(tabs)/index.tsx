import { Button, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import WifiManager from "react-native-wifi-reborn";
import * as Location from "expo-location";

import { Text, View } from "../../components/Themed";
import { WIFI } from "../../constants/Wifi";

export default function Home() {
  const [ESPNetwork, setESPNetwork] = useState<
    WifiManager.WifiEntry | null | undefined
  >(null);

  const checkNetworkAvailability = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return false;
    }
    const list = (await WifiManager.loadWifiList()).filter(
      (n) => n.SSID === WIFI.ssid
    );
    setESPNetwork(list.length === 0 ? undefined : list[0]);
  };

  const connectToNetwork = async () => {
    await WifiManager.connectToProtectedSSID(WIFI.ssid, WIFI.pass, false);
  };

  useEffect(() => {
    checkNetworkAvailability();
  }, []);

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
              <Text>{JSON.stringify(ESPNetwork)}</Text>
            </>
          )}
        </>
      )}
      <View style={styles.end}>
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
