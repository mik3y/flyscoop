import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { ApiContextProvider } from "./src/component/ApiContext";
import { EnvironmentContextProvider } from "./src/component/EnvironmentContext";
import { SettingsContextProvider } from "./src/component/SettingsContext";
import Bootloader from "./src/view/Bootloader";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

// TODO(mikey): Use our very own special colors here.
const theme = {
  ...DefaultTheme,
};

export default function App() {
  return (
    <EnvironmentContextProvider>
      <SettingsContextProvider>
        <ApiContextProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <PaperProvider theme={theme}>
                <Bootloader />
              </PaperProvider>
            </NavigationContainer>
          </SafeAreaProvider>
        </ApiContextProvider>
      </SettingsContextProvider>
    </EnvironmentContextProvider>
  );
}
