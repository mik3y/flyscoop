import React, { useState, useEffect } from "react";
import * as Sentry from "sentry-expo";
import Constants from "expo-constants";

const ENVIRONMENT_LOCAL = "local";
const ENVIRONMENT_STAGING = "staging";
const ENVIRONMENT_PROD = "production";

export const ENVIRONMENTS = {
  [ENVIRONMENT_LOCAL]: {
    name: ENVIRONMENT_LOCAL,
    sentryDsn: "",
  },
  [ENVIRONMENT_STAGING]: {
    name: ENVIRONMENT_STAGING,
    sentryDsn: "",
  },
  [ENVIRONMENT_PROD]: {
    name: ENVIRONMENT_PROD,
    sentryDsn: "",
  },
};

/**
 * EnvironmentContext exposes the current env.
 */
const EnvironmentContext = React.createContext({
  environment: ENVIRONMENTS[ENVIRONMENT_PROD],
});

export const EnvironmentContextProvider = function ({ children }) {
  const isExpoGo = Constants.appOwnership === "expo";
  const [envName, setEnvName] = useState(isExpoGo ? ENVIRONMENT_LOCAL : ENVIRONMENT_PROD);
  const environment = ENVIRONMENTS[envName];

  const setEnvironment = (newEnvName) => {
    if (!ENVIRONMENTS[newEnvName]) {
      throw new Error(`Invalid env name: ${newEnvName}`);
    }
    setEnvName(newEnvName);
  }

  useEffect(() => {
    if (environment.sentryDsn) {
      Sentry.init({
        dsn: environment.sentryDsn,
        enableInExpoDevelopment: false,
        debug: true,
      });
    }
  }, [envName]);

  return (
    <EnvironmentContext.Provider
      value={{
        environment,
        setEnvironment,
        isExpoGo,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
};

export const EnvironmentContextConsumer = EnvironmentContext.Consumer;
export default EnvironmentContext;
