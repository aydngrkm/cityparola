import React from 'react';
import './Modal.css';

const Modal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-buttons">
                    <button className="modal-button confirm" onClick={onConfirm}>Yes</button>
                    <button className="modal-button cancel" onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
