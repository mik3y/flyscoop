import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card, Title } from "react-native-paper";
import ApiContext from "../component/ApiContext";
import { getLogger } from "../lib/Logging";

import { LongDateAndTime } from "../component/TimeUtil";
import MapView from "./MapView";

const debug = getLogger("AppDetailView");

const ChangesList = ({ changes }) => {
  if (!changes.length) {
    return null;
  }
  const changeList = changes.slice(0, 10).map((change) => {
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
    <Card style={{ marginTop: 20 }}>
      <Card.Title title={"Activity"} />
      <Card.Content>{changeList}</Card.Content>
    </Card>
  );
};

const RegionStatusCard = ({ region, allocations }) => {
  const totalAllocations = allocations.length;
  const healthyAllocations = allocations.filter(a => a.healthy).length;

  return (
    <Card style={{ marginTop: 20 }}>
      <Card.Title title={region.code.toUpperCase()} />
      <Card.Content>
        <Text>{healthyAllocations}/{totalAllocations} healthy</Text>
      </Card.Content>
    </Card>
  );
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
        setDetail(await apiClient.getAppDetail(app.name));
      } catch (e) {
        console.error(e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const regions = app.regions;

  const doViewLogs = () => {
    navigation.navigate("Modals", {
      screen: "AppLogs",
      params: { app },
    });
  };

  const currentReleaseBox = app.currentRelease ? (
    <>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.textLabel}>Version: </Text>
        <Text>{`v${app.currentRelease.version}`}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.textLabel}>Deployed: </Text>
        <Text>
          <LongDateAndTime datetime={app.currentRelease.createdAt} />
        </Text>
      </View>
    </>
  ) : null;

  const changesBox =
    detail && detail.changes && detail.changes.nodes ? (
      <ChangesList changes={detail.changes.nodes} />
    ) : null;


  const statusByRegion = regions.map((region) => {
    return (
      <RegionStatusCard
        key={region.code}
        region={region}
        allocations={detail ? detail.allocations.filter(a => a.region === region.code) : []}
      />
    );
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Title>{app.name}</Title>
        {currentReleaseBox}
        <MapView regions={regions} style={styles.map} />
        <Button
          style={{ marginTop: 20 }}
          mode={"contained"}
          icon="note-text"
          onPress={doViewLogs}
        >
          View Logs
        </Button>
        {statusByRegion}
        {changesBox}
        <View style={{ marginBottom: 20 }}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D1C4E9",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    width: "100%",
    padding: 20,
  },
  cardStyle: {
    width: "100%",
    marginBottom: 20,
  },
  statusIcon: {
    fontSize: 20,
  },
  statusIconHealthy: {
    color: "#1DB954",
  },
  statusIconDead: {
    color: "#777777",
  },
  statusIconUnhealthy: {
    color: "#ed5858",
  },
  statusIconUnknown: {
    color: "#787878",
  },
  textLabel: {
    fontWeight: "bold",
  },
  map: {
    width: "100%",
    height: 250,
    marginBottom: 20,
  },
  activityTitle: {
    fontWeight: "bold",
  },
  activityDate: {},
});

export default AppDetailView;
