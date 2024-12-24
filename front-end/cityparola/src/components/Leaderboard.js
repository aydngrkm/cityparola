import React, { useState, useEffect } from 'react';
import './Leaderboard.css';
import axios from 'axios';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Leaderboard = ({ darkMode }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authTokens } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const { username } = useContext(AuthContext);
  const [currentUserRank, setCurrentUserRank] = useState(0);
  const [currentUserScore, setCurrentUserScore] = useState(0);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/get-leaderboard', {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setCurrentUserRank(response.data.current_user_rank);
        setCurrentUserScore(response.data.current_user_score);
        setLeaderboard(response.data.leaderboard);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboard', err);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [authTokens]);

  let playersToDisplay = leaderboard.slice(0, 5);


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
            {playersToDisplay.map((player, index) => (
              <div
                className={`leaderboard-item ${player.username === username ? 'highlight' : ''}`}
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
            {currentUserRank > 5 && (
              <div className="leaderboard-item highlight" style={{ color: darkMode ? '#eee' : '#000' }}>
                <span className="leaderboard-rank highlight">{currentUserRank}.</span>
                <span className="leaderboard-username highlight">
                  {username}
                </span>
                <span className="leaderboard-score highlight">{currentUserScore}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
