import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import colors from "../config/colors";
const { width, height } = Dimensions.get("window");

function Results({
  title,
  image,
  location,
  description,
  tour_guide_name,
  onPress,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.results}>
        <View style={styles.cardView}>
          <Image style={styles.image} source={image} />
        </View>

        <View style={styles.textView}>
          <Text style={styles.itemTitle}>{title}</Text>
          <Text style={styles.Location}>
            <FontAwesome name="map-marker" /> {location}
          </Text>
          <Text style={styles.description} numberOfLines={3}>
            {description}
          </Text>

          <Text style={styles.tourGuide}>~ {tour_guide_name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  results: {
    width: "100%",
    height: (30 * width) / 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  cardView: {
    width: "30%",
    height: "100%",
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 50,
    marginLeft: 13,
  },
  textView: {
    width: "55%",
    height: "98%",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  itemTitle: {
    color: "#000",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 5,
  },
  Location: {
    color: colors.mediumGray,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 5,
  },

  description: {
    fontSize: 10,
    color: "#000",
    width: "80%",
    marginBottom: 5,
  },

  tourGuide: {
    fontSize: 9,
    color: colors.mediumGray,
  },
});
export default Results;
