import { createContext, useContext, useEffect, useState } from "react";
import WifiManager from "react-native-wifi-reborn";
import * as Location from "expo-location";
import { WIFI } from "../constants/Wifi";

type Network = {
  allNetworks: WifiManager.WifiEntry[];
  allPlantPalNetworks: WifiManager.WifiEntry[];
  allOtherNetworks: WifiManager.WifiEntry[];
  ESPNetwork?: WifiManager.WifiEntry;
  found: boolean;
  isCustomNetwork: boolean;
  setIsCustomNetwork: (value: boolean) => void;
  wifi: { ssid: string; pass: string };
  setWifi: (value: { ssid: string; pass: string }) => void;
  connected: boolean;
  locationAccess?: boolean;
  checkNetworkAvailability: (first?: boolean) => Promise<false | undefined>;
  connectToNetwork: () => Promise<void>;
  clear: () => void;
};

export const NetworkContext = createContext<Network>({} as Network);

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("Network Context used outside of provider");
  }
  return context;
}

export function NetworkContextProvider(props: {
  children: JSX.Element[] | JSX.Element;
}) {
  const [allNetworks, setAllNetworks] = useState<WifiManager.WifiEntry[]>([]);
  const [allPlantPalNetworks, setAllPlantPalNetworks] = useState<
    WifiManager.WifiEntry[]
  >([]);
  const [ESPNetwork, setESPNetwork] = useState<WifiManager.WifiEntry>();
  const [isCustomNetwork, setIsCustomNetwork] = useState(false);
  const [wifi, setWifi] = useState<{
    ssid: string;
    pass: string;
  }>(WIFI);
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
    // using setWifi to get latest value of wifi,
    // since this is used as a closure (setInterval)
    setWifi((wifi) => {
      console.log(wifi);
      (first
        ? WifiManager.loadWifiList()
        : WifiManager.reScanAndLoadWifiList()
      ).then((list) => {
        list.filter((n) => n.SSID != "(hidden SSID)");
        setAllNetworks(list.filter((n) => n.SSID != "(hidden SSID)"));
        setAllPlantPalNetworks(
          list.filter(
            (n) =>
              n.SSID != "(hidden SSID)" &&
              (n.SSID.startsWith("plantpal-") || n.SSID === WIFI.ssid)
          )
        );
        setESPNetwork(
          list
            .filter((n) => n.SSID != "(hidden SSID)")
            .filter((n) => n.SSID === wifi.ssid).length === 0
            ? undefined
            : list
                .filter((n) => n.SSID != "(hidden SSID)")
                .filter((n) => n.SSID === wifi.ssid)[0]
        );

        WifiManager.getCurrentWifiSSID().then((ssid) => {
          setConnected(ssid === wifi.ssid);
        });
      });

      return wifi;
    });
  };

  const connectToNetwork = async () => {
    await WifiManager.connectToProtectedSSID(wifi.ssid, wifi.pass, false)
      .then(() => {
        WifiManager.getCurrentWifiSSID().then((ssid) => {
          setConnected(ssid === wifi.ssid);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const clear = () => {
    setAllNetworks([]);
    setESPNetwork(undefined);
    setConnected(false);
  };

  useEffect(() => {
    checkNetworkAvailability(true);
    const checkNetworkIsAvailable = setInterval(() => {
      checkNetworkAvailability();
    }, 5000);
    return () => clearInterval(checkNetworkIsAvailable);
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        allNetworks,
        allPlantPalNetworks,
        allOtherNetworks: allNetworks.filter(
          (n) => n.SSID !== WIFI.ssid && !n.SSID.startsWith("plantpal-")
        ),
        ESPNetwork,
        found: ESPNetwork !== undefined,
        isCustomNetwork,
        setIsCustomNetwork,
        wifi,
        setWifi,
        connected,
        locationAccess,
        checkNetworkAvailability,
        connectToNetwork,
        clear,
      }}
    >
      {props.children}
    </NetworkContext.Provider>
  );
}
