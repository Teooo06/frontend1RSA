import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
    
        <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-blue-100 to-purple-100">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-lg">

                <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
                    Accedi
                </h2>
                
                <form>

                    {/* Email Input */}
                    <div className="mb-6">
                        
                        <label className="block text-gray-700 font-medium mb-2">
                            Email
                        </label>
                        
                        <div className="flex items-center border rounded-lg p-3 bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500">
                            <FaUser className="text-gray-500 mr-2" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent focus:outline-none text-lg"
                                placeholder="Inserisci la tua email"
                            />
                        </div>
                    
                    </div>

                    {/* Password Input */}
                    <div className="mb-6">
                        
                        <label className="block text-gray-700 font-medium mb-2">
                            Password
                        </label>
                    
                        <div className="flex items-center border rounded-lg p-3 bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500">
                            <FaLock className="text-gray-500 mr-2" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent focus:outline-none text-lg"
                                placeholder="Inserisci la tua password"
                            />
                        </div>
                    
                    </div>

                    {/* Submit Button */}
                    <button
                        type="button"
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