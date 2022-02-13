import { View } from 'react-native';
import { Caption } from 'react-native-paper';

const EmptyState = ({ message }) => {
  return (
    <View style={styles.container}>
      <Caption style={styles.caption}>{message}</Caption>
    </View>
  );
};

const styles = {
  container: {
    padding: 20,
  },
  caption: {
    fontSize: 20,
    textAlign: 'center',
  },
};

export default EmptyState;
