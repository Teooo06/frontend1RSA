import React, { useState } from 'react';
import { Button, Input, message, Card } from 'antd';
import {useNavigate} from "react-router-dom";
import axios from "axios";

const { TextArea } = Input;

const UploadKey = () => {

    const [key, setKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleConfirm = async () => {
        setIsLoading(true); // Impostiamo lo stato di caricamento su true
        setError(null); // Resettiamo eventuali errori precedenti
        try {
            const loginData = {
                key: key,
                user: localStorage.getItem('username')
            };

            const response = await axios.post(
                `http://localhost:8080/api/users/addKey`, // Percorso corretto per il login
                loginData, // Corpo della richiesta
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                message.success('Chiave salvata con successo!');
                navigate("/");
            } else {
                setError('Credenziali errate.');
                message.error('Credenziali errate.');
            }
        } catch (error) {
            setIsLoading(false);
            setError('Errore durante il login.');
            message.error('Errore durante il login.');
            console.error('Errore nel login:', error);
        }
    };


    // Function to handle cancel action
    const handleCancel = () => {
        navigate("/");
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
