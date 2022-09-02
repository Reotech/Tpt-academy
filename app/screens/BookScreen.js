import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Animated,
  RefreshControl,
  View,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
  Share,
  Text,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import axios from "axios";

import { FontAwesome5 } from "@expo/vector-icons";
import MenuItem from "../components/MenuItems";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { credentialsContext } from "../components/CredentialsContext";
import CustomAlert from "../components/CustomAlert";
import AppHeader from "../components/AppHeader";
import BookCards from "../components/BookCards";
import colors from "../config/colors";
import SearchButton from "../components/SearchButton";
import AppActivityIndicator from "../components/AppActivityIndicator";

function BookScreen({ navigation }) {
  useEffect(() => {
    getData();
    getUserData();
  }, []);
  const [alerttext, setalerttext] = useState("");
  const [books, setBooks] = useState("");
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [profile, setProfile] = useState();
  const [booksCount, setBooksCount] = useState("0");
  const [referralCode, setReferralCode] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();

  useEffect(() => {
    getCartItems();
  });

  useEffect(() => {
    getProfile();
  });

  const [refreshing, setRefreshing] = React.useState(false);
  const { storedCredentials, setStoredCredentials } =
    useContext(credentialsContext);
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

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const getData = () => {
    const url = "https://tpt-academy.online/books.php";
    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        setBooks(data.bookData);
      })
      .catch((error) => console.log(error));
  };

  const getUserData = async () => {
    try {
      const value = await AsyncStorage.getItem("tptCredentials");
      if (value !== null) {
        const parsedForm = JSON.parse(value);
        // console.log(parsedForm);
        setReferralCode(parsedForm.referral_code);
        setName(parsedForm.name);
        setUserEmail(parsedForm.email);
        setUserName(parsedForm.name);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getProfile = () => {
    const url = `https://shielded-thicket-31967.herokuapp.com/user/${userEmail}`;
    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        // console.log(data.userData[0].profile_img);
        setProfile(data.userData[0].profile_img);
      })
      .catch((error) => console.log(error));
  };

  const getCartItems = () => {
    const url = `https://shielded-thicket-31967.herokuapp.com/cart/${userEmail}`;
    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        setBooksCount(data.cartData.length);
      })
      .catch((error) => console.log(error));
  };

  const onRefresh = () => {
    books.map(() => []);
    getData();
  };

  const addToCart = (item) => {
    const url = "https://shielded-thicket-31967.herokuapp.com/cart";
    axios
      .post(url, {
        userName: userName,
        userEmail: userEmail,
        ...item,
      })
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;

        if (status != "SUCCESS") {
          setalerttext("Already added to Cart");
          fadeIn();
          setTimeout(() => {
            fadeOut();
          }, 3000);
        } else {
          setalerttext("Saved to Cart");
          fadeIn();
          setTimeout(() => {
            fadeOut();
          }, 2000);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <View style={styles.container}>
      <AppHeader
        SearchButton={SearchButton}
        booksCount={booksCount}
        viewCart={() => navigation.navigate("CartScreen")}
        onPress={settingModal}
      />
      <Animated.View
        style={{
          opacity: fadeAnim,
          zIndex: 100,
          top: -20,
        }}
      >
        <CustomAlert text={alerttext} />
      </Animated.View>
      <ScrollView
        style={{
          paddingLeft: 20,
          paddingRight: 20,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.cardContainer}>
          {books && books.length > 0 ? (
            books.map((item, index) => {
              return (
                <BookCards
                  key={index}
                  iconName="plus"
                  add={() => addToCart(item)}
                  image={{ uri: "https://tpt-academy.online/" + item.image }}
                  title={item.title}
                  subTitle={"₦ " + item.price}
                  onPress={() =>
                    navigation.navigate("BookDetailScreen", { item })
                  }
                />
              );
            })
          ) : (
            <View style={{ paddingHorizontal: 150, paddingTop: "45%" }}>
              <AppActivityIndicator size={40} color={colors.primary} />
            </View>
          )}
        </View>
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
  },
  bookmark: {
    backgroundColor: "#FFFFFF60",
    position: "absolute",
    zIndex: 99,
    height: 30,
    width: 30,
    left: 30,
    top: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    color: colors.dark,
  },

  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    top: -30,
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

export default BookScreen;
