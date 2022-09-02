import React, { useState } from "react";
import { StyleSheet } from "react-native";
import AppLoading from "expo-app-loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePreventScreenCapture } from "expo-screen-capture";

import { credentialsContext } from "./app/components/CredentialsContext";
import RootStack from "./app/navigators/RootStack";

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");
  usePreventScreenCapture();

  const checkLoginCredentials = () => {
    AsyncStorage.getItem("yimiwiCredentials")
      .then((result) => {
        if (result !== null) {
          setStoredCredentials(JSON.parse(result));
        } else {
          setStoredCredentials(null);
        }
      })
      .catch((err) => console.log(err));
  };

  if (!appReady) {
    return (
      <AppLoading
        startAsync={checkLoginCredentials}
        onFinish={() => setAppReady(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <credentialsContext.Provider
      value={{ storedCredentials, setStoredCredentials }}
    >
      <RootStack />
    </credentialsContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
