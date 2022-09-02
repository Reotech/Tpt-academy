import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import AppActivityIndicator from "./AppActivityIndicator";

function AppButton({
  title,
  name,
  icon,
  onPress,
  size = 30,
  indicator,
  txtColor = "black",
  bgColor = "primary",
}) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor }]}
      onPress={onPress}
    >
      {indicator && (
        <AppActivityIndicator color={colors.primary} size="small" />
      )}
      <Text style={[styles.text, { color: txtColor }]}>{title}</Text>
      {icon && (
        <FontAwesome
          style={styles.icon}
          name={name}
          size={size}
          color={colors.dark}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: colors.primary,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    flexDirection: "row",
  },

  text: {
    fontSize: 17,
    color: colors.white,
    fontWeight: "bold",
  },

  icon: {
    position: "absolute",
    paddingStart: 230,
    color: colors.primary,
    fontWeight: "bold",
  },
});

export default AppButton;
