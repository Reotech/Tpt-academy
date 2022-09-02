import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Modal,
  Pressable,
  Text,
  Alert,
} from "react-native";
import axios from "axios";

import colors from "../config/colors";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

function AppHeader({ onPress, viewCart, booksCount }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <FontAwesome size={22} name="bars" color={colors.lightGray} />
      </TouchableOpacity>

      <TouchableOpacity onPress={viewCart}>
        <FontAwesome
          size={22}
          name="shopping-basket"
          color={colors.lightGray}
        />
        <View style={styles.basketBadge}>
          <Text style={{ color: colors.white, fontSize: 12 }}>
            {booksCount}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    height: "10%",
    backgroundColor: colors.secondary,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  logo: {
    height: 45,
    width: 125,
  },

  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10,
  },

  email: {
    fontSize: 15,
    color: colors.primary,
  },

  basketBadge: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    height: 20,
    width: 20,
    borderRadius: 10,
    position: "absolute",
    top: 15,
    left: 11,
  },
});

export default AppHeader;
