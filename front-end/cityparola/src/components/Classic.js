import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import './Classic.css';
import backbtn from '../assets/back_button.png';
import timerlogo from '../assets/timer.png';

const Classic = ({ darkMode }) => {
    const [timer, setTimer] = useState(300);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(countdown);
    }, []);

    useEffect(() => {
        if (timer === 0) {
            setIsGameOver(true);
        }
    }, [timer]);

    const writeTime = (time) => {
        const minute = Math.floor(time / 60);
        const second = time % 60;
        return `${minute}:${second < 10 ? '0' + second : second}`;
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = () => {
        console.log("Submitted:", inputValue);
        setInputValue("");
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleBackClick = (event) => {
        event.preventDefault();
        setShowModal(true);
    };

    const handleConfirmExit = () => {
        setShowModal(false);
        navigate("/");
    };

    const handleCancelExit = () => {
        setShowModal(false);
    };

    return (
        <>
            <link href='https://fonts.googleapis.com/css?family=JetBrains Mono' rel='stylesheet'></link>
            <a href="/" onClick={handleBackClick} className='back-button-img'>
                <img src={backbtn} alt='bckbtn' className={`back-button ${darkMode ? 'dark-mode' : ''}`} />
            </a>
            <div className={`title ${darkMode ? 'dark-mode' : ''}`}>City Parolla</div>
            
            {!isGameOver && (
                <div className={`classic-container ${darkMode ? 'dark-mode' : ''}`}>
                    <div className={`timer txt ${darkMode ? 'dark-mode' : ''}`}>
                        <span>
                            <img src={timerlogo} alt='timer-logo' className={`timer-logo ${darkMode ? 'dark-mode' : ''}`} />
                        </span>
                        <span>{writeTime(timer)}</span>
                    </div>
                    <div className={`question-container txt ${darkMode ? 'dark-mode' : ''}`}>
                        Question A: <br /><br />
                        The city where a bullet was fired into the sun
                    </div>
                    <div className='right-section'>
                        <div className='score-container'>
                            Score: {score}
                        </div>
                        <div className='combo-container'>
                            Combo: x{combo}
                        </div>
                    </div>
                </div>
            )}

            {!isGameOver && (
                <div className='input-container'>
                    <div className='input-text'>
                        <input
                            type='text'
                            value={inputValue}
                            placeholder='Your answer here'
                            className='input'
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                        />
                        <button className='pass-button' onClick={handleSubmit}>
                            <div className='pass-text'>PASS</div>
                        </button>
                    </div>
                </div>
            )}
            {isGameOver && <div className='game-over-container'>
                <div className={`game-over ${darkMode ? 'dark-mode' : ''}`}>Game Over<br/>Your Score Is: {score}</div>
            </div>}
            {showModal && (
                <Modal
                    message="Are you sure you want to leave? Your test will not be counted."
                    onConfirm={handleConfirmExit}
                    onCancel={handleCancelExit}
                />
            )}
        </>
    );
    
};

export default Classic;
