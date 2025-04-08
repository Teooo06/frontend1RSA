import React, { useState, useRef } from 'react';
import { Button, Input, message, Card, Alert } from 'antd';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../contex/ThemeContext.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

const { TextArea } = Input;

const UploadKey = () => {
    const [key, setKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState('');
    
    // Add ref for the textarea
    const keyTextAreaRef = useRef(null);

    const navigate = useNavigate();
    const { darkMode } = useTheme();

    // Function to validate the key (only allow alphanumeric characters)
    const validateKey = (inputKey) => {
        // This regex checks if the key contains only letters and numbers
        const alphanumericRegex = /^[a-zA-Z0-9]+$/;
        return alphanumericRegex.test(inputKey);
    };

    // Handle key input change with validation
    const handleKeyChange = (e) => {
        const newKey = e.target.value;
        setKey(newKey);
        
        // Clear validation error if input is empty
        if (!newKey) {
            setValidationError('');
            return;
        }
        
        // Show validation error if key contains special characters
        if (!validateKey(newKey)) {
            setValidationError('La chiave può contenere solo lettere e numeri (nessun carattere speciale).');
        } else {
            setValidationError('');
        }
    };

    // Handle key press events
    const handleKeyDown = (e) => {
        // Check if Enter was pressed (without Shift for new lines)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent default behavior (new line)
            handleConfirm(); // Call the confirm function
        }
    };

    const handleConfirm = async () => {
        // Check if key is valid before submitting
        if (!key) {
            setValidationError('Inserire una chiave.');
            return;
        }
        
        if (!validateKey(key)) {
            setValidationError('La chiave può contenere solo lettere e numeri (nessun carattere speciale).');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        try {
            const loginData = {
                key: key,
                user: localStorage.getItem('username')
            };

            const response = await axios.post(
                `http://localhost:8080/api/users/addKey`,
                loginData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                message.success('Chiave salvata con successo!');
                navigate("/");
            } else {
                setError('Credenziali errate.');
                message.error('Credenziali errate.');
            }
        } catch (error) {
            setIsLoading(false);
            setError('Errore durante il login.');
            message.error('Errore durante il login.');
            console.error('Errore nel login:', error);
        }
    };

    // Function to handle cancel action
    const handleCancel = () => {
        navigate("/");
        setKey('');
        message.info('Operazione annullata.');
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-darkBg' : 'bg-gray-100'}`}>
            <Card className={`w-full max-w-lg p-6 shadow-md ${darkMode ? 'bg-darkCard border-darkBorder' : ''}`}>
                <div className="flex justify-end mb-4">
                    <ThemeToggle />
                </div>
                
                <h2 
                    onClick={() => navigate('/')}
                    className={`text-2xl font-semibold mb-4 text-center ${darkMode ? 'text-white' : ''} cursor-pointer hover:text-blue-500 transition duration-200`}
                >
                    Carica Nuova Chiave RSA
                </h2>

                {/* Text area for RSA key input */}
                <label className={`block font-medium mb-2 ${darkMode ? 'text-white' : ''}`}>Chiave Pubblica</label>
                <TextArea
                    ref={keyTextAreaRef}
                    rows={4}
                    value={key}
                    onChange={handleKeyChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Incolla qui la tua chiave pubblica RSA"
                    className={`mb-4 ${darkMode ? 'bg-darkCard border-darkBorder text-white' : ''}`}
                    status={validationError ? 'error' : ''}
                />
                
                {/* Display validation error */}
                {validationError && (
                    <Alert 
                        message={validationError} 
                        type="error" 
                        showIcon 
                        className="mb-4"
                    />
                )}

                {/* Action buttons */}
                <div className="flex justify-between mt-4">
                    <Button 
                        type="primary" 
                        onClick={handleConfirm} 
                        loading={isLoading}
                        disabled={!!validationError}
                    >
                        Conferma
                    </Button>
                    <Button 
                        type="default" 
                        onClick={handleCancel} 
                        className={darkMode ? 'border-gray-600 text-white' : ''}
                    >
                        Annulla
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default UploadKey;
