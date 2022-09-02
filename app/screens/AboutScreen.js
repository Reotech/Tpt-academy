import React from "react";
import { View, StyleSheet, Text } from "react-native";
import colors from "../config/colors";

function AboutScreen(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Turning Point is a fast growing eucational institution which consists of
        both the Tutotrial Wing (TPT) and the Academy (TPA).
      </Text>
      <Text style={styles.text}>Our numerous testimonies are everywhere.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
    padding: 20,
  },

  text: {
    lineHeight: 25,
    fontSize: 17,
    marginBottom: 15,
    color: colors.midGray,
  },
});

export default AboutScreen;
