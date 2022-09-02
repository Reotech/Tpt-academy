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
import DropDownPicker from "react-native-dropdown-picker";

function EditProfileScreen() {
  useEffect(() => {
    // getData();
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

  const [userEmail, setUserEmail] = useState();
  const [profile_img, setProfile_img] = useState();
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [binary, setBinary] = useState(null);

  // const [open, setOpen] = useState(false);
  const [modalVisible, SetModalVisible] = useState(false);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const [fname, setFName] = useState("...");
  const [uemail, setUEmail] = useState("...");
  const [username, setUsername] = useState("...");
  const [phoneNumber, setPhoneNumber] = useState("...");
  const [department, setDepartment] = useState("...");
  const [favoriteCourse, setFavoriteCourse] = useState("...");
  const [hobbies, setHobbies] = useState("...");
  const [level, setlevel] = useState("...");
  const [university, setuniversity] = useState("...");
  const [faculty, setfaculty] = useState("...");
  // const [value, setValue] = useState(null);
  // const [items, setItems] = useState([
  //   { label: "JAMB", value: "JAMB" },
  //   { label: "POST-UTME", value: "POST-UTME" },
  //   { label: "100 Level", value: "100 Level" },
  //   { label: "200 Level", value: "200 Level" },
  // ]);

  const { storedCredentials, setStoredCredentials } =
    useContext(credentialsContext);

  // const { email, profile_img } = storedCredentials;

  useEffect(() => {
    getUserData();
  }, [userEmail]);

  const getUserData = () => {
    const url = `https://shielded-thicket-31967.herokuapp.com/user/${userEmail}`;

    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        setFName(data.userData[0].name);
        setUEmail(data.userData[0].email);
        setUsername(data.userData[0].username);
        setPhoneNumber(data.userData[0].phoneNumber);
        setDepartment(data.userData[0].department);
        setFavoriteCourse(data.userData[0].favoriteCourse);
        setHobbies(data.userData[0].hobbies);
        setProfile_img(data.userData[0].profile_img);
        setlevel(data.userData[0].level);
        setuniversity(data.userData[0].university);
        setfaculty(data.userData[0].faculty);
      })
      .catch((error) => console.log(error));
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

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("tptCredentials");
      console.log(value);
      if (value !== null) {
        const parsedForm = JSON.parse(value);
        setUserEmail(parsedForm.email);
      }
    } catch (e) {
      console.log(e);
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

  const editProfile = (credentials) => {
    handleMessage(null);
    setSubmitting(true);
    const url = `https://shielded-thicket-31967.herokuapp.com/user/editProfile/${userEmail}`;

    axios
      .put(url, {
        name: fname,
        username: username,
        email: uemail,
        phoneNumber: phoneNumber,
        university: university,
        faculty: faculty,
        level: level,
        department: department,
        favoriteCourse: favoriteCourse,
        hobbies: hobbies,
      })
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;

        if (status != "SUCCESS") {
          handleMessage(message, status);
          setSubmitting(false);
        } else if (image != null) {
          const url = `https://shielded-thicket-31967.herokuapp.com/user/uploadimg/${userEmail}`;

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

                setCredentials({
                  name: fname,
                  username: username,
                  email: uemail,
                  phoneNumber: phoneNumber,
                  university: university,
                  faculty: faculty,
                  level: level,
                  department: department,
                  favoriteCourse: favoriteCourse,
                  hobbies: hobbies,
                });

                alert("Details Updated successfully");
              }
            })
            .catch((error) => console.log(error));
        } else {
          setSubmitting(false);

          setCredentials({
            name: fname,
            username: username,
            email: uemail,
            phoneNumber: phoneNumber,
            university: university,
            faculty: faculty,
            level: level,
            department: department,
            favoriteCourse: favoriteCourse,
            hobbies: hobbies,
          });

          alert("Details Updated successfully");
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
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.imgContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.img} />
            ) : profile_img != "" ? (
              <Image source={{ uri: profile_img }} style={styles.img} />
            ) : (
              <Image
                source={require("../assets/profile.jpg")}
                style={styles.img}
              />
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
          <View style={{ width: "90%", paddingLeft: 20 }}>
            <Text style={styles.label}>Name</Text>
            <View style={styles.container2}>
              <TextInput
                style={styles.inputField}
                editable={true}
                autoCapitalize="none"
                autoCorrect={false}
                icon="account"
                placeholder="Full Name"
                name="name"
                textContentType="name"
                value={fname}
                onChangeText={(text) => setFName(text)}
              />
            </View>

            <Text style={styles.label}>Username</Text>
            <View style={styles.container2}>
              <TextInput
                style={styles.inputField}
                editable={true}
                autoCapitalize="none"
                autoCorrect={false}
                icon="account"
                placeholder="Username"
                name="username"
                textContentType="name"
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
            </View>

            <Text style={styles.label}>Email</Text>
            <View style={styles.container2}>
              <TextInput
                style={styles.inputField}
                autoCapitalize="none"
                autoCorrect={false}
                icon="email"
                keyboardType="email-address"
                placeholder="Email"
                name="email"
                textContentType="emailAddress"
                value={uemail}
                onChangeText={(text) => setUEmail(text)}
              />
            </View>

            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.container2}>
              <TextInput
                style={styles.inputField}
                editable={true}
                icon="phone"
                keyboardType="phone-pad"
                placeholder="Phone Number"
                name="phoneNumber"
                textContentType="telephoneNumber"
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text)}
              />
            </View>

            <Text style={styles.label}>Department</Text>
            <View style={styles.container2}>
              <TextInput
                style={styles.inputField}
                editable={true}
                autoCapitalize="none"
                autoCorrect={false}
                icon="account"
                placeholder="Department"
                name="department"
                textContentType="name"
                value={department}
                onChangeText={(text) => setDepartment(text)}
              />
            </View>

            <Text style={styles.label}>University</Text>
            <View style={styles.container2}>
              <TextInput
                style={styles.inputField}
                editable={true}
                autoCapitalize="none"
                autoCorrect={false}
                icon="account"
                placeholder="University"
                name="university"
                textContentType="name"
                value={university}
                onChangeText={(text) => setuniversity(text)}
              />
            </View>

            <Text style={styles.label}>faculty</Text>
            <View style={styles.container2}>
              <TextInput
                style={styles.inputField}
                editable={true}
                autoCapitalize="none"
                autoCorrect={false}
                icon="account"
                placeholder="Faculty"
                name="faculty"
                textContentType="name"
                value={faculty}
                onChangeText={(text) => setfaculty(text)}
              />
            </View>

            <Text style={styles.label}>level</Text>
            <View style={styles.container2}>
              <TextInput
                style={styles.inputField}
                editable={true}
                autoCapitalize="none"
                autoCorrect={false}
                icon="account"
                placeholder="Level"
                name="level"
                textContentType="name"
                value={level}
                onChangeText={(text) => setlevel(text)}
              />
            </View>

            <Text style={styles.label}>Favorite Quote</Text>
            <View style={styles.container2}>
              <TextInput
                style={styles.inputField}
                editable={true}
                autoCapitalize="none"
                autoCorrect={false}
                icon="account"
                placeholder="Favorite Course"
                name="favoriteCourse"
                textContentType="name"
                value={favoriteCourse}
                onChangeText={(text) => setFavoriteCourse(text)}
              />
            </View>

            <Text style={styles.label}>Hobbies</Text>
            <View style={styles.container2}>
              <TextInput
                style={styles.inputField}
                editable={true}
                autoCapitalize="none"
                autoCorrect={false}
                icon="account"
                placeholder="Hobbies"
                name="hobbies"
                textContentType="name"
                value={hobbies}
                onChangeText={(text) => setHobbies(text)}
              />
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
                title={
                  <AppActivityIndicator size="small" color={colors.white} />
                }
              />
            ) : (
              <AppButton
                title="Update"
                bgColor={colors.primary}
                txtColor="white"
                onPress={() => {
                  editProfile();
                }}
              />
            )}
          </View>

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
      </ScrollView>
    </KeyboardAvoidingWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: colors.appBackground,
  },

  container2: {
    backgroundColor: colors.secondary,
    borderRadius: 15,
    flexDirection: "row",
    width: "100%",
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
  },

  inputField: {
    color: colors.mildGray,
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
    color: colors.white,
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
