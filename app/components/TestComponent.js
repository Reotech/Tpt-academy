import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
function TestComponent({ onLanguageSet }) {
  const [location, setLocation] = useState("");
  return (
    <View>
      <Text>Boiler</Text>
      <TouchableOpacity>
        <Text onPress={() => setLocation("Me")} onLanguageSet={onLanguageSet}>
          Click
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default TestComponent;
