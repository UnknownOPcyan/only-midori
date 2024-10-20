import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import './TaskUI.css';

interface TaskUIProps {
  user: any;
  buttonStage1: 'check' | 'claim' | 'claimed';
  buttonStage2: 'check' | 'claim' | 'claimed';
  buttonStage3: 'check' | 'claim' | 'claimed';
  buttonStage7: 'check' | 'claim' | 'claimed';
  buttonStage8: 'check' | 'claim' | 'claimed';
  isLoading: boolean;
  isLoading1: boolean;
  isLoading2: boolean;
  notification: string;
  handleButtonClick4: () => void;
  handleButtonClick5: () => void;
  handleButtonClick6: () => void;
  handleButtonClick7: () => void;
  handleButtonClick8: () => void;
  handleClaim4: () => void;
  handleClaim5: () => void;
  handleClaim6: () => void;
  handleClaim7: () => void;
  handleClaim8: () => void;
}

export default function TaskUI({
  user,
  buttonStage1,
  buttonStage2,
  buttonStage3,
  buttonStage7,
  buttonStage8,
  isLoading,
  isLoading1,
  isLoading2,
  notification,
  handleButtonClick4,
  handleButtonClick5,
  handleButtonClick6,
  handleButtonClick7,
  handleButtonClick8,
  handleClaim4,
  handleClaim5,
  handleClaim6,
  handleClaim7,
  handleClaim8,
}: TaskUIProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      setIsDarkMode(tg.colorScheme === 'dark');

      tg.onEvent('themeChanged', () => {
        setIsDarkMode(tg.colorScheme === 'dark');
      });
    }
  }, []);

  const renderButton = (stage: 'check' | 'claim' | 'claimed', onClick: () => void, isLoading: boolean) => {
    let content;
    if (isLoading) {
      content = 'Claiming...';
    } else if (stage === 'check') {
      content = '+200';
    } else if (stage === 'claim') {
      content = 'Claim';
    } else {
      content = 'Claimed';
    }

    return (
      <button
        onClick={onClick}
        disabled={stage === 'claimed' || isLoading}
        className={stage === 'claim' ? 'slide-up' : ''}
      >
        {content}
      </button>
    );
  };

  return (
    <div className={`task-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="header">
        <div className="points">
          <span>₱ {user.points}</span>
        </div>
      </div>
      <div className="task-icon-container">
        <div className="task-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
        </div>
      </div>
      <div className="description">
        Complete the following tasks<br />and increase PG
      </div>
      <ul className="task-list">
        <li>
          <i className="fab fa-youtube"></i>
          <span>Subscribe PG YouTube channel :</span>
          {renderButton(buttonStage1, buttonStage1 === 'check' ? handleButtonClick4 : handleClaim4, isLoading)}
        </li>
        <li>
          <i className="fab fa-telegram-plane"></i>
          <span>Subscribe PG Telegram Channel :</span>
          {renderButton(buttonStage3, buttonStage3 === 'check' ? handleButtonClick6 : handleClaim6, false)}
        </li>
        <li>
          <i className="fab fa-twitter"></i>
          <span>Follow PG's X Handle :</span>
          {renderButton(buttonStage2, buttonStage2 === 'check' ? handleButtonClick5 : handleClaim5, false)}
        </li>
        <li>
          <i className="fab fa-discord"></i>
          <span>Join PG's Discord Server :</span>
          {renderButton(buttonStage7, buttonStage7 === 'check' ? handleButtonClick7 : handleClaim7, isLoading1)}
        </li>
        <li>
          <i className="fab fa-instagram"></i>
          <span>Follow PG Instagram Handle :</span>
          {renderButton(buttonStage8, buttonStage8 === 'check' ? handleButtonClick8 : handleClaim8, isLoading2)}
        </li>
      </ul>
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
          <a className="footer-link active-nav">
            <i className="fas fa-clipboard footer-icon"></i>
            <p className="footer-text">Tasks</p>
          </a>
        </Link>
      </div>
      {notification && <div className="notification-banner">{notification}</div>}
    </div>
  );
}
