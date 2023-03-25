import React from "react";
import { useSpotify } from "../api";

const FloatingBar = () => {
  const { timeRange, changeTimeRange } = useSpotify();
  return (
    <div className="floating-bar-time_range-buttons">
      <button
        onClick={() => changeTimeRange("short_term")}
        className={`floating-bar-time_range-button ${
          timeRange === "short_term" && "active"
        }`}
      >
        1M
      </button>
      <button
        onClick={() => changeTimeRange("medium_term")}
        className={`floating-bar-time_range-button ${
          timeRange === "medium_term" && "active"
        }`}
      >
        6M
      </button>
      <button
        onClick={() => changeTimeRange("long_term")}
        className={`floating-bar-time_range-button ${
          timeRange === "long_term" && "active"
        }`}
      >
        All Time
      </button>
    </div>
  );
};

export default FloatingBar;
