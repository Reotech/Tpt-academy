import React, { useState, useEffect, useRef, useContext } from "react";
import Constants from "expo-constants";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Keyboard,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

import { credentialsContext } from "../components/CredentialsContext";
import SubmitButton from "../components/SubmitButton";
import colors from "../config/colors";
import TextLink from "../components/TextLink";
import AppSeparator from "../components/AppSeparator";
import FormContainer from "../components/FormContainer";
import AppFormField from "../components/AppFormField";
import AppActivityIndicator from "../components/AppActivityIndicator";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const emailReg = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  username: Yup.string().required().label("Username"),
  email: Yup.string()
    .required()
    .matches(emailReg, "Email is not valid")
    .label("Email"),
  phoneNumber: Yup.string().matches(phoneRegExp, "Phone number is not valid"),
  password: Yup.string().required().min(8).label("Password"),
});

function UserRegisterScreen({ navigation }) {
  const [submitting, setSubmitting] = useState(false);
  const [showText, setShowText] = useState(true);
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

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
  }, []);

  const _keyboardDidShow = () => setShowText(false);
  const _keyboardDidHide = () => setShowText(true);

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

  const handleUserSignup = (credentials) => {
    handleMessage(null);
    setSubmitting(true);

    const url = "https://shielded-thicket-31967.herokuapp.com/user/signup";

    axios
      .post(url, { device_token: expoPushToken, ...credentials })
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;

        if (status != "SUCCESS") {
          handleMessage(message, status);
          setSubmitting(false);
        } else {
          setCredentials({ ...data });
          navigation.replace("ExtraDetailScreen");
        }
      })
      .catch((error) => {
        setSubmitting(false);
        handleMessage(
          "An error occurred. Check your connection and try again" + error
        );
        console.log(error);
      });
  };

  return (
    <KeyboardAvoidingWrapper>
      <ScrollView
        style={{
          flex: 1,
          paddingTop: StatusBar.currentHeight,
          backgroundColor: colors.appBackground,
        }}
      >
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <Image source={require("../assets/logo.png")} style={styles.img} />
            <FormContainer
              validationSchema={validationSchema}
              initialValues={{
                name: "",
                username: "",
                email: "",
                phoneNumber: "",
                password: "",
                referrerCode: "",
              }}
              onSubmit={(values) => {
                handleUserSignup(values);
              }}
            >
              <AppFormField
                autoCorrect={false}
                icon="account"
                placeholder="Full Name"
                name="name"
                textContentType="name"
              />
              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="account"
                placeholder="Username"
                name="username"
                textContentType="name"
              />

              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="email"
                keyboardType="email-address"
                placeholder="Email"
                name="email"
                textContentType="emailAddress"
              />
              <AppFormField
                autoCorrect={false}
                icon="phone"
                keyboardType="phone-pad"
                placeholder="Phone Number"
                name="phoneNumber"
                textContentType="telephoneNumber"
              />

              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="lock"
                placeholder="Password"
                textContentType="password"
                name="password"
                secureTextEntry={true}
              />

              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="account"
                placeholder="Referral Code (Optional)"
                textContentType="name"
                name="referrerCode"
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
                  title="Register"
                />
              )}
            </FormContainer>
            {showText && (
              <View style={styles.bottomView}>
                <Text style={styles.bottomText}>
                  Already have an account?{"   "}
                  <TextLink
                    title="Login"
                    onPress={() => navigation.navigate("LoginScreen")}
                    style={styles.textLink}
                  />
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    // marginTop: StatusBar.currentHeight,
    alignItems: "center",
    flex: 1,
    backgroundColor: colors.appBackground,
  },

  img: {
    height: 100,
    width: 100,
    marginBottom: 5,
  },

  formContainer: {
    height: "100%",
    width: "90%",
    paddingTop: "8%",
    alignItems: "center",
  },

  pageTitle: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 4,
    paddingBottom: 15,
  },

  bottomView: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    justifyContent: "center",
    borderTopColor: colors.midGray,
  },

  bottomText: {
    color: colors.lightGray,
    fontSize: 16,
  },

  textLink: {
    color: colors.primary,
    fontSize: 16,
  },
});

export default UserRegisterScreen;
