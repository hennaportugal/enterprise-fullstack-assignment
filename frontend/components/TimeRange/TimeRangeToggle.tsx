import React, { useState } from "react";
import styles from "./TimeRangeToggle.module.scss";

interface TimeRangeToggleProps {
  onTimeRangeChange: (days: number) => void;
}

const TimeRangeToggle: React.FC<TimeRangeToggleProps> = ({
  onTimeRangeChange,
}) => {
  const [selectedRange, setSelectedRange] = useState<number>(7);

  const handleToggle = (days: number) => {
    setSelectedRange(days);
    onTimeRangeChange(days);
  };

  return (
    <div className={styles.timeRangeToggle}>
      <div className={styles.label}>Time Range</div>
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.toggleButton} ${
            selectedRange === 7 ? styles.active : ""
          }`}
          onClick={() => handleToggle(7)}
        >
          7 Days
        </button>
        <button
          className={`${styles.toggleButton} ${
            selectedRange === 30 ? styles.active : ""
          }`}
          onClick={() => handleToggle(30)}
        >
          30 Days
        </button>
      </div>
    </div>
  );
};

export default TimeRangeToggle;
