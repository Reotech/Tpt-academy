import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../config/colors";

function DownloadedBookCard({ onPress, title, img, del }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View
          style={{
            width: "30%",
          }}
        >
          <Image source={img} style={styles.img} />
        </View>
        <View style={styles.txtContainer}>
          <Text style={styles.txt}>{title}</Text>
        </View>
        <TouchableOpacity onPress={del}>
          <FontAwesome name="trash" size={30} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "transparent",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
    marginBottom: 15,
  },

  img: {
    height: 70,
    width: 70,
    borderRadius: 15,
  },
  txtContainer: {
    width: "55%",
    alignItems: "flex-start",
  },
  maintxt: {
    fontSize: 17,
    fontWeight: "900",
  },

  txt: {
    color: colors.lightGray,
  },
});

export default DownloadedBookCard;
