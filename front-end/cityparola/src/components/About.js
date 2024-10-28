import React from 'react';
import './About.css';

const About = ({ darkMode }) => {
  return (
    <div className="about-container">
      <div className={`about-box ${darkMode ? 'dark' : 'light'}`}>
        <h1 className="about-title" style={{ color: darkMode ? '#eee' : '#000' }}>
          About Us
        </h1>
        <p className="about-content" style={{ color: darkMode ? '#eee' : '#000' }}>
          Ali Avci<br />
          Gorkem Aydin<br />
          Ahmet Akgun
        </p>
      </div>
    </div>
  );
};

export default About;
