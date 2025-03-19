// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';
import { Input, Button, Card, Tabs, Modal, message, Tooltip } from 'antd';
import { SearchOutlined, UserOutlined, UploadOutlined, CopyOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

// Reusable KeyCard Component

const KeyCard: React.FC<{ keyItem: any; onCopy: (key: string) => void }> = ({ keyItem, onCopy }) => (

  <Card
    key={keyItem.id}
    className="hover:shadow-lg transition-shadow"
    actions={[
      <Tooltip title="Copia chiave">
        <CopyOutlined onClick={() => onCopy(keyItem.key)} />
      </Tooltip>,
      <Tooltip title="Dettagli">
        <InfoCircleOutlined />
      </Tooltip>,
    ]}
  >

    <div className="space-y-2">

      <div className="flex items-center space-x-2">
        <UserOutlined/>
        <span className="font-medium">{keyItem.user}</span>
      </div>
    
      <div className="text-gray-500 text-sm truncate">
        {keyItem.key.substring(0, 32)}...
      </div>
    
      <div className="flex justify-between text-sm text-gray-500">
        <span>{keyItem.date}</span>
        <span>{keyItem.size}</span>
      </div>
    
    </div>
  
  </Card>

);

const App: React.FC = () => {

  // State Management
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('1');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sample Key Data
  const keys = [
    {
      id: 1,
      user: 'Marco Rossi',
      key: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...',
      date: '2025-03-12',
      size: '2048 bit',
      algorithm: 'RSA'
    },
    {
      id: 2, 
      user: 'Giuseppe Verdi',
      key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC...',
      date: '2025-03-11',
      size: '4096 bit',
      algorithm: 'RSA'
    },
    {
      id: 3,
      user: 'Sofia Bianchi',
      key: 'MIIBCgKCAQEA9tD9Ej0eKBF6h4yNR0anWH0K3Zx...',
      date: '2025-03-10',
      size: '3072 bit',
      algorithm: 'RSA'
    }
  ];

  // Handlers
  const handleLogin = () => {
    setIsLoggedIn(true);
    message.success('Accesso effettuato con successo!');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    message.info('Disconnessione effettuata');
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    message.success('Chiave copiata negli appunti!');
  };

  return (
    
    <div className="min-h-screen bg-gray-50">
  
      {/* Header */}
      <header className="bg-white shadow-md">
        
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
          <h1 className="text-2xl font-bold text-blue-600">KeyVault RSA</h1>
        
          <div className="flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <Button type="text" className="!rounded-button" onClick={() => setIsModalVisible(true)}>
                  <UploadOutlined /> Carica Chiave
                </Button>
                <Button type="text" className="!rounded-button" onClick={handleLogout}>
                  Disconnetti
                </Button>
              </>
            ) : (
              <Button type="primary" className="!rounded-button" onClick={handleLogin}>
                Accedi
              </Button>
            )}
          </div>
        
        </div>

      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Search Bar */}
        <div className="mb-8">
          <Input
            size="large"
            placeholder="Cerca per nome utente o caratteristiche della chiave..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* Tabs */}
        <Tabs activeKey={activeTab} onChange={setActiveTab} className="bg-white p-6 rounded-lg shadow-sm">
        
          {/* All Keys Tab */}
          <TabPane tab="Tutte le Chiavi" key="1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {keys.map((keyItem) => (
                <KeyCard keyItem={keyItem} onCopy={copyKey} />
              ))}
            </div>
          </TabPane>

          {/* My Keys Tab */}
          <TabPane tab="Le Mie Chiavi" key="2">
          
            {isLoggedIn ? (
              <div className="text-center py-8">
                <p>Non hai ancora caricato nessuna chiave</p>
                <Button type="primary" className="mt-4 !rounded-button" onClick={() => setIsModalVisible(true)}>
                  Carica la tua prima chiave
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p>Effettua l'accesso per visualizzare le tue chiavi</p>
                <Button type="primary" className="mt-4 !rounded-button" onClick={handleLogin}>
                  Accedi
                </Button>
              </div>
            )}
          
          </TabPane>
      
        </Tabs>
      
      </main>

      {/* Upload Modal */}
      <Modal
        title="Carica Nuova Chiave RSA"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Annulla
          </Button>,
          <Button key="submit" type="primary" className="!rounded-button">
            Carica
          </Button>,
        ]}
      >

        <div className="space-y-4">
         
          <Input.TextArea
            rows={4}
            placeholder="Incolla qui la tua chiave RSA pubblica..."
            className="font-mono"
          />
          <div className="text-gray-500 text-sm">
            <p>Formato supportato: RSA</p>
            <p>Dimensioni supportate: 2048-bit, 3072-bit, 4096-bit</p>
          </div>
        
        </div>
      
      </Modal>

      {/* Footer */}

      <footer className="bg-white border-t mt-12">

        <div className="max-w-7xl mx-auto px-4 py-8">
        
          <div className="text-center text-gray-500 text-sm">
        
            <p>KeyVault RSA © 2025 - Tutti i diritti riservati</p>
            <p className="mt-2">
              Un servizio sicuro per la gestione e la condivisione delle chiavi RSA pubbliche
            </p>
        
          </div>
        
        </div>
      
      </footer>
    
    </div>
  
  );

};

export default App;