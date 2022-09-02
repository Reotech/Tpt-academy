import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import * as Yup from "yup";
import axios from "axios";
import { credentialsContext } from "../components/CredentialsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import RadioForm from "react-native-simple-radio-button";

import colors from "../config/colors";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppFormField from "../components/AppFormField";
import FormContainer from "../components/FormContainer";
import SubmitButton from "../components/SubmitButton";

const validationSchema = Yup.object().shape({
  favoriteCourse: Yup.string().required().label("Favorite Course"),
  hobbies: Yup.string().required().label("Hobbies"),
});

function PersonalDetailScreen({ navigation }) {
  const [radioValue, setRadioValue] = useState("Male");
  const [error, setError] = useState("");
  const [email, setUserEmail] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const { storedCredentials, setStoredCredentials } =
    useContext(credentialsContext);

  useEffect(() => {
    getData();
  }, []);

  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState();

  const onChanged = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setStartDate(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };
  //const for radio button label texts
  const gender = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ];

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

    if (startDate != "") {
      const url = `https://shielded-thicket-31967.herokuapp.com/user/personalDetails/${email}`;

      axios
        .put(url, {
          dob: startDate.toDateString(),
          gender: radioValue,
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
            navigation.navigate("UploadImageScreen");
          }
        })
        .catch((error) => {
          setSubmitting(false);
          handleMessage(
            "An error occurred. Check your connection and try again" + error
          );
          // console.log(error);
        });
    } else {
      setError("Please enter a valid date");
      setSubmitting(false);
    }
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
        Step 2/3
      </Text>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChanged}
        />
      )}
      <FormContainer
        validationSchema={validationSchema}
        initialValues={{
          favoriteCourse: "",
          hobbies: "",
          gender: "",
        }}
        onSubmit={(values) => {
          submit(values);
        }}
      >
        <TouchableOpacity onPress={showDatePicker}>
          <AppFormField
            maxLength={200}
            name="dob"
            placeholder="Date of birth"
            value={startDate ? startDate.toDateString() : ""}
            editable={false}
          />
        </TouchableOpacity>

        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="account"
          placeholder="Favorite Quote"
          name="favoriteCourse"
          textContentType="name"
        />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="account"
          numberOfLines={2}
          placeholder="Hobbies"
          name="hobbies"
          textContentType="name"
        />

        <RadioForm
          style={{
            justifyContent: "space-between",
            marginBottom: 4,
            marginTop: 2,
          }}
          radio_props={gender}
          labelColor={colors.white}
          selectedButtonColor={colors.primary}
          buttonColor={colors.primary}
          selectedLabelColor={colors.primary}
          formHorizontal
          onPress={(value) => {
            setRadioValue(value);
          }}
        />

        <Text style={{ color: "red" }}>{error}</Text>

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

export default PersonalDetailScreen;
