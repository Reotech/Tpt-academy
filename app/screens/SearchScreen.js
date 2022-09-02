import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AppActivityIndicator from "../components/AppActivityIndicator";
import axios from "axios";
import filter from "lodash.filter";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import defaultStyles from "../config/styles";

import colors from "../config/colors";
import Results from "../components/Results";
import SearchHeader from "../components/SearchHeader";

function SearchScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filteredData, setFilteredData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setIsLoading(true);
    getTours();
  }, []);

  const getTours = () => {
    const url = "https://pure-atoll-06308.herokuapp.com/tour";

    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        setFilteredData(data.tourData);
        setMasterData(data.tourData);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error);
        console.log(error);
      });
  };

  const ItemView = ({ item }) => {
    return (
      <Results
        image={{ uri: item.image }}
        title={item.title}
        location={item.location}
        description={item.description}
        tour_guide_name={item.tour_guide_name}
        onPress={() => navigation.navigate("TourDetailScreen", { item })}
      />
    );
  };

  const searchFilter = (text) => {
    if (text) {
      const newData = masterData.filter((item) => {
        const itemData = item.title
          ? item.title.toUpperCase()
          : "".toUpperCase();

        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
      setSearch(text);
    } else {
      setFilteredData(masterData);
      setSearch(text);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.container2}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={colors.mildGray}
            style={styles.icon}
          />

          <TextInput
            clearButtonMode="always"
            placeholderTextColor={colors.mildGray}
            style={[defaultStyles.text, styles.inputField]}
            value={search}
            onChangeText={(text) => {
              searchFilter(text);
            }}
            placeholder="Search"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
        </View>
      </View>

      <View style={{ paddingTop: 20 }}>
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={ItemView}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  result: {
    marginTop: 20,
    paddingBottom: 130,
  },

  category: {
    paddingLeft: "6%",
    paddingBottom: 10,
    fontWeight: "bold",
    fontSize: 16,
  },

  scrolly: {
    marginLeft: "5%",
  },

  button: {
    backgroundColor: colors.midGray,
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },

  text: {
    color: colors.dark,
  },

  tabActive: {
    backgroundColor: colors.primary,
  },

  textActive: {
    color: colors.white,
  },

  container2: {
    backgroundColor: colors.lightGray,
    borderRadius: 25,
    flexDirection: "row",
    width: "100%",
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
  },

  inputField: {
    width: "100%",
  },

  icon: {
    marginRight: 10,
  },

  headerContainer: {
    marginTop: StatusBar.currentHeight,
    height: "12%",
    backgroundColor: colors.white,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
});

export default SearchScreen;
