import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";

import AppText from "./AppText";
import colors from "../config/colors";

function Card({ title, subTitle, image, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <Image style={styles.img} source={image} />

        <View style={styles.detailsContainer}>
          <AppText style={styles.title} numberOfLines={2}>
            {title}
          </AppText>
          <AppText style={styles.subTitle}>{subTitle}</AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    width: "100%",
    backgroundColor: colors.secondary,
    marginVertical: 30,
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: 200,
  },

  detailsContainer: {
    padding: 10,
  },

  title: {
    fontSize: 17,
    marginBottom: 7,
    width: "90%",
    color: colors.white,
  },

  subTitle: {
    color: colors.mildGray,
    fontSize: 14,
  },
});

export default Card;
