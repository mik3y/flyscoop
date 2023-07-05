import React, { useContext, useState } from 'react';

import { Linking, StyleSheet, Text, View } from 'react-native';
import { Appbar, Button, Caption, DefaultTheme, TextInput } from 'react-native-paper';

import ApiContext from '../component/ApiContext';

const LoginForm = () => {
  const [newApiKey, setNewApiKey] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { setApiKey } = useContext(ApiContext);

  const doLogin = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    try {
      await setApiKey(newApiKey);
    } catch (e) {
      setErrorMessage('Invalid token');
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
        placeholder="Access token"
        autoCompleteType="password"
        autoCorrect={false}
        value={newApiKey}
        editable={!isLoggingIn}
        onChangeText={setNewApiKey}
      />
      {errorMessage && <Text>{errorMessage}</Text>}
      <Button mode="contained" onPress={doLogin} disabled={isLoggingIn} style={styles.loginButton}>
        {isLoggingIn ? 'Logging In...' : 'Log In'}
      </Button>
      <View style={{ width: '100%', marginTop: 20, alignItems: 'center' }}>
        <Caption style={{ textAlign: 'center' }}>
          Input an access token to continue. In the Fly.io dashboard, visit Settings → Access Tokens
          to create a token.
        </Caption>
        <Button
          mode={'outlined'}
          style={{ marginTop: 20 }}
          icon={'external-link-alt'}
          onPress={() => Linking.openURL('https://web.fly.io/user/personal_access_tokens')}
        >
          Open Fly.io Dashboard
        </Button>
        <Button
          style={{ marginTop: 20 }}
          icon="file-alt"
          mode={'outlined'}
          onPress={() => Linking.openURL('https://flyscoop.app/privacy/')}
        >
          FlyScoop Privacy Policy
        </Button>
      </View>
    </View>
  );
};

export default function LoginView() {
  const getContent = () => {
    return (
      <View style={styles.mainContent}>
        <LoginForm />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.Content title={'Please log in'} />
      </Appbar.Header>
      {getContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: DefaultTheme.colors.background,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  mainContent: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 16,
  },
  appBar: {
    width: '100%',
  },
  input: {
    width: '100%',
    marginBottom: 8,
  },
  loginButton: {
    width: '100%',
    padding: 16,
  },
});
