import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Tag, message } from 'antd';
import { SearchOutlined, CopyOutlined, UserOutlined, CalendarOutlined, UploadOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import { useNavigate } from 'react-router-dom'; // Just use the navigate hook
import axios from 'axios'; // Import axios for making requests
import { useAuth } from "./contex/AuthContext.jsx";

const App = () => {
    const navigate = useNavigate(); // Hook for navigation

    // State variables
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]); // State to store users' data
    const {isAuthenticated, logout } = useAuth(); // Usa lo stato di autenticazione

    // Fetch users data from backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/users/getKeys'); // Make a GET request to fetch data
                if (Array.isArray(response.data)) {
                    setUsers(response.data); // Set the response data to the state
                } else {
                    setUsers([]); // Ensure we set users as an empty array if the response is not an array
                    message.error('Dati non validi ricevuti dal server.');
                }
            } catch (error) {
                console.error('Error fetching users data:', error);
                setUsers([]); // Ensure we set users as an empty array in case of an error
                message.error('Impossibile caricare i dati degli utenti.');
            }
        };
        fetchUsers();
    }, []); // Empty dependency array to fetch data only on mount

    // Initialize chart
    useEffect(() => {
        const initChart = () => {
            const chartDom = document.getElementById('keySizeChart');
            if (!chartDom) return;

            const myChart = echarts.init(chartDom);
            const option = {
                animation: false,
                title: { text: 'Distribuzione Dimensioni Chiavi', left: 'center' },
                tooltip: { trigger: 'item' },
                series: [
                    {
                        name: 'Dimensione Chiave',
                        type: 'pie',
                        radius: '70%',
                        data: [
                            { value: 45, name: '2048 bit' },
                            { value: 30, name: '3072 bit' },
                            { value: 25, name: '4096 bit' },
                        ],
                    },
                ],
            };
            myChart.setOption(option);
        };

        initChart();
    }, []);

    // Force light theme (even when the browser is in dark mode)
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'light'); // Force light theme globally
        document.body.style.backgroundColor = '#f0f0f0'; // Keep body background light
        document.body.style.color = '#000'; // Make text dark
    }, []);

    // Handlers
    const handleLogin = () => {
        navigate('/login');
    };

    const handleUpload = () => {
        if (!isAuthenticated) {
            message.warning('Effettua il login per caricare una chiave');
            return;
        }
        window.location.href = '/upload'; // Navigate to upload page
    };

    const handleCopyKey = (key) => {
        navigator.clipboard.writeText(key);
        message.success('Chiave copiata negli appunti!');
    };

    const handleLogOut = () => {
        logout();
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-blue-600">KeyVault RSA</h1>
                    <div className="flex items-center space-x-6">
                        {!isAuthenticated ? (
                            <Button
                                type="primary"
                                icon={<UserOutlined />}
                                onClick={handleLogin}
                                loading={isLoading}
                                className="!rounded-button whitespace-nowrap"
                            >
                                Accedi
                            </Button>
                        ) : (
                            <>
                                <Button
                                    type="default"
                                    onClick={handleLogOut}
                                    className="!rounded-button whitespace-nowrap"
                                >
                                    Disconnetti
                                </Button>
                                <Button
                                    type="primary"
                                    className="!rounded-button whitespace-nowrap"
                                    onClick={() => navigate('/UserSection')}
                                >
                                    Area Personale
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Public Keys Section */}
                <section className="mb-8">
                    {isAuthenticated ? (
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold">Chiavi Pubbliche RSA</h2>
                            <Button
                                type="primary"
                                icon={<UploadOutlined />}
                                onClick={handleUpload}
                                className="!rounded-button whitespace-nowrap"
                            >
                                Carica Nuova Chiave
                            </Button>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center mb-6"></div>
                    )}

                    <div className="flex space-x-6">
                        {/* Keys List */}
                        <section className="w-full space-y-4">
                            {users.length === 0 ? (
                                <p>Nessuna chiave trovata</p>
                            ) : (
                                users.map((user, index) => (
                                    <Card key={index} className="shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                {/* Nome completo e username */}
                                                <h3 className="text-lg font-medium">
                                                    {user.user
                                                        ? `${user.user.name} ${user.user.surname} (${user.user.username})`
                                                        : 'Utente sconosciuto'}
                                                </h3>

                                                {/* Stato validazione */}
                                                <p className="text-gray-500 mt-1">
                                                    <Tag color={user.validazioni ? 'green' : 'red'}>
                                                        {user.validazioni ? 'Validata' : 'Non Validata'}
                                                    </Tag>
                                                </p>

                                                {/* Anteprima della chiave pubblica */}
                                                <p className="mt-2 font-mono text-sm text-gray-600">
                                                    {user.publicK
                                                        ? user.publicK.substring(0, 100)
                                                        : 'Nessuna chiave disponibile'}
                                                </p>
                                            </div>

                                            {/* Pulsante copia */}
                                            <Button
                                                icon={<CopyOutlined />}
                                                onClick={() => handleCopyKey(user.publicK)}
                                                className="!rounded-button whitespace-nowrap"
                                            >
                                                Copia Chiave
                                            </Button>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </section>
                    </div>
                </section>

                {/* Statistics Section */}
                <section className="bg-white p-6 rounded-lg shadow mt-8">
                    <h2 className="text-xl font-semibold mb-4">Statistiche</h2>
                    <div id="keySizeChart" style={{ height: '400px' }}></div>
                </section>
            </main>
        </div>
    );
};

export default App;
