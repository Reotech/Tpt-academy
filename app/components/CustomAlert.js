import React from "react";
import { Text, View, StyleSheet } from "react-native";
import colors from "../config/colors";

function CustomAlert({ text }) {
  return (
    <View style={styles.superContainer}>
      <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  superContainer: {
    width: "100%",
    alignItems: "center",
  },

  container: {
    backgroundColor: colors.primary,
    width: "65%",
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    borderRadius: 10,
  },

  text: {
    color: colors.white,
    fontSize: 17,
  },
});

export default CustomAlert;
