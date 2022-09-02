import React, { useState, useEffect, useContext } from "react";
import Constants from "expo-constants";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Keyboard,
  Image,
  Alert,
} from "react-native";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  hasHardwareAsync,
  isEnrolledAsync,
  authenticateAsync,
} from "expo-local-authentication";
import * as Notifications from "expo-notifications";

import { credentialsContext } from "../components/CredentialsContext";
import colors from "../config/colors";
import TextLink from "../components/TextLink";
import AppSeparator from "../components/AppSeparator";
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

function LoginScreen({ navigation }) {
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });
  }, []);
  const [expoPushToken, setExpoPushToken] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [showText, setShowText] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const { storedCredentials, setStoredCredentials } =
    useContext(credentialsContext);

  // Check if hardware supports biometrics
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("tptCredentials");
      if (value !== null) {
        biometricsAuth();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const _keyboardDidShow = () => setShowText(false);
  const _keyboardDidHide = () => setShowText(true);

  //get device token function
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

  //biometric code
  const biometricsAuth = async () => {
    const compatible = await hasHardwareAsync();
    if (!compatible)
      throw "This device is not compatible for biometric authentication";
    const enrolled = await isEnrolledAsync();
    if (!enrolled)
      throw "This device doesn't have biometric authentication enabled";
    const result = await authenticateAsync();
    if (!result.success) throw `${result.error} - Authentication unsuccessful`;
    navigation.navigate("HomeScreen");
  };

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

  const handleLogin = (credentials) => {
    handleMessage(null);
    setSubmitting(true);

    const url = "https://shielded-thicket-31967.herokuapp.com/user/login";

    axios
      .post(url, { device_token: expoPushToken, ...credentials })
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;

        if (status != "SUCCESS") {
          handleMessage(message, status);
          setSubmitting(false);
        } else {
          setSubmitting(false);
          setCredentials({ ...data[0] });
          navigation.navigate("HomeScreen");
        }
      })
      .catch((error) => {
        handleMessage("An error occurred. Check your connection and try again");
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Image source={require("../assets/logo.png")} style={styles.img} />
        <FormContainer
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => {
            handleLogin(values);
          }}
          validationSchema={validationSchema}
        >
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            placeholder="Email Address"
            name="email"
            textContentType="emailAddress"
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

          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={{ color: "red" }} type={messageType}>
              {message}
            </Text>
          </View>

          <View
            style={{ width: "100%", alignItems: "flex-end", marginBottom: 10 }}
          >
            <TextLink
              title="Forgot your password?"
              onPress={() => navigation.navigate("ForgotPasswordScreen")}
              style={{ color: colors.lightGray }}
            />
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
              title="Log in"
            />
          )}
        </FormContainer>
        {showText && (
          <View style={styles.bottomView}>
            {/* <AppSeparator /> */}
            <Text style={styles.bottomText}>
              Don't have an account yet?{"   "}
              <TextLink
                title="Register"
                onPress={() => navigation.navigate("UserRegisterScreen")}
                style={styles.textLink}
              />
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    alignItems: "center",
    backgroundColor: colors.appBackground,
  },

  img: {
    height: 120,
    width: 120,
    // marginBottom: 5,
  },

  formContainer: {
    flex: 1,
    width: "90%",
    paddingTop: "10%",
    alignItems: "center",
  },

  pageTitle: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 2,
    paddingBottom: 10,
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
    fontSize: 16,
    color: colors.primary,
  },
});

export default LoginScreen;
