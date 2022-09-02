import React from "react";
import { Image, View, StyleSheet, StatusBar } from "react-native";

import colors from "../config/colors";
import AppTextInput from "./AppTextInput";

function SearchHeader(props) {
  return (
    <View style={styles.container}>
      <AppTextInput icon="magnify" placeholder="Search" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    height: "12%",
    backgroundColor: colors.white,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
});

export default SearchHeader;
