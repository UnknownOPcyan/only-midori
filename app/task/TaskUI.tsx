import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import './TaskUI.css';

interface TaskUIProps {
  user: any;
  buttonStages: { [key: string]: 'check' | 'claim' | 'claimed' };
  isLoading: { [key: string]: boolean };
  notification: string;
  handleButtonClick: (buttonId: string) => void;
  handleClaim: (buttonId: string) => void;
}

export default function TaskUI({
  user,
  buttonStages,
  isLoading,
  notification,
  handleButtonClick,
  handleClaim,
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

  const renderButton = (buttonId: string, points: number) => {
    const stage = buttonStages[buttonId];
    const loading = isLoading[buttonId];

    if (stage === 'check') {
      return (
        <button className="button" onClick={() => handleButtonClick(buttonId)} disabled={loading}>
          <div className="button-wrapper">
            <div className="text">+{points}</div>
            <span className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
            </span>
          </div>
        </button>
      );
    } else if (stage === 'claim') {
      return (
        <button className="button" onClick={() => handleClaim(buttonId)} disabled={loading}>
          <div className="button-wrapper">
            <div className="text">Claim</div>
            <span className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
            </span>
          </div>
        </button>
      );
    } else {
      return (
        <button className="button claimed" disabled>
          <div className="button-wrapper">
            <div className="text">Claimed</div>
          </div>
        </button>
      );
    }
  };

  const tasks = [
    { id: 'button4', icon: 'fab fa-youtube', text: 'Subscribe PG YouTube channel :', points: 200 },
    { id: 'button6', icon: 'fab fa-telegram-plane', text: 'Subscribe PG Telegram Channel :', points: 200 },
    { id: 'button5', icon: 'fab fa-twitter', text: "Follow PG's X Handle :", points: 200 },
    { id: 'button7', icon: 'fab fa-discord', text: "Join PG's Discord Server :", points: 200 },
    { id: 'button8', icon: 'fab fa-instagram', text: 'Follow PG Instagram Handle :', points: 200 },
  ];

  return (
    <div className={`task-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* ... (rest of the component remains the same) ... */}
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id}>
            <i className={task.icon}></i>
            <span>{task.text}</span>
            {renderButton(task.id, task.points)}
          </li>
        ))}
      </ul>
      {/* ... (footer and notification banner remain the same) ... */}
    </div>
  );
}
