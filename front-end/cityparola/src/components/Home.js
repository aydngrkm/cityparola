import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import africa from '../assets/africa.png'
import america from '../assets/america.png'
import asia from '../assets/asia.png'
import europe from '../assets/europe.png'
import './Home.css';

const Home = ({ toggleSettings, darkMode }) => {

  const [selectedContinent, setSelectedContinent] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleContinentClick = (continent) => {
    setSelectedContinent((prev) => (prev === continent ? null : continent));
  };

  const continentImages = {
    Africa: africa,
    America: america,
    Asia: asia,
    Europe: europe,
  };

  return (
    <>
    
    <div className="continent-selector">
      <div className={`dropdown ${darkMode ? 'dark' : 'light'}`}>
        <div className={`dropdown-header ${darkMode ? 'dark' : 'light'}`}>
          {selectedContinent ? selectedContinent : "World"}
        </div>
        <div className={`dropdown-menu ${darkMode ? 'dark' : 'light'}`}>
            {["Asia", "Europe", "America", "Africa"].map((continent) => (
              <div key={continent}
                className={`dropdown-item ${selectedContinent === continent ? "selected" : ""} ${darkMode ? 'dark' : 'light'}`}
                onClick={() => handleContinentClick(continent)}
              >
                <img src={continentImages[continent]} alt="continent" className="continent-icon"/> {continent}
              </div>
            ))}
          </div>
      </div>
    </div>
     
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
    </>
  );
};

export default Home;
