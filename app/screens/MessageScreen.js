import React, { useState, useEffect, useContext } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Image,
} from "react-native";
import axios from "axios";

import { credentialsContext } from "../components/CredentialsContext";

import ListItem from "../components/ListItem";
import AppSeparator from "../components/AppSeparator";
import ListItemDeleteAction from "../components/ListItemDeleteAction";
import colors from "../config/colors";

function MessageScreen({ navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(credentialsContext);
  const { _id, name } = storedCredentials;
  const [refreshing, setRefreshing] = useState(false);

  // const handleDelete = (message) => {
  //   //delete the message from messages array
  //   setMessages(messages.filter((m) => m.id !== message.id));
  // };
  const [chats, setChats] = useState([]);

  useEffect(() => {
    getChat();
  }, []);

  const getChat = () => {
    const url = "https://pure-atoll-06308.herokuapp.com/chat";

    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        setChats(data.ChatData.slice(-1));
      })
      .catch((error) => console.log(error));
  };
  const onRefresh = () => {
    chats.map(() => []);
    getChat();
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={chats}
        keyExtractor={(chat) => chat._id.toString()}
        renderItem={({ item }) => {
          if (item.user._id == _id || item.sentTo == _id) {
            if (item.user._id == _id) {
              if (item.sentToImg != null) {
                return (
                  <ListItem
                    title={item.sentToName}
                    subTitle={item.text}
                    image={{ uri: item.sentToImg }}
                    onPress={() => navigation.navigate("ChatScreen", { item })}
                    renderRightActions={() => (
                      <ListItemDeleteAction
                        onPress={() => handleDelete(item)}
                      />
                    )}
                  />
                );
              } else {
                return (
                  <ListItem
                    title={item.sentToName}
                    subTitle={item.text}
                    image={require("../assets/profile.jpg")}
                    onPress={() => navigation.navigate("ChatScreen", { item })}
                    // renderRightActions={() => (
                    //   <ListItemDeleteAction
                    //     onPress={() => handleDelete(item)}
                    //   />
                    // )}
                  />
                );
              }
            } else {
              if (item.sentByImg != null) {
                return (
                  <ListItem
                    title={item.sentByName}
                    subTitle={item.text}
                    image={{ uri: item.sentByImg }}
                    onPress={() => navigation.navigate("ChatScreen", { item })}
                    renderRightActions={() => (
                      <ListItemDeleteAction
                        onPress={() => handleDelete(item)}
                      />
                    )}
                  />
                );
              } else {
                return (
                  <ListItem
                    title={item.sentByName}
                    subTitle={item.text}
                    image={require("../assets/profile.jpg")}
                    onPress={() => navigation.navigate("ChatScreen", { item })}
                    renderRightActions={() => (
                      <ListItemDeleteAction
                        onPress={() => handleDelete(item)}
                      />
                    )}
                  />
                );
              }
            }
          } else {
            return (
              <View style={styles.emptyContainer}>
                {/* <Image
                  source={require("../assets/noChats.png")}
                  style={styles.img}
                /> */}
                <Text style={styles.txt}>You have no chats yet</Text>
              </View>
            );
          }
        }}
        ItemSeparatorComponent={AppSeparator}
        refreshing={refreshing}
        onRefresh={() => {
          getChat();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
  },

  list: {
    paddingTop: 10,
  },

  emptyContainer: {
    paddingTop: 30,
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  img: {
    height: 300,
    borderRadius: 500,
    width: "87%",
  },

  txt: {
    fontSize: 18,
    paddingTop: 20,
    color: colors.mediumGray,
  },
});

export default MessageScreen;
