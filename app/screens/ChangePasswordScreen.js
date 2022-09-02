import React, { useState, useContext } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import * as Yup from "yup";

import { credentialsContext } from "../components/CredentialsContext";
import AppActivityIndicator from "../components/AppActivityIndicator";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import colors from "../config/colors";
import FormContainer from "../components/FormContainer";
import SubmitButton from "../components/SubmitButton";
import AppFormField from "../components/AppFormField";

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required().label("Old Password"),
  newPassword: Yup.string().required().min(8).label("New Password"),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});

function EditProfileScreen() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const { storedCredentials, setStoredCredentials } =
    useContext(credentialsContext);

  const { _id, account_type } = storedCredentials;

  const handleMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
  };

  //function for editing profile details
  const changePassword = (credentials) => {
    handleMessage(null);
    setSubmitting(true);
    // console.log(credentials);

    const url = `https://pure-atoll-06308.herokuapp.com/user/updatePassword/${_id}`;

    axios
      .put(url, credentials)
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
        handleMessage("An error occurred. Check your connection and try again");
        console.log(error);
      });
    // console.log(credentials);
  };
  const guideChangePassword = (credentials) => {
    handleMessage(null);
    setSubmitting(true);
    // console.log(credentials);

    const url = `https://pure-atoll-06308.herokuapp.com/guide/updatePassword/${_id}`;

    axios
      .put(url, credentials)
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
        handleMessage("An error occurred. Check your connection and try again");
        console.log(error);
      });
    // console.log(credentials);
  };

  return (
    <KeyboardAvoidingWrapper>
      <ScrollView>
        <View style={styles.container}>
          <FormContainer
            validationSchema={validationSchema}
            initialValues={{
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            onSubmit={(values) => {
              if (account_type == "User") {
                changePassword(values);
              } else {
                guideChangePassword(values);
              }
            }}
          >
            <View style={{ width: "90%", paddingLeft: 20 }}>
              <Text style={styles.label}>Old Password</Text>
              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="lock"
                placeholder="Old Password"
                textContentType="password"
                name="oldPassword"
                secureTextEntry={true}
              />

              <Text style={styles.label}>New Password</Text>
              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="lock"
                placeholder="New Password"
                textContentType="password"
                name="newPassword"
                secureTextEntry={true}
              />
              <Text style={styles.label}>Confirm New Password</Text>
              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="lock"
                placeholder="Confirm New Password"
                textContentType="password"
                name="confirmPassword"
                secureTextEntry={true}
              />

              <View style={{ width: "100%", alignItems: "center" }}>
                <Text style={{ color: "red" }} type={messageType}>
                  {message}
                </Text>
              </View>

              {submitting ? (
                <SubmitButton
                  title={
                    <AppActivityIndicator size="small" color={colors.white} />
                  }
                />
              ) : (
                <SubmitButton title="Update" />
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
    paddingTop: 30,
    backgroundColor: colors.white,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    color: "#fff",
  },

  label: {
    paddingTop: 20,
    fontWeight: "bold",
  },

  theInput: {
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: colors.midGray,
    marginBottom: 20,
  },

  iconContainer: {
    top: 150,
    right: 100,
    position: "absolute",
    width: 60,
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  imgContainer: {
    alignItems: "center",
    width: "100%",
    height: 250,
    // backgroundColor: "red",
  },

  img: {
    height: 200,
    width: 200,
    borderRadius: 100,
  },
});

export default EditProfileScreen;
