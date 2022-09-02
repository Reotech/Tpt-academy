import { Platform } from "react-native";
import colors from "./colors";

export default {
  text: {
    fontFamily: 'poppins',
    fontSize: 15,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    color: colors.mediumGray,
  },
};
