import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Alert,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import { Shadow } from "react-native-shadow-2";

import { credentialsContext } from "../components/CredentialsContext";
import colors from "../config/colors";

const { width } = Dimensions.get("window");
function BankDetails({ navigation }) {
  const [details, setDetails] = useState([]);
  const { storedCredentials, setStoredCredentials } =
    useContext(credentialsContext);

  useEffect(() => {
    getDetails();
  }, []);

  const { _id } = storedCredentials;
  const userID = _id;

  const getDetails = () => {
    const url = `https://pure-atoll-06308.herokuapp.com/uploadbankdetails/${userID}`;

    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        setDetails(data.bankData);
      })
      .catch((error) => console.log(error));
  };

  const removeDetails = (details) => {
    console.log(details);

    const url = `https://pure-atoll-06308.herokuapp.com/uploadbankdetails/delete/${details}`;

    axios
      .delete(url)
      .then((response) => {
        const result = response.data;
        const { message, status } = result;

        if (status != "SUCCESS") {
          console.log("error");
        } else {
          getDetails();
        }
      })
      .catch((error) => {
        alert("An error occurred. Check your connection and try again");
        console.log(error);
      });
  };
  return (
    <View
      style={{
        backgroundColor: colors.white,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {details && details.length > 0 ? (
        <Shadow
          distance={7}
          startColor={"#00000010"}
          containerViewStyle={{
            position: "absolute",
            width: width - 60,
            marginLeft: 50,
            top: 40,
          }}
          radius={8}
        >
          <View style={styles.cardContainer}>
            <Text style={styles.detailText}>
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                Account No :
              </Text>
              {"   "}
              {details[0].accountNumber}
            </Text>
            <Text style={styles.detailText}>
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                Account Holder :
              </Text>
              {"   "}
              {details[0].accountName}
            </Text>
            <Text style={styles.detailText}>
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                Bank Name :
              </Text>
              {"   "}
              {details[0].bankName}
            </Text>
            <View
              style={{
                width: "40%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("EditBankDetails")}
              >
                <Text
                  style={{
                    color: "green",
                    fontSize: 16,
                  }}
                >
                  Edit <FontAwesome name="edit" />
                  {"   "}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert("Delete", "Remove item from View Later?", [
                    { text: "No" },
                    {
                      text: "Remove",
                      onPress: () => removeDetails(details[0]._id),
                      style: "destructive",
                    },
                  ])
                }
              >
                <Text
                  style={{
                    color: colors.danger,
                    fontSize: 16,
                  }}
                >
                  Delete <FontAwesome name="trash-o" />{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Shadow>
      ) : (
        <Shadow
          distance={7}
          startColor={"#00000010"}
          containerViewStyle={{
            marginVertical: 30,
          }}
          radius={10}
        >
          <View style={styles.cardContainer2}>
            <TouchableOpacity
              onPress={() => navigation.navigate("UploadBankDetails")}
            >
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    marginRight: 10,
                    fontWeight: "bold",
                    fontSize: 20,
                    paddingBottom: 10,
                  }}
                >
                  Upload Bank Details
                </Text>
                <FontAwesome size={30} color={colors.primary} name="upload" />
              </View>
            </TouchableOpacity>
          </View>
        </Shadow>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  detailText: {
    paddingBottom: 15,
  },

  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },

  cardContainer2: {
    justifyContent: "center",
    paddingLeft: 30,
    paddingRight: 30,
    width: "100%",
    height: 110,
    borderRadius: 30,
  },
  cardContainer: {
    justifyContent: "center",
    paddingLeft: 25,
    paddingRight: 25,
    width: "100%",
    height: 200,
    borderRadius: 30,
  },
});

export default BankDetails;
