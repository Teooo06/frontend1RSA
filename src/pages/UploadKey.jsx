import React, { useState } from 'react';
import { Button, Input, message, Card } from 'antd';

const { TextArea } = Input;

const UploadKey = () => {
    const [key, setKey] = useState('');

    const generateKey = () => {
        const fakeKey = `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...\n-----END PUBLIC KEY-----`;
        setKey(fakeKey);
        message.success('Chiave generata con successo!');
    };

    const handleConfirm = () => {
        if (!key.trim()) {
            message.error('Inserisci una chiave valida!');
            return;
        }
        message.success('Chiave caricata con successo!');
        setKey('');
    };

    const handleCancel = () => {
        window.location.href = "/";
        setKey('');
        message.info('Operazione annullata.');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-lg p-6 shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-center">Carica Nuova Chiave RSA</h2>

                <label className="block font-medium mb-2">Chiave Pubblica</label>
                <TextArea
                    rows={4}
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Incolla qui la tua chiave pubblica RSA"
                    className="mb-4"
                />

                <Button type="default" onClick={generateKey} block className="mb-2">
                    Genera Chiave
                </Button>

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
