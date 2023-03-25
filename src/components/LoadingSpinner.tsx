import React from "react";
import { InfinitySpin } from "react-loader-spinner";

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner_container">
      <InfinitySpin width="200" color="white" />
    </div>
  );
};

export default LoadingSpinner;
