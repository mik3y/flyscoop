import React, { useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { Appbar, Button, DefaultTheme, TextInput } from 'react-native-paper';

const LoginForm = ({ onApiKeySet, validateAuthToken }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const doLogin = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    try {
      const isValid = await validateAuthToken(apiKey);
      if (!isValid) {
        setErrorMessage('Invalid token');
        return;
      }
      await onApiKeySet(apiKey);
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
      {errorMessage && <Text>{errorMessage}</Text>}
      <Button mode="contained" onPress={doLogin} disabled={isLoggingIn} style={styles.loginButton}>
        {isLoggingIn ? 'Logging In...' : 'Log In'}
      </Button>
    </View>
  );
};

export default function LoginView({ onApiKeySet, validateAuthToken }) {
  const getContent = () => {
    return (
      <View style={styles.mainContent}>
        <LoginForm onApiKeySet={onApiKeySet} validateAuthToken={validateAuthToken} />
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
