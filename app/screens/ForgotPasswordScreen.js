import React, { useState, useEffect, useContext } from "react";
import Constants from "expo-constants";

import { Text, View, StyleSheet } from "react-native";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

import { credentialsContext } from "../components/CredentialsContext";
import colors from "../config/colors";
import FormLabel from "../components/FormLabel";
import AppFormField from "../components/AppFormField";
import SubmitButton from "../components/SubmitButton";
import FormContainer from "../components/FormContainer";
import AppActivityIndicator from "../components/AppActivityIndicator";

const emailReg = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required()
    .matches(emailReg, "Email is not valid")
    .label("Email"),
  password: Yup.string().required().min(8).label("Password"),
});

function ForgotPasswordScreen({ navigation }) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const [expoPushToken, setExpoPushToken] = useState("");

  const { storedCredentials, setStoredCredentials } =
    useContext(credentialsContext);
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "GAP",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  const handleMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
  };

  const setCredentials = (credentials, message, status) => {
    AsyncStorage.setItem("tptCredentials", JSON.stringify(credentials))
      .then(() => {
        handleMessage(message, status);
        setStoredCredentials(credentials);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleReset = (credentials) => {
    handleMessage(null);
    setSubmitting(true);

    const url = `https://shielded-thicket-31967.herokuapp.com/user/resetPassword/${credentials.email}`;

    axios
      .put(url, { device_token: expoPushToken, ...credentials })
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;
        const userData = data;

        if (status != "SUCCESS") {
          handleMessage(message, status);
          setSubmitting(false);
        } else {
          //   console.log(userData[0]);
          setCredentials({ ...userData });
          navigation.replace("HomeScreen");
        }
      })
      .catch((error) => {
        setSubmitting(false);
        handleMessage("An error occurred. Check your connection and try again");
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.pageTitle}>Forgot Password</Text>
        <Text style={styles.pageDesc}>
          Please enter the email associated with your account and the new
          password to reset your password
        </Text>
        <FormContainer
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => {
            handleReset(values);
          }}
          validationSchema={validationSchema}
        >
          <FormLabel>Your Email: </FormLabel>

          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            placeholder="Email"
            name="email"
            textContentType="emailAddress"
          />
          <FormLabel>New Password: </FormLabel>
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            placeholder="Password"
            textContentType="password"
            name="password"
            secureTextEntry={true}
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
              title={<AppActivityIndicator size="small" color={colors.white} />}
            />
          ) : (
            <SubmitButton
              bgColor={colors.primary}
              txtColor="white"
              title="Reset"
            />
          )}
        </FormContainer>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: StatusBar.currentHeight,
    alignItems: "center",
    backgroundColor: colors.appBackground,
  },

  formContainer: {
    flex: 1,
    width: "90%",
    paddingTop: "10%",
  },

  pageTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 2,
    paddingBottom: 5,
  },

  pageDesc: {
    color: colors.mildGray,
    fontSize: 14,
    paddingLeft: 2,
    paddingBottom: 10,
  },

  bottomView: {
    width: "100%",
    position: "absolute",
    bottom: 11,
    alignItems: "center",
    justifyContent: "center",
    borderTopColor: colors.midGray,
  },

  bottomText: {
    color: colors.mediumGray,
  },

  textLink: {
    color: colors.primary,
  },
});

export default ForgotPasswordScreen;
