import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import DownloadedBookCard from "../components/DownloadedBookCard";
import colors from "../config/colors";

function CartScreen({ navigation }) {
  const [books, setBooks] = useState({});
  const [userEmail, setUserEmail] = useState();
  const [userId, setUserId] = useState();

  useEffect(() => {
    getCartItems();
  }, [books]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("tptCredentials");
      // console.log(value);
      if (value !== null) {
        const parsedForm = JSON.parse(value);
        setUserEmail(parsedForm.email);
        setUserId(parsedForm.id);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getCartItems = () => {
    const url = `https://shielded-thicket-31967.herokuapp.com/cart/${userEmail}`;
    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        console.log(data.cartData);
        setBooks(data.cartData);
      })
      .catch((error) => console.log(error));
  };

  const deleteBook = (item) => {
    const url = `https://shielded-thicket-31967.herokuapp.com/cart/delete/${item}`;
    axios
      .delete(url)
      .then((response) => {
        getCartItems();
      })
      .catch((error) => console.log(error));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {books && books.length > 0 ? (
          books.map((item, index) => {
            return (
              <DownloadedBookCard
                key={index}
                img={{ uri: "https://tpt-academy.online/" + item.image }}
                title={item.title}
                onPress={() => navigation.navigate("PaymentScreen", { item })}
                del={() =>
                  Alert.alert("Logout", "Remove this book from cart?", [
                    { text: "No" },
                    {
                      text: "Yes",
                      onPress: () => deleteBook(item.id),
                      style: "destructive",
                    },
                  ])
                }
              />
            );
          })
        ) : (
          <View style={styles.view}>
            <Text style={{ color: colors.midGray }}>Cart is empty</Text>
            {/* <AppActivityIndicator size={40} color={colors.primary} /> */}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: colors.appBackground,
  },

  view: {
    paddingTop: "45%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CartScreen;
