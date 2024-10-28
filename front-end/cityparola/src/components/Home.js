import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = ({ toggleSettings, darkMode }) => {
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div className="parolla-container">
      <div className={`parolla-box ${darkMode ? 'dark' : 'light'}`}>
        <h1 className="parolla-title" style={{ color: darkMode ? '#eee' : '#000' }}>City Parolla</h1>
        <p className="parolla-subtitle" style={{ color: darkMode ? '#eee' : '#000' }}>GSU Games</p>
        <div className="button-container">
          <Link to="/Classic">
            <button className="classic-button">Classic</button>
          </Link>
          <Link to="/Survival">
            <button className="survival-button">Survival</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
