// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Tag, Modal, message, Tooltip, Spin } from 'antd';
import { SearchOutlined, CopyOutlined, UserOutlined, LockOutlined, CalendarOutlined, UploadOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';

const App = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const mockUsers = [
        { id: 1, name: 'Alessandro Rossi', keySize: '2048 bit', uploadDate: '2025-03-12', key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...' },
        { id: 2, name: 'Marco Bianchi', keySize: '4096 bit', uploadDate: '2025-03-11', key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8B...' },
        { id: 3, name: 'Giuseppe Verdi', keySize: '3072 bit', uploadDate: '2025-03-10', key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8C...' },
    ];

    useEffect(() => {
        const initChart = () => {
            const chartDom = document.getElementById('keySizeChart');
            if (!chartDom) return;

            const myChart = echarts.init(chartDom);
            const option = {
                animation: false,
                title: {
                    text: 'Distribuzione Dimensioni Chiavi',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                series: [
                    {
                        name: 'Dimensione Chiave',
                        type: 'pie',
                        radius: '70%',
                        data: [
                            { value: 45, name: '2048 bit' },
                            { value: 30, name: '3072 bit' },
                            { value: 25, name: '4096 bit' }
                        ]
                    }
                ]
            };
            myChart.setOption(option);
        };

        initChart();
    }, []);

    const handleLogin = () => {
        setIsLoading(true);
        // Apro pagina di login
        window.location.href = "/login";
    };

    const handleUpload = () => {
        if (!isAuthenticated) {
            message.warning('Effettua il login per caricare una chiave');
            return;
        }
        setIsModalVisible(true);
    };

    const handleCopyKey = (key) => {
        navigator.clipboard.writeText(key);
        message.success('Chiave copiata negli appunti!');
    };

    return (
        <div className="min-h-screen bg-gray-50"
        style={{width: "100%"}}>
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold text-blue-600">KeyVault RSA</h1>
                    </div>

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
                            <Button
                                type="default"
                                onClick={() => setIsAuthenticated(false)}
                                className="!rounded-button whitespace-nowrap"
                            >
                                Disconnetti
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
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

                    <div className="flex space-x-6">
                        {/* Search and Filters */}
                        <div className="w-1/4 bg-white p-4 rounded-lg shadow">
                            <h3 className="text-lg font-medium mb-4">Filtri</h3>
                            <Input
                                placeholder="Cerca per nome utente"
                                prefix={<SearchOutlined />}
                                className="mb-4"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Dimensione Chiave</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <input type="checkbox" id="2048" className="mr-2" />
                                            <label htmlFor="2048">2048 bit</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input type="checkbox" id="3072" className="mr-2" />
                                            <label htmlFor="3072">3072 bit</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input type="checkbox" id="4096" className="mr-2" />
                                            <label htmlFor="4096">4096 bit</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Keys List */}
                        <div className="w-3/4 space-y-4">
                            {mockUsers.map(user => (
                                <Card key={user.id} className="shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-medium">{user.name}</h3>
                                            <p className="text-gray-500 mt-1">
                                                <Tag color="blue">{user.keySize}</Tag>
                                                <span className="ml-2">
                          <CalendarOutlined className="mr-1" />
                                                    {user.uploadDate}
                        </span>
                                            </p>
                                            <p className="mt-2 font-mono text-sm text-gray-600">{user.key.substring(0, 40)}...</p>
                                        </div>
                                        <Button
                                            icon={<CopyOutlined />}
                                            onClick={() => handleCopyKey(user.key)}
                                            className="!rounded-button whitespace-nowrap"
                                        >
                                            Copia Chiave
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="bg-white p-6 rounded-lg shadow mt-8">
                    <h2 className="text-xl font-semibold mb-4">Statistiche</h2>
                    <div id="keySizeChart" style={{ height: '400px' }}></div>
                </div>
            </main>

            {/* Upload Modal */}
            <Modal
                title="Carica Nuova Chiave RSA"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => {
                    message.success('Chiave caricata con successo!');
                    setIsModalVisible(false);
                }}
            >
                <Input.TextArea
                    rows={4}
                    placeholder="Incolla qui la tua chiave pubblica RSA"
                    className="mb-4"
                />
                <p className="text-gray-500 text-sm">
                    Formato supportato: PEM
                    <br />
                    Dimensioni supportate: 2048, 3072, 4096 bit
                </p>
            </Modal>
        </div>
    );
};

export default App;

