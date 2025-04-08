import React, { useState, useEffect } from 'react';
import { Button, Card, Tabs, message, Tag } from 'antd';
import { UploadOutlined, CopyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./contex/AuthContext.jsx";
import { useTheme } from "./contex/ThemeContext.jsx";
import ThemeToggle from './components/ThemeToggle.jsx';
import axios from 'axios';

const { TabPane } = Tabs;

const UserSection = () => {
    const [users, setUserKeys] = useState([]); // Stato per le chiavi dell'utente
    const [copiedKeyId, setCopiedKeyId] = useState(null); // Stato per tracciare quale chiave è stata copiata

    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const { darkMode } = useTheme();
    const username = localStorage.getItem('username');

    useEffect(() => {
        // Recupero delle chiavi dell'utente dal server
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

    // Gestisce il logout dell'utente
    const handleLogout = () => {
        logout();  // Fa il logout, pulisce localStorage e reindirizza
        navigate("/");
        window.location.reload();
    };

    // Naviga alla pagina di caricamento chiavi
    const handleUpload = () => {
        navigate('/upload');
    };

    // Copia la chiave negli appunti con feedback visivo
    const handleCopyKey = (key, id) => {
        navigator.clipboard.writeText(key)
            .then(() => {
                // Imposta questa chiave come copiata - per feedback visivo
                setCopiedKeyId(id);
                
                // Resetta lo stato dopo 5 secondi
                setTimeout(() => {
                    setCopiedKeyId(null);
                }, 5000);
            })
            .catch(err => {
                message.error('Impossibile copiare la chiave');
                console.error('Errore durante la copia:', err);
            });
    };

    // Disabilita una chiave sul server
    const handleDisableKey = async (key) => {
        try {
            // Chiamata API per disabilitare la chiave
            await axios.put(`http://localhost:8080/api/users/disableKey`, null, {
                params: { key }
            });

            // Aggiorna lo stato locale per riflettere il cambiamento
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
                {/* Lista delle chiavi dell'utente */}
                <Tabs className={`${darkMode ? 'dark:bg-darkCard dark:border-darkBorder border' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
                    <TabPane tab={<span 
                        className={darkMode ? 'text-gray-300 hover:text-blue-500' : 'hover:text-blue-500'}
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
                                                    className={`!rounded-button whitespace-nowrap m-1 transition-colors duration-200 min-w-[160px] flex items-center justify-center ${
                                                        copiedKeyId === index 
                                                            ? '!bg-green-100 !text-green-800 !border-green-500 hover:!bg-green-100 hover:!text-green-800 focus:!bg-green-100 focus:!text-green-800 active:!bg-green-100' 
                                                            : darkMode 
                                                                ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' 
                                                                : ''
                                                    }`}
                                                >
                                                    <span className="inline-block text-center">{copiedKeyId === index ? 'Chiave Copiata' : 'Copia Chiave'}</span>
                                                </Button>
                                                
                                                {/* Pulsante disattiva */}
                                                <Button
                                                    onClick={() => handleDisableKey(user.publicK)}
                                                    disabled={!user.validazioni}
                                                    className={`
                                                        !rounded-button 
                                                        whitespace-nowrap 
                                                        m-1 
                                                        min-w-[160px] 
                                                        flex 
                                                        items-center 
                                                        justify-center 
                                                        ${!user.validazioni ? 'opacity-50 cursor-not-allowed' : ''}
                                                    `}
                                                    style={{
                                                        background: user.validazioni 
                                                            ? '#ffcccc' // Light red background for enabled keys
                                                            : (darkMode ? 'rgb(55, 65, 81)' : ''), 
                                                        color: user.validazioni ? '#8b0000' : (darkMode ? 'white' : ''),
                                                        borderColor: user.validazioni ? '#ff8080' : (darkMode ? 'rgb(75, 85, 99)' : ''),
                                                        padding: '4px 15px',
                                                        lineHeight: '22px',
                                                        height: '32px',
                                                    }}
                                                    title={!user.validazioni ? 'Questa chiave è già disattivata' : 'Disattiva questa chiave'}
                                                >
                                                    <div className="flex items-center justify-center w-full">
                                                        <CopyOutlined className="mr-1 flex-shrink-0" />
                                                        <span className="flex-shrink-0">Disattiva Chiave</span>
                                                    </div>
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
