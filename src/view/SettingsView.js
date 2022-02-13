import { useContext } from 'react';

import Constants from 'expo-constants';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, RadioButton } from 'react-native-paper';

import EnvironmentContext, { ENVIRONMENTS } from '../component/EnvironmentContext';
import SettingsContext from '../component/SettingsContext';

export default SettingsView = () => {
  const { resetInstallation } = useContext(SettingsContext);

  const { environment, isExpoGo, setEnvironment } = useContext(EnvironmentContext);

  const version = Constants.manifest.version;
  const releaseId = Constants.manifest.extra?.expoClient?.releaseId || '';
  const revisionId = Constants.manifest.extra?.expoClient?.revisionId || '';

  const getEnvSwitcher = () => {
    if (!isExpoGo) {
      return null;
    }
    const buttons = Object.entries(ENVIRONMENTS).map(([envName]) => {
      return (
        <View key={envName} style={styles.radioContainer}>
          <RadioButton key={envName} value={envName} />
          <Text>{envName}</Text>
        </View>
      );
    });
    return (
      <RadioButton.Group
        onValueChange={(newValue) => setEnvironment(newValue)}
        value={environment.name}
      >
        {buttons}
      </RadioButton.Group>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.cardStyle}>
          <Card.Title title={'About'} />
          <Card.Content>
            <Text>
              FlyTouch: A simple management app for Fly.io. Version {version}{' '}
              {releaseId ? `release ${releaseId}` : null}{' '}
              {revisionId ? `revision ${revisionId}` : null}
            </Text>
            {getEnvSwitcher()}
            <Button
              style={{ marginTop: 20 }}
              icon="globe"
              onPress={() => Linking.openURL('https://FlyTouch.app/')}
            >
              Visit FlyTouch.app
            </Button>
          </Card.Content>
        </Card>
        <Card style={styles.cardStyle}>
          <Card.Title title={'DangerZone™'} />
          <Card.Content>
            <Button icon="sign-out-alt" mode="contained" onPress={() => resetInstallation()}>
              Reset app
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#607D8B',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingStart: 8,
    paddingEnd: 8,
    borderRadius: 4,
  },
  scrollView: {
    width: '100%',
    padding: 20,
  },
  settingLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    marginLeft: 8,
  },
  cardStyle: {
    width: '100%',
    marginBottom: 20,
  },
});
