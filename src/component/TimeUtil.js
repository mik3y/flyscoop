import dayjs from 'dayjs';
import { Text } from 'react-native';

/** Renders a date like "an hour ago" */
export const TimeSince = ({ datetime, unknown = 'unknown', ...props }) => {
  const dateObj = dayjs(datetime);
  if (!datetime || !dateObj.isValid()) {
    return <Text {...props}>{unknown}</Text>;
  }
  const tooltip = <LongDateAndTime datetime={datetime} />;
  return (
      <Text {...props}>{dateObj.fromNow()}</Text>
  );
};

/** Renders a date like "Thursday, August 16, 2018 8:02 PM" */
export const LongDateAndTime = ({ datetime, unknown = 'unknown', ...props }) => {
  const dateObj = dayjs(datetime);
  if (!datetime || !dateObj.isValid()) {
    return <Text {...props}>{unknown}</Text>;
  }
  return <Text {...props}>{dateObj.format('LLLL')}</Text>
};

/** Renders a date like "08/16/2018" */
export const ShortDate = ({ datetime, unknown = 'unknown' }) => {
  const dateObj = dayjs(datetime);
  if (!datetime || !dateObj.isValid()) {
    return <Text {...props}>{unknown}</Text>;
  }
  return <Text {...props}>{dateObj.format('L')}</Text>
};
