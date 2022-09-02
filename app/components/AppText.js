import React from "react";
import { Text, StyleSheet } from "react-native";
import colors from "../config/colors";
// import { useFonts, poppins } from '@expo-google-fonts/poppins';
// import AppLoading from "expo-app-loading";

function AppText({ children, style, ...otherProps }) {
  // const [fontsLoaded] = useFonts({ poppins });

  // if(!fontsLoaded){
  //  <AppLoading />
  // }

    return (
      <Text style={[styles.text, style]} {...otherProps}>
        {children}
      </Text>
      
      );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    color: colors.mediumGray,
  },
})



export default AppText;
