import React, { useEffect, useRef } from 'react';

import { useIsFocused, useNavigation } from '@react-navigation/native';
import debugLibrary from 'debug';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { DefaultTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const debug = debugLibrary('skyscour.AirportView');

const MIN_ZOOM_LEVEL = 7.0;

export default function RegionMap({ regions, style = {} }) {
  const insets = useSafeAreaInsets();
  const mapElement = useRef(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const region = null;

  const getZoomLevel = () => {
    if (!region) {
      return null;
    }
    const screenWidth = Math.round(Dimensions.get('window').width);
    const zoomLevel = Math.log2(360 * (screenWidth / 256 / region.longitudeDelta)) + 1;
    return zoomLevel;
  };

  const onMapRegionChangeComplete = async (region) => {
    if (!isFocused) {
      return;
    }
    debug('Map region changed:', region);
    debug('Zoom level:', getZoomLevel());
  };

  const showRegion = async (region) => {
    debug('Showing app: ', region);
    // navigation.navigate("AirportDetail", { designator });
  };

  useEffect(() => {
    if (mapElement.current) {
      mapElement.current.fitToSuppliedMarkers(
        regions.map((r) => r.code),
        {
          edgePadding: 120,
          animated: false,
        }
      );
    }
  }, [mapElement]);

  const markers = regions.map((region) => (
    <Marker
      identifier={region.code}
      key={region.code}
      coordinate={{
        latitude: region.latitude,
        longitude: region.longitude,
      }}
      title={region.code.toUpperCase()}
      description={region.name}
      pinColor={'green'}
      onCalloutPress={() => showRegion(region)}
    />
  ));

  return (
    <View style={styles.container}>
      <MapView
        ref={mapElement}
        style={[styles.map, style]}
        showsUserLocation={false}
        showsMyLocationButton={false}
        onRegionChangeComplete={onMapRegionChangeComplete}
      >
        {markers}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1,
    paddingLeft: 8,
    paddingRight: 8,
  },
  searchBar: {
    marginBottom: 4,
  },
  progressBar: {
    marginBottom: 4,
  },
  warningBar: {
    marginBottom: 4,
    backgroundColor: '#333',
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 8,
  },
  searchResult: {
    padding: 4,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: DefaultTheme.colors.surface,
    marginBottom: 1,
  },
  locationButton: {},
  locationButtonContainer: {
    padding: 4,
    borderRadius: 50,
    alignSelf: 'flex-end',
    marginRight: 8,
    backgroundColor: DefaultTheme.colors.surface,
  },
  map: {
    flex: 3,
    width: '100%',
    height: '100%',
  },
});
