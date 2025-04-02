import React, { useState } from 'react';
import { Button, Input, message, Card } from 'antd';

const { TextArea } = Input;

const UploadKey = () => {

    const [key, setKey] = useState('');

    // Function to generate a fake RSA key
    const generateKey = () => {
        const fakeKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A`;
        setKey(fakeKey);
        message.success('Chiave generata con successo!');
    };

    // Function to handle key confirmation
    const handleConfirm = () => {
    
        if (!key.trim()) {
            message.error('Inserisci una chiave valida!');
            return;
        }
    
        message.success('Chiave caricata con successo!');
        setKey('');
    
    };

    // Function to handle cancel action
    const handleCancel = () => {
        window.location.href = "/";
        setKey('');
        message.info('Operazione annullata.');
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            
            <Card className="w-full max-w-lg p-6 shadow-md">
                
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Carica Nuova Chiave RSA
                </h2>

                {/* Text area for RSA key input */}
                <label className="block font-medium mb-2">Chiave Pubblica</label>
                <TextArea
                    rows={4}
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Incolla qui la tua chiave pubblica RSA"
                    className="mb-4"
                />

                {/* Button to generate a new key */}
                <Button type="default" onClick={generateKey} block className="mb-2">
                    Genera Chiave
                </Button>

                {/* Action buttons */}
                <div className="flex justify-between mt-4">
                    <Button type="primary" onClick={handleConfirm}>
                        Conferma
                    </Button>
                    <Button type="default" onClick={handleCancel}>
                        Annulla
                    </Button>
                </div>
                
            </Card>
        
        </div>

    );

};

export default UploadKey;
