import { useState } from "react";
import axios from "axios";
import {message} from "antd";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../contex/AuthContext.jsx";
import {FaLock, FaUser} from "react-icons/fa";

function Register() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { login, setuser } = useAuth();

    const handleSingIn = async () => {
        setIsLoading(true); // Impostiamo lo stato di caricamento su true
        setError(null); // Resettiamo eventuali errori precedenti
        try {
            const singInData = {
                name: name,
                surname: surname,
                username: username,
                password: password
            };

            console.log(singInData);

            const response = await axios.post(
                `http://localhost:8080/api/users/register`, // Percorso corretto per il login
                singInData, // Corpo della richiesta
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                setIsAuthenticated(true);  // L'utente è autenticato
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

    return (
    
        <div className="flex items-center justify-center h-screen w-screen bg-white">

            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200">
                
                <h2 className="text-4xl font-bold text-center text-black mb-6">
                    Registrati
                </h2>
                
                <form className="text-black">
                    <div className="mb-6">
                        <label className="block text-black font-medium mb-2">
                            Nome
                        </label>
                        <div className="flex items-center border rounded-lg p-3 bg-white focus-within:ring-2 focus-within:ring-blue-500">
                            <FaUser className="text-gray-500 mr-2" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-transparent focus:outline-none text-lg text-black"
                                placeholder="Inserisci il tuo nome"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-black font-medium mb-2">
                            Cognome
                        </label>
                        <div className="flex items-center border rounded-lg p-3 bg-white focus-within:ring-2 focus-within:ring-blue-500">
                            <FaUser className="text-gray-500 mr-2" />
                            <input
                                type="text"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                className="w-full bg-transparent focus:outline-none text-lg text-black"
                                placeholder="Inserisci il tuo cognome"
                            />
                        </div>
                    </div>
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
                    {error && (
                        <div className="text-red-600 text-center font-medium mb-4">
                            {error}
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleSingIn}
                        className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold text-xl hover:bg-blue-600 transition duration-300"
                    >
                        Registrati
                    </button>

                </form>
            
            </div>
        
        </div>
    
    );

}

export default Register;