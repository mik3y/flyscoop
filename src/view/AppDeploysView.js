import React, { useContext, useEffect, useState } from 'react';

import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';

import ApiContext from '../component/ApiContext';
import CurrentAppContext from '../component/CurrentAppContext';
import { LongDateAndTime } from '../component/TimeUtil';
import { getLogger } from '../lib/Logging';

const debug = getLogger('AppLogsView');

const AppDeploysView = ({ route, navigation }) => {
  const { app } = useContext(CurrentAppContext);
  const { apiClient } = useContext(ApiContext);
  const [isLoading, setIsLoading] = useState(true);
  const [releases, setReleases] = useState([]);

  const fetchReleases = async () => {
    setIsLoading(true);
    try {
      setReleases(await apiClient.getAppReleases(app.name));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReleases();
  }, [app]);

  const deployItems = releases.map((release) => {
    const releaseTitle = `v${release.version}`;
    return (
      <Card key={release.id} style={{ marginBottom: 20 }}>
        <Card.Title title={releaseTitle} />
        <Card.Content>
          <LongDateAndTime datetime={release.createdAt} />
        </Card.Content>
      </Card>
    );
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchReleases} />}
      >
        {deployItems}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1C4E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    width: '100%',
    padding: 20,
  },
});

export default AppDeploysView;
