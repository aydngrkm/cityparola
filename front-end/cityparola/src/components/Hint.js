/* 
import React, { useState } from 'react';
import axios from 'axios';
import './Hint.css';
import hintIcon from '../assets/hint.png';

const Hint = ({ questionId }) => {
    const [hintCount, setHintCount] = useState(3);
    const [hintText, setHintText] = useState("");
    const [isHintVisible, setIsHintVisible] = useState(false);

    const getHint = async () => {
        if (hintCount > 0) {
            try {
                const response = await axios.post('http://localhost:8000/api/get-hint', { question_id: questionId });
                setHintText(response.data.hint_text);
                setHintCount(hintCount - 1);
                setIsHintVisible(true);
            } catch (error) {
                console.error("Error fetching hint:", error);
            }
        }
    };

    return (
        <div className="hint-container">
            <div className="hint-button" onClick={getHint}>
                <img src={hintIcon} alt="hint" className={`hint-icon ${hintCount === 0 ? 'disabled' : ''}`} />
                <div className="hint-count">{hintCount}</div>
            </div>
            {isHintVisible && (
                <div className="hint-text">
                    {hintText}
                </div>
            )}
        </div>
    );
};

export default Hint;
*/
