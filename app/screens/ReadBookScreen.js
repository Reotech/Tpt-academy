import React from "react";
import { StyleSheet, View, StatusBar } from "react-native";
import { WebView } from "react-native-webview";
import { usePreventScreenCapture } from "expo-screen-capture";

import AppActivityIndicator from "../components/AppActivityIndicator";
import colors from "../config/colors";

function ReadBookScreen({ route, navigation }) {
  usePreventScreenCapture();
  const { item } = route.params;
  // const source = "http://www.africau.edu/images/default/sample.pdf";
  const source = "https://tpt-academy.online/" + item.pdf;
  const INJECTEDJAVASCRIPT = "document.body.style.userSelect = 'none'";

  return (
    <View style={styles.container}>
      <WebView
        startInLoadingState={true}
        injectedJavaScript={INJECTEDJAVASCRIPT}
        scrollEnabled
        source={{
          uri: `http://docs.google.com/gview?embedded=true&url=${source}`,
        }}
        renderLoading={() => (
          <View style={{ paddingTop: "15%" }}>
            <AppActivityIndicator color={colors.primary} size={40} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
});

export default ReadBookScreen;
