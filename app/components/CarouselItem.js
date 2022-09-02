import React, { useState, useContext } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import colors from "../config/colors";

const { width, height } = Dimensions.get("window");

function CarouselItem({ navigation, item }) {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("TourDetailScreen", { item })}
      style={styles.container}
    >
      <View style={styles.cardView}>
        <Image
          style={styles.image}
          source={{
            uri: item.image,
          }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.location}>
            <FontAwesome
              name="map-marker"
              size={19}
              style={styles.locationIcon}
            />
            {item.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height / 3,
    justifyContent: "center",
    alignItems: "center",
  },

  cardView: {
    flex: 1,
    width: "87%",
    height: "100%",
    margin: 10,
    borderRadius: 25,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },

  textContainer: {
    position: "absolute",
    bottom: 10,
    margin: 10,
    left: 5,
  },

  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },

  location: {
    color: colors.lightGray,
    fontSize: 14,
  },
});

export default CarouselItem;
