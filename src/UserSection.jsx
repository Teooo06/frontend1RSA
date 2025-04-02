import React, { useState } from 'react';
import { Input, Button, Card, Tabs, Modal, message } from 'antd';
import { SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const { TabPane } = Tabs;

const UserSection = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState('1');
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const navigate = useNavigate(); // Hook per la navigazione

    const handleLogout = () => {
        localStorage.setItem('isAuthenticated', 'false'); // Salva il logout
        message.info('Disconnessione effettuata');
        navigate('/'); // Torna alla homepage
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-blue-600">KeyVault RSA</h1>
                    <div className="flex items-center space-x-6">
                        {isAuthenticated ? (
                            <>
                                <Button type="text" onClick={() => setIsModalVisible(true)}>
                                    <UploadOutlined /> Carica Chiave
                                </Button>
                                <Button type="text" onClick={handleLogout}>Disconnetti</Button>
                            </>
                        ) : (
                            <Button type="default" onClick={handleLogout}>
                                Disconnetti
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <Input
                    size="large"
                    placeholder="Cerca per nome utente o caratteristiche della chiave..."
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="max-w-2xl mx-auto"
                />
                <Tabs activeKey={activeTab} onChange={setActiveTab} className="bg-white p-6 rounded-lg shadow-sm">
                    <TabPane tab="Le Mie Chiavi" key="2">
                        {isAuthenticated ? (
                            <div className="text-center py-8">
                                <p>Non hai ancora caricato nessuna chiave</p>
                                <Button type="primary" onClick={() => setIsModalVisible(true)}>Carica la tua prima chiave</Button>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p>Effettua l'accesso per visualizzare le tue chiavi</p>
                                <Button type="primary" onClick={() => navigate('/login')}>Accedi</Button>
                            </div>
                        )}
                    </TabPane>
                </Tabs>
            </main>
        </div>
    );
};

export default UserSection;
