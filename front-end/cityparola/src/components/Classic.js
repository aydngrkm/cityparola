import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from './Modal';
import './Classic.css';
import backbtn from '../assets/back_button.png';
import timerlogo from '../assets/timer.png';
import hintIcon from '../assets/hint.png';
import AuthContext from '../context/AuthContext';

const Classic = ({ darkMode }) => {
    const [timer, setTimer] = useState(300);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [animationClass, setAnimationClass] = useState("");
    const [questions, setQuestions] = useState([]);
    const [modifiableQuestions, setModifiableQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hintAvailable, setHintAvailable] = useState(3);
    const [hints, setHints] = useState([]);
    const [showHints, setShowHints] = useState(false);
    const [isHintUsed, setIsHintUsed] = useState(false);
    const navigate = useNavigate();

    const { user } = useContext(AuthContext);
    const userId = user ? user.user_id : null;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/default-test`);
                setQuestions(response.data);
                setModifiableQuestions(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(countdown);
    }, []);

    useEffect(() => {
        if (timer === 0) {
            setIsGameOver(true);
            updateUserScore(score);
        }
    }, [timer, score]);

    const writeTime = (time) => {
        const minute = Math.floor(time / 60);
        const second = time % 60;
        return `${minute}:${second < 10 ? '0' + second : second}`;
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = async () => {
        const answer = inputValue.trim().toUpperCase();
        const questionId = modifiableQuestions[currentQuestionIndex].question.id;

        try {
            const response = await axios.post(`http://localhost:8000/api/check-answer/`, {
                question_id: questionId,
                answer: answer
            });

            const { is_correct } = response.data;
            if (is_correct) {
                setAnimationClass("correct");
                setScore((prevScore) => prevScore + (10 * (combo + 1)));
                setCombo((prevCombo) => prevCombo + 1);
            } else {
                setAnimationClass("wrong");
                setCombo(0);
            }

            setTimeout(() => setAnimationClass(""), 800);
            moveToNextQuestion();

        } catch (err) {
            setError(err);
        }

        setInputValue("");
    };

    const handlePass = () => {
        setAnimationClass("pass");
        setTimeout(() => setAnimationClass(""), 800);
        setCombo(0);
        const skippedQuestion = modifiableQuestions[currentQuestionIndex];
        setModifiableQuestions(prev => [...prev, skippedQuestion]);
        setInputValue("");
        moveToNextQuestion();
    };

    const moveToNextQuestion = () => {
        if (currentQuestionIndex < modifiableQuestions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            setIsGameOver(true);
            updateUserScore(score);
        }
        setHints([]);
        setShowHints(false);
        setIsHintUsed(false);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleBackClick = (event) => {
        if (isGameOver) {
            navigate("/");
        } else {
            event.preventDefault();
            setShowModal(true);
        }
    };

    const handleConfirmExit = () => {
        setShowModal(false);
        navigate("/");
    };

    const handleCancelExit = () => {
        setShowModal(false);
    };

    const handleReturnHome = () => {
        navigate("/");
    };

    const handleRestartGame = () => {
        setScore(0);
        setCombo(0);
        setTimer(300);
        setIsGameOver(false);
        setCurrentQuestionIndex(0);
        setInputValue("");
        setModifiableQuestions(questions);
        setHintAvailable(3);
        setHints([]);
    };

    const updateUserScore = async (newScore) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/users/${userId}/`);
            const user = response.data;

            if (newScore > user.score) {
                await axios.put(`http://localhost:8000/api/users/${userId}/`, {
                    ...user,
                    score: newScore
                });
            }
        } catch (err) {
            console.error("Error updating user score:", err);
        }
    };

    const handleGetHint = async () => {
        if (hintAvailable > 0 && !isHintUsed) {
            try {
                const response = await axios.post(`http://localhost:8000/api/get-hint/`, {
                    question_id: modifiableQuestions[currentQuestionIndex].question.id
                });
                setHints(prevHints => [...prevHints, response.data.hint_text]);
                setHintAvailable(prev => prev - 1);
                setShowHints(true);
            } catch (err) {
                console.error("Error fetching hint:", err);
            }
            setIsHintUsed(true);
        }
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
                        Question {modifiableQuestions[currentQuestionIndex]?.letter}: <br /><br />
                        {modifiableQuestions[currentQuestionIndex] ? modifiableQuestions[currentQuestionIndex].question.question_text : 'Loading...'}
                    </div>
                    <div className='right-section'>
                        <div className={`score-container ${animationClass}`}>
                            Score: {score}
                        </div>
                        <div className={`combo-container ${animationClass}`}>
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
                        <button className='pass-button' onClick={handlePass}>
                            <div className='pass-text'>Pass</div>
                        </button>
                    </div>
                </div>
            )}

            {showHints && (
                <div className="hints-display">
                    <h3>Hints:</h3>
                    {hints.map((hint, index) => (
                        <div key={index} className="hint-box">
                            <p>{hint}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className='hint-container'>
                <button className='hint-button' onClick={handleGetHint}>
                    <img src={hintIcon} alt='Hint' className='hint-icon' />
                </button>
                <div className='hint-remaining'>{hintAvailable}</div>
            </div>

            {isGameOver && (
                <div className='game-over-container'>
                    <div className={`game-over ${darkMode ? 'dark-mode' : ''}`}>Game Over<br />Your Score: {score}</div>
                    <div className='end-game-buttons'>
                        <button className='end-game-button restart' onClick={handleRestartGame}>Restart</button>
                        <button className='end-game-button return' onClick={handleReturnHome}>Return Home</button>
                    </div>
                </div>
            )}

            {showModal && !isGameOver && (
                <Modal
                    message="Are you sure you want to leave? Your test will not be counted."
                    onConfirm={handleConfirmExit}
                    onCancel={handleCancelExit}
                />
            )}
            {showModal && isGameOver && (
                navigate("/")
            )}
            
        </>
    );
    
};

export default Classic;
