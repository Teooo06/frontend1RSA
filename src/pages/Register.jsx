import { useState, useRef } from "react";
import axios from "axios";
import { message, Alert, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contex/AuthContext.jsx";
import { FaLock, FaUser } from "react-icons/fa";
import { useTheme } from "../contex/ThemeContext.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

function Register() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);
    
    // Validation error states
    const [nameError, setNameError] = useState('');
    const [surnameError, setSurnameError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Create refs for form elements
    const nameInputRef = useRef(null);
    const surnameInputRef = useRef(null);
    const usernameInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const registerButtonRef = useRef(null);

    const navigate = useNavigate();
    const { login, setuser } = useAuth();
    const { darkMode } = useTheme();

    // Validation functions
    const validateName = (value) => {
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!value) return '';
        if (!nameRegex.test(value)) {
            return 'Il nome può contenere solo lettere.';
        }
        return '';
    };

    const validateSurname = (value) => {
        const surnameRegex = /^[a-zA-Z\s]+$/;
        if (!value) return '';
        if (!surnameRegex.test(value)) {
            return 'Il cognome può contenere solo lettere.';
        }
        return '';
    };

    const validateUsername = (value) => {
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!value) return '';
        if (!usernameRegex.test(value)) {
            return 'Lo username può contenere solo lettere e numeri.';
        }
        return '';
    };

    const validatePassword = (value) => {
        if (!value) return '';
        if (value.length < 8) {
            return 'La password deve contenere almeno 8 caratteri.';
        }
        return '';
    };
    
    // Handle input changes with validation
    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        setNameError(validateName(value));
    };
    
    const handleSurnameChange = (e) => {
        const value = e.target.value;
        setSurname(value);
        setSurnameError(validateSurname(value));
    };
    
    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        setUsernameError(validateUsername(value));
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordError(validatePassword(value));
    };

    // Handle form submission - for both button click and Enter key
    const handleSubmit = async () => {
        const currentNameError = validateName(name);
        const currentSurnameError = validateSurname(surname);
        const currentUsernameError = validateUsername(username);
        const currentPasswordError = validatePassword(password);
        
        setNameError(currentNameError);
        setSurnameError(currentSurnameError);
        setUsernameError(currentUsernameError);
        setPasswordError(currentPasswordError);
        
        if (currentNameError || currentSurnameError || currentUsernameError || currentPasswordError || !name || !surname || !username || !password) {
            setError('Compila tutti i campi correttamente.');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        try {
            const singInData = {
                name: name,
                surname: surname,
                username: username,
                password: password
            };

            const response = await axios.post(
                `http://localhost:8080/api/users/register`,
                singInData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                setIsAuthenticated(true);
                message.success('Sing In effettuato con successo!');
                login(username);
                navigate("/");
            } else {
                setError('Credenziali errate.');
                message.error('Credenziali errate.');
            }
        } catch (error) {
            setIsLoading(false);

            if (error.response && error.response.status === 409) {
                setError("Username già esistente.");
            } else {
                setError("Errore durante la registrazione.");
            }

            console.error("Errore nella registrazione:", error);
        }
    };

    const handleSingIn = handleSubmit;

    // Handle Enter key press to navigate between fields
    const handleKeyDown = (e, field) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            switch(field) {
                case 'name':
                    surnameInputRef.current.focus();
                    break;
                case 'surname':
                    usernameInputRef.current.focus();
                    break;
                case 'username':
                    passwordInputRef.current.focus();
                    break;
                case 'password':
                    handleSubmit();
                    passwordInputRef.current.blur();
                    break;
                default:
                    break;
            }
        }
    };

    const goToHome = () => {
        navigate('/');
    };

    const goToLogin = () => {
        navigate('/login');
    };

    const isSubmitDisabled = nameError || surnameError || usernameError || passwordError || !name || !surname || !username || !password;

    return (
        <div className={`flex items-center justify-center h-screen w-screen ${darkMode ? 'bg-darkBg' : 'bg-white'}`}>
            <div className={`${darkMode ? 'bg-darkCard border-darkBorder' : 'bg-white border-gray-200'} p-10 rounded-2xl shadow-2xl w-full max-w-lg border`}>
                <div className="flex justify-end mb-4">
                    <ThemeToggle />
                </div>
                
                <h2 
                    onClick={goToHome}
                    className={`text-4xl font-bold text-center ${darkMode ? 'text-white' : 'text-black'} mb-6 cursor-pointer hover:text-blue-500 transition duration-200`}
                >
                    Registrati
                </h2>
                
                <form className={darkMode ? 'text-white' : 'text-black'}>
                    <div className="mb-6">
                        <label className={`block ${darkMode ? 'text-white' : 'text-black'} font-medium mb-2`}>
                            Nome
                        </label>
                        <div className={`flex items-center border rounded-lg p-3 ${nameError ? 'border-red-500' : ''} ${darkMode ? 'bg-darkCard border-darkBorder' : 'bg-white'} focus-within:ring-2 focus-within:ring-blue-500`}>
                            <FaUser className={`${nameError ? 'text-red-500' : 'text-gray-500'} mr-2`} />
                            <input
                                ref={nameInputRef}
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                onKeyDown={(e) => handleKeyDown(e, 'name')}
                                className={`w-full bg-transparent focus:outline-none text-lg ${darkMode ? 'text-white placeholder-gray-400' : 'text-black'}`}
                                placeholder="Inserisci il tuo nome"
                            />
                        </div>
                        {nameError && (
                            <div className="text-red-500 text-sm mt-1">{nameError}</div>
                        )}
                    </div>
                    
                    <div className="mb-6">
                        <label className={`block ${darkMode ? 'text-white' : 'text-black'} font-medium mb-2`}>
                            Cognome
                        </label>
                        <div className={`flex items-center border rounded-lg p-3 ${surnameError ? 'border-red-500' : ''} ${darkMode ? 'bg-darkCard border-darkBorder' : 'bg-white'} focus-within:ring-2 focus-within:ring-blue-500`}>
                            <FaUser className={`${surnameError ? 'text-red-500' : 'text-gray-500'} mr-2`} />
                            <input
                                ref={surnameInputRef}
                                type="text"
                                value={surname}
                                onChange={handleSurnameChange}
                                onKeyDown={(e) => handleKeyDown(e, 'surname')}
                                className={`w-full bg-transparent focus:outline-none text-lg ${darkMode ? 'text-white placeholder-gray-400' : 'text-black'}`}
                                placeholder="Inserisci il tuo cognome"
                            />
                        </div>
                        {surnameError && (
                            <div className="text-red-500 text-sm mt-1">{surnameError}</div>
                        )}
                    </div>
                    
                    <div className="mb-6">
                        <label className={`block ${darkMode ? 'text-white' : 'text-black'} font-medium mb-2`}>
                            Username
                        </label>
                        <div className={`flex items-center border rounded-lg p-3 ${usernameError ? 'border-red-500' : ''} ${darkMode ? 'bg-darkCard border-darkBorder' : 'bg-white'} focus-within:ring-2 focus-within:ring-blue-500`}>
                            <FaUser className={`${usernameError ? 'text-red-500' : 'text-gray-500'} mr-2`} />
                            <input
                                ref={usernameInputRef}
                                type="text"
                                value={username}
                                onChange={handleUsernameChange}
                                onKeyDown={(e) => handleKeyDown(e, 'username')}
                                className={`w-full bg-transparent focus:outline-none text-lg ${darkMode ? 'text-white placeholder-gray-400' : 'text-black'}`}
                                placeholder="Inserisci il tuo username"
                            />
                        </div>
                        {usernameError && (
                            <div className="text-red-500 text-sm mt-1">{usernameError}</div>
                        )}
                    </div>
                    
                    <div className="mb-6">
                        <label className={`block ${darkMode ? 'text-white' : 'text-black'} font-medium mb-2`}>
                            Password
                        </label>
                        <div className={`flex items-center border rounded-lg p-3 ${passwordError ? 'border-red-500' : ''} ${darkMode ? 'bg-darkCard border-darkBorder' : 'bg-white'} focus-within:ring-2 focus-within:ring-blue-500`}>
                            <FaLock className={`${passwordError ? 'text-red-500' : 'text-gray-500'} mr-2`} />
                            <input
                                ref={passwordInputRef}
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                onKeyDown={(e) => handleKeyDown(e, 'password')}
                                className={`w-full bg-transparent focus:outline-none text-lg ${darkMode ? 'text-white placeholder-gray-400' : 'text-black'}`}
                                placeholder="Inserisci la tua password"
                            />
                        </div>
                        {passwordError && (
                            <div className="text-red-500 text-sm mt-1">{passwordError}</div>
                        )}
                    </div>
                    
                    {error && (
                        <Alert 
                            message={error} 
                            type="error" 
                            showIcon 
                            className="mb-4"
                        />
                    )}
                    
                    <button
                        type="button"
                        ref={registerButtonRef}
                        onClick={handleSingIn}
                        disabled={isSubmitDisabled}
                        className={`w-full ${isSubmitDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white py-3 rounded-lg font-semibold text-xl transition duration-300`}
                    >
                        Registrati
                    </button>
                </form>
                
                <div className="mt-6 pt-4 border-t border-gray-300 flex justify-between">
                    <Button 
                        type="link" 
                        onClick={goToLogin}
                        className="text-blue-500 hover:text-blue-600"
                    >
                        Torna al Login
                    </Button>
                    <Button 
                        type="link" 
                        onClick={goToHome}
                        className="text-blue-500 hover:text-blue-600"
                    >
                        Torna alla Home
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Register;