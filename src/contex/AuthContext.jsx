import React, { createContext, useState, useEffect } from 'react';

/**
 * AuthContext - Fornisce lo stato di autenticazione e i metodi in tutta l'applicazione
 * 
 * Questo context gestisce lo stato di autenticazione dell'utente, fornendo funzionalità
 * di login e logout e rendendo lo stato di autenticazione disponibile a tutti i componenti.
 */
const AuthContext = createContext(null);

/**
 * AuthProvider - Componente che avvolge l'applicazione e fornisce il contesto di autenticazione
 * 
 * @param {Object} props - Proprietà del componente
 * @param {React.ReactNode} props.children - Componenti figli che avranno accesso a questo contesto
 */
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Controlla lo stato di autenticazione al caricamento della pagina
        const userAuthStatus = localStorage.getItem('authenticated');
        if (userAuthStatus === 'true') {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    /**
     * Funzione di login - Autentica un utente e memorizza la sua sessione
     * @param {string} username - Il nome utente dell'utente autenticato
     */
    const login = (username) => {
        localStorage.setItem('username', username);
        localStorage.setItem('authenticated', 'true');
        setIsAuthenticated(true);
    };

    /**
     * Funzione di logout - Termina la sessione dell'utente e cancella i dati di autenticazione
     */
    const logout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('authenticated');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook personalizzato per utilizzare il contesto di autenticazione
 * @returns {Object} Contesto di autenticazione con stato isAuthenticated e funzioni login/logout
 */
export const useAuth = () => React.useContext(AuthContext);