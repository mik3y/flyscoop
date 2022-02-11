import { ApiContextProvider } from "./src/component/ApiContext";
import { EnvironmentContextProvider } from "./src/component/EnvironmentContext";
import { SettingsContextProvider } from "./src/component/SettingsContext";

import AppMainView from "./src/view/AppMain";

export default function App() {
  return (
    <EnvironmentContextProvider>
      <SettingsContextProvider>
        <ApiContextProvider>
          <AppMainView />
        </ApiContextProvider>
      </SettingsContextProvider>
    </EnvironmentContextProvider>
  );
}
