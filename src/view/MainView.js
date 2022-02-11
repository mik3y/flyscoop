import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";

const AppsView = () => {
  return (
    <View style={styles.container}>
      <Text>AppsView</Text>
    </View>
  );
};

const LoginView = () => {
  return (
    <View style={styles.container}>
      <Text>LoginView</Text>
    </View>
  );
};

const SettingsView = () => {
  return (
    <View style={styles.container}>
      <Text>LoginView</Text>
    </View>
  );
};

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
          name="settings"
          component={SettingsView}
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="account-settings"
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
        options={{ headerShown: false }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#605770",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MainView;
