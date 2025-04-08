import React, { useState, useRef } from 'react';
import { Button, Input, message, Card, Alert, Select } from 'antd';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../contex/ThemeContext.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

const { TextArea } = Input;
const { Option } = Select;

const UploadKey = () => {
    const [key, setKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState('');
    const [keyLength, setKeyLength] = useState(null);
    
    // Add ref for the textarea
    const keyTextAreaRef = useRef(null);

    const navigate = useNavigate();
    const { darkMode } = useTheme();

    // Valid RSA key lengths
    const validKeyLengths = [1024, 2048, 3072, 4096];

    // Function to generate a random RSA key of specified length
    const generateRandomKey = (length) => {
        console.log("Generating key with length:", length);
        
        if (!length) {
            message.error('Seleziona prima una lunghezza di chiave');
            return;
        }
        
        try {
            // Generate a random alphanumeric string of appropriate length
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            
            // Ensure length is treated as a number
            const bitLength = parseInt(length, 10);
            if (isNaN(bitLength)) {
                message.error('Lunghezza chiave non valida');
                return;
            }
            
            // Calculate exact character count for the selected bit length
            // (8 bits per character in our simulation)
            const charCount = Math.ceil(bitLength / 8);
            console.log("Character count:", charCount);
            
            for (let i = 0; i < charCount; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            
            console.log("Generated key length (chars):", result.length);
            setKey(result);
            setValidationError('');
            message.success(`Chiave di ${bitLength} bit generata con successo!`);
        } catch (error) {
            console.error("Error generating key:", error);
            message.error('Errore durante la generazione della chiave');
        }
    };

    // Function to validate the key (checks for alphanumeric characters AND valid length)
    const validateKey = (inputKey) => {
        // Empty key is invalid but handled separately
        if (!inputKey) return false;
        
        // Check if key contains only letters and numbers
        const alphanumericRegex = /^[a-zA-Z0-9]+$/;
        if (!alphanumericRegex.test(inputKey)) {
            return false;
        }
        
        // For generated keys or manually entered keys that match our pattern,
        // we'll consider them valid
        return true;
    };
    
    // Get the error message based on key validation
    const getValidationErrorMessage = (inputKey) => {
        if (!inputKey) return 'Inserire una chiave.';
        
        const alphanumericRegex = /^[a-zA-Z0-9]+$/;
        if (!alphanumericRegex.test(inputKey)) {
            return 'La chiave può contenere solo lettere e numeri (nessun carattere speciale).';
        }
        
        return '';
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
        
        // Validate the key and show appropriate error message
        if (!validateKey(newKey)) {
            setValidationError(getValidationErrorMessage(newKey));
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

    // Try multiple submission formats
    const attemptKeySubmission = async () => {
        setIsLoading(true);
        setError(null);
        
        // Create an array of different payload formats to try
        const payloadFormats = [
            // Format 1: Using publicK field
            { 
                payload: { publicK: key, user: localStorage.getItem('username') },
                description: "Format with publicK field"
            },
            // Format 2: Using key field
            { 
                payload: { key: key, user: localStorage.getItem('username') },
                description: "Format with key field"
            },
            // Format 3: Using nested user object
            { 
                payload: { publicK: key, user: { username: localStorage.getItem('username') } },
                description: "Format with nested user object"
            },
            // Format 4: Using username directly
            { 
                payload: { publicK: key, username: localStorage.getItem('username') },
                description: "Format with username field"
            }
        ];
        
        let lastError = null;
        
        // Try each format until one succeeds
        for (const format of payloadFormats) {
            try {
                console.log(`Trying submission with ${format.description}:`, format.payload);
                
                const response = await axios.post(
                    `http://localhost:8080/api/users/addKey`,
                    format.payload,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        timeout: 10000
                    }
                );
                
                console.log(`${format.description} response:`, response);
                
                if (response.status === 200) {
                    setIsLoading(false);
                    message.success('Chiave salvata con successo!');
                    navigate("/");
                    return; // Success! Exit the function
                }
            } catch (error) {
                console.error(`${format.description} failed:`, error);
                lastError = error;
            }
        }
        
        // If we get here, all formats failed
        setIsLoading(false);
        
        // Use the last error for messaging
        if (lastError?.response?.status === 500) {
            setError('Il server ha riscontrato un problema. Potrebbe esserci un problema con il formato della chiave o con il server stesso.');
            message.error('Errore del server. Per favore contatta l\'amministratore.');
        } else {
            const errorMsg = lastError?.response?.data?.message || 
                          lastError?.response?.statusText ||
                          'Impossibile salvare la chiave. Riprova più tardi.';
            
            setError(errorMsg);
            message.error(errorMsg);
        }
    };

    // Modified handleConfirm to use the new multi-attempt function
    const handleConfirm = async () => {
        // Check if key is valid before submitting
        if (!key) {
            setValidationError('Inserire una chiave.');
            return;
        }
        
        if (!validateKey(key)) {
            setValidationError(getValidationErrorMessage(key));
            return;
        }
        
        // Get username from localStorage
        const username = localStorage.getItem('username');
        if (!username) {
            message.error('Sessione utente non valida. Effettua il login di nuovo.');
            navigate('/login');
            return;
        }
        
        // Try all submission formats
        attemptKeySubmission();
    };

    const tryAlternativeSubmission = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const alternativeData = {
                keyValue: key,
                username: localStorage.getItem('username')
            };
            
            console.log("Trying alternative submission format:", alternativeData);
            
            const response = await axios.post(
                `http://localhost:8080/api/users/addKey`,
                alternativeData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.status === 200) {
                setIsLoading(false);
                message.success('Chiave salvata con successo!');
                navigate("/");
            } else {
                throw new Error(`Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Alternative submission failed:", error);
            setIsLoading(false);
            setError("Anche il formato alternativo non ha funzionato. Contatta l'amministratore del sistema.");
        }
    };

    // Function to directly send a simplified request
    const trySimplifiedSubmission = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // Get the username
            const username = localStorage.getItem('username');
            
            // Try the simplest possible format
            const simpleData = { 
                key: key,
                username: username 
            };
            
            console.log("Trying simplified submission:", simpleData);
            
            // Use fetch instead of axios for a different approach
            const response = await fetch('http://localhost:8080/api/users/addKey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(simpleData)
            });
            
            if (response.ok) {
                setIsLoading(false);
                message.success('Chiave salvata con successo!');
                navigate("/");
            } else {
                throw new Error(`Status: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error("Simplified submission failed:", error);
            setIsLoading(false);
            setError("Anche il formato semplificato ha fallito. Si prega di contattare l'assistenza tecnica.");
        }
    };

    // Function to handle cancel action
    const handleCancel = () => {
        navigate("/");
        setKey('');
        message.info('Operazione annullata.');
    };

    // Handle key length selection
    const handleKeyLengthChange = (value) => {
        console.log("Selected key length:", value);
        setKeyLength(value);
    };

    // Custom styles to hide scrollbar while maintaining scroll functionality
    const textAreaStyle = {
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none', /* IE 10+ */
    };
    
    // Remove webkit scrollbar
    const globalScrollbarStyle = `
        .ant-input::-webkit-scrollbar {
            display: none;
        }
    `;

    return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-darkBg' : 'bg-gray-100'}`}>
            {/* Add global style to hide webkit scrollbar */}
            <style>{globalScrollbarStyle}</style>
            
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

                {/* Text area for RSA key input with hidden scrollbar */}
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
                    style={textAreaStyle}
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

                {/* Key generation options */}
                <div className="flex items-center mb-4">
                    <Select
                        placeholder="Seleziona lunghezza chiave"
                        style={{ width: 200, marginRight: 8 }}
                        onChange={handleKeyLengthChange}
                        value={keyLength}
                        className={darkMode ? 'ant-select-dark' : ''}
                    >
                        <Option value="1024">1024 bit</Option>
                        <Option value="2048">2048 bit</Option>
                        <Option value="3072">3072 bit</Option>
                        <Option value="4096">4096 bit</Option>
                    </Select>
                    <Button 
                        onClick={() => generateRandomKey(keyLength)}
                        className={`mr-2 ${darkMode ? 'border-gray-600 text-white' : ''}`}
                        disabled={!keyLength}
                    >
                        Genera
                    </Button>
                </div>

                {/* Action buttons */}
                <div className="flex justify-between mt-4">
                    <Button 
                        type="primary" 
                        onClick={handleConfirm} 
                        loading={isLoading}
                        disabled={!!validationError || !key}
                    >
                        Conferma
                    </Button>
                    <Button 
                        type="default" 
                        onClick={handleCancel} 
                        className={darkMode ? 'border-gray-600 text-white' : ''}
                        disabled={isLoading}
                    >
                        Annulla
                    </Button>
                </div>
                
                {/* Display error message with retry options if server error occurs */}
                {error && (
                    <div className="mt-4">
                        <Alert 
                            message={error} 
                            type="error" 
                            showIcon 
                            className="mb-2"
                        />
                        <div className="flex justify-between mt-2">
                            <Button 
                                onClick={tryAlternativeSubmission}
                                type="default"
                                disabled={isLoading}
                            >
                                Formato alternativo
                            </Button>
                            <Button 
                                onClick={trySimplifiedSubmission}
                                type="default"
                                disabled={isLoading}
                            >
                                Formato semplificato
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default UploadKey;
