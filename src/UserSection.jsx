import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Tabs, Modal, message, Tag } from 'antd';
import { SearchOutlined, UploadOutlined, CopyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./contex/AuthContext.jsx";
import axios from 'axios';

const { TabPane } = Tabs;

const UserSection = () => {
    const [searchText, setSearchText] = useState('');
    const [users, setUserKeys] = useState([]); // Stato per le chiavi dell'utente

    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
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

    const handleCopyKey = (key) => {
        navigator.clipboard.writeText(key);
        message.success("Chiave copiata negli appunti!");
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


    // Force light theme (even when the browser is in dark mode)
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'light'); // Force light theme globally
        document.body.style.backgroundColor = '#f0f0f0'; // Keep body background light
        document.body.style.color = '#000'; // Make text dark
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-blue-600">KeyVault RSA</h1>
                    <div className="flex items-center space-x-6">
                        {isAuthenticated ? (
                            <>
                                <Button type="text" onClick={handleUpload}>
                                    <UploadOutlined /> Carica Chiave
                                </Button>
                                <Button type="text" onClick={handleLogout}>Disconnetti</Button>
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
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="max-w-2xl mx-auto mb-6"
                />

                {/* Keys List */}
                <Tabs className="bg-white p-6 rounded-lg shadow-sm">
                    <TabPane tab="Le Mie Chiavi">
                        <section className="w-full space-y-4">
                            {users.length === 0 ? (
                                <p>Non hai ancora caricato chiavi</p>
                            ) : (
                                users.map((user, index) => (
                                    <Card key={index} className="shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                {/* Nome completo e username */}
                                                <h3 className="text-lg font-medium">
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
                                                <p className="mt-2 font-mono text-sm text-gray-600">
                                                    {user.publicK
                                                        ? user.publicK.substring(0, 100)
                                                        : 'Nessuna chiave disponibile'}
                                                </p>
                                            </div>
                                            <div className="flex flex-col">
                                                {/* Pulsante copia */}
                                                <Button
                                                    icon={<CopyOutlined />}
                                                    onClick={() => handleCopyKey(user.publicK)}
                                                    className="!rounded-button whitespace-nowrap m-1"
                                                >
                                                    Copia Chiave
                                                </Button>
                                                {/* Pulsante copia */}
                                                <Button
                                                    icon={<CopyOutlined />}
                                                    onClick={() => handleDisableKey(user.publicK)}
                                                    className="!rounded-button whitespace-nowrap m-1"
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
