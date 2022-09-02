import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Pressable,
  Share,
  Linking,
  Image,
  Text,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import Card from "../components/Card";
import MenuItem from "../components/MenuItems";
import { credentialsContext } from "../components/CredentialsContext";
import AppActivityIndicator from "../components/AppActivityIndicator";
import colors from "../config/colors";
import AppHeader from "../components/AppHeader";
import SearchButton from "../components/SearchButton";

function VideoScreen({ navigation }) {
  const [videos, setVideo] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [profile, setProfile] = useState();
  const [booksCount, setBooksCount] = useState("0");
  const [referralCode, setReferralCode] = useState();

  useEffect(() => {
    getVideos();
    getUserData();
  }, []);

  useEffect(() => {
    getProfile();
  });

  useEffect(() => {
    getCartItems();
  });
  const [modalVisible, SetModalVisible] = useState(false);
  const settingModal = () => {
    SetModalVisible(true);
  };

  const playstoreLink =
    "https://play.google.com/store/apps/details?id=com.reotech.gap";
  const message = `Click on the Link to download the GAP App and please use my referral code => ${referralCode} when registering:`;

  const onShare = async () => {
    try {
      await Share.share({
        message: message + "" + playstoreLink,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getProfile = () => {
    const url = `https://shielded-thicket-31967.herokuapp.com/user/${email}`;
    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        // console.log(data.userData[0].profile_img);
        setProfile(data.userData[0].profile_img);
      })
      .catch((error) => console.log(error));
  };

  const getVideos = () => {
    const url = "https://tpt-academy.online/video.php";
    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        setVideo(data.videoData);
        console.log(data.videoData);
      })
      .catch((error) => console.log(error));
  };

  const getUserData = async () => {
    try {
      const value = await AsyncStorage.getItem("tptCredentials");
      if (value !== null) {
        const parsedForm = JSON.parse(value);
        setReferralCode(parsedForm.referral_code);
        setName(parsedForm.name);
        setEmail(parsedForm.email);
        setUserId(parsedForm.id);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getCartItems = () => {
    const url = `https://shielded-thicket-31967.herokuapp.com/cart/${email}`;
    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        setBooksCount(data.cartData.length);
      })
      .catch((error) => console.log(error));
  };
  const onRefresh = () => {
    videos.map(() => []);
    getVideos();
  };

  return (
    <View style={styles.container}>
      <AppHeader
        SearchButton={SearchButton}
        booksCount={booksCount}
        viewCart={() => navigation.navigate("CartScreen")}
        onPress={settingModal}
      />
      <ScrollView
        style={{ flex: 1, flexDirection: "column", width: "90%" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {videos && videos.length > 0 ? (
          videos.map((item, index) => {
            return (
              <Card
                key={index}
                image={{ uri: item.image }}
                title={item.title}
                subTitle={item.subtitle}
                onPress={() => {
                  Linking.openURL(item.url);
                }}
              />
            );
          })
        ) : (
          <View style={{ paddingHorizontal: 150, paddingTop: "45%" }}>
            <AppActivityIndicator size={40} color={colors.primary} />
          </View>
        )}
      </ScrollView>
      <Modal
        visible={modalVisible}
        animationType="slide"
        swipeDirection="left"
        transparent
      >
        <View style={{ flex: 1, backgroundColor: "#000000AA" }}>
          <Pressable
            onPress={() => SetModalVisible(false)}
            style={{ flex: 1 }}
          />
          <View
            style={{
              bottom: 0,
              paddingTop: 20,
              position: "absolute",
              width: "80%",
              backgroundColor: colors.appBackground,
              height: "100%",
              maxHeight: "100%",
            }}
          >
            <View style={styles.topContainer}>
              {profile != "" ? (
                <Image
                  style={styles.proimg}
                  source={{
                    uri: profile,
                  }}
                />
              ) : (
                <Image
                  source={require("../assets/profile.jpg")}
                  style={styles.proimg}
                />
              )}
              <View style={{ width: "50%", paddingLeft: 7 }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "bold",
                    color: colors.white,
                  }}
                >
                  {name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => SetModalVisible(false)}
                style={{
                  height: 40,
                  width: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: colors.primary,
                  borderRadius: 25,
                  // left: "85%",
                }}
              >
                <FontAwesome5 color={colors.white} name="times" size={18} />
              </TouchableOpacity>
            </View>

            <MenuItem
              icon="pencil"
              name="Edit Profile"
              onPress={() => {
                SetModalVisible(false);
                navigation.navigate("EditProfileScreen");
              }}
            />

            <MenuItem
              icon="download"
              name="Downloaded Books"
              onPress={() => {
                SetModalVisible(false);
                navigation.navigate("DownloadedBookScreen");
              }}
            />
            <MenuItem
              icon="pencil"
              name="About"
              onPress={() => {
                SetModalVisible(false);
                navigation.navigate("AboutScreen");
              }}
            />
            <MenuItem
              icon="cog"
              name="Referral Earnings"
              onPress={() => {
                SetModalVisible(false);
                navigation.navigate("ReferralScreen");
              }}
            />
            <MenuItem
              icon="phone"
              name="Contact Us"
              onPress={() => {
                SetModalVisible(false);
                navigation.navigate("ContactScreen");
              }}
            />
            <MenuItem
              icon="share"
              name="Share"
              onPress={() => {
                SetModalVisible(false);
                onShare();
              }}
            />
            <MenuItem
              name="Logout"
              icon="logout"
              onPress={() =>
                Alert.alert("Logout", "Are you sure you want to logout?", [
                  { text: "No" },
                  {
                    text: "Logout",
                    onPress: () => navigation.navigate("LoginScreen"),
                    style: "destructive",
                  },
                ])
              }
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
    backgroundColor: colors.appBackground,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 40,
  },

  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 30,
  },

  proimg: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },

  email: {
    fontSize: 15,
    color: colors.primary,
  },
});

export default VideoScreen;
