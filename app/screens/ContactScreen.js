import React from "react";
import { View, Text, StyleSheet, Linking } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import AppSeparator from "../components/AppSeparator";
import TextLink from "../components/TextLink";
import colors from "../config/colors";

function ContactScreen(props) {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <FontAwesome size={17} color={colors.primary} name="envelope" />
        <TextLink
          style={styles.innertext}
          title="www.gap.org@gmail.com"
          onPress={() => {
            Linking.openURL("mailto:www.gap.org@gmail.com");
          }}
        />
      </View>
      <AppSeparator />

      <View style={styles.innerContainer}>
        <FontAwesome size={17} color={colors.primary} name="phone" />
        <TextLink
          style={styles.innertext}
          title="07037775390"
          onPress={() => {
            Linking.openURL("tel:+2347037775390");
          }}
        />
        <TextLink
          style={styles.innertext}
          title="09030185761"
          onPress={() => {
            Linking.openURL("tel:+2349030185761");
          }}
        />
        <TextLink
          style={styles.innertext}
          title="08135301934"
          onPress={() => {
            Linking.openURL("tel:+2348135301934");
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
    padding: 20,
  },

  header: {
    fontWeight: "800",
    fontSize: 17,
    marginTop: 10,
  },

  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },

  innertext: {
    paddingLeft: 8,
    color: colors.lightGray,
  },
});

export default ContactScreen;
