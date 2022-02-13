import { NavigationContainer } from '@react-navigation/native';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { ApiContextProvider } from './src/component/ApiContext';
import { EnvironmentContextProvider } from './src/component/EnvironmentContext';
import { OrganizationContextProvider } from './src/component/OrganizationContext';
import { SettingsContextProvider } from './src/component/SettingsContext';
import Bootloader from './src/view/Bootloader';

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
  },
};

export default function App() {
  return (
    <EnvironmentContextProvider>
      <SettingsContextProvider>
        <ApiContextProvider>
          <OrganizationContextProvider>
            <SafeAreaProvider>
              <NavigationContainer>
                <PaperProvider
                  theme={theme}
                  settings={{
                    icon: (props) => <FontAwesome5 {...props} />,
                  }}
                >
                  <Bootloader />
                </PaperProvider>
              </NavigationContainer>
            </SafeAreaProvider>
          </OrganizationContextProvider>
        </ApiContextProvider>
      </SettingsContextProvider>
    </EnvironmentContextProvider>
  );
}
