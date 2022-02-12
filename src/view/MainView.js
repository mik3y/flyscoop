import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import LoginView from "./LoginView";
import SettingsView from "./SettingsView";
import AppsView from "./AppsView";
import AppDetailView from "./AppDetailView";
import AppLogsView from "./AppLogsView";

const Tab = createMaterialBottomTabNavigator();
const TabScreen = () => {
  const { colors } = useTheme();

  return (
    <>
      <Tab.Navigator
        initialRouteName="apps"
        barStyle={{ backgroundColor: colors.primary }}
      >
        <Tab.Screen
          name="apps"
          component={AppsView}
          options={{
            tabBarLabel: "Apps",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="format-list-text"
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="login"
          component={LoginView}
          options={{
            tabBarLabel: "Login",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="settings"
          component={SettingsView}
          options={{
            headerShown: true,
            tabBarLabel: "Settings",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="adjust"
                color={color}
                size={26}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const ModalStack = createStackNavigator();
const ModalStackScreen = () => {
  return (
    <ModalStack.Navigator screenOptions={{ presentation: "modal" }}>
      <ModalStack.Screen
        name="LoginModal"
        component={LoginView}
        options={{ headerShown: false }}
      />
      <ModalStack.Screen
        name="AppLogs"
        component={AppLogsView}
        options={{ headerShown: true,  }}
      />
      <ModalStack.Screen
        name="AppDetail"
        component={AppDetailView}
        options={{ headerShown: true,  }}
      />
      {/* Other modals here. */}
    </ModalStack.Navigator>
  );
};

const MainStack = createStackNavigator();
const MainStackScreen = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Main"
        component={TabScreen}
        options={{ headerShown: true }}
      />
    </MainStack.Navigator>
  );
};

const RootStack = createStackNavigator();
const RootStackScreen = () => {
  return (
    <RootStack.Navigator
      name="RootStack"
      screenOptions={{ presentation: "modal", headerShown: false }}
    >
      <RootStack.Screen name="MainStack" component={MainStackScreen} />
      <RootStack.Screen
        name="Modals"
        component={ModalStackScreen}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
};

/**
 * MainView hosts the main (bottom) navigation, and swaps between
 * the primary screens.
 */
const MainView = () => {
  /** Returns the top-level navigator; a mere container for our modals and tabs. */

  return (
    <View style={{ flex: 1 }}>
      <RootStackScreen />
    </View>
  );
};

export default MainView;
