import { View } from 'react-native';
import { Caption } from 'react-native-paper';

import GlobalStyles from '../lib/GlobalStyles';

const EmptyState = ({ message }) => {
  return (
    <View style={styles.container}>
      <Caption style={GlobalStyles.caption}>{message}</Caption>
    </View>
  );
};

const styles = {
  container: {
    padding: 20,
  },
};

export default EmptyState;
