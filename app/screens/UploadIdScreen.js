import React, { useEffect, useState, useContext } from "react";
import {
  Text,
  Alert,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  TextInput,
  Dimensions,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

import { credentialsContext } from "../components/CredentialsContext";
import AppActivityIndicator from "../components/AppActivityIndicator";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import colors from "../config/colors";
import FormContainer from "../components/FormContainer";
import SubmitButton from "../components/SubmitButton";
import AppFormField from "../components/AppFormField";
import ProfileItem from "../components/ProfileItem";
import AppButton from "../components/AppButton";

function UploadIdScreen({ navigation }) {
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();

    getData();
  }, []);

  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [binary, setBinary] = useState(null);

  const [modalVisible, SetModalVisible] = useState(false);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const [userEmail, setUserEmail] = useState();

  const { storedCredentials, setStoredCredentials } =
    useContext(credentialsContext);

  const { email, profile_img } = storedCredentials;

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

  const openCamera = async () => {
    let { cancelled, uri } = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cancelled) {
      setImage(uri);
    }
  };
  const pickImage = async () => {
    let { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cancelled) {
      setImage(uri);

      //change the uri(image) to base64
      const binary = uri.replace(/^data:image\/(png|jpg);base64,/, "");
      setBinary(binary);
      SetModalVisible(false);
    }
  };

  const settingModal = () => {
    SetModalVisible(true);
  };

  const handleMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
  };

  const editProfile = (credentials) => {
    handleMessage(null);
    setSubmitting(true);
    const url = `http://192.168.146.169:3000/user/uploadimg/${userEmail}`;

    const img = new FormData();
    img.append("profile_img", {
      name: "profile_img.jpg",
      uri: image,
      type: "image/jpeg",
    });
    axios
      .put(url, img, {
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Method": "POST",
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;

        if (status != "SUCCESS") {
          handleMessage(message, status);
          setSubmitting(false);
        } else {
          setSubmitting(false);

          setCredentials({ profile_img: image });
          navigation.navigate("HomeScreen", { ...data });
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.img}
            name="profile_img"
          />
        ) : (
          <Image source={require("../assets/profile.jpg")} style={styles.img} />
        )}

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={settingModal}
          name="profile_img"
        >
          <MaterialCommunityIcons
            name="camera"
            size={20}
            color={colors.white}
          />
        </TouchableOpacity>
      </View>
      <View style={{ width: "100%", alignItems: "center" }}>
        <Text style={{ color: "red" }} type={messageType}>
          {message}
        </Text>
      </View>

      {submitting ? (
        <AppButton
          bgColor={colors.primary}
          txtColor="white"
          title={<AppActivityIndicator size="small" color={colors.white} />}
        />
      ) : (
        <AppButton
          bgColor={colors.primary}
          txtColor="white"
          title="Upload"
          onPress={() => {
            editProfile();
          }}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: "#000000AA" }}>
          <Pressable
            onPress={() => SetModalVisible(false)}
            style={{ flex: 1 }}
          />
          <View
            style={{
              bottom: 0,
              position: "absolute",
              width: "100%",
              backgroundColor: "white",
              borderTopRightRadius: 25,
              borderTopLeftRadius: 25,
              height: Dimensions.get("window").height * 0.3,
              maxHeight: Dimensions.get("window").height * 0.3,
            }}
          >
            <TouchableOpacity onPress={() => SetModalVisible(false)}>
              <View
                style={{
                  height: 40,
                  justifyContent: "center",
                  borderTopRightRadius: 25,
                  borderTopLeftRadius: 25,
                }}
              >
                <FontAwesome5
                  style={{ left: "85%" }}
                  color={colors.mediumGray}
                  name="times"
                  size={25}
                />
              </View>
            </TouchableOpacity>

            <ProfileItem
              style={{
                borderTopWidth: 0,
                borderTopColor: colors.white,
              }}
              name="Gallery"
              icon="image"
              onPress={() => {
                pickImage();
                SetModalVisible(false);
              }}
            />

            <ProfileItem
              style={{
                borderTopWidth: 0,
                borderTopColor: colors.white,
              }}
              name="Camera"
              icon="camera"
              onPress={() => openCamera()}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: colors.white,
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

export default UploadIdScreen;
