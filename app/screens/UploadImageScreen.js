import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { credentialsContext } from "../components/CredentialsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppActivityIndicator from "../components/AppActivityIndicator";
import colors from "../config/colors";
import FormContainer from "../components/FormContainer";
import SubmitButton from "../components/SubmitButton";

function UploadImageScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const { storedCredentials, setStoredCredentials } =
    useContext(credentialsContext);

  useEffect(() => {
    requestPermission();
  }, []);

  const handleMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
  };

  //upload photo - start
  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) alert("You need to enable permission to access the library");
  };

  const handlePress = () => {
    if (!image) selectImage();
    else
      Alert.alert("Delete", "Are you sure you want to delete this image?", [
        { text: "No" },
        { text: "Yes", onPress: () => setImage(null) },
      ]);
  };

  const selectImage = async () => {
    try {
      const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });
      if (!cancelled) {
        setImage(uri);
      }
    } catch (error) {
      console.log("there was an error loading image", error);
    }
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

  const SubmitItems = async (credentials) => {
    setSubmitting(true);
    handleMessage(null);

    const value = await AsyncStorage.getItem("tptCredentials");
    const newValue = JSON.parse(value);

    const { email } = newValue;
    const url = `https://shielded-thicket-31967.herokuapp.com/user/uploadimg/${email}`;

    const form = new FormData();
    form.append("profile_img", {
      name: "profile.jpg",
      uri: image,
      type: "image/jpeg",
    });

    axios
      .put(url, form, {
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Method": "PUT",
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;
        console.log(data);
        if (status != "SUCCESS") {
          handleMessage(message, status);
          setSubmitting(false);
        } else {
          setSubmitting(false);
          setCredentials({ ...data });
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
      <Text
        style={{
          color: colors.white,
          fontSize: 14,
          left: 25,
          paddingBottom: 15,
        }}
      >
        Step 3/3
      </Text>
      <View style={{ paddingLeft: 25, width: "95%", paddingBottom: 15 }}>
        <Text style={{ color: colors.lightGray }}>
          Please choose a nice photo from your gallery (Preferably a picture of
          yourself)
        </Text>
      </View>
      <FormContainer
        initialValues={{
          profile_img: null,
        }}
        onSubmit={(values) => {
          SubmitItems(values);
        }}
      >
        <View style={styles.imgContainer}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.img}
              name="profile_img"
            />
          ) : (
            <Image
              source={require("../assets/profile.jpg")}
              style={styles.img}
            />
          )}

          <TouchableOpacity onPress={handlePress} name="profile_img">
            <Text style={styles.linkText}>Choose a picture</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={{ color: "red" }} type={messageType}>
              {message}
            </Text>
          </View>
        </View>

        <View
          style={{
            position: "absolute",
            width: "90%",
            bottom: 0,
            marginRight: 20,
            marginLeft: 20,
          }}
        >
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
              title="Upload"
            />
          )}
        </View>
      </FormContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.appBackground,
    flex: 1,
  },

  imgContainer: {
    alignItems: "center",
    width: "100%",
    height: 220,
    marginTop: 100,
  },

  img: {
    height: 180,
    width: 180,
    borderRadius: 100,
  },

  linkText: {
    color: colors.primary,
    fontSize: 18,
    paddingTop: 7,
  },
  linkText2: {
    color: colors.dark,
    fontSize: 16,
    paddingTop: 7,
  },

  container2: {
    backgroundColor: colors.lightGray,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    width: 270,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },
});

export default UploadImageScreen;
