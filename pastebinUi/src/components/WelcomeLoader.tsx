import React from 'react';
import '../styles/WelcomeLoader.css';

const WelcomeLoader: React.FC = () => {
    return (
        <div className="loader-overlay">
            <div className="loader-card">
                <div className="spinner-container">
                    <div className="spinner"></div>
                    <div className="spinner-inner"></div>
                </div>
                <h1>Waking up the server</h1>
                <p>
                    We're using a free server tier, which takes about
                    <strong> 90 seconds </strong>
                    to start up after inactivity.
                </p>
                <div className="progress-bar-container">
                    <div className="progress-bar"></div>
                </div>
                <p className="sub-text">Thanks for your patience while we get things ready!</p>
            </div>
        </div>
    );
};

export default WelcomeLoader;
