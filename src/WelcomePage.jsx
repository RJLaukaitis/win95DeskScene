import React from 'react';
import "./WelcomePage.css";

const WelcomePage = ({ onEnter }) => {
  return (
    <div className="welcome-page">
      <h1>Welcome to My Portfolio</h1>
      <button onClick={onEnter}>Enter</button>
    </div>
  );
};

export default WelcomePage;