import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Text, StatusBar } from "react-native";
import * as Yup from "yup";
import axios from "axios";
import { credentialsContext } from "../components/CredentialsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";

import colors from "../config/colors";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppFormField from "../components/AppFormField";
import FormContainer from "../components/FormContainer";
import SubmitButton from "../components/SubmitButton";

const validationSchema = Yup.object().shape({
  university: Yup.string().required().label("University"),
  faculty: Yup.string().required().label("Faculty"),
  department: Yup.string().required().label("Department"),
});

function ExtraDetailScreen({ navigation }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "JAMB", value: "JAMB" },
    { label: "POST-UTME", value: "POST-UTME" },
    { label: "100 Level", value: "100 Level" },
    { label: "200 Level", value: "200 Level" },
  ]);
  const [email, setUserEmail] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const { storedCredentials, setStoredCredentials } =
    useContext(credentialsContext);

  useEffect(() => {
    getData();
  }, []);

  const handleMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
  };

  const setCredentials = (credentials, message, status) => {
    AsyncStorage.mergeItem("tptCredentials", JSON.stringify(credentials))
      .then(() => {
        handleMessage(message, status);
        setStoredCredentials(credentials);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("tptCredentials");
      if (value !== null) {
        const parsedForm = JSON.parse(value);
        setUserEmail(parsedForm.email);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const submit = (credentials) => {
    handleMessage(null);
    setSubmitting(true);

    const url = `https://shielded-thicket-31967.herokuapp.com/user/schoolDetails/${email}`;

    axios
      .put(url, {
        level: value,
        ...credentials,
      })
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;

        if (status != "SUCCESS") {
          handleMessage(message, status);
          setSubmitting(false);
        } else {
          setCredentials({ ...data });
          navigation.navigate("PersonalDetailScreen");
        }
      })
      .catch((error) => {
        setSubmitting(false);
        handleMessage(
          "An error occurred. Check your connection and try again" + error
        );
        // console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: colors.lightGray,
          fontSize: 14,
          left: 25,
          paddingBottom: 15,
        }}
      >
        Step 1/3
      </Text>
      <FormContainer
        validationSchema={validationSchema}
        initialValues={{
          department: "",
          university: "",
          faculty: "",
        }}
        onSubmit={(values) => {
          submit(values);
        }}
      >
        <DropDownPicker
          placeholder="What level are you?"
          open={open}
          value={value}
          theme="DARK"
          style={{ backgroundColor: colors.secondary }}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />
        <AppFormField
          autoCorrect={false}
          icon="account"
          placeholder="Your University"
          name="university"
          textContentType="name"
        />
        <AppFormField
          autoCorrect={false}
          icon="account"
          placeholder="Your Faculty"
          name="faculty"
          textContentType="name"
        />
        <AppFormField
          autoCorrect={false}
          icon="account"
          placeholder="Your Department"
          name="department"
          textContentType="name"
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
            title="Submit"
          />
        )}
      </FormContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.appBackground,
    padding: 20,
  },
});

export default ExtraDetailScreen;
