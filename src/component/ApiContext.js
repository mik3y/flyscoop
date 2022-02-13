import React, { useState } from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';

import ApiClient from '../lib/Api';
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
  const { appConfig, installationId, isInitialized, authToken } = useContext(SettingsContext);
  const [apiClient, setApiClient] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      setApiClient(null);
      return;
    }
    setApiClient(new ApiClient(authToken));
  }, [isInitialized, environment, appConfig, installationId, authToken]);

  useEffect(() => {
    async function load() {
      try {
        await apiClient.getViewer();
        setIsLoggedIn(true);
      } catch (e) {
        console.error(e);
      }
    }
    if (apiClient) {
      load();
    }
  }, [apiClient]);

  const validateApiKey = async (newApiKey) => {
    const c = new ApiClient(newApiKey);
    await c.getViewer();
  };

  return (
    <ApiContext.Provider
      value={{
        apiClient,
        validateApiKey,
        isLoggedIn,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const ApiContextConsumer = ApiContext.Consumer;
export default ApiContext;
