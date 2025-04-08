import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Card, Tag, message } from 'antd';
import { SearchOutlined, CopyOutlined, UserOutlined, CalendarOutlined, UploadOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import { useNavigate } from 'react-router-dom'; // Just use the navigate hook
import axios from 'axios'; // Import axios for making requests
import { useAuth } from "./contex/AuthContext.jsx";
import { useTheme } from "./contex/ThemeContext.jsx";
import ThemeToggle from './components/ThemeToggle.jsx';

const App = () => {
    const navigate = useNavigate(); // Hook for navigation
    
    // Chart reference for proper cleanup and reinitialization
    const chartRef = useRef(null);

    // State variables
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]); // State to store users' data
    const {isAuthenticated, logout } = useAuth(); // Usa lo stato di autenticazione
    const { darkMode } = useTheme(); // Get dark mode state
    const [copiedKeyId, setCopiedKeyId] = useState(null); // State to track which key is being copied

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

    // Process key data to get distribution by key length
    const processKeyLengthData = () => {
        // Standard RSA key lengths in bits
        const standardLengths = [1024, 2048, 3072, 4096];
        const lengthCounts = {};
        
        // Initialize counts for all standard lengths
        standardLengths.forEach(length => {
            lengthCounts[length] = 0;
        });
        
        // Add a category for non-standard lengths
        lengthCounts['other'] = 0;
        
        // Count keys by their approximate bit length
        users.forEach(user => {
            if (user.publicK) {
                // Convert character count to approximate bit length (1 char ≈ 8 bits)
                const keyLengthInBits = user.publicK.length * 8;
                
                // Find the closest standard key length
                let matched = false;
                for (const stdLength of standardLengths) {
                    // Allow 5% tolerance for matching standard lengths
                    const minLength = stdLength * 0.95;
                    const maxLength = stdLength * 1.05;
                    
                    if (keyLengthInBits >= minLength && keyLengthInBits <= maxLength) {
                        lengthCounts[stdLength]++;
                        matched = true;
                        break;
                    }
                }
                
                // If no standard length matched, count as "other"
                if (!matched) {
                    lengthCounts['other']++;
                }
            }
        });
        
        // Convert counts to chart data format
        const chartData = Object.entries(lengthCounts)
            .filter(([_, count]) => count > 0) // Only include lengths that have at least one key
            .map(([length, count]) => ({
                value: count,
                name: length === 'other' ? 'Altro' : `${length} bit`
            }));
            
        return chartData;
    };

    // Initialize and update chart when darkMode changes or users data changes
    useEffect(() => {
        const chartDom = document.getElementById('keySizeChart');
        if (!chartDom) return;
        
        // Properly dispose of any existing chart instance to prevent memory leaks
        if (chartRef.current) {
            chartRef.current.dispose();
        }
        
        // Create fresh chart instance
        const myChart = echarts.init(chartDom);
        chartRef.current = myChart;
        
        // Process key length data
        const keyLengthData = processKeyLengthData();
        
        // Calculate total for percentage display
        const total = keyLengthData.reduce((sum, item) => sum + item.value, 0);
        
        // Configure chart based on current theme and real data
        const option = {
            animation: false,
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            title: { 
                text: 'Distribuzione Dimensioni Chiavi', 
                left: 'center',
                textStyle: {
                    color: darkMode ? '#ffffff' : '#333333'
                }
            },
            tooltip: { 
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)' 
            },
            textStyle: {
                color: darkMode ? '#ffffff' : '#333333'
            },
            series: [
                {
                    name: 'Dimensione Chiave',
                    type: 'pie',
                    radius: '70%',
                    label: {
                        color: darkMode ? '#ffffff' : '#333333',
                        formatter: '{b}: {c} ({d}%)'
                    },
                    data: keyLengthData.length > 0 ? keyLengthData : [
                        { value: 1, name: 'Nessuna chiave' }
                    ],
                },
            ],
        };
        
        myChart.setOption(option);
        
        // Handle window resize
        const handleResize = () => {
            myChart.resize();
        };
        window.addEventListener('resize', handleResize);
        
        // Clean up
        return () => {
            window.removeEventListener('resize', handleResize);
            myChart.dispose();
            chartRef.current = null;
        };
    }, [darkMode, users]); // Re-run when darkMode or users data changes

    // Handlers
    const handleLogin = () => {
        navigate('/login');
    };

    const handleUpload = () => {
        if (!isAuthenticated) {
            message.warning('Effettua il login per caricare una chiave');
            return;
        }
        // Use React Router navigate instead of window.location for smoother transitions
        // that preserve the state, including dark mode
        navigate('/upload');
    };

    const handleCopyKey = (key, id) => {
        navigator.clipboard.writeText(key)
            .then(() => {
                // Set this key as being copied - for visual feedback
                setCopiedKeyId(id);
                
                // Reset states after 5 seconds
                setTimeout(() => {
                    setCopiedKeyId(null);
                }, 5000);
            })
            .catch(err => {
                message.error('Impossibile copiare la chiave');
                console.error('Failed to copy: ', err);
            });
    };

    const handleLogOut = () => {
        logout();
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'dark:bg-darkBg' : 'bg-gray-50'}`}>
            {/* Header */}
            <header className={`${darkMode ? 'dark:bg-darkCard dark:border-darkBorder border-b' : 'bg-white shadow-md'}`}>
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 
                        onClick={() => navigate('/')}
                        className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'} cursor-pointer hover:text-blue-500 transition duration-200`}
                    >
                        KeyVault RSA
                    </h1>
                    <div className="flex items-center space-x-6">
                        <ThemeToggle />
                        
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
                            <h2 
                                onClick={() => navigate('/')}
                                className={`text-2xl font-semibold ${darkMode ? 'text-white' : ''} cursor-pointer hover:text-blue-500 transition duration-200`}
                            >
                                Chiavi Pubbliche RSA
                            </h2>
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
                                <p className={darkMode ? 'text-gray-300' : ''}>Nessuna chiave trovata</p>
                            ) : (
                                users.map((user, index) => (
                                    <Card key={index} className={darkMode ? 'shadow-sm dark:bg-darkCard dark:border-darkBorder' : 'shadow-sm'}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                {/* Nome completo e username */}
                                                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : ''}`}>
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
                                                <p className={`mt-2 font-mono text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    {user.publicK
                                                        ? user.publicK.substring(0, 100)
                                                        : 'Nessuna chiave disponibile'}
                                                </p>
                                            </div>

                                            {/* Pulsante copia - with copy feedback */}
                                            <Button
                                                icon={copiedKeyId === index ? null : <CopyOutlined />}
                                                onClick={() => handleCopyKey(user.publicK, index)}
                                                className={`!rounded-button whitespace-nowrap transition-colors duration-200 ${
                                                    copiedKeyId === index 
                                                        ? '!bg-green-100 !text-green-800 !border-green-500 hover:!bg-green-100 hover:!text-green-800 focus:!bg-green-100 focus:!text-green-800 active:!bg-green-100' 
                                                        : darkMode 
                                                            ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' 
                                                            : ''
                                                }`}
                                            >
                                                {copiedKeyId === index ? 'Chiave Copiata' : 'Copia Chiave'}
                                            </Button>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </section>
                    </div>
                </section>

                {/* Statistics Section */}
                <section className={`${darkMode ? 'dark:bg-darkCard dark:border-darkBorder border' : 'bg-white'} p-6 rounded-lg shadow mt-8`}>
                    <h2 
                        onClick={() => navigate('/')}
                        className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : ''} cursor-pointer hover:text-blue-500 transition duration-200`}
                    >
                        Statistiche
                    </h2>
                    <div id="keySizeChart" style={{ height: '400px' }}></div>
                </section>
            </main>
        </div>
    );
};

export default App;
