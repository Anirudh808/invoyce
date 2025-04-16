import React from "react";

const AreaChart = ({ strokeColor = "#0000FF" }) => {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <linearGradient id="fadeBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="blue" stopOpacity="0.4" />
          <stop offset="100%" stopColor="blue" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Fading fill under the curve */}
      <path
        d="M 0,60 C 15,20 30,100 45,40 C 60,-10 75,90 100,30 L 100,100 L 0,100 Z"
        fill="url(#fadeBlue)"
        stroke="none"
      />

      {/* Curve stroke on top with dynamic color */}
      <path
        d="M 0,60 C 15,20 30,100 45,40 C 60,-10 75,90 100,30"
        fill="none"
        stroke={strokeColor} // Dynamically set stroke color
        strokeWidth="1"
      />
    </svg>
  );
};

export default AreaChart;
