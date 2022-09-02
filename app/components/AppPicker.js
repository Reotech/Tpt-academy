import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
  Button,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppText from "./AppText";
import colors from "../config/colors";
import PickerItem from "./PickerItem";

function AppPicker({
  placeholder,
  onSelectItem,
  selectedItem,
  items,
  numberOfColumns = 1,
  PickerItemComponent = PickerItem,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [language, setLanguage] = useState("");

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("@language", JSON.stringify(value));
    } catch (e) {
      // saving error
      console.log(e);
    }
  };
  const setthins = (itemLabel) => {
    storeData(itemLabel);
    setLanguage(itemLabel);
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View style={styles.container}>
          {selectedItem ? (
            <AppText style={styles.text}>{language} </AppText>
          ) : (
            <AppText style={styles.placeholder}>{placeholder} </AppText>
          )}

          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color={colors.mediumGray}
          />
        </View>
      </TouchableWithoutFeedback>

      <Modal visible={modalVisible} animationType="slide">
        <View style={{ paddingTop: StatusBar.currentHeight - 10 }}>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <View
              style={{
                height: 40,
                justifyContent: "center",
              }}
            >
              <FontAwesome5
                style={{ left: "85%" }}
                color={colors.mediumGray}
                name="times"
                size={25}
              />
            </View>
          </TouchableOpacity>
          <FlatList
            numColumns={numberOfColumns}
            data={items}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item }) => (
              <PickerItemComponent
                item={item}
                label={item.label}
                onPress={() => {
                  setModalVisible(false);
                  setthins(item.label);
                  setLanguage(item.label);
                  onSelectItem(item);
                }}
              />
            )}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGray,
    borderRadius: 25,
    flexDirection: "row",
    width: "100%",
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
  },

  text: {
    flex: 1,
  },

  placeholder: {
    color: colors.mediumGray,
    flex: 1,
  },
});

export default AppPicker;
