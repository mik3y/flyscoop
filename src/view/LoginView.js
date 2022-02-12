import React, { useContext, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Appbar,
  Button,
  DefaultTheme,
  Headline,
  List,
  TextInput,
} from "react-native-paper";
import ApiContext from "../component/ApiContext";
import { getLogger } from "../lib/Logging";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

const debug = getLogger("LoginView");

const LoginIntroView = () => {
  const navigation = useNavigation();

  const onContinuePressed = () => {
    navigation.navigate("LoginForm");
  };

  // For some reason need to wrap this in a view with explicit
  // styling, else we get weird layout. See:
  // https://github.com/react-navigation/react-navigation/issues/3184

  return (
    <View style={{ display: "flex", width: "100%" }}>
      <ScrollView>
        <Headline>Get Started</Headline>
        <Text>
            FlyTouch is a utility application for Fly.io accounts.
            In order to use it, you need to log in.
        </Text>
        <Text style={styles.registrationSubheader}>What you can do</Text>
        <View>
          <List.Item
            title="View apps"
            description="View all of your apps and basic status"
            left={(props) => <List.Icon {...props} icon="heart" />}
          />
          <List.Item
            title="Scale up and down"
            description="Quickly change the scale settings for an app"
            left={(props) => <List.Icon {...props} icon="chat" />}
          />
          <List.Item
            title="View logs"
            description="View and follow logs for active apps"
            left={(props) => <List.Icon {...props} icon="account-group" />}
          />
        </View>
        <Text style={styles.registrationSubheader}>Requirements</Text>
        <View>
          <List.Item
            title="API key"
            description="We need an API"
            left={(props) => <List.Icon {...props} icon="mail" />}
          />
          <List.Item
            title="Private"
            description="Your key is stored only locally, and only exchanged with fly.io hosts."
            left={(props) => <List.Icon {...props} icon="do-not-disturb" />}
          />
        </View>
        <Button
          mode="contained"
          icon="account-arrow-right"
          style={{ marginTop: 20, marginBottom: 20 }}
          onPress={onContinuePressed}
        >
          Continue
        </Button>
      </ScrollView>
    </View>
  );
};

const LoginStack = createStackNavigator();
const LoginStackScreen = () => {
  return (
    <View style={{ width: "100%", flex: 1 }}>
      <LoginStack.Navigator
        initialRouteName="LoginIntro"
        screenOptions={{
          headerStatusBarHeight: 0,
          headerShown: false,
        }}
      >
        <LoginStack.Screen
          name="LoginIntro"
          component={LoginIntroView}
        />
        <LoginStack.Screen name="LoginForm" component={LoginForm} />
      </LoginStack.Navigator>
    </View>
  );
};

const LoginForm = ({ onLoggedIn = () => {} }) => {
  const [apiKey, setApiKey] = useState("");
  const { apiClient, validateApiKey } = useContext(ApiContext);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const doLogin = async () => {
    debug("Logging in ....");
    setIsLoggingIn(true);
    try {
      await validateApiKey(apiKey);
      await apiClient.login(username, password);
      const user = await apiClient.getCurrentUser();
      onLoggedIn(user);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <View style={styles.mainContent}>
      <TextInput
        style={styles.input}
        textContentType="password"
        secureTextEntry
        placeholder="API key"
        autoCompleteType="password"
        autoCorrect={false}
        value={apiKey}
        editable={!isLoggingIn}
        onChangeText={setApiKey}
      />
      <Button
        mode="contained"
        onPress={doLogin}
        disabled={isLoggingIn}
        style={styles.loginButton}
      >
        {isLoggingIn ? "Logging In..." : "Log In"}
      </Button>
    </View>
  );
};

export default function LoginView({ route, navigation }) {
  const onLoggedIn = async (user) => {
    debug("User logged in:", user);
    // setUser(user);
    navigation.goBack();
  };

  const goBack = () => {
    navigation.goBack();
  };

  const getContent = () => {
    return (
      <View style={styles.mainContent}>
        <LoginStackScreen />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content title={"Please log in"} />
      </Appbar.Header>
      {getContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: DefaultTheme.colors.background,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  mainContent: {
    flex: 1,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 16,
  },
  appBar: {
    width: "100%",
  },
  input: {
    width: "100%",
    marginBottom: 8,
  },
  loginButton: {
    width: "100%",
    padding: 16,
  },
  registrationSubheader: {
    textTransform: "uppercase",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
});
