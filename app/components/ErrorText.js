import React from "react";
import { Text, StyleSheet } from "react-native";

function ErrorText({ Children }) {
  return <Text style={styles.error}>{Children}</Text>;
}

const styles = StyleSheet.create({
  error: {
    color: "red",
  },
});

export default ErrorText;
