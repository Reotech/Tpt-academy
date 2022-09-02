import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import colors from "../config/colors";

function ImageInput() {
  const [image, setImage] = useState(null);
  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) alert("You need to enable permission to access the library");
  };

  const handlePress = () => {
    if (!image) selectImage();
    else
      Alert.alert("Delete", "Are you sure you want to delete this image?", [
        { text: "No" },
        { text: "Yes", onPress: () => setImage(null) },
      ]);
  };

  const selectImage = async () => {
    try {
      const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });
      if (!cancelled) {
        setImage(uri);

        //change the uri(image) to base64
        const binary = uri.replace(/^data:image\/(png|jpg);base64,/, "");
        putImage(binary);
      }
    } catch (error) {
      console.log("there was an error loading image", image, error);
    }
  };

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("@tourImage", JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
  };
  const putImage = (binary) => {
    storeData(binary);
    // putImage(theImage);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        {!image && (
          <MaterialCommunityIcons
            name="camera"
            size={40}
            color={colors.mediumGray}
          />
        )}
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGray,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    width: 100,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },
});

export default ImageInput;
