import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { ApiContextProvider } from "./src/component/ApiContext";
import { EnvironmentContextProvider } from "./src/component/EnvironmentContext";
import { SettingsContextProvider } from "./src/component/SettingsContext";
import Bootloader from "./src/view/Bootloader";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import dayjs from 'dayjs';

import advancedFormat from 'dayjs/plugin/advancedFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

// dayjs plugin setup
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

// TODO(mikey): Use our very own special colors here.
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#673AB7',
    accent: '#607D8B',
    text: '#212121',
    background: '#D1C4E9',
    // $primary-color-text:   #FFFFFF
    // $secondary-text-color: #757575
    // $divider-color:        #BDBDBD
  }
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
