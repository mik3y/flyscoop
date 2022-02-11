import React, { useState } from "react";
import { useContext } from "react";
import SettingsContext from "./SettingsContext";
import EnvironmentContext from "./EnvironmentContext";
import ApiClient from "../lib/Api";
import { useEffect } from "react";

/**
 * ApiContext exposes an ApiClient according to the current config.
 */
const ApiContext = React.createContext({
  apiClient: null,
});

export const ApiContextProvider = function ({ children }) {
  const { environment } = useContext(EnvironmentContext);
  const { appConfig, installationId, isInitialized, authToken } =
    useContext(SettingsContext);
  const [apiClient, setApiClient] = useState(null);

  useEffect(() => {
    if (!isInitialized) {
      setApiClient(null);
      return;
    }
    setApiClient(
      new ApiClient(
        environment.apiBaseUrl,
        installationId,
        authToken
      )
    );
  }, [isInitialized, environment, appConfig, installationId, authToken]);

  return (
    <ApiContext.Provider
      value={{
        apiClient,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const ApiContextConsumer = ApiContext.Consumer;
export default ApiContext;
