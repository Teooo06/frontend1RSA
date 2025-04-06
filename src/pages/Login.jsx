import { useState, useRef } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message, Button } from "antd";
import { useAuth } from "../contex/AuthContext.jsx";
import { useTheme } from "../contex/ThemeContext.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);

    // Create refs for form elements for keyboard navigation
    const usernameInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const loginButtonRef = useRef(null);

    const navigate = useNavigate();
    const { login } = useAuth();
    const { darkMode } = useTheme();

    // Handle form submission - for both button click and Enter key
    const handleSubmit = async () => {
        setIsLoading(true); // Impostiamo lo stato di caricamento su true
        setError(null); // Resettiamo eventuali errori precedenti
        try {
            const loginData = {
                username: username,
                password: password
            };

            const response = await axios.post(
                `http://localhost:8080/api/users/login`, // Percorso corretto per il login
                loginData, // Corpo della richiesta
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                setIsAuthenticated(true);  // L'utente è autenticato
                setIsLoading(false); // Make sure to set loading to false on success
                message.success('Login effettuato con successo!');
                login(username);
                navigate("/");
            } else {
                setError('Credenziali errate.');
                setIsLoading(false); // Set loading to false on error
                message.error('Credenziali errate.');
            }
        } catch (error) {
            setIsLoading(false);
            
            // Check if it's an authentication error
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                setError('Wrong credentials');
                message.error('Wrong credentials');
            } else {
                setError('Errore durante il login.');
                message.error('Errore durante il login.');
            }
            console.error('Errore nel login:', error);
        }
    };

    // Rename the existing function and call the new handleSubmit function
    const handleLogin = handleSubmit;

    // Handle Enter key press to navigate between fields
    const handleKeyDown = (e, field) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (field === 'username') {
                passwordInputRef.current.focus();
            } else if (field === 'password') {
                // Submit the form when Enter is pressed on the password field
                handleSubmit();
                // Remove focus from the input
                passwordInputRef.current.blur();
            }
        }
    };

    const goToHome = () => {
        navigate('/');
    };

    return (
        <div className={`flex items-center justify-center h-screen w-screen ${darkMode ? 'bg-darkBg' : 'bg-white'}`}>
            <div className={`${darkMode ? 'bg-darkCard border-darkBorder' : 'bg-white border-gray-200'} p-10 rounded-2xl shadow-2xl w-full max-w-lg border`}>
                <div className="flex justify-end mb-4 items-center">
                    <ThemeToggle />
                </div>
                
                <h2 
                    onClick={goToHome}
                    className={`text-4xl font-bold text-center ${darkMode ? 'text-white' : 'text-black'} mb-6 cursor-pointer hover:text-blue-500`}
                >
                    Accedi
                </h2>

                <form className={darkMode ? 'text-white' : 'text-black'}>
                    {/* Username Input */}
                    <div className="mb-6">
                        <label className={`block ${darkMode ? 'text-white' : 'text-black'} font-medium mb-2`}>
                            Username
                        </label>
                        <div className={`flex items-center border rounded-lg p-3 ${darkMode ? 'bg-darkCard border-darkBorder' : 'bg-white'} focus-within:ring-2 focus-within:ring-blue-500`}>
                            <FaUser className="text-gray-500 mr-2" />
                            <input
                                ref={usernameInputRef}
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, 'username')}
                                className={`w-full bg-transparent focus:outline-none text-lg ${darkMode ? 'text-white placeholder-gray-400' : 'text-black'}`}
                                placeholder="Inserisci il tuo username"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="mb-6">
                        <label className={`block ${darkMode ? 'text-white' : 'text-black'} font-medium mb-2`}>
                            Password
                        </label>
                        <div className={`flex items-center border rounded-lg p-3 ${darkMode ? 'bg-darkCard border-darkBorder' : 'bg-white'} focus-within:ring-2 focus-within:ring-blue-500`}>
                            <FaLock className="text-gray-500 mr-2" />
                            <input
                                ref={passwordInputRef}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, 'password')}
                                className={`w-full bg-transparent focus:outline-none text-lg ${darkMode ? 'text-white placeholder-gray-400' : 'text-black'}`}
                                placeholder="Inserisci la tua password"
                            />
                        </div>
                    </div>

                    {/* Display error message */}
                    {error && (
                        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="button"
                        ref={loginButtonRef}
                        onClick={handleLogin}
                        disabled={!username || !password || isLoading}
                        className={`w-full py-3 rounded-lg font-semibold text-xl transition duration-300 ${
                            !username || !password || isLoading
                            ? 'bg-blue-300 cursor-not-allowed text-white' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    >
                        {isLoading ? 'Logging in...' : 'Accedi'}
                    </button>
                </form>

                {/* Footer with navigation links */}
                <div className="mt-6 pt-4 border-t border-gray-300 flex justify-between">
                    <Button 
                        type="link" 
                        onClick={() => navigate('/register')}
                        className="text-blue-500 hover:text-blue-600"
                    >
                        Registrati
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

export default Login;
