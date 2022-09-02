import React from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import colors from "../config/colors";

function KeyboardAvoidingWrapper({ children }) {
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.white }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {children}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default KeyboardAvoidingWrapper;
