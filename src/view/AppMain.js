import { StatusBar } from 'expo-status-bar';
import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import EnvironmentContext from '../component/EnvironmentContext';

export default function AppMain() {
    const { environment } = useContext(EnvironmentContext);
  return (
    <View style={styles.container}>
      <Text>Hello, world! We are in: {environment.name}</Text>
      <StatusBar style="auto" />
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
});
