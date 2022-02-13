import React, { useContext, useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { orderBy } from 'lodash';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Caption, Card, Chip, Portal } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import ApiContext from '../component/ApiContext';
import EmptyState from '../component/EmptyState';
import OrganizationContext from '../component/OrganizationContext';
import { TimeSince } from '../component/TimeUtil';
import GlobalStyles from '../lib/GlobalStyles';
import { getLogger } from '../lib/Logging';

const debug = getLogger('AppsView');

const RegionList = ({ regions, maxRegions = 3 }) => {
  const chips = regions.slice(0, maxRegions).map((region) => {
    return (
      <Chip key={region.code}>
        <Text style={{ fontVariant: ['small-caps'] }}>{region.code}</Text>
      </Chip>
    );
  });

  const numExtraRegions = Math.max(0, regions.length - maxRegions);
  const extraBits =
    numExtraRegions > 0 ? (
      <View style={{ marginLeft: 6 }}>
        <Text>&amp; {numExtraRegions} more</Text>
      </View>
    ) : null;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {chips}
      {extraBits}
    </View>
  );
};

const AppCard = ({ app, onPress = () => {}, ...cardProps }) => {
  let appIcon;
  switch (app.status) {
    case 'running':
      appIcon = (
        <FontAwesome5 name={'check-circle'} style={[styles.statusIcon, styles.statusIconHealthy]} />
      );
      break;
    case 'pending':
      appIcon = (
        <FontAwesome5 name={'dot-circle'} style={[styles.statusIcon, styles.statusIconPending]} />
      );
      break;
    case 'dead':
      appIcon = <FontAwesome5 name={'skull'} style={[styles.statusIcon, styles.statusIconDead]} />;
      break;
    default:
      appIcon = (
        <FontAwesome5
          name={'exclamation-circle'}
          style={[styles.statusIcon, styles.statusIconUnknown]}
        />
      );
  }

  let subtitle;
  if (app.currentRelease) {
    const { version, createdAt } = app.currentRelease;
    subtitle = (
      <View style={{ flexDirection: 'row' }}>
        <Text>{`v${version} • `}</Text>
        <TimeSince datetime={createdAt} />
      </View>
    );
  } else {
    subtitle = app.hostname;
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card {...cardProps} key={app.name} style={styles.cardStyle}>
        <Card.Title
          title={app.name}
          titleStyle={GlobalStyles.appTitle}
          subtitle={subtitle}
          left={(props) => React.cloneElement(appIcon, props)}
          leftStyle={{
            margin: 0,
            padding: 0,
            width: 20,
            alignContent: 'flex-end',
          }}
        />
        <Card.Content>
          <View>
            <RegionList regions={app.regions} />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const AppsView = () => {
  const [apps, setApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { apiClient } = useContext(ApiContext);
  const { currentOrganization } = useContext(OrganizationContext);

  const navigation = useNavigation();

  async function fetchApps() {
    debug('Loading apps...');
    setIsLoading(true);
    try {
      const allApps = await apiClient.getApps();
      const orgApps = allApps.filter((a) => a.organization.id === currentOrganization.id);

      // Sory apps by most recently released.
      // TODO(mikey): Control this filter in the view.
      const sortedApps = orderBy(orgApps, ['currentRelease.createdAt'], ['desc']);

      setApps(sortedApps);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (currentOrganization) {
      fetchApps();
    } else {
      setApps([]);
    }
  }, [currentOrganization]);

  const onAppSelected = (app) => {
    navigation.navigate('AppTabs', { app });
  };

  const getAppList = () => {
    if (!apps.length) {
      return <EmptyState message={'No apps found in this organization.'} />;
    }

    return apps.map((app) => {
      return <AppCard key={app.name} app={app} onPress={() => onAppSelected(app)} elevation={4} />;
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchApps} />}
      >
        {getAppList()}
        <View style={{ marginBottom: 30 }}></View>
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
  cardStyle: {
    width: '100%',
    marginBottom: 20,
  },
  statusIcon: {
    fontSize: 20,
  },
  statusIconHealthy: {
    color: '#1DB954',
  },
  statusIconPending: {
    color: '#f7a35e',
  },
  statusIconDead: {
    color: '#777777',
  },
  statusIconUnhealthy: {
    color: '#ed5858',
  },
  statusIconUnknown: {
    color: '#787878',
  },
});

export default AppsView;
