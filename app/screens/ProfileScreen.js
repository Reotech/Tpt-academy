import React, { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { credentialsContext } from "../components/CredentialsContext";
import colors from "../config/colors";
import ProfileItem from "../components/ProfileItem";

function ProfileScreen({ navigation }) {
  const [user, setUser] = useState([]);
  useEffect(() => {
    getData();
  });
  if (account_type == "User") {
    useEffect(() => {
      getUserData();
    }, [setUser]);
  } else {
    useEffect(() => {
      getGuideData();
    }, [setUser]);
  }

  const { storedCredentials, setStoredCredentials } =
    useContext(credentialsContext);
  const { _id, name, account_type, profile_img } = storedCredentials;

  const clearLogin = () => {
    AsyncStorage.removeItem("yimiwiCredentials")
      .then(() => {
        setStoredCredentials("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getGuideData = () => {
    const url = `https://pure-atoll-06308.herokuapp.com/guide/${_id}`;

    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        console.log(data);
        setUser(data.userData);
        // console.log(user);
      })
      .catch((error) => console.log(error));
  };

  const getUserData = () => {
    const url = `https://pure-atoll-06308.herokuapp.com/user/${_id}`;

    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        console.log(data);
        setUser(data.userData);
        // console.log(user);
      })
      .catch((error) => console.log(error));
  };

  const changeAccount = () => {
    const url = `https://pure-atoll-06308.herokuapp.com/user/delete/${_id}`;

    axios
      .delete(url)
      .then((response) => {
        const result = response.data;
        const { message, status } = result;

        if (status != "SUCCESS") {
          console.log("Error", message, status);
        } else {
          clearLogin();
          setTimeout(() => {
            navigation.navigate("TourGuideRegisterScreen");
          }, 1000);
        }
      })
      .catch((error) => {
        alert("An error occurred. Check your connection and try again");
        console.log(error);
      });
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("yimiwiCredentials");
      if (value !== null) {
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        {user.profile_img == null ? (
          <Image source={require("../assets/profile.jpg")} style={styles.img} />
        ) : (
          <Image
            source={{
              uri: user.profile_img,
            }}
            style={styles.img}
          />
        )}
        <View style={styles.textSection}>
          <Text style={styles.profileName}>{name || "Buddy"}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("EditProfileScreen")}
            style={styles.button}
          >
            <Text style={styles.text}>
              <MaterialCommunityIcons name="pencil" /> Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {account_type == "User" ? (
        <ProfileItem
          name="Booked Tours"
          icon="credit-card"
          onPress={() => navigation.navigate("BookedTourScreen")}
        />
      ) : (
        <>
          <ProfileItem
            name="My Tours"
            icon="upload"
            onPress={() => navigation.navigate("MyToursScreen")}
          />

          <ProfileItem
            name="Booked Tours"
            icon="credit-card"
            onPress={() => navigation.navigate("BookedTourScreen")}
          />

          <ProfileItem
            name="Bank Details"
            icon="credit-card"
            onPress={() => navigation.navigate("BankDetails")}
          />
        </>
      )}

      {account_type == "User" ? (
        <ProfileItem
          name="Become a tour guide"
          onPress={() =>
            Alert.alert(
              "Account Change",
              "This will delete your current account and you will be directed to register as Tour Guide",
              [
                { text: "Cancel" },
                {
                  text: "Ok",
                  onPress: () => changeAccount(),
                  style: "destructive",
                },
              ]
            )
          }
          icon="star"
        />
      ) : (
        <></>
      )}

      <ProfileItem
        name="View Later"
        icon="bookmark"
        onPress={() => navigation.navigate("ViewLaterScreen")}
      />
      <ProfileItem
        name="Settings"
        icon="cog"
        onPress={() => navigation.navigate("SettingsScreen")}
      />
      <ProfileItem
        name="Logout"
        icon="logout"
        onPress={() =>
          Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "No" },
            {
              text: "Logout",
              onPress: () => clearLogin(),
              style: "destructive",
            },
          ])
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  profileSection: {
    marginTop: StatusBar.currentHeight,
    flexDirection: "row",
    padding: 20,
    backgroundColor: colors.white,
    alignItems: "center",
    height: 180,
  },

  img: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },

  textSection: {
    marginLeft: 30,
  },

  profileName: {
    fontSize: 16,
    paddingBottom: 6,
  },

  button: {
    backgroundColor: colors.midGray,
    borderRadius: 20,
    padding: 7,
    marginRight: 10,
    alignItems: "center",
  },

  text: {
    color: colors.dark,
  },
});
export default ProfileScreen;
