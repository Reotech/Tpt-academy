import React from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import CarouselItem from "./CarouselItem";
import colors from "../config/colors";

const { width, height } = Dimensions.get("window");
function CustomSlider({ data }) {
  const settings = {
    sliderWidth: width,
    sliderHeight: width,
    itemWidth: width,
    data: data,
    renderItem: CarouselItem,
    hasParallaxImages: true,
    autoplay: true,
    enableMomentum: false,
    lockScrollWhileSnapping: true,
    autoplayInterval: 3000,
    autoplayDelay: 1000,
    loop: true,
    enableSnap: true,
  };
  if (data && data.length > 0) {
    return (
      <View>
        <Carousel {...settings} />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.cardView}>
          <View style={styles.textContainer}>
            <View style={styles.titt} />
            <View style={styles.subtit} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 7,
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
    backgroundColor: colors.white,
  },

  textContainer: {
    position: "absolute",
    bottom: 10,
    margin: 10,
    left: 5,
    width: "100%",
  },

  titt: {
    height: 10,
    width: "45%",
    marginLeft: 10,
    backgroundColor: colors.midGray,
    marginBottom: 15,
  },

  subtit: {
    height: 10,
    width: "40%",
    marginLeft: 10,
    backgroundColor: colors.midGray,
  },
});

export default CustomSlider;
