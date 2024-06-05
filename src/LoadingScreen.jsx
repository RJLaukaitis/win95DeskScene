import React, {useEffect, useRef} from 'react';
import T from 't.js';
import "./LoadingScreen.css";

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="terminal">
        <p>Loading...</p>
        <p>██████████████████████ 100%</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
