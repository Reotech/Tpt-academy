import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Animated,
  ScrollView,
} from "react-native";
import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "../components/CustomAlert";

import AppSeparator from "../components/AppSeparator";
import AppButton from "../components/AppButton";
import colors from "../config/colors";

function BookDetailScreen({ navigation, route }) {
  const [alerttext, setalerttext] = useState("");
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();

  useEffect(() => {
    getUserData();
  }, []);

  const { item } = route.params;

  const getUserData = async () => {
    try {
      const value = await AsyncStorage.getItem("tptCredentials");
      if (value !== null) {
        const parsedForm = JSON.parse(value);
        setUserName(parsedForm.name);
        setUserEmail(parsedForm.email);
      }
    } catch (e) {
      console.log(e);
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
    <ScrollView style={{ backgroundColor: colors.secondary }}>
      <View style={styles.container}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            zIndex: 100,
            // top: -2,
          }}
        >
          <CustomAlert text={alerttext} />
        </Animated.View>
        <ImageBackground
          style={styles.image}
          source={{ uri: "https://tpt-academy.online/" + item.image }}
        />
        <View style={styles.imgTextContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={{ color: colors.primary }}>₦{item.price}</Text>
        </View>

        <AppSeparator />

        <View style={{ marginTop: 10 }}>
          <Text style={{ fontWeight: "600", color: colors.white }}>
            Description:
          </Text>
          <Text style={{ color: colors.lightGray, marginBottom: 10 }}>
            {item.description}
          </Text>

          <View style={styles.btnContainer}>
            <AppButton
              bgColor="#ADD8E6"
              txtColor={colors.dark}
              title="Add to Cart"
              onPress={() => addToCart(item)}
            />
            <AppButton
              bgColor={colors.primary}
              txtColor="white"
              title="Buy Now"
              onPress={() => navigation.navigate("PaymentScreen", { item })}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
    backgroundColor: colors.secondary,
  },

  image: {
    height: 250,
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: -30,
  },

  title: {
    fontSize: 17,
    color: colors.white,
    fontWeight: "700",
  },

  imgTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});

export default BookDetailScreen;
