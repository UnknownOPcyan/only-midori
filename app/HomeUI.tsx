import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toggleUpdateText } from './utils';
import './HomeUI.css';

interface HomeUIProps {
  user: any;
  buttonStage1: 'check' | 'claim' | 'claimed';
  buttonStage2: 'check' | 'claim' | 'claimed';
  buttonStage3: 'check' | 'claim' | 'claimed';
  farmingStatus: 'farm' | 'farming' | 'claim';
  isLoading: boolean;
  notification: string;
  handleButtonClick1: () => void;
  handleButtonClick2: () => void;
  handleButtonClick3: () => void;
  handleClaim1: () => void;
  handleClaim2: () => void;
  handleClaim3: () => void;
  handleFarmClick: () => void;
}

export default function HomeUI({
  user,
  buttonStage1,
  buttonStage2,
  buttonStage3,
  farmingStatus,
  isLoading,
  notification,
  handleButtonClick1,
  handleButtonClick2,
  handleButtonClick3,
  handleClaim1,
  handleClaim2,
  handleClaim3,
  handleFarmClick,
}: HomeUIProps) {
  const [farmingPoints, setFarmingPoints] = useState(0);
  const [displayedPoints, setDisplayedPoints] = useState(0);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(link);
    toggleUpdateText();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (farmingStatus === 'farming') {
      interval = setInterval(() => {
        setFarmingPoints(prev => prev + 1);
      }, 1000);
    } else {
      setFarmingPoints(0);
    }
    return () => clearInterval(interval);
  }, [farmingStatus]);

  useEffect(() => {
    setDisplayedPoints(farmingPoints);
  }, [farmingPoints]);

  const FarmingPoints = ({ points }: { points: number }) => {
    return (
      <div className="farming-points">
        <span className={`farming-point ${points === farmingPoints ? 'current' : 'exiting'}`}>
          {points}
        </span>
        <span className={`farming-point ${points === farmingPoints ? 'entering' : 'current'}`}>
          {points + 1}
        </span>
      </div>
    );
  };

  return (
    <div className="home-container">
      <div className="header-container">
        <div className="dog-image-container">
          <img
            alt="Animated style dog image"
            className="dog-image"
            src="https://storage.googleapis.com/a1aa/image/YlpvEfbklKRiDi8LX5Rww5U3zZZwHEUfju1qUNknpEZ6e2OnA.jpg"
          />
        </div>
        <p id="pixelDogsCount" className="pixel-dogs-count">
          {user.points} PixelDogs
        </p>
        <p id="updateText" className="update-text fade fade-in">
          Exciting updates are on the way:)
        </p>
        <div className="tasks-container">
          <button className="tasks-button">Daily Tasks..!</button>
          <div className="social-container">
            <p className="social-text">Follow Our Youtube!</p>
            <button
              onClick={() => {
                if (buttonStage1 === 'check') {
                  handleButtonClick1();
                } else if (buttonStage1 === 'claim') {
                  handleClaim1();
                }
              }}
              disabled={buttonStage1 === 'claimed' || isLoading}
              className={`claim-button ${
                buttonStage1 === 'claimed' || isLoading ? 'disabled' : ''
              }`}
            >
              {isLoading ? 'Claiming...' : buttonStage1 === 'check' ? 'Check' : buttonStage1 === 'claim' ? 'Claim' : 'Claimed'}
            </button>
          </div>
          <div className="social-container">
            <p className="social-text">Follow Our Twitter!</p>
            <button
              onClick={() => {
                if (buttonStage2 === 'check') {
                  handleButtonClick2();
                } else if (buttonStage2 === 'claim') {
                  handleClaim2();
                }
              }}
              disabled={buttonStage2 === 'claimed' || isLoading}
              className={`claim-button ${
                buttonStage2 === 'claimed' || isLoading ? 'disabled' : ''
              }`}
            >
              {isLoading ? 'Claiming...' : buttonStage2 === 'check' ? 'Check' : buttonStage2 === 'claim' ? 'Claim' : 'Claimed'}
            </button>
          </div>
          <div className="social-container">
            <p className="social-text">Join Our Telegram!</p>
            <button
              onClick={() => {
                if (buttonStage3 === 'check') {
                  handleButtonClick3();
                } else if (buttonStage3 === 'claim') {
                  handleClaim3();
                }
              }}
              disabled={buttonStage3 === 'claimed' || isLoading}
              className={`claim-button ${
                buttonStage3 === 'claimed' || isLoading ? 'disabled' : ''
              }`}
            >
              {isLoading ? 'Claiming...' : buttonStage3 === 'check' ? 'Check' : buttonStage3 === 'claim' ? 'Claim' : 'Claimed'}
            </button>
          </div>
        </div>
      </div>
      <div className="flex-grow"></div>
      <button 
        className={`farm-button ${farmingStatus === 'farming' ? 'farming' : ''}`}
        onClick={handleFarmClick}
        disabled={farmingStatus === 'farming'}
      >
        {farmingStatus === 'farm' ? 'Farm PixelDogs' : 
         farmingStatus === 'farming' ? `Farming.` : 
         'Claim Farm'}
        {farmingStatus === 'farming' && <FarmingPoints points={displayedPoints} />}
      </button>
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
      <div className="footer-container">
        <Link href="/">
          <a className="footer-link">
            <i className="fas fa-home footer-icon"></i>
            <p className="footer-text">Home</p>
          </a>
        </Link>
        <Link href="/invite">
          <a className="footer-link">
            <i className="fas fa-users footer-icon"></i>
            <p className="footer-text">Friends</p>
          </a>
        </Link>
        <Link href="/task">
          <a className="footer-link">
            <i className="fas fa-clipboard footer-icon"></i>
            <p className="footer-text">Tasks</p>
          </a>
        </Link>
      </div>
    </div>
  );
}
