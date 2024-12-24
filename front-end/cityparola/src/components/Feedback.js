import React, { useState } from 'react';
import axios from 'axios';
import './Feedback.css';

const Feedback = ({ darkMode }) => {
  const [feedback, setFeedback] = useState('');

  const handleChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/feedbacks/', {
        body: feedback,
      });
      alert('Thank you for your feedback!');
      setFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('There was an error submitting your feedback. Please try again later.');
    }
  };

  return (
    <div className="feedback-container">
      <div className={`feedback-box ${darkMode ? 'dark' : 'light'}`}>
        <h1 className="feedback-title" style={{ color: darkMode ? '#eee' : '#000' }}>
          We Value Your Feedback
        </h1>
        <p className="feedback-description" style={{ color: darkMode ? '#eee' : '#000' }}>
          Please share your thoughts and suggestions to help us improve.
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            className="feedback-textarea"
            value={feedback}
            onChange={handleChange}
            placeholder="Enter your feedback here..."
            rows="5"
          />
          <button type="submit" className="feedback-submit-button">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
