import { Dimensions } from 'react-native';
import { LineChart as LineChartBase } from 'react-native-chart-kit';
import { Card } from 'react-native-paper';

export const LineChart = ({ allPlots, title = '', legend = null }) => {
  // Convert each [x,y] list into an object of { data: [yvals] }
  const datasets = allPlots
    .filter((plot) => plot.timeseries && plot.timeseries.length)
    .map((plot) => {
      return {
        data: plot.timeseries.map((point) => point[1]),
        color: () => plot.color,
      };
    });
  return (
    <Card>
      {title ? <Card.Title title={title} /> : null}
      <Card.Content>
        <LineChartBase
          data={{
            datasets,
            legend,
          }}
          fromZero
          width={Dimensions.get('window').width - 80}
          height={220}
          //   yAxisLabel="$"
          //   yAxisSuffix="k"
          //   yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: 'transparent',
            backgroundGradientTo: 'white',
            backgroundGradientFromOpacity: 0,
            backgroundGradientFrom: 'white',
            backgroundGradientToOpacity: 0,
            decimalPlaces: 0, // optional, defaults to 2dp
            strokeWidth: 1,
            color: (opacity = 1) => `green`,
            labelColor: (opacity = 1) => `darkgrey`,
            propsForDots: {
              r: '1',
              strokeWidth: '0',
              stroke: '#ffa726',
            },
            propsForBackgroundLines: {
              strokeWidth: 1,
              stroke: '#e3e3e3',
              strokeDasharray: '0',
            },
          }}
          bezier
          style={
            {
              // marginVertical: 8,
            }
          }
        />
      </Card.Content>
    </Card>
  );
};
