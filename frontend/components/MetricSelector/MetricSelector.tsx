import React, { useState } from "react";
import styles from "./MetricSelector.module.scss";

interface MetricSelectorProps {
  onMetricChange: (metric: string) => void;
}

const MetricSelector: React.FC<MetricSelectorProps> = ({ onMetricChange }) => {
  const [selectedMetric, setSelectedMetric] = useState<string>("");

  const metrics = [
    { name: "Listener to Stream Ratio", value: "LISTENER_TO_STREAM_RATIO" },
    { name: "Follower Conversion Rate", value: "FOLLOWER_CONVERSION_RATE" },
    { name: "Playlist Efficiency", value: "PLAYLIST_EFFICIENCY" },
  ];

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const metric = event.target.value;
    setSelectedMetric(metric);
    onMetricChange(metric);
  };

  return (
    <div className={styles.metricSelector}>
      <label htmlFor="metric-selector" className={styles.label}>
        Metric
      </label>
      <select
        id="metric-selector"
        value={selectedMetric}
        onChange={handleSelect}
        className={styles.dropdown}
        required
      >
        <option value="">Select a Metric</option>
        {metrics.map((metric) => (
          <option key={metric.value} value={metric.value}>
            {metric.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MetricSelector;
