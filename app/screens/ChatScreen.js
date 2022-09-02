import React, { useState, useCallback, useEffect, useContext } from "react";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import axios from "axios";

import { credentialsContext } from "../components/CredentialsContext";
import colors from "../config/colors";

function ChatScreen({ route }) {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);

  const { item } = route.params;

  useEffect(() => {
    displayChats();
  }, [chats]);

  const { storedCredentials, setStoredCredentials } =
    useContext(credentialsContext);

  const { _id, name, profile_img } = storedCredentials;
  const currentId = _id;

  const displayChats = () => {
    const url = "https://pure-atoll-06308.herokuapp.com/chat";

    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        setChats(data.ChatData);

        setMessages(
          chats
            .filter((item) => {
              if (item.user._id == currentId || item.sentTo == currentId) {
                return {
                  _id: item._id,
                  text: item.text,
                  sentTo: item.sentTo,
                  sentToImg: item.sentToImg,
                  sentToName: item.sentToName,
                  // sentById: item.sentById,
                  sentByName: item.sentByName,
                  sentByImg: item.sentByImg,
                  createdAt: item.createdAt,
                  user: {
                    _id: item.user._id,
                    name: item.user.name,
                    avatar: profile_img,
                  },
                };
              }
            })
            .reverse()
        );
      })
      .catch((error) => console.log(error));
  };

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    const url = "https://pure-atoll-06308.herokuapp.com/chat";

    if (item.user_id) {
      axios
        .post(url, {
          _id,
          createdAt,
          sentTo: item.user_id,
          sentToImg: item.guide_profile_pic,
          sentToName: item.tour_guide_name,
          sentByName: name,
          sentByImg: profile_img,
          text,
          user,
        })
        .then((response) => {
          const result = response.data;
          const { status, data } = result;

          if (status != "SUCCESS") {
            console.log("Error");
          } else {
            console.log("Sent");
          }
        })
        .catch((error) => console.log(error));
    } else {
      if (currentId != item.sentTo) {
        axios
          .post(url, {
            _id,
            createdAt,
            sentTo: item.sentTo,
            sentToImg: item.sentToImg,
            sentToName: item.sentToName,
            sentByName: name,
            sentByImg: profile_img,
            text,
            user,
          })
          .then((response) => {
            const result = response.data;
            const { status, data } = result;

            if (status != "SUCCESS") {
              console.log("Error");
            } else {
              console.log("Sent");
            }
          })
          .catch((error) => console.log(error));
      } else {
        axios
          .post(url, {
            _id,
            createdAt,
            sentTo: item.user._id,
            sentToImg: item.user.profile_img,
            sentToName: item.user.name,
            sentByName: name,
            sentByImg: profile_img,
            text,
            user,
          })
          .then((response) => {
            const result = response.data;
            const { status, data } = result;

            if (status != "SUCCESS") {
              console.log("Error");
            } else {
              console.log("Sent");
            }
          })
          .catch((error) => console.log(error));
      }
    }
  }, []);

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: colors.primary,
          },
        }}
        textStyle={{
          left: {
            color: colors.dark,
          },

          right: {
            color: colors.white,
          },
        }}
      />
    );
  };

  return (
    <GiftedChat
      messages={messages}
      renderBubble={renderBubble}
      showAvatarForEveryMessage={true}
      // showUserAvatar={true}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: currentId,
        name: name,
        profile_img: profile_img,
      }}
    />
  );
}

export default ChatScreen;
