import { ActivityIndicator, Colors } from 'react-native-paper';

const LoadingZone = ({ isLoading = true, children }) => {
  if (!isLoading) {
    return children;
  }
  return <ActivityIndicator animating={true} />;
};

export default LoadingZone;
