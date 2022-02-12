import React, { useContext, useEffect, useState } from 'react';

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Title } from 'react-native-paper';

import ApiContext from '../component/ApiContext';
import LoadingZone from '../component/LoadingZone';
import MetricsCard from '../component/MetricsCard';
import { LongDateAndTime } from '../component/TimeUtil';
import ApiClient from '../lib/Api';
import GlobalStyles from '../lib/GlobalStyles';
import { getLogger } from '../lib/Logging';

const debug = getLogger('AppDetailView');

const Section = ({ children }) => {
  return <View style={styles.section}>{children}</View>;
};

const RegionStatusCard = ({ region, allocations }) => {
  const totalAllocations = allocations.length;
  const healthyAllocations = allocations.filter((a) => a.healthy).length;

  return (
    <Card style={{ marginBottom: 20 }}>
      <Card.Title title={region.code.toUpperCase()} />
      <Card.Content>
        <Text>
          {healthyAllocations}/{totalAllocations} healthy
        </Text>
      </Card.Content>
    </Card>
  );
};

const AppSummarySection = ({ app, appDetail }) => {
  if (!app) {
    return null;
  }

  const scaleListItems =
    appDetail && appDetail.taskGroupCounts.length
      ? appDetail.taskGroupCounts.map((tg) => {
          return (
            <Text key={tg.name}>
              {tg.name}×{tg.count}
            </Text>
          );
        })
      : null;

  const scaleList = scaleListItems ? <Text>({scaleListItems})</Text> : null;

  return (
    <Section>
      {app.currentRelease && (
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.textLabel}>Version: </Text>
          <Text>{`v${app.currentRelease.version}`}</Text>
        </View>
      )}
      {app.currentRelease && (
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.textLabel}>Deployed: </Text>
          <Text>
            <LongDateAndTime datetime={app.currentRelease.createdAt} />
          </Text>
        </View>
      )}
      {appDetail && (
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.textLabel}>Scale: </Text>
          <Text>
            {appDetail.vmSize.name} {scaleList}
          </Text>
        </View>
      )}
    </Section>
  );
};

const AppMetricsSection = ({ appDetail }) => {
  if (!appDetail) {
    return null;
  }
  return (
    <Section>
      <MetricsCard
        app={appDetail}
        plots={[
          { query: ApiClient.METRIC_QUERIES.data_sent(appDetail), color: 'red' },
          { query: ApiClient.METRIC_QUERIES.data_recv(appDetail), color: 'green' },
        ]}
        legend={['sent', 'recd']}
      />
    </Section>
  );
};

const AppActivitySection = ({ appDetail }) => {
  if (!appDetail) {
    return null;
  }
  const { changes } = appDetail;
  if (!changes || !changes.nodes.length) {
    return null;
  }

  const changeList = changes.nodes.slice(0, 10).map((change) => {
    return (
      <View key={change.id} style={{ marginBottom: 10 }}>
        <Text style={styles.activityTitle}>{change.description}</Text>
        <Text style={styles.activityDate}>
          <LongDateAndTime datetime={change.createdAt} />
        </Text>
      </View>
    );
  });
  return (
    <Section>
      <Card>
        <Card.Title title={'Activity'} />
        <Card.Content>{changeList}</Card.Content>
      </Card>
    </Section>
  );
};

const AppRegionalStatusSection = ({ app, appDetail }) => {
  if (!appDetail) {
    return null;
  }
  const regions = app.regions;
  const statusByRegion = regions.map((region) => {
    return (
      <RegionStatusCard
        key={region.code}
        region={region}
        allocations={appDetail.allocations.filter((a) => a.region === region.code)}
      />
    );
  });
  return <Section>{statusByRegion}</Section>;
};

const AppDetailView = ({ route, navigation }) => {
  const { app } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const { apiClient } = useContext(ApiContext);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const newDetail = await apiClient.getAppDetail(app.name);
        setDetail(newDetail);
      } catch (e) {
        console.error(e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [app]);

  const doViewLogs = () => {
    navigation.navigate('Modals', {
      screen: 'AppLogs',
      params: { app },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card
          style={[
            styles.section,
            {
              backgroundColor: '#fff',
            },
          ]}
        >
          <Card.Content>
            <Title style={GlobalStyles.appTitle}>{app.name}</Title>
            <AppSummarySection app={app} appDetail={detail} />
          </Card.Content>
        </Card>
        <Section>
          <Button mode={'contained'} icon="note-text" onPress={doViewLogs}>
            View Logs
          </Button>
        </Section>
        <LoadingZone isLoading={isLoading}>
          <AppMetricsSection appDetail={detail} />
          <AppActivitySection appDetail={detail} />
          <AppRegionalStatusSection app={app} appDetail={detail} />
        </LoadingZone>
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
  section: {
    marginBottom: 20,
  },
  scrollView: {
    width: '100%',
    padding: 20,
  },
  textLabel: {
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: 250,
  },
  activityTitle: {
    fontWeight: 'bold',
  },
  activityDate: {},
});

export default AppDetailView;
