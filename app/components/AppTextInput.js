import React, { useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import defaultStyles from "../config/styles";
import colors from "../config/colors";

function AppTextInput({ icon, style, ...otherProps }) {
  // const [bordercolor, setbordercolor] = useState("#1C1E1F")

  return (
    <View style={[styles.container, style]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={colors.white}
          style={styles.icon}
        />
      )}
      <TextInput
        placeholderTextColor={colors.mildGray}
        style={[defaultStyles.text, styles.inputField]}
        {...otherProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    borderRadius: 15,
    flexDirection: "row",
    borderColor: "#1C1E1F",
    borderWidth: 1,
    width: "100%",
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
  },

  inputField: {
    width: "100%",
    color: colors.white,
  },

  icon: {
    marginRight: 10,
  },
});

export default AppTextInput;
