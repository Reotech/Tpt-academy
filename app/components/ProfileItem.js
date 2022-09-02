import React from "react";
import { Text, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Icon from "./Icon";

import colors from "../config/colors";
const { width, height } = Dimensions.get("window");

function ProfileItem({ icon, name, onPress, style }) {
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
    padding: 20,
    backgroundColor: colors.white,
    alignItems: "center",
    height: (23 * width) / 100,
    borderTopWidth: 1,
    borderTopColor: colors.midGray,
    // borderBottomWidth:1,
  },

  text: {
    color: colors.dark,
    fontSize: (4 * width) / 100,
    marginLeft: "2%",
  },
});
export default ProfileItem;
