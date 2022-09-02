import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import colors from "../config/colors";

function FeedDetailScreen({ navigation, route }) {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView>
        <ImageBackground
          style={styles.image}
          source={{ uri: "https://tpt-academy.online/" + item.image }}
        />
        <View style={styles.imgTextContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={{ color: colors.primary }}>{item.subtitle}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.secondary,
  },

  image: {
    height: 350,
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.white,
  },

  imgTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
});

export default FeedDetailScreen;
