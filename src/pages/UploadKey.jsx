import React, { useState, useRef } from 'react';
import { Button, Input, message, Card, Alert } from 'antd';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../contex/ThemeContext.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

/**
 * Componente UploadKey
 * 
 * Questo componente fornisce un'interfaccia per gli utenti per caricare le loro chiavi pubbliche RSA.
 * Include validazione, gestione degli errori e funzionalità di accessibilità.
 */

const { TextArea } = Input;

const UploadKey = () => {
    const [key, setKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState('');
    
    const keyTextAreaRef = useRef(null);

    const navigate = useNavigate();
    const { darkMode } = useTheme();

    /**
     * Valida il formato della chiave pubblica RSA
     * Validazione meno restrittiva che controlla solo la lunghezza minima
     * 
     * @param {string} inputKey - La chiave da validare
     * @returns {boolean} - Se la chiave è valida
     */
    const validateKey = (inputKey) => {
        if (!inputKey) return false;
        if (inputKey.trim().length < 10) {
            return false;
        }
        return true;
    };
    
    /**
     * Restituisce un messaggio di errore di validazione appropriato in base alla validazione della chiave
     * 
     * @param {string} inputKey - La chiave da validare
     * @returns {string} - Messaggio di errore o stringa vuota se valida
     */
    const getValidationErrorMessage = (inputKey) => {
        if (!inputKey) return 'Inserire una chiave.';
        if (inputKey.trim().length < 10) {
            return 'La chiave è troppo corta. Inserisci una chiave RSA valida.';
        }
        return '';
    };

    /**
     * Gestisce i cambiamenti nell'input della chiave ed esegue la validazione
     * 
     * @param {Event} e - Evento di cambiamento dell'input
     */
    const handleKeyChange = (e) => {
        const newKey = e.target.value;
        setKey(newKey);
        if (!newKey) {
            setValidationError('');
            return;
        }
        if (!validateKey(newKey)) {
            setValidationError(getValidationErrorMessage(newKey));
        } else {
            setValidationError('');
        }
    };

    /**
     * Gestisce gli eventi da tastiera per l'invio del modulo
     * 
     * @param {KeyboardEvent} e - Evento da tastiera
     */
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleConfirm();
        }
    };

    /**
     * Invia la chiave al server con gestione degli errori
     */
    const submitKey = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const username = localStorage.getItem('username');
            if (!username) {
                throw new Error('Username non trovato nella sessione. Effettua nuovamente il login.');
            }
            
            const payload = { 
                key: key,
                user: username
            };
            
            const response = await axios.post(
                `http://localhost:8080/api/users/addKey`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(localStorage.getItem('token') && {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        })
                    },
                    timeout: 15000
                }
            );
            
            if (response.status === 200 || response.status === 201) {
                setIsLoading(false);
                message.success('Chiave salvata con successo!');
                navigate("/");
                return;
            }
            
            throw new Error(`Risposta con stato inatteso: ${response.status}`);
            
        } catch (error) {
            setIsLoading(false);
            
            if (error.response) {
                if (error.response.status === 401 || error.response.status === 403) {
                    const msg = 'Sessione scaduta. Effettua nuovamente il login.';
                    setError(msg);
                    message.error(msg);
                    setTimeout(() => navigate('/login'), 2000);
                    return;
                } else if (error.response.status === 400) {
                    const msg = 'Formato della chiave non valido.';
                    setError(msg);
                    message.error(msg);
                    return;
                }
            }
            
            const errorMsg = error?.response?.data?.message || 
                          error?.response?.statusText ||
                          error.message ||
                          'Impossibile salvare la chiave. Riprova più tardi.';
            
            setError(errorMsg);
            message.error(errorMsg);
        }
    };

    /**
     * Valida e avvia il processo di invio della chiave
     */
    const handleConfirm = async () => {
        if (!key) {
            setValidationError('Inserire una chiave.');
            return;
        }
        
        if (!validateKey(key)) {
            setValidationError(getValidationErrorMessage(key));
            return;
        }
        
        const username = localStorage.getItem('username');
        if (!username) {
            message.error('Sessione utente non valida. Effettua il login di nuovo.');
            navigate('/login');
            return;
        }
        
        submitKey();
    };

    /**
     * Annulla l'operazione e torna alla home
     */
    const handleCancel = () => {
        navigate("/");
        setKey('');
        message.info('Operazione annullata.');
    };

    const textAreaStyle = {
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
    };
    
    const globalScrollbarStyle = `
        .ant-input::-webkit-scrollbar {
            display: none;
        }

        .ant-btn-primary[disabled].dark-mode-button {
            color: rgba(255, 255, 255, 0.65) !important;
        }
    `;

    return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-darkBg' : 'bg-gray-100'}`}>
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

                <label className={`block font-medium mb-2 ${darkMode ? 'text-white' : ''}`}>
                    Chiave Pubblica <span className="text-xs text-gray-500 ml-1">(incolla la chiave completa)</span>
                </label>
                <TextArea
                    ref={keyTextAreaRef}
                    rows={6}
                    value={key}
                    onChange={handleKeyChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Incolla qui la tua chiave pubblica RSA (inclusi caratteri speciali come +, /, =)"
                    className={`mb-4 ${darkMode ? 'bg-darkCard border-darkBorder text-white' : ''}`}
                    status={validationError ? 'error' : ''}
                    style={textAreaStyle}
                />
                
                {validationError && (
                    <Alert 
                        message={validationError} 
                        type="error" 
                        showIcon 
                        className="mb-4"
                    />
                )}

                <div className="flex justify-between mt-4">
                    <Button 
                        type="primary" 
                        onClick={handleConfirm} 
                        loading={isLoading}
                        disabled={!!validationError || !key}
                        className={darkMode ? 'dark-mode-button' : ''}
                        style={darkMode && (!!validationError || !key) ? { color: 'rgba(255, 255, 255, 0.65)' } : {}}
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
                
                {!error && !validationError && (
                    <div className="mt-2 text-xs text-gray-500">
                        Nota: Assicurati di incollare la chiave RSA completa, inclusi eventuali caratteri speciali.
                    </div>
                )}

                {error && (
                    <Alert 
                        message={error}
                        description="Se il problema persiste, verifica che il formato della chiave sia corretto."
                        type="error" 
                        showIcon 
                        className="mt-4"
                    />
                )}
            </Card>
        </div>
    );
};

export default UploadKey;
