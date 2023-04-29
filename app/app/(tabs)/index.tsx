import { Button, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import WifiManager from "react-native-wifi-reborn";
import * as Location from "expo-location";

import { Text, View } from "../../components/Themed";
import { WIFI } from "../../constants/Wifi";

export default function Home() {
  const [network, setNetwork] = useState<WifiManager.WifiEntry>();

  const checkNetworkAvailability = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return false;
    }
    const list = (await WifiManager.loadWifiList()).filter(
      (n) => n.SSID === WIFI.ssid
    );
    setNetwork(list.length === 0 ? undefined : list[0]);
  };

  useEffect(() => {
    checkNetworkAvailability();
  }, []);

  return (
    <View style={styles.container}>
      {network == undefined ? (
        <Text>Network Not Found</Text>
      ) : (
        <>
          <Text>{JSON.stringify(network)}</Text>
          <View style={styles.end}>
            <Button
              title="Connect"
              color={"#333"}
              onPress={() => checkNetworkAvailability()}
            />
          </View>
        </>
      )}
      <View style={styles.end}>
        <Button
          title="Check if available"
          color={"#333"}
          onPress={() => checkNetworkAvailability()}
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
  },
});
