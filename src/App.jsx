import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Card, Tag, message } from 'antd';
import { SearchOutlined, CopyOutlined, UserOutlined, CalendarOutlined, UploadOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import { useAuth } from "./contex/AuthContext.jsx";
import { useTheme } from "./contex/ThemeContext.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";

const App = () => {
    const navigate = useNavigate(); // Hook per la navigazione
    
    // Riferimento per il grafico (per pulizia e reinizializzazione corretta)
    const chartRef = useRef(null);

    // Variabili di stato
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]); // Stato per memorizzare i dati degli utenti
    const [searchText, setSearchText] = useState(''); // Stato per il testo di ricerca
    const {isAuthenticated, logout } = useAuth(); // Stato di autenticazione
    const { darkMode } = useTheme(); // Stato modalità scura
    const [copiedKeyId, setCopiedKeyId] = useState(null); // Stato per tenere traccia della chiave copiata

    // Recupero dati utenti dal backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/users/getKeys'); 
                if (Array.isArray(response.data)) {
                    setUsers(response.data); // Imposta i dati di risposta nello stato
                } else {
                    setUsers([]); // Assicura che lo stato users sia un array vuoto se la risposta non è un array
                    message.error('Dati non validi ricevuti dal server.');
                }
            } catch (error) {
                console.error('Errore nel recupero dei dati degli utenti:', error);
                setUsers([]); // Assicura che lo stato users sia un array vuoto in caso di errore
                message.error('Impossibile caricare i dati degli utenti.');
            }
        };
        fetchUsers();
    }, []); // Array di dipendenze vuoto per eseguire il fetch solo al montaggio

    // Elabora i dati delle chiavi per ottenere la distribuzione per lunghezza
    const processKeyLengthData = () => {
        // Lunghezze standard delle chiavi RSA in bit
        const standardLengths = [1024, 2048, 3072, 4096];
        const lengthCounts = {};
        
        // Inizializza i conteggi per tutte le lunghezze standard
        standardLengths.forEach(length => {
            lengthCounts[length] = 0;
        });
        
        // Aggiungi una categoria per lunghezze non standard
        lengthCounts['other'] = 0;
        
        // Conta le chiavi per la loro lunghezza approssimativa in bit
        users.forEach(user => {
            if (user.publicK) {
                // Converti il conteggio dei caratteri in lunghezza approssimativa in bit (1 carattere ≈ 8 bit)
                const keyLengthInBits = user.publicK.length * 8;
                
                // Trova la lunghezza standard più vicina
                let matched = false;
                for (const stdLength of standardLengths) {
                    // Consenti una tolleranza del 5% per corrispondere alle lunghezze standard
                    const minLength = stdLength * 0.95;
                    const maxLength = stdLength * 1.05;
                    
                    if (keyLengthInBits >= minLength && keyLengthInBits <= maxLength) {
                        lengthCounts[stdLength]++;
                        matched = true;
                        break;
                    }
                }
                
                // Se nessuna lunghezza standard corrisponde, conta come "altro"
                if (!matched) {
                    lengthCounts['other']++;
                }
            }
        });
        
        // Converti i conteggi nel formato dati del grafico
        const chartData = Object.entries(lengthCounts)
            .filter(([_, count]) => count > 0) // Includi solo le lunghezze che hanno almeno una chiave
            .map(([length, count]) => ({
                value: count,
                name: length === 'other' ? 'Altro' : `${length} bit`
            }));
            
        return chartData;
    };

    // Inizializza e aggiorna il grafico quando cambia darkMode o i dati degli utenti
    useEffect(() => {
        const chartDom = document.getElementById('keySizeChart');
        if (!chartDom) return;
        
        // Smaltisce correttamente l'istanza del grafico esistente per prevenire perdite di memoria
        if (chartRef.current) {
            chartRef.current.dispose();
        }
        
        // Crea una nuova istanza del grafico
        const myChart = echarts.init(chartDom);
        chartRef.current = myChart;
        
        // Elabora i dati di lunghezza delle chiavi
        const keyLengthData = processKeyLengthData();
        
        // Calcola il totale per la visualizzazione percentuale
        const total = keyLengthData.reduce((sum, item) => sum + item.value, 0);
        
        // Configura il grafico in base al tema corrente e ai dati reali
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
        
        // Gestione del ridimensionamento della finestra
        const handleResize = () => {
            myChart.resize();
        };
        window.addEventListener('resize', handleResize);
        
        // Pulizia
        return () => {
            window.removeEventListener('resize', handleResize);
            myChart.dispose();
            chartRef.current = null;
        };
    }, [darkMode, users]); // Riesegui quando cambia darkMode o i dati degli utenti

    // Filtra gli utenti in base al testo di ricerca
    const filteredUsers = users.filter(user => {
        const searchLower = searchText.toLowerCase();
        
        // Se non c'è testo di ricerca, restituisci tutti gli utenti
        if (!searchText.trim()) return true;
        
        // Controlla se i dati dell'utente esistono
        if (!user || !user.user) return false;
        
        // Cerca nei dettagli dell'utente
        const nameMatch = `${user.user.name} ${user.user.surname}`.toLowerCase().includes(searchLower);
        const usernameMatch = user.user.username.toLowerCase().includes(searchLower);
        
        // Cerca nella chiave (se si cerca una parte di una chiave)
        const keyMatch = user.publicK && user.publicK.toLowerCase().includes(searchLower);
        
        return nameMatch || usernameMatch || keyMatch;
    });

    // Gestori di eventi
    const handleLogin = () => {
        navigate('/login');
    };

    const handleUpload = () => {
        if (!isAuthenticated) {
            message.warning('Effettua il login per caricare una chiave');
            return;
        }
        // Usa navigate di React Router invece di window.location per transizioni più fluide
        // che preservano lo stato, inclusa la modalità scura
        navigate('/upload');
    };

    const handleCopyKey = (key, id) => {
        navigator.clipboard.writeText(key)
            .then(() => {
                // Imposta questa chiave come copiata - per feedback visivo
                setCopiedKeyId(id);
                
                // Resetta gli stati dopo 5 secondi
                setTimeout(() => {
                    setCopiedKeyId(null);
                }, 5000);
            })
            .catch(err => {
                message.error('Impossibile copiare la chiave');
                console.error('Errore durante la copia:', err);
            });
    };

    const handleLogOut = () => {
        logout();
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'dark:bg-darkBg' : 'bg-gray-50'}`}>
            {/* Intestazione */}
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

            {/* Contenuto Principale */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Barra di Ricerca */}
                <div className="mb-6">
                    <Input
                        size="large"
                        placeholder="Cerca per nome utente o caratteristiche della chiave..."
                        prefix={<SearchOutlined className={darkMode ? 'text-gray-400' : ''} />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className={`max-w-2xl mx-auto ${darkMode ? 'bg-darkCard border-darkBorder text-white placeholder-gray-400' : ''}`}
                    />
                </div>

                {/* Sezione Chiavi Pubbliche */}
                <section className="mb-8">
                    {isAuthenticated ? (
                        <div className="flex justify-between items-center mb-6">
                            <h2 
                                onClick={() => navigate('/')}
                                className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-black'} cursor-pointer hover:text-blue-500 transition duration-200`}
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
                        {/* Lista Chiavi */}
                        <section className="w-full space-y-4">
                            {filteredUsers.length === 0 ? (
                                <p className={darkMode ? 'text-gray-300' : ''}>
                                    {searchText.trim() ? 'Nessun risultato trovato' : 'Nessuna chiave trovata'}
                                </p>
                            ) : (
                                filteredUsers.map((user, index) => (
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

                                            {/* Pulsante copia - con feedback di copia */}
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

                {/* Sezione Statistiche */}
                <section className={`${darkMode ? 'dark:bg-darkCard dark:border-darkBorder border' : 'bg-white'} p-6 rounded-lg shadow mt-8`}>
                    <h2 
                        onClick={() => navigate('/')}
                        className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-black'} cursor-pointer hover:text-blue-500 transition duration-200`}
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
