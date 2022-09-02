import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Yup from "yup";

import { credentialsContext } from "../components/CredentialsContext";
import AppActivityIndicator from "../components/AppActivityIndicator";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import colors from "../config/colors";
import FormContainer from "../components/FormContainer";
import SubmitButton from "../components/SubmitButton";
import AppFormField from "../components/AppFormField";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  bankName: Yup.string().required().label("Bank Name"),
  accountNumber: Yup.string().required().label("Account Number"),
  accountName: Yup.string().required().label("Account Name"),
  phoneNumber: Yup.string().required().label("Phone Number"),
});

function UploadBankDetails({ navigation, route }) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState();
  const [email, setEmail] = useState();
  const [bal, setBalance] = useState();
  const [messageType, setMessageType] = useState();

  const { storedCredentials, setStoredCredentials } =
    useContext(credentialsContext);
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
        setBalance(data.userData[0].balance.toString());
      })
      .catch((error) => console.log(error));
  };

  const handleMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
  };

  const submitDetails = (values) => {
    console.log(values);
    handleMessage(null);
    setSubmitting(true);

    const url = `https://shielded-thicket-31967.herokuapp.com/uploadbankdetails`;

    axios
      .post(url, {
        amount: bal,
        name: values.name,
        bankName: values.bankName,
        accountNumber: values.accountNumber,
        accountName: values.accountName,
        phoneNumber: values.phoneNumber,
        userEmail: email,
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
          updateBalance();

          alert("Withdrawal request sent");
        }
      })
      .catch((error) => {
        setSubmitting(false);
        handleMessage("An error occurred. Check your connection and try again");
        console.log(error);
      });
  };

  const updateBalance = () => {
    const url = `https://shielded-thicket-31967.herokuapp.com/user/balancetoZero/${email}`;

    axios
      .put(url)
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;

        if (status != "SUCCESS") {
          alert("Error in payment");
          navigation.replace("BookDetailScreen");
        } else {
          navigation.replace("HomeScreen");
        }
      })
      .catch((error) => {
        handleMessage("An error occurred. Check your connection and try again");
      });
  };

  return (
    <KeyboardAvoidingWrapper>
      <ScrollView>
        <View style={styles.container}>
          <FormContainer
            validationSchema={validationSchema}
            initialValues={{
              name: "",
              amount: bal,
              userEmail: email,
              bankName: "",
              accountNumber: "",
              accountName: "",
              phoneNumber: "",
            }}
            onSubmit={(values) => submitDetails(values)}
          >
            <View style={{ width: "90%", paddingLeft: 20 }}>
              <Text style={styles.label}>Amount to withdraw:</Text>
              <AppFormField
                icon="account"
                editable={false}
                keyboardType="numeric"
                placeholder="Amount to withdraw"
                name="amount"
                value={bal}
              />
              <Text style={styles.label}>Your Full Name:</Text>
              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="account"
                placeholder="Enter your Full Name"
                name="name"
                textContentType="name"
              />

              <Text style={styles.label}>Bank Name:</Text>
              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="bank"
                placeholder="Enter your bank name"
                name="bankName"
                textContentType="name"
              />

              <Text style={styles.label}>Bank Account Number:</Text>
              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="account"
                placeholder="Enter your account number"
                name="accountNumber"
                textContentType="name"
              />

              <Text style={styles.label}>Name On Account:</Text>
              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="account"
                placeholder="Enter Name on Account"
                name="accountName"
                textContentType="name"
              />

              <Text style={styles.label}>Phone Number:</Text>
              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="phone"
                placeholder="Enter your phone number"
                name="phoneNumber"
                textContentType="telephoneNumber"
              />

              <View style={{ width: "100%", alignItems: "center" }}>
                <Text style={{ color: "red" }} type={messageType}>
                  {message}
                </Text>
              </View>

              {submitting ? (
                <SubmitButton
                  bgColor={colors.primary}
                  txtColor="white"
                  title={
                    <AppActivityIndicator size="small" color={colors.white} />
                  }
                />
              ) : (
                <SubmitButton
                  bgColor={colors.primary}
                  txtColor="white"
                  title="Upload"
                />
              )}
            </View>
          </FormContainer>
        </View>
      </ScrollView>
    </KeyboardAvoidingWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },

  label: {
    paddingTop: 20,
    fontWeight: "bold",
  },
});

export default UploadBankDetails;
