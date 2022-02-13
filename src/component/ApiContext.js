import React, { useState } from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';

import ApiClient from '../lib/Api';
import LoginView from '../view/LoginView';
import SplashView from '../view/SplashView';
import EnvironmentContext from './EnvironmentContext';
import LoadingZone from './LoadingZone';
import SettingsContext from './SettingsContext';

/**
 * ApiContext exposes an ApiClient according to the current config.
 */
const ApiContext = React.createContext({
  apiClient: null,
});

export const ApiContextProvider = function ({ children }) {
  const { environment } = useContext(EnvironmentContext);
  const { installationId, isInitialized, authToken, setAuthToken } = useContext(SettingsContext);
  const [apiClient, setApiClient] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // When the provider receives an auth token, it asynchronously validates
  // it before deciding we're logged in (token is valid). This tracks
  // that brief window of time.
  const [authTokenValidated, setAuthTokenValidated] = useState(false);

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
      if (isInitialized && installationId && authToken) {
        const newApiClient = await buildValidatedApiClient(authToken);
        setApiClient(newApiClient);
        setIsLoggedIn(!!newApiClient);
        setAuthTokenValidated(true);
      } else {
        setApiClient(null);
        setIsLoggedIn(false);
        setAuthTokenValidated(false);
      }
    }
    load();
  }, [isInitialized, installationId, authToken]);

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

  const getComponentToRender = () => {
    if (!isInitialized) {
      // We haven't (potentially) loaded our API key from storage. Just wait
      // for that to come online.
      return <SplashView message={'Loading credentials...'} />;
    } else if (authTokenValidated && !isLoggedIn) {
      // We've loaded a key, and it's either null or invalid. Show the login view.
      return <LoginView onApiKeySet={doLogin} validateAuthToken={validateAuthToken} />;
    } else {
      // Happy path: Onward to the rest of the app!
      return children;
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
      {getComponentToRender()}
    </ApiContext.Provider>
  );
};

export const ApiContextConsumer = ApiContext.Consumer;
export default ApiContext;
