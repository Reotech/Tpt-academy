import React from "react";
import { Text, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Icon from "./Icon";

import colors from "../config/colors";
const { width, height } = Dimensions.get("window");

function MenuItem({ icon, name, onPress, style }) {
  return (
    <TouchableOpacity
      style={[styles.profileSection, style]}
      delayPressIn={50}
      onPress={() => onPress()}
    >
      <Icon name={icon} backgroundColor={colors.primary} />
      <Text style={styles.text}>{name}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  profileSection: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: colors.appBackground,
    alignItems: "center",
    height: 50,
    marginBottom: 15,
    // borderTopWidth: 1,
    borderTopColor: colors.midGray,
  },

  text: {
    color: colors.lightGray,
    fontSize: (4 * width) / 100,
    marginLeft: "5%",
  },
});
export default MenuItem;
