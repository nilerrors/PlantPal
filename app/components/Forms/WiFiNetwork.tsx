import { useEffect, useState } from "react";
import { Button, TextInput, View } from "react-native";
import { Checkbox } from "expo-checkbox";
import SelectDropdown from "react-native-select-dropdown";
import { Text } from "../Themed";
import { FontAwesome } from "@expo/vector-icons";
import { getNetwork, setNetwork } from "../../utils/networkCredentials";
import { useNetwork } from "../../contexts/NetworkContext";

type Props = {
  onDeviceConnect: () => void;
};

export function WiFiNetwork({ onDeviceConnect }: Props) {
  const { allOtherNetworks, checkNetworkAvailability: refetchNetworks } =
    useNetwork();
  const [ssid, setSsid] = useState("");
  const [pass, setPass] = useState("");
  const [saveForNext, setSaveForNext] = useState(true);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getNetwork().then((network) => {
      setSsid(network.ssid ?? "");
      setPass(network.pass ?? "");
    });
  }, []);

  const handleSubmit = () => {
    if (ssid == "") {
      setError("No value given for SSID");
      return;
    }
    if (pass == "") {
      setError("No value given for Password");
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15);
    const formData = new FormData();
    formData.append("ssid", ssid);
    formData.append("pass", pass);
    fetch("http://192.168.1.1/api/change_wifi", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        if (data.title == "Connection Successful") {
          setError(undefined);
          alert("Device is connected to network");
          onDeviceConnect();
          if (saveForNext) {
            setNetwork(ssid, pass);
          }
        } else {
          alert(data.title + ": " + data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        if (err.name == "AbortError") {
          setError("Request took too long");
          return;
        }
        setError(JSON.stringify(err));
      });
    clearTimeout(timeout);
  };

  return (
    <>
      <View style={{ marginVertical: "20%", width: "70%" }}>
        <Text
          style={{ fontSize: 50, textAlign: "center", marginBottom: "10%" }}
        >
          Network Credentials
        </Text>
        {error == undefined ? null : (
          <>
            <Text style={{ fontSize: 20, color: "red" }}>{error}</Text>
            <View style={{ marginVertical: "3%" }}></View>
          </>
        )}
        <Text style={{ fontSize: 30 }}>Network SSID</Text>
        <SelectDropdown
          data={allOtherNetworks.map((n) => n.SSID)}
          onFocus={refetchNetworks}
          onSelect={(s) => {
            setSsid(s);
            setError(undefined);
          }}
          buttonStyle={{
            borderRadius: 5,
            borderColor: "white",
            backgroundColor: "#7393B3",
            width: "100%",
            margin: 0,
          }}
          renderDropdownIcon={(isOpened) => {
            return (
              <FontAwesome
                name={isOpened ? "chevron-up" : "chevron-down"}
                color={"#444"}
                size={18}
              />
            );
          }}
          buttonTextStyle={{
            color: "white",
          }}
          rowStyle={{
            borderColor: "white",
            backgroundColor: "#7393B3",
          }}
        />
        <View style={{ marginVertical: "2%" }}></View>
        <Text style={{ fontSize: 30 }}>Password</Text>
        <TextInput
          style={{
            borderColor: "white",
            borderWidth: 1,
            paddingHorizontal: 5,
            width: "100%",
            height: 30,
            color: "white",
            fontSize: 30,
          }}
          onChangeText={(value) => {
            setPass(value);
            setError(undefined);
          }}
          secureTextEntry={true}
          value={pass}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Checkbox
            value={saveForNext}
            onValueChange={() => {
              setSaveForNext((v) => !v);
            }}
            color={"#5599ff"}
            style={{ marginVertical: "3%", marginRight: "3%" }}
          />
          <Text style={{ fontSize: 15 }}>Save For Later</Text>
        </View>
        <View style={{ marginTop: "11%" }}>
          <Button
            title={loading ? "Loading..." : "Submit"}
            onPress={() => handleSubmit()}
            disabled={loading}
          />
        </View>
      </View>
    </>
  );
}
