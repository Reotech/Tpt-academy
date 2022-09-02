import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet } from "react-native";
import axios from "axios";
import { Paystack } from "react-native-paystack-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";

function PaymentScreen({ route, navigation }) {
  const [payerId, setPayerId] = useState();
  const [payerName, setPayerName] = useState();
  const [payerEmail, setPayerEmail] = useState();
  const [ref, setRef] = useState();

  useEffect(() => {
    getData();
  }, []);

  const { item } = route.params;

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("tptCredentials");
      if (value !== null) {
        const parsedForm = JSON.parse(value);
        setPayerName(parsedForm.name);
        setPayerId(parsedForm.id);
        setPayerEmail(parsedForm.email);
        setRef(parsedForm.referrerCode);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const updateBalance = () => {
    const url = `https://shielded-thicket-31967.herokuapp.com/user/updateBalance/${ref}`;

    const bonus = Math.round((item.price * 15) / 100);

    axios
      .put(url, { bonus: bonus })
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;

        if (status != "SUCCESS") {
          alert("Error in payment");
          navigation.replace("BookDetailScreen");
        } else {
          // updateBalance();
          navigation.replace("DownloadedBookScreen");
        }
      })
      .catch((error) => {
        // handleMessage("An error occurred. Check your connection and try again");
        console.log(error);
      });
  };

  const submitDetails = () => {
    const url = "https://shielded-thicket-31967.herokuapp.com/boughtBook";

    axios
      .post(url, {
        userName: payerName,
        userEmail: payerEmail,
        ...item,
      })
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;

        if (status != "SUCCESS") {
          alert("Error in payment");
        } else {
          if (ref != "") {
            updateBalance();
          } else {
            navigation.replace("DownloadedBookScreen");
          }
        }
      })
      .catch((error) => {
        // handleMessage("An error occurred. Check your connection and try again");
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <Paystack
        paystackKey="pk_live_769ee8cfa51fc9b662a9ae0c301757ff0a82eafc"
        amount={item.price}
        billingEmail={payerEmail}
        billingName={payerName}
        channels={["card", "ussd", "bank"]}
        activityIndicatorColor="green"
        onCancel={(e) => {
          navigation.navigate("HomeScreen");
        }}
        onSuccess={(res) => {
          submitDetails();
        }}
        autoStart={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PaymentScreen;
