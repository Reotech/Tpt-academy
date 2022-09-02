import React, { useState, useContext, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, TextInput } from "react-native";
import axios from "axios";

import { credentialsContext } from "../components/CredentialsContext";
import AppActivityIndicator from "../components/AppActivityIndicator";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import colors from "../config/colors";
import AppButton from "../components/AppButton";

function EditBankDetails(props) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const [bName, setBName] = useState("...");
  const [bankName, setbankName] = useState("...");
  const [accountNumber, setaccountNumber] = useState("...");
  const [accountName, setaccountName] = useState("...");
  const [phoneNumber, setphoneNumber] = useState("...");
  const [id, setId] = useState("");

  const { storedCredentials, setStoredCredentials } =
    useContext(credentialsContext);
  useEffect(() => {
    getDetails();
  }, []);

  const { _id, name } = storedCredentials;
  const userId = _id;

  const getDetails = () => {
    const url = `https://pure-atoll-06308.herokuapp.com/uploadbankdetails/${userId}`;

    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        // setDetails(data.bankData);
        setBName(data.bankData[0].name);
        setbankName(data.bankData[0].bankName);
        setaccountNumber(data.bankData[0].accountNumber);
        setaccountName(data.bankData[0].accountName);
        setphoneNumber(data.bankData[0].phoneNumber);
        setId(data.bankData[0]._id);
      })
      .catch((error) => console.log(error));
  };

  const handleMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
  };

  const submitDetails = (values) => {
    handleMessage(null);
    setSubmitting(true);

    if (bName != name) {
      handleMessage("Name must match name on your Yimiwi Account");
      setSubmitting(false);
    } else if (
      bName == "" ||
      bankName == "" ||
      accountNumber == "" ||
      accountName == "" ||
      phoneNumber == ""
    ) {
      handleMessage("Please fill in all fields");
      setSubmitting(false);
    } else {
      const url = `https://pure-atoll-06308.herokuapp.com/uploadbankdetails/update/${id}`;

      axios
        .put(url, {
          // name: values.name,
          bankName: bankName,
          accountNumber: accountNumber,
          accountName: accountName,
          phoneNumber: phoneNumber,
        })
        .then((response) => {
          const result = response.data;
          const { message, status, data } = result;

          if (status != "SUCCESS") {
            handleMessage(message, status);
            setSubmitting(false);
          } else {
            console.log(data);
            setSubmitting(false);
            alert("Details Updated successfully");
          }
        })
        .catch((error) => {
          setSubmitting(false);
          handleMessage(
            "An error occurred. Check your connection and try again"
          );
          console.log(error);
        });
    }
  };
  return (
    <KeyboardAvoidingWrapper>
      <ScrollView>
        <View style={styles.container}>
          <View style={{ width: "90%", paddingLeft: 20 }}>
            <Text style={styles.label}>Your Full Name:</Text>
            <View style={styles.container2}>
              <TextInput
                style={styles.inputField}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Enter your Full Name"
                name="name"
                editable={false}
                textContentType="name"
                value={bName}
                onChangeText={(text) => setBName(text)}
              />
            </View>

            <Text style={styles.label}>Bank Name:</Text>
            <View style={styles.container2}>
              <TextInput
                style={styles.inputField}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Enter your bank name"
                name="bankName"
                textContentType="name"
                value={bankName}
                onChangeText={(text) => setbankName(text)}
              />
            </View>

            <Text style={styles.label}>Bank Account Number:</Text>
            <View style={styles.container2}>
              <TextInput
                style={styles.inputField}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Enter your account number"
                name="accountNumber"
                textContentType="name"
                value={accountNumber}
                onChangeText={(text) => setaccountNumber(text)}
              />
            </View>

            <Text style={styles.label}>Name On Account:</Text>
            <View style={styles.container2}>
              <TextInput
                style={styles.inputField}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Enter Name on Account"
                name="accountName"
                textContentType="name"
                value={accountName}
                onChangeText={(text) => setaccountName(text)}
              />
            </View>

            <Text style={styles.label}>Phone Number:</Text>
            <View style={styles.container2}>
              <TextInput
                style={styles.inputField}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Enter your phone number"
                name="phoneNumber"
                textContentType="telephoneNumber"
                value={phoneNumber}
                onChangeText={(text) => setphoneNumber(text)}
              />
            </View>

            <View style={{ width: "100%", alignItems: "center" }}>
              <Text style={{ color: "red" }} type={messageType}>
                {message}
              </Text>
            </View>

            {submitting ? (
              <AppButton
                title={
                  <AppActivityIndicator size="small" color={colors.white} />
                }
              />
            ) : (
              <AppButton title="Update" onPress={() => submitDetails()} />
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  label: {
    paddingTop: 20,
    fontWeight: "bold",
  },

  container2: {
    backgroundColor: colors.lightGray,
    borderRadius: 25,
    flexDirection: "row",
    width: "100%",
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
  },

  inputField: {
    width: "100%",
  },

  icon: {
    marginRight: 10,
  },
});

export default EditBankDetails;
