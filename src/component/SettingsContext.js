import React, { useContext, useState, useEffect } from "react";
import Storage from "../lib/Storage";
import EnvironmentContext from "./EnvironmentContext";

/**
 * SettingsContext exposes various app settings, and handles persisting
 * them through a `Storage` instance.
 */
const SettingsContext = React.createContext({
  isInitialized: false,
  installationId: null,
});

export const SettingsContextProvider = function ({ children }) {
  const { environment } = useContext(EnvironmentContext);
  const [isInitialized, setIsInitialized] = useState(false);
  const [storage, setStorage] = useState(null);
  const [installationId, setInstallationId] = useState(null);
  const [authToken, setAuthTokenInternal] = useState(null);

  const initialize = async () => {
    setIsInitialized(false);
    const s = new Storage(environment.name);
    setStorage(s);
    setInstallationId(await s.getInstallationId());
    setAuthTokenInternal(await s.getAuthToken());
    setIsInitialized(true);
  };

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [environment.name, isInitialized]);

  const resetInstallation = async () => {
    await storage.reset();
    setIsInitialized(false);  // triggers effect
  };

  const setAuthToken = async (newToken) => {
    setAuthTokenInternal(newToken);
    await storage.setAuthToken(newToken);
  };

  // Re-initialize any time envrionment changes. This is important because
  // our inner `Storage` instance takes and uses `environment.name` to
  // segregate storage.
  useEffect(() => {
    setIsInitialized(false);
    initialize();
  }, [environment.name]);

  return (
    <SettingsContext.Provider
      value={{
        isInitialized,
        installationId,
        resetInstallation,
        authToken,
        setAuthToken,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const SettingsContextConsumer = SettingsContext.Consumer;
export default SettingsContext;
