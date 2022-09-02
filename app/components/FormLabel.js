import React from "react";
import { StyleSheet, Text } from "react-native";

import colors from "../config/colors";

function FormLabel({ children }) {
  return <Text style={styles.text}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: colors.midGray,
    paddingTop: 10,
    fontWeight: "600",
  },
});

export default FormLabel;
