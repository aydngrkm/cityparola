import React, { useState, useEffect } from 'react';
import './Leaderboard.css';
import axios from 'axios';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Leaderboard = ({ darkMode }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/get-leaderboard');
        setLeaderboard(response.data.leaderboard.slice(0, 50));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching leaderboard", err);
        setLoading(false);
      }
    };

    fetchLeaderboard();

    if (user) {
      console.log("Logged-in username:", user.username);
    }

  }, [user]);

  return (
    <div className={`leaderboard-container ${darkMode ? 'dark' : 'light'}`}>
      <div className={`leaderboard-box ${darkMode ? 'dark' : 'light'}`}>
        <h1 className="leaderboard-title" style={{ color: darkMode ? '#eee' : '#000' }}>
          Leaderboard
        </h1>
        {loading ? (
          <p style={{ color: darkMode ? '#eee' : '#000' }}>Loading...</p>
        ) : (
          <div className="leaderboard-list">
            {leaderboard.map((player, index) => (
              <div
                className={`leaderboard-item ${user && player.username === user.username ? 'highlight' : ''}`}
                key={index}
              >
                <span className="leaderboard-rank" style={{ color: darkMode ? '#eee' : '#000' }}>
                  {index + 1}.
                </span>
                <span className="leaderboard-username" style={{ color: darkMode ? '#eee' : '#000' }}>
                  {player.username}
                </span>
                <span className="leaderboard-score" style={{ color: darkMode ? '#eee' : '#000' }}>
                  {player.score}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
