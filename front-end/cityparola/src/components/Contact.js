import React from 'react';
import './Contact.css';

const Contact = ({ darkMode }) => {
  return (
    <div className="contact-container">
      <div className={`contact-box ${darkMode ? 'dark' : 'light'}`}>
        <h1 className="contact-title" style={{ color: darkMode ? '#eee' : '#000' }}>
          Contact Us
        </h1>
        <p className="contact-content" style={{ color: darkMode ? '#eee' : '#000' }}>
        Feel free to contact us! <br/ >  
        Mail: <a href=''>contact@cityparola.com</a><br />
        </p>
      </div>
    </div>
  );
};

export default Contact;
