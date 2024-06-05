import React from 'react';
import './WelcomePage.css'; // Create and import your CSS file for styling

const WelcomePage = ({ onEnter }) => {
    return (
        <div id="welcomeScreen">
            <h1>Welcome to My Site</h1>
            <button id="enterButton" onClick={onEnter}>Enter</button>
        </div>
    );
};

export default WelcomePage;