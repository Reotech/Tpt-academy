import React, { useContext } from "react";
import { View, StyleSheet, StatusBar, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { credentialsContext } from "../components/CredentialsContext";
import ProfileItem from "../components/ProfileItem";
import colors from "../config/colors";

function SettingsScreen({ navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(credentialsContext);

  const { _id, account_type } = storedCredentials;

  const clearLogin = () => {
    AsyncStorage.removeItem("yimiwiCredentials")
      .then(() => {
        setStoredCredentials("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = () => {
    const url = `https://pure-atoll-06308.herokuapp.com/user/delete/${_id}`;

    axios
      .delete(url)
      .then((response) => {
        const result = response.data;
        const { message, status } = result;

        if (status != "SUCCESS") {
          handleMessage(message, status);
        } else {
          clearLogin();
          setTimeout(() => {
            navigation.navigate("LoginScreen");
          }, 2000);
        }
      })
      .catch((error) => {
        alert("An error occurred. Check your connection and try again");
        console.log(error);
      });
  };

  const handleGuideDelete = () => {
    const url = `https://pure-atoll-06308.herokuapp.com/guide/delete/${_id}`;

    axios
      .delete(url)
      .then((response) => {
        const result = response.data;
        const { message, status } = result;

        if (status != "SUCCESS") {
          handleMessage(message, status);
        } else {
          clearLogin();
          setTimeout(() => {
            navigation.navigate("LoginScreen");
          }, 2000);
        }
      })
      .catch((error) => {
        alert("An error occurred. Check your connection and try again");
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <ProfileItem
        name="Change Password"
        icon="lock"
        onPress={() => navigation.navigate("ChangePasswordScreen")}
      />
      <ProfileItem name="Help" icon="head-question" />
      <ProfileItem name="About" icon="information" />
      <ProfileItem
        name="Delete Account"
        icon="trash-can"
        onPress={() =>
          Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account?",
            [
              { text: "No" },
              {
                text: "Yes",
                onPress: () => {
                  if (account_type == "User") {
                    handleDelete();
                  } else {
                    handleGuideDelete();
                  }
                },
                style: "destructive",
              },
            ]
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  profileSection: {
    marginTop: StatusBar.currentHeight,
    flexDirection: "row",
    padding: 20,
    backgroundColor: colors.white,
    alignItems: "center",
    height: 180,
  },

  img: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },

  textSection: {
    marginLeft: 30,
  },

  profileName: {
    fontSize: 16,
    paddingBottom: 6,
  },

  button: {
    backgroundColor: colors.midGray,
    borderRadius: 20,
    padding: 7,
    marginRight: 10,
    alignItems: "center",
  },

  text: {
    color: colors.dark,
  },
});
export default SettingsScreen;
