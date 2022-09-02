import React, { useState, useContext, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import axios from "axios";

import { credentialsContext } from "../components/CredentialsContext";
import BookScreen from "../screens/BookScreen";
import HomeScreen from "../screens/HomeScreen";
import MessageScreen from "../screens/MessageScreen";

import colors from "../config/colors";
import VideoScreen from "../screens/VideoScreen";

const Tab = createBottomTabNavigator();

function BottomTabNavigator({ navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(credentialsContext);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: "#a0c6fb",
          tabBarStyle: {
            height: 55,
            backgroundColor: colors.primary,
            paddingBottom: 4,
            borderTopColor: colors.primary,
            elevation: 0,
          },
        }}
      >
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons color={color} size={size} name="home" />
            ),
          }}
          name="Home"
          component={HomeScreen}
        />

        <Tab.Screen
          name="Books"
          options={{
            headerShown: false,
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons color={color} size={size} name="folder" />
            ),
          }}
          component={BookScreen}
        />

        {/* <Tab.Screen
          name="Chats"
          options={{
            headerShown: false,
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                color={color}
                size={size}
                name="comment"
              />
            ),
          }}
          component={MessageScreen}
        /> */}

        <Tab.Screen
          name="Videos"
          options={{
            headerShown: false,
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                color={color}
                size={size}
                name="youtube"
              />
            ),
          }}
          component={VideoScreen}
        />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({});

export default BottomTabNavigator;
