import { useContext, useEffect, useRef, useState } from 'react';

import AppLoading from 'expo-app-loading';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { Image, StyleSheet, Text, View } from 'react-native';

import logo from '../../assets/icon.png';
import ApiContext from '../component/ApiContext';
import SettingsContext from '../component/SettingsContext';
import { getLogger } from '../lib/Logging';
import MainView from './MainView';

const debug = getLogger('BootloaderView');

const SPLASH_SCREEN_DEFAULT_TIMEOUT_MILLIS = 1500;

/**
 * Shows a splash screen until the app is ready.
 *
 * Should only show up on first launch, or after erase.
 */
export default BootloaderView = () => {
  const { isInitialized } = useContext(SettingsContext);
  const { apiClient } = useContext(ApiContext);
  const [showingSplashScreen, setShowingSplashScreen] = useState(!isInitialized);
  const setShowingSplashScreenRef = useRef(setShowingSplashScreen);
  const [checkinComplete, setCheckinComplete] = useState(false);
  const [appIsUpToDate, setAppIsUpToDate] = useState(false);
  const [statusText, setStatusText] = useState('');

  const isExpoGo = Constants.appOwnership === 'expo';

  const performFirstLaunchCheckin = async () => {
    // TODO(mikey): Phone home to ensure app is valid.
    setCheckinComplete(true);
  };

  const checkForUpdates = async () => {
    if (isExpoGo) {
      debug('Running on Go, skipping update check.');
      setAppIsUpToDate(true);
      return;
    }

    try {
      debug('Checking for updates...');
      const result = Updates.checkForUpdateAsync();
      if (!result.isAvailable) {
        debug('App is up-to-date!');
        setAppIsUpToDate(true);
        return;
      }
      debug('Fetching latest update ...');
      await Updates.fetchUpdateAsync();
      debug('Triggering reload..');
      await Updates.reloadAsync();
    } catch (e) {
      debug(`Error checking for updates, soldiering on: ${e}`);
      setAppIsUpToDate(true);
    }
  };

  // Stages of bootloader initialization:
  //   1 - Initialize storage (`isInitialized` -> true)
  //   2 - Initialize apiClient (`apiClient` -> non-null; happens automatically)
  //   3 - Perform on-start checkin (`checkinComplete` -> true)
  //   4 - Look for expo updates (`appIsUpToDate` -> true)
  //   5 - Dismiss splash screen

  // Stage 1: Initialize storage.
  useEffect(() => {
    async function loadStage1() {
      setShowingSplashScreen(true);
      debug('Storage is not initialized, waiting...');
      setStatusText('Starting up...');
    }
    if (!isInitialized) {
      setCheckinComplete(false);
      setAppIsUpToDate(false);
      loadStage1();
    }
  }, [isInitialized]);

  // Stage 2 & 3: Wait for api client & perform initial checkin.
  useEffect(() => {
    async function loadStage3() {
      debug('Initialized storage, performing api checkin');
      setStatusText('Optimizing experience...');
      await performFirstLaunchCheckin();
    }
    if (isInitialized && apiClient) {
      loadStage3();
    }
  }, [isInitialized, apiClient]);

  // Stage 4: Attempt update check
  useEffect(() => {
    async function loadStage4() {
      debug('Api checkin complete, checking for updates');
      setStatusText('Fixing things up...');
      await checkForUpdates();
    }
    if (isInitialized && apiClient && checkinComplete) {
      loadStage4();
    }
  }, [isInitialized, apiClient, checkinComplete]);

  // Stage 5: Dismiss splash screen
  useEffect(() => {
    async function loadStage5() {
      debug('Init is done, lingering on splash screen for a bit.');
      setStatusText('Getting ready to fly...');
      setTimeout(() => {
        debug('Clearing splash screen');
        setShowingSplashScreenRef.current(false);
      }, SPLASH_SCREEN_DEFAULT_TIMEOUT_MILLIS);
    }
    if (isInitialized && apiClient && checkinComplete && appIsUpToDate) {
      loadStage5();
    }
  }, [isInitialized, apiClient, checkinComplete, appIsUpToDate]);

  // When mounted, the <AppLoading /> component keeps the native
  // splash screen visible to prevent a flash. Let's keep it mounted for
  // the short interval while not initialized.
  const appLoading = !isInitialized ? <AppLoading /> : null;

  // Show the splash screen.
  if (!isInitialized || showingSplashScreen)
    return (
      <View style={styles.container}>
        {appLoading}
        <Image source={logo} style={{ width: 400, height: 400 }} />
        {statusText ? <Text style={styles.statusText}>{statusText}</Text> : null}
      </View>
    );

  // Show the main app.
  return <MainView />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#605770',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: '#aaa',
  },
});
