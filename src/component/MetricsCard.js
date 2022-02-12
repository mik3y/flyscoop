import React, { useContext, useEffect, useState } from 'react';

import ApiContext from '../component/ApiContext';
import { LineChart } from '../component/Charts';

const MetricsCard = ({ app, plots, legend = null }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [allPlots, setAllPlots] = useState([]);
  const { apiClient } = useContext(ApiContext);

  useEffect(() => {
    async function load() {
      const newPlots = [];
      setIsLoading(true);
      try {
        for (let plot of plots) {
          const { query, color } = plot;
          const result = await apiClient.queryProm({ app, query });
          if (result && result.data && result.data.length) {
            newPlots.push({
              timeseries: result.data[0].values,
              color,
            });
          }
        }

        // Only set data if we got results for all queries.
        // TODO(mikey): Deal with partial query results better.
        if (newPlots.length === plots.length) {
          setAllPlots(newPlots);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (allPlots.length) {
    return <LineChart allPlots={allPlots} title={'Data Transfer'} legend={legend} />;
  }
  return null;
};

export default MetricsCard;
