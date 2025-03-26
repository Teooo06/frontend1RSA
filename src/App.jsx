import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Tag, message } from 'antd';
import { SearchOutlined, CopyOutlined, UserOutlined, CalendarOutlined, UploadOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import * as echarts from 'echarts';

const App = () => {
    const navigate = useNavigate(); // Hook per la navigazione

    // State variables
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    // Mock data for users
    const mockUsers = [
        { id: 1, name: 'Alessandro Rossi', keySize: '2048 bit', uploadDate: '2025-03-12', key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...' },
        { id: 2, name: 'Marco Bianchi', keySize: '4096 bit', uploadDate: '2025-03-11', key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8B...' },
        { id: 3, name: 'Giuseppe Verdi', keySize: '3072 bit', uploadDate: '2025-03-10', key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8C...' },
    ];

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

    // Handlers
    const handleLogin = () => {
        setIsLoading(true);
        window.location.href = '/login';
    };

    const handleUpload = () => {
        if (!isAuthenticated) {
            message.warning('Effettua il login per caricare una chiave');
            return;
        }
        window.location.href = '/upload';
    };

    const handleCopyKey = (key) => {
        navigator.clipboard.writeText(key);
        message.success('Chiave copiata negli appunti!');
    };

    return (
        <div className="min-h-screen bg-gray-50" style={{ width: '100%' }}>
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
                                    onClick={() => setIsAuthenticated(false)}
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
                        {/* Filters */}
                        <aside className="w-1/4 bg-white p-4 rounded-lg shadow">
                            <h3 className="text-lg font-medium mb-4">Filtri</h3>
                            <Input
                                placeholder="Cerca per nome utente"
                                prefix={<SearchOutlined />}
                                className="mb-4"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium mb-2">Dimensione Chiave</h4>
                                {['2048', '3072', '4096'].map((size) => (
                                    <div key={size} className="flex items-center">
                                        <input type="checkbox" id={size} className="mr-2" />
                                        <label htmlFor={size}>{size} bit</label>
                                    </div>
                                ))}
                            </div>
                        </aside>

                        {/* Keys List */}
                        <section className="w-3/4 space-y-4">
                            {mockUsers.map((user) => (
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
                                            <p className="mt-2 font-mono text-sm text-gray-600">
                                                {user.key.substring(0, 40)}...
                                            </p>
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

// Wrappa App con Router per usare useNavigate
const WrappedApp = () => (
    <Router>
        <Routes>
            <Route path="/*" element={<App />} />
        </Routes>
    </Router>
);

export default WrappedApp;
