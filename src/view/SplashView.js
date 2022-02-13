/**
 * A view to show a generic splash screen.
 *
 * Unlike most views which are instantiated in one and only one
 * code site, this view may be rendered from multiple places.
 *
 * Specifically, each ContextProvider may show a SplashView while
 * it is loading. When mounted with unique messages, this allows
 * a developer to understand at what phase of loading we are in the
 * app, eg:
 *
 *  EnvironmentContext: <SplashView message={"Setting up app.."} />
 *  ApiContext: <SplashView message={"Checking account.."} />
 *  .. etc ..
 */
import { Image, StyleSheet, Text, View } from 'react-native';

import logo from '../../assets/icon.png';

const SplashView = ({ message = null }) => {
  return (
    <View style={styles.container}>
      <Image source={logo} style={{ width: 200, height: 200 }} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3a0088',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: 10,
    color: '#aaa',
  },
});

export default SplashView;
