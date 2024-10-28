import React, { useEffect, useRef } from 'react';
import './Settings.css';

const Settings = ({ show, toggleDarkMode, darkMode, toggleSettings }) => {
  const settingsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        toggleSettings();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, toggleSettings]);

  return (
    <div
      className={`settings ${show ? 'show' : ''}`}
      style={{
        backgroundColor: darkMode ? '#444' : '#eee',
        color: darkMode ? '#eee' : '#000',
      }}
      ref={settingsRef}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: darkMode ? '#eee' : '#000' }}>Settings</h2>
        <button onClick={toggleSettings} className="close-button" style={{ color: darkMode ? '#eee' : '#000' }}>✖️</button>
      </div>
      <div className="toggle-container">
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          <span className="slider"></span>
        </label>
        <span style={{ color: darkMode ? '#eee' : '#000' }}>Dark Mode</span>
      </div>
    </div>
  );
};

export default Settings;
