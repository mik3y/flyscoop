import { useContext } from 'react';

import Constants from 'expo-constants';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card } from 'react-native-paper';

import SettingsContext from '../component/SettingsContext';

export default SettingsView = () => {
  const { resetInstallation } = useContext(SettingsContext);

  const version = Constants.manifest.version;
  const releaseId = Constants.manifest.extra?.expoClient?.releaseId || '';
  const revisionId = Constants.manifest.extra?.expoClient?.revisionId || '';

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.cardStyle}>
          <Card.Title title={'About'} />
          <Card.Content>
            <Text>
              FlyScoop: A simple management app for Fly.io. Version {version}{' '}
              {releaseId ? `release ${releaseId}` : null}{' '}
              {revisionId ? `revision ${revisionId}` : null}
            </Text>
            <Button
              style={{ marginTop: 20 }}
              icon="globe"
              mode={'outlined'}
              onPress={() => Linking.openURL('https://flyscoop.app/')}
            >
              Homepage
            </Button>
            <Button
              style={{ marginTop: 20 }}
              icon="file-alt"
              mode={'outlined'}
              onPress={() => Linking.openURL('https://flyscoop.app/privacy/')}
            >
              Privacy Policy
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
