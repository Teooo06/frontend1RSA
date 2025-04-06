import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {message} from "antd";
import { useAuth } from "../contex/AuthContext.jsx";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async () => {
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
                message.success('Login effettuato con successo!');
                login(username);
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

    return (
        <div className="flex items-center justify-center h-screen w-screen bg-white">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200">
                <h2 className="text-4xl font-bold text-center text-black mb-6">
                    Accedi
                </h2>

                <form className="text-black">
                    {/* Username Input */}
                    <div className="mb-6">
                        <label className="block text-black font-medium mb-2">
                            Username
                        </label>
                        <div className="flex items-center border rounded-lg p-3 bg-white focus-within:ring-2 focus-within:ring-blue-500">
                            <FaUser className="text-gray-500 mr-2" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-transparent focus:outline-none text-lg text-black"
                                placeholder="Inserisci il tuo username"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="mb-6">
                        <label className="block text-black font-medium mb-2">
                            Password
                        </label>
                        <div className="flex items-center border rounded-lg p-3 bg-white focus-within:ring-2 focus-within:ring-blue-500">
                            <FaLock className="text-gray-500 mr-2" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent focus:outline-none text-lg text-black"
                                placeholder="Inserisci la tua password"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="button"
                        onClick={handleLogin}
                        className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold text-xl hover:bg-blue-600 transition duration-300"
                    >
                        Accedi
                    </button>
                </form>

                {/* Register Link */}
                <p className="text-center text-gray-600 mt-6">
                    Non hai un account?{" "}
                    <a href="/register" className="text-blue-500 hover:underline">
                        Registrati
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Login;
