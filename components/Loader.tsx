import React from "react";

const Loader = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-1/2">
      <div className="relative w-[120px] h-10 flex items-center justify-evenly">
        <span className="w-5 block h-5 bg-black rounded-full loading-animation"></span>
        <span className="w-5 block h-5 bg-black rounded-full loading-animation"></span>
        <span className="w-5 block h-5 bg-black rounded-full loading-animation"></span>
        <span className="w-5 block h-5 bg-black rounded-full loading-animation"></span>
        <span className="w-5 block h-5 bg-black rounded-full loading-animation"></span>
      </div>
    </div>
  );
};

export default Loader;
