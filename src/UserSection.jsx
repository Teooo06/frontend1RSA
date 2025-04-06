import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Tabs, Modal, message, Tag } from 'antd';
import { SearchOutlined, UploadOutlined, CopyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./contex/AuthContext.jsx";
import { useTheme } from "./contex/ThemeContext.jsx";
import ThemeToggle from './components/ThemeToggle.jsx';
import axios from 'axios';

const { TabPane } = Tabs;

const UserSection = () => {
    const [searchText, setSearchText] = useState('');
    const [users, setUserKeys] = useState([]); // Stato per le chiavi dell'utente
    const [copiedKeyId, setCopiedKeyId] = useState(null); // Stato per tracciare quale chiave è stata copiata

    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const { darkMode } = useTheme();
    const username = localStorage.getItem('username');

    useEffect(() => {
        // Pulisce il localStorage e disabilita l'autenticazione al reload della pagina
        const fetchUserKeys = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/getKeysByUsername`, {
                    params: { username }
                });
                if (Array.isArray(response.data)) {
                    setUserKeys(response.data);
                } else {
                    setUserKeys([]);
                    message.error('Dati non validi ricevuti dal server.');
                }
            } catch (error) {
                console.error('Errore nel recupero delle chiavi dell\'utente:', error);
                setUserKeys([]);
                message.error('Impossibile caricare le chiavi dell\'utente.');
            }
        };
        fetchUserKeys();
    }, [username, logout]);

    const handleLogout = () => {
        logout();  // Fa il logout, pulisce localStorage e reindirizza
        navigate("/");
        window.location.reload();
    };

    const handleUpload = () => {
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

    const handleDisableKey = async (key) => {
        try {
            // Disabilita la chiave nel backend
            await axios.put(`http://localhost:8080/api/users/disableKey`, null, {
                params: { key }
            });

            // Aggiorna lo stato dell'utente per riflettere il cambiamento
            setUserKeys((prevUsers) =>
                prevUsers.map((user) =>
                    user.publicK === key ? { ...user, validazioni: false } : user
                )
            );

            message.success("Chiave disabilitata con successo!");
        } catch (error) {
            console.error("Errore nel disabilitare la chiave:", error);
            message.error("Impossibile disabilitare la chiave.");
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'dark:bg-darkBg' : 'bg-gray-50'}`}>
            <header className={`${darkMode ? 'dark:bg-darkCard dark:border-darkBorder border-b' : 'bg-white shadow-md'}`}>
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 
                        onClick={() => navigate('/')}
                        className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'} cursor-pointer hover:text-blue-500 transition duration-200`}
                    >
                        KeyVault RSA
                    </h1>
                    <div className="flex items-center space-x-6">
                        <ThemeToggle />
                        
                        {isAuthenticated ? (
                            <>
                                <Button type="text" onClick={handleUpload} 
                                    className={darkMode ? 'text-gray-300' : ''}>
                                    <UploadOutlined /> Carica Chiave
                                </Button>
                                <Button type="text" onClick={handleLogout}
                                    className={darkMode ? 'text-gray-300' : ''}>
                                    Disconnetti
                                </Button>
                            </>
                        ) : (
                            <Button type="default" onClick={() => navigate('/login')}>
                                Accedi
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <Input
                    size="large"
                    placeholder="Cerca per nome utente o caratteristiche della chiave..."
                    prefix={<SearchOutlined className={darkMode ? 'text-gray-400' : ''} />}
                    onChange={(e) => setSearchText(e.target.value)}
                    className={`max-w-2xl mx-auto mb-6 ${darkMode ? 'bg-darkCard border-darkBorder text-white placeholder-gray-400' : ''}`}
                />

                {/* Keys List */}
                <Tabs className={`${darkMode ? 'dark:bg-darkCard dark:border-darkBorder border' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
                    <TabPane tab={<span 
                        className={darkMode ? 'text-gray-300 cursor-pointer hover:text-blue-500' : 'cursor-pointer hover:text-blue-500'}
                        onClick={() => navigate('/')}
                    >Le Mie Chiavi</span>}>
                        <section className="w-full space-y-4">
                            {users.length === 0 ? (
                                <p className={darkMode ? 'text-gray-300' : ''}>Non hai ancora caricato chiavi</p>
                            ) : (
                                users.map((user, index) => (
                                    <Card key={index} className={darkMode ? 'shadow-sm dark:bg-darkCard dark:border-darkBorder' : 'shadow-sm'}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                {/* Nome completo e username */}
                                                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : ''}`}>
                                                    {user.user
                                                        ? `${user.user.name} ${user.user.surname}`
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
                                            <div className="flex flex-col">
                                                {/* Pulsante copia */}
                                                <Button
                                                    icon={copiedKeyId === index ? null : <CopyOutlined />}
                                                    onClick={() => handleCopyKey(user.publicK, index)}
                                                    className={`!rounded-button whitespace-nowrap m-1 transition-colors duration-200 ${
                                                        copiedKeyId === index 
                                                            ? '!bg-green-100 !text-green-800 !border-green-500 hover:!bg-green-100 hover:!text-green-800 focus:!bg-green-100 focus:!text-green-800 active:!bg-green-100' 
                                                            : darkMode 
                                                                ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' 
                                                                : ''
                                                    }`}
                                                >
                                                    {copiedKeyId === index ? 'Chiave Copiata' : 'Copia Chiave'}
                                                </Button>
                                                {/* Pulsante disattiva */}
                                                <Button
                                                    icon={<CopyOutlined />}
                                                    onClick={() => handleDisableKey(user.publicK)}
                                                    className={`!rounded-button whitespace-nowrap m-1 ${darkMode ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' : ''}`}
                                                >
                                                    Disattiva Chiave
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </section>
                    </TabPane>
                </Tabs>
            </main>
        </div>
    );
};

export default UserSection;
