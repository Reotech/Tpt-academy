import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

import AppText from "./AppText";
import colors from "../config/colors";

function BookCards({ title, subTitle, image, onPress, add, iconName }) {
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress}>
        <Image style={styles.img} source={image} />

        <View style={styles.detailsContainer}>
          <AppText style={styles.title} numberOfLines={2}>
            {title}
          </AppText>
          <AppText style={styles.subTitle}>{subTitle}</AppText>
          <TouchableOpacity style={styles.addbtn} onPress={add}>
            <FontAwesome name={iconName} color={colors.white} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    width: "47%",
    backgroundColor: colors.secondary,
    marginVertical: 30,
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: 150,
  },

  detailsContainer: {
    padding: 10,
  },

  title: {
    fontSize: 17,
    marginBottom: 7,
    width: "90%",
    color: colors.lightGray,
  },

  subTitle: {
    color: colors.mildGray,
    fontSize: 14,
  },

  addbtn: {
    height: 40,
    width: 40,
    borderRadius: 15,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
});

export default BookCards;
