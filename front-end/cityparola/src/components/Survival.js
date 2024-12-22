import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './Survival.css';
import backbtn from '../assets/back_button.png';
import timerlogo from '../assets/timer.png';

const Survival = ({ darkMode }) => {
    const { authTokens } = useContext(AuthContext);
    const [timer, setTimer] = useState(300);
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showForfeit, setShowForfeit] = useState(false);
    const [animationClass, setAnimationClass] = useState("");
    const navigate = useNavigate();
    const [questionIds, setQuestionIds] = useState([]);
    const [allQuestions, setAllQuestions] = useState([]);
    const [newQuestions, setNewQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const handleSubmit = async () => {
        const answer = inputValue.trim().toUpperCase();
        const currentQuestion = newQuestions[currentQuestionIndex];

        if (answer) {
            try {
                const response = await axios.post('http://localhost:8000/api/check-answer/', {
                    question_id: currentQuestion.id,
                    answer: answer
                }, {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`
                    }
                });

                if (response.data.is_correct) {
                    setAnimationClass("correct");
                    setScore((prevScore) => prevScore + 10);
                    setTimer((prevTimer) => prevTimer + 5);
                    setTimeout(() => setAnimationClass(""), 1000);
                    setInputValue("");

                    if (currentQuestionIndex + 1 < newQuestions.length) {
                        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                    } else {
                        fetchNewQuestions();
                    }
                } else {
                    setIsGameOver(true);
                    setInputValue("");
                }
            } catch (err) {
                console.error('Error checking answer:', err);
            }
        }
    };

    const fetchNewQuestions = async () => {
        try {
            if (!authTokens) {
                throw new Error('No auth token found');
            }

            const postData = {
                question_ids: questionIds
            };

            const response = await axios.post('http://localhost:8000/api/survival-test/', postData, {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`
                }
            });

            const newQuestionsData = response.data;
            const newQuestionIds = newQuestionsData.map((q) => q.id);

            const filteredNewQuestions = newQuestionsData.filter(q => !questionIds.includes(q.id));

            setNewQuestions(filteredNewQuestions);
            setAllQuestions((prevQuestions) => [...prevQuestions, ...newQuestionsData]);
            setQuestionIds((prevIds) => [...prevIds, ...newQuestionIds]);
            setCurrentQuestionIndex(0);
        } catch (err) {
            setError(err);
            if (err.response && err.response.status === 400) {
                console.error("Bad Request Error", err.response.data);
                setIsGameOver(true);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!authTokens) {
                    throw new Error('No auth token found');
                }

                const response = await axios.post('http://localhost:8000/api/survival-test/', {
                    question_ids: questionIds
                }, {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`
                    }
                });

                const newQuestionsData = response.data;
                const newQuestionIds = newQuestionsData.map((q) => q.id);

                setNewQuestions(newQuestionsData);
                setAllQuestions(newQuestionsData);
                setQuestionIds(newQuestionIds);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (authTokens) {
            fetchData();
        }
    }, [authTokens]);

    useEffect(() => {
        if (newQuestions.length === 0 && isGameOver) {
            navigate("/"); 
        }
    }, [newQuestions, isGameOver, navigate]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleForfeitClick = (event) => {
        event.preventDefault();
        setShowForfeit(true);
    };

    const handleConfirmForfeit = () => {
        setIsGameOver(true);
        setShowForfeit(false);
    };

    const handleCancelForfeit = () => {
        setShowForfeit(false);
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

    const handleReturnHome = () => {
        navigate("/");
    };

    const handleRestartGame = async () => {
        setScore(0);
        setTimer(300);
        setIsGameOver(false);
        setInputValue("");
        setCurrentQuestionIndex(0);
        setQuestionIds([]);
        setAllQuestions([]);
        setNewQuestions([]);
        setLoading(true);

        try {
            if (!authTokens) {
                throw new Error('No auth token found');
            }

            const postData = { question_ids: [] };

            const response = await axios.post('http://localhost:8000/api/survival-test/', postData, {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`
                }
            });

            const newQuestionsData = response.data;
            const newQuestionIds = newQuestionsData.map((q) => q.id);

            setNewQuestions(newQuestionsData);
            setAllQuestions(newQuestionsData);
            setQuestionIds(newQuestionIds);
        } catch (err) {
            console.error('Error restarting game:', err);
        } finally {
            setLoading(false);
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
                <div className={`survival-container ${darkMode ? 'dark-mode' : ''}`}>
                    <div className={`timer txt ${darkMode ? 'dark-mode' : ''}`}>
                        <span>
                            <img src={timerlogo} alt='timer-logo' className={`timer-logo ${darkMode ? 'dark-mode' : ''}`} />
                        </span>
                        <span>{writeTime(timer)}</span>
                    </div>
                    <div className={`question-container txt ${darkMode ? 'dark-mode' : ''}`}>
                        {newQuestions.length > 0 && newQuestions[currentQuestionIndex]
                            ? newQuestions[currentQuestionIndex].question_text
                            : "Loading..."}
                    </div>
                    <div className='right-section'>
                        <div className={`score-container ${animationClass}`}>
                            Score: {score}
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
                        <button className='forfeit-button' onClick={handleForfeitClick}>
                            <div className='forfeit-text'>Forfeit</div>
                        </button>
                    </div>
                </div>
            )}

            {isGameOver && (
                <div className='game-over-container'>
                    <div className={`game-over ${darkMode ? 'dark-mode' : ''}`}>Game Over<br />Your Score: {score}</div>
                    <div className='end-game-buttons'>
                        <button className='end-game-button restart' onClick={handleRestartGame}>Restart</button>
                        <button className='end-game-button return' onClick={handleReturnHome}>Return Home</button>
                    </div>
                </div>
            )}

            {showForfeit && (
                <Modal
                    message="Are you sure you want to forfeit?"
                    onConfirm={handleConfirmForfeit}
                    onCancel={handleCancelForfeit}
                />
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

export default Survival;
