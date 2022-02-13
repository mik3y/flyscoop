import React, { useCallback, useContext, useEffect, useState } from 'react';

import * as Clipboard from 'expo-clipboard';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Title } from 'react-native-paper';

import ApiContext from '../component/ApiContext';
import CurrentAppContext from '../component/CurrentAppContext';
import { LongDateAndTime } from '../component/TimeUtil';
import GlobalStyles from '../lib/GlobalStyles';
import { useTimeout } from '../lib/Hooks';
import { getLogger } from '../lib/Logging';

const MAX_LOGS_TO_SHOW = 1000;
const POLL_INTERVAL_MILLIS = 5000;

const debug = getLogger('AppLogsView');

const LogEntry = ({ log, isExpanded = false, style }) => {
  const logStyles = isExpanded ? [styles.expandedLog, style] : [style];
  return (
    <View style={logStyles} key={log.id}>
      <Text style={GlobalStyles.logText}>{log.attributes.message}</Text>
      {isExpanded ? (
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={{
              marginRight: 4,
              textTransform: 'uppercase',
              backgroundColor: '#888',
              borderRadius: 3,
              paddingLeft: 3,
              paddingRight: 3,
            }}
          >
            {log.attributes.level}
          </Text>
          <LongDateAndTime style={styles.logDateTime} datetime={log.attributes.timestamp} />
        </View>
      ) : null}
    </View>
  );
};

const AppLogsView = ({ route, navigation }) => {
  const { app } = useContext(CurrentAppContext);
  const [logs, setLogs] = useState([]);
  const [token, setToken] = useState(null);
  const [refreshing, setRefreshing] = React.useState(true);
  const { apiClient } = useContext(ApiContext);
  const [nextTimeout, setNextTimeout] = useState(null);
  const [expandedLogId, setExpandedLogId] = useState(null);

  const logKeys = new Set(logs.map((l) => l.attributes.id));

  const fetchLogs = async () => {
    debug(`Fetching logs, token=${token}`);
    setNextTimeout(null);
    try {
      const response = await apiClient.getLogs({ appName: app.name, token });
      const { lines: newLines, nextToken } = response;
      const newLogs = [...logs];
      const originalLogsLength = newLogs.length;
      newLines.forEach((logLine) => {
        if (!logKeys.has(logLine.attributes.id)) {
          newLogs.push(logLine);
        }
      });
      const logsAdded = newLogs.length - originalLogsLength;
      debug(
        `Fetched ${logsAdded} new log lines, ${originalLogsLength} total, new token: ${nextToken}`
      );
      setLogs(newLogs.slice(0, MAX_LOGS_TO_SHOW));
      setToken(nextToken);
    } finally {
      setRefreshing(false);
      setNextTimeout(POLL_INTERVAL_MILLIS);
    }
  };

  useTimeout(() => fetchLogs(), nextTimeout);

  useEffect(() => {
    setNextTimeout(0);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setNextTimeout(0);
  }, []);

  const onLogEntryPress = (log) => {
    if (log.id === expandedLogId) {
      setExpandedLogId(null);
    } else {
      setExpandedLogId(log.id);
    }
  };

  const onLogEntryLongPress = (log) => {
    // TODO(mikey): Show a "log copied!" toast
    Clipboard.setString(log.attributes.message);
  };

  const logItems = logs.map((log, idx) => {
    const style = idx % 2 ? styles.logLineEven : styles.logLineOdd;
    const isExpanded = log.id === expandedLogId;
    return (
      <TouchableOpacity
        onPress={() => onLogEntryPress(log)}
        onLongPress={() => onLogEntryLongPress(log)}
      >
        <LogEntry style={style} log={log} key={log.id} isExpanded={isExpanded} />
      </TouchableOpacity>
    );
  });
  logItems.reverse();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {logItems}
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
    padding: 0,
  },
  logLineEven: {
    backgroundColor: '#00000033',
    padding: 6,
  },
  logLineOdd: {
    backgroundColor: '#00000011',
    padding: 6,
  },
  logDateTime: {
    fontWeight: 'bold',
  },
  expandedLog: {
    backgroundColor: 'lightgreen',
  },
});

export default AppLogsView;
