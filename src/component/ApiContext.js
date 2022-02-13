import React, { useState } from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';

import ApiClient from '../lib/Api';
import LoginView from '../view/LoginView';
import EnvironmentContext from './EnvironmentContext';
import SettingsContext from './SettingsContext';

/**
 * ApiContext exposes an ApiClient according to the current config.
 */
const ApiContext = React.createContext({
  apiClient: null,
});

export const ApiContextProvider = function ({ children }) {
  const { environment } = useContext(EnvironmentContext);
  const { appConfig, installationId, isInitialized, authToken, setAuthToken } =
    useContext(SettingsContext);
  const [apiClient, setApiClient] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const validateAuthToken = async (newAuthToken) => {
    try {
      const c = new ApiClient(newAuthToken);
      const result = await c.getViewer();
      return true;
    } catch (e) {
      return false;
    }
  };

  const buildValidatedApiClient = async (newAuthToken) => {
    try {
      const c = new ApiClient(newAuthToken);
      await c.getViewer();
      return c;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    async function load() {
      if (!isInitialized) {
        setApiClient(null);
      }
      const newApiClient = await buildValidatedApiClient(authToken);
      setApiClient(newApiClient);
      setIsLoggedIn(!!newApiClient);
    }
    load();
  }, [isInitialized, environment, appConfig, installationId, authToken]);

  useEffect(() => {
    async function load() {
      try {
        await apiClient.getViewer();
        // setIsLoggedIn(true);
      } catch (e) {
        console.error(e);
      }
    }
    if (apiClient) {
      load();
    }
  }, [apiClient]);

  const doLogin = async (newAuthToken) => {
    const isValid = await validateAuthToken(newAuthToken);
    if (isValid) {
      console.log('token is valid');
      setAuthToken(newAuthToken);
    }
  };

  return (
    <ApiContext.Provider
      value={{
        apiClient,
        isLoggedIn,
        validateAuthToken,
      }}
    >
      {isLoggedIn ? (
        children
      ) : (
        <LoginView onApiKeySet={doLogin} validateAuthToken={validateAuthToken} />
      )}
    </ApiContext.Provider>
  );
};

export const ApiContextConsumer = ApiContext.Consumer;
export default ApiContext;
