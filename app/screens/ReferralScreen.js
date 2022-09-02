import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import colors from "../config/colors";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppButton from "../components/AppButton";

function ReferralScreen({ navigation }) {
  const [email, setEmail] = useState();
  const [balance, setBalance] = useState("...");
  const [referralCode, setReferralCode] = useState("...");

  useEffect(() => {
    getUserData();
    getData();
  });

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("tptCredentials");
      if (value !== null) {
        const parsedForm = JSON.parse(value);
        setEmail(parsedForm.email);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getUserData = async () => {
    const url = `https://shielded-thicket-31967.herokuapp.com/user/${email}`;
    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        setBalance(data.userData[0].balance);
        setReferralCode(data.userData[0].referral_code);
      })
      .catch((error) => console.log(error));
  };

  const handlePress = () => {
    if (balance < 1000) {
      alert("You need to have at least 1000 naira to make a withdrawal");
    } else {
      navigation.navigate("UploadBankDetails");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.earningContainer}>
        <Text style={styles.heading}>My Referral Earnings: </Text>
        <Text style={{ color: "green" }}>₦ {balance}</Text>
      </View>

      <Text style={styles.txt}>
        To increase your earnings, refer others to download the TPT App and use
        your referral code when registering
      </Text>

      <View style={styles.refCont}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: colors.white,
          }}
        >
          Referral Code:
        </Text>
        <Text
          selectable
          style={{
            color: "green",
            marginLeft: 7,
            fontSize: 16,
          }}
        >
          {referralCode}
        </Text>
      </View>
      <AppButton
        title="Withdraw Earnings"
        bgColor={colors.primary}
        txtColor={colors.white}
        onPress={handlePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
    padding: 25,
  },
  heading: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.white,
  },

  txt: {
    color: colors.mildGray,
    marginBottom: 10,
  },

  earningContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  refCont: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
});

export default ReferralScreen;
