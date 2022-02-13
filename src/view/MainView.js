import React, { useContext, useState } from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import { Appbar, Menu, useTheme } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import CurrentAppContext from '../component/CurrentAppContext';
import OrganizationContext from '../component/OrganizationContext';
import AppDeploysView from './AppDeploysView';
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

  const onSettingsPressed = () => {
    navigation.navigate('Modals', {
      screen: 'Settings',
    });
  };

  const otherOrgItems = otherOrganizations.map((o) => {
    return (
      <Menu.Item key={o.id} icon="exchange-alt" title={o.name} onPress={() => onChangeOrg(o)} />
    );
  });

  // Fetch current app from navigation state.
  // TODO(mikey): So ugly and hacky. Any better way?
  const navState = navigation.getState();
  const appTabsState = navState.routes.find((s) => s.name === 'AppTabs');
  const app = appTabsState ? appTabsState.params.app : null;

  const title = app ? app.name : currentOrgName;

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />
      {otherOrganizations.length ? (
        <Menu
          onDismiss={() => setShowMenu(false)}
          visible={showMenu}
          anchor={<Appbar.Action color="white" icon="building" onPress={() => setShowMenu(true)} />}
        >
          {otherOrgItems}
        </Menu>
      ) : null}
      <Appbar.Action icon="cog" onPress={onSettingsPressed} />
    </Appbar.Header>
  );
};

const Tab = createMaterialBottomTabNavigator();

const AppTabsScreen = ({ route }) => {
  const { app } = route.params;
  const { colors } = useTheme();

  return (
    <CurrentAppContext.Provider value={{ app }}>
      <Tab.Navigator initialRouteName="appsStack" barStyle={{ backgroundColor: colors.primary }}>
        <Tab.Screen
          name="AppDetail"
          component={AppDetailView}
          options={{
            tabBarLabel: 'Summary',
            tabBarIcon: ({ color }) => <FontAwesome5 name="th-list" color={color} size={26} />,
          }}
        />
        <Tab.Screen
          name="AppLogs"
          component={AppLogsView}
          options={{
            tabBarLabel: 'Logs',
            tabBarIcon: ({ color }) => <FontAwesome5 name="file-alt" color={color} size={26} />,
          }}
        />
        <Tab.Screen
          name="AppDeploys"
          component={AppDeploysView}
          options={{
            tabBarLabel: 'Deploys',
            tabBarIcon: ({ color }) => <FontAwesome5 name="bolt" color={color} size={26} />,
          }}
        />
      </Tab.Navigator>
    </CurrentAppContext.Provider>
  );
};

const ModalStack = createStackNavigator();
const ModalStackScreen = () => {
  return (
    <ModalStack.Navigator screenOptions={{ presentation: 'modal' }}>
      <ModalStack.Screen name="LoginModal" component={LoginView} options={{ headerShown: false }} />
      <ModalStack.Screen name="Settings" component={SettingsView} options={{ headerShown: true }} />
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
        component={AppsView}
        options={{ headerShown: true, header: OrgNavHeader }}
      />
      <MainStack.Screen
        name="AppTabs"
        component={AppTabsScreen}
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
