import React, { useContext, useState } from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import { Appbar, Menu, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import OrganizationContext from '../component/OrganizationContext';
import AppDetailView from './AppDetailView';
import AppLogsView from './AppLogsView';
import AppsView from './AppsView';
import LoginView from './LoginView';
import SettingsView from './SettingsView';

const OrgNavHeader = ({ navigation, back }) => {
  const { currentOrganization, otherOrganizations, changeOrganization } =
    useContext(OrganizationContext);
  const [showMenu, setShowMenu] = useState(false);

  const currentOrgName = currentOrganization ? currentOrganization.name : 'FlyTouch';

  const onChangeOrg = (o) => {
    setShowMenu(false);
    changeOrganization(o);
  };

  const otherOrgItems = otherOrganizations.map((o) => {
    return (
      <Menu.Item key={o.id} icon="exchange-alt" title={o.name} onPress={() => onChangeOrg(o)} />
    );
  });

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={currentOrgName} />
      {otherOrganizations.length ? (
        <Menu
          onDismiss={() => setShowMenu(false)}
          visible={showMenu}
          anchor={<Appbar.Action color="white" icon="building" onPress={() => setShowMenu(true)} />}
        >
          {otherOrgItems}
        </Menu>
      ) : null}
      <Appbar.Action icon="cog" onPress={() => console.log('Pressed settings')} />
    </Appbar.Header>
  );
};

const AppStack = createStackNavigator();
const AppStackScreen = () => {
  const { colors } = useTheme();
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTitleStyle: {
          color: '#fff',
        },
      }}
    >
      <AppStack.Screen name="Apps" component={AppsView} options={{ headerShown: false }} />
      <AppStack.Screen name="AppDetail" component={AppDetailView} options={{ headerShown: true }} />
    </AppStack.Navigator>
  );
};

const Tab = createMaterialBottomTabNavigator();
const TabScreen = () => {
  const { colors } = useTheme();

  return (
    <>
      <Tab.Navigator initialRouteName="appsStack" barStyle={{ backgroundColor: colors.primary }}>
        <Tab.Screen
          name="appsStack"
          component={AppStackScreen}
          options={{
            tabBarLabel: 'Apps',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="format-list-text" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="login"
          component={LoginView}
          options={{
            tabBarLabel: 'Login',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="settings"
          component={SettingsView}
          options={{
            headerShown: true,
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="adjust" color={color} size={26} />
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
    <ModalStack.Navigator screenOptions={{ presentation: 'modal' }}>
      <ModalStack.Screen name="LoginModal" component={LoginView} options={{ headerShown: false }} />
      <ModalStack.Screen name="AppLogs" component={AppLogsView} options={{ headerShown: true }} />
      {/* Other modals here. */}
    </ModalStack.Navigator>
  );
};

const MainStack = createStackNavigator();
const MainStackScreen = () => {
  const { colors } = useTheme();
  return (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTitleStyle: {
          color: '#fff',
        },
      }}
    >
      <MainStack.Screen
        name="Main"
        component={TabScreen}
        options={{ headerShown: true, header: OrgNavHeader }}
      />
    </MainStack.Navigator>
  );
};

const RootStack = createStackNavigator();
const RootStackScreen = () => {
  return (
    <RootStack.Navigator
      name="RootStack"
      screenOptions={{ presentation: 'modal', headerShown: false }}
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
