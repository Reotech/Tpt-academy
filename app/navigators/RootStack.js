import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { credentialsContext } from "../components/CredentialsContext";

import BottomTabNavigator from "./BottomTabNavigator";
import SearchScreen from "../screens/SearchScreen";
import LoginScreen from "../screens/LoginScreen";
import UserRegisterScreen from "../screens/UserRegisterScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import colors from "../config/colors";
import ChatScreen from "../screens/ChatScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import UploadIdScreen from "../screens/UploadIdScreen";
import UploadBankDetails from "../screens/UploadBankDetails";
import BankDetails from "../screens/BankDetails";
import EditBankDetails from "../screens/EditBankDetails";
import BookDetailScreen from "../screens/BookDetailScreen";
import PaymentScreen from "../screens/PaymentScreen";
import DownloadedBookScreen from "../screens/DownloadedBookScreen";
import ReadBookScreen from "../screens/ReadBookScreen";
import ExtraDetailScreen from "../screens/ExtraDetailScreen";
import FeedDetailScreen from "../screens/FeedDetailScreen";
import CartScreen from "../screens/CartScreen";
import ContactScreen from "../screens/ContactScreen";
import PersonalDetailScreen from "../screens/PersonalDetailScreen";
import UploadImageScreen from "../screens/UploadImageScreen";
import AboutScreen from "../screens/AboutScreen";
import ReferralScreen from "../screens/ReferralScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";

const Stack = createNativeStackNavigator();

function RootStack(props) {
  return (
    <credentialsContext.Consumer>
      {({ storedCredentials }) => (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: "transparent",
              },
              cardShadowEnabled: false,
              headerTitle: "",
            }}
            initialRouteName="LoginScreen"
          >
            <Stack.Screen
              options={{ headerShown: false }}
              name="HomeScreen"
              component={BottomTabNavigator}
            />

            <Stack.Screen
              options={{ headerShown: false }}
              name="LoginScreen"
              component={LoginScreen}
            />
            <Stack.Screen
              options={{
                headerTitle: "",
                headerStyle: {
                  backgroundColor: colors.appBackground,
                },
                headerTintColor: colors.white,
              }}
              name="ForgotPasswordScreen"
              component={ForgotPasswordScreen}
            />

            <Stack.Screen
              options={{ headerShown: false }}
              name="UserRegisterScreen"
              component={UserRegisterScreen}
            />

            <Stack.Screen
              options={{ headerShown: false }}
              name="ExtraDetailScreen"
              component={ExtraDetailScreen}
            />

            <Stack.Screen
              options={{
                headerTitle: "Upload Profile Picture ",
                headerShadowVisible: false,
              }}
              name="UploadIdScreen"
              component={UploadIdScreen}
            />

            <Stack.Screen
              options={{ headerShown: false }}
              name="SearchScreen"
              component={SearchScreen}
            />

            <Stack.Screen
              options={{
                headerTitle: "Edit Profile",
                headerStyle: {
                  backgroundColor: colors.secondary,
                },
                headerTintColor: colors.white,
              }}
              name="EditProfileScreen"
              component={EditProfileScreen}
            />
            <Stack.Screen
              options={{
                headerTitle: "Contact us",
                headerStyle: {
                  backgroundColor: colors.secondary,
                },
                headerTintColor: colors.white,
              }}
              name="ContactScreen"
              component={ContactScreen}
            />
            <Stack.Screen
              options={{
                headerTitle: "About us",
                headerStyle: {
                  backgroundColor: colors.secondary,
                },
                headerTintColor: colors.white,
              }}
              name="AboutScreen"
              component={AboutScreen}
            />
            <Stack.Screen
              options={{
                headerTitle: "Referral Earnings",
                headerStyle: {
                  backgroundColor: colors.secondary,
                },
                headerTintColor: colors.white,
              }}
              name="ReferralScreen"
              component={ReferralScreen}
            />
            <Stack.Screen
              options={{
                headerTitle: "Settings",
                headerShadowVisible: false,
              }}
              name="SettingsScreen"
              component={SettingsScreen}
            />

            <Stack.Screen
              options={{ headerShown: false }}
              name="PersonalDetailScreen"
              component={PersonalDetailScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="UploadImageScreen"
              component={UploadImageScreen}
            />

            <Stack.Screen
              options={{ headerShown: false }}
              name="ChatScreen"
              component={ChatScreen}
            />

            <Stack.Screen
              options={{
                headerTitle: "Change Password",
                headerShadowVisible: false,
              }}
              name="ChangePasswordScreen"
              component={ChangePasswordScreen}
            />

            <Stack.Screen
              options={{
                headerTitle: "Bank Details",
                headerShadowVisible: false,
              }}
              name="BankDetails"
              component={BankDetails}
            />
            <Stack.Screen
              options={{
                headerTitle: "Upload Bank Details",
                headerShadowVisible: false,
              }}
              name="UploadBankDetails"
              component={UploadBankDetails}
            />
            <Stack.Screen
              options={{
                headerShadowVisible: false,
                headerStyle: {
                  backgroundColor: colors.secondary,
                },
                headerTintColor: colors.white,
              }}
              name="BookDetailScreen"
              component={BookDetailScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="PaymentScreen"
              component={PaymentScreen}
            />
            <Stack.Screen
              options={{
                headerTitle: "",
                headerStyle: {
                  backgroundColor: colors.secondary,
                },
                headerTintColor: colors.white,
              }}
              name="FeedDetailScreen"
              component={FeedDetailScreen}
            />
            <Stack.Screen
              options={{
                headerTitle: "Downloaded Books",
                headerStyle: {
                  backgroundColor: colors.secondary,
                },
                headerTintColor: colors.white,
              }}
              name="DownloadedBookScreen"
              component={DownloadedBookScreen}
            />
            <Stack.Screen
              options={{
                headerTitle: "Cart",
                headerStyle: {
                  backgroundColor: colors.secondary,
                },
                headerTintColor: colors.white,
              }}
              name="CartScreen"
              component={CartScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="ReadBookScreen"
              component={ReadBookScreen}
            />
            <Stack.Screen
              options={{
                headerTitle: "Edit Bank Details",
                headerShadowVisible: false,
              }}
              name="EditBankDetails"
              component={EditBankDetails}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </credentialsContext.Consumer>
  );
}

export default RootStack;
