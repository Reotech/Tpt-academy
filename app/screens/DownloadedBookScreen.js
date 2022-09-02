import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import DownloadedBookCard from "../components/DownloadedBookCard";
import colors from "../config/colors";

function DownloadedBookScreen({ navigation }) {
  const [books, setBooks] = useState("");
  const [userEmail, setUserEmail] = useState();
  const [userId, setUserId] = useState();

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    getDownloadedBooks();
  }, [books]);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("tptCredentials");
      if (value !== null) {
        const parsedForm = JSON.parse(value);
        setUserId(parsedForm.id);
        setUserEmail(parsedForm.email);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getDownloadedBooks = () => {
    const url = `https://shielded-thicket-31967.herokuapp.com/boughtBook/${userEmail}`;

    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        setBooks(data.boughtBookData);
      })
      .catch((error) => console.log(error));
  };

  const deleteBook = (item) => {
    const url = `https://shielded-thicket-31967.herokuapp.com/boughtBook/delete/${item}`;
    axios
      .delete(url)
      .then((response) => {
        getDownloadedBooks();
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
                img={{
                  uri: "https://tpt-academy.online/" + item.image,
                }}
                title={item.title}
                onPress={() => navigation.navigate("ReadBookScreen", { item })}
                del={() =>
                  Alert.alert(
                    "Logout",
                    "Are you sure you want to delete this book?",
                    [
                      { text: "No" },
                      {
                        text: "Yes",
                        onPress: () => deleteBook(item.id),
                        style: "destructive",
                      },
                    ]
                  )
                }
              />
            );
          })
        ) : (
          <View style={styles.view}>
            <Text style={{ color: colors.midGray }}>
              No downloaded Books yet
            </Text>
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
    backgroundColor: colors.appBackground,
  },

  view: {
    paddingTop: "45%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DownloadedBookScreen;
