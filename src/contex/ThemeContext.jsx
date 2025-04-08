import React, { createContext, useState, useEffect, useCallback } from 'react';

/**
 * ThemeContext - Fornisce lo stato del tema e la funzionalità di cambio in tutta l'applicazione
 * 
 * Questo contesto gestisce lo stato del tema chiaro/scuro e fornisce metodi per cambiare il tema,
 * garantendo un aspetto coerente in tutta l'applicazione.
 */
const ThemeContext = createContext(null);

/**
 * ThemeProvider - Componente che avvolge l'applicazione e fornisce il contesto del tema
 * 
 * @param {Object} props - Proprietà del componente
 * @param {React.ReactNode} props.children - Componenti figli che avranno accesso a questo contesto
 */
export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    /**
     * Applica le modifiche del tema direttamente agli elementi DOM
     * Questo garantisce un feedback visivo immediato senza sfarfallio
     * 
     * @param {boolean} isDark - Indica se applicare la modalità scura
     */
    const applyTheme = useCallback((isDark) => {
        const html = document.documentElement;
        const body = document.body;

        if (isDark) {
            html.classList.add('dark');
            html.style.colorScheme = 'dark';
            body.style.backgroundColor = '#1a1a1a';
            body.style.color = '#fff';
        } else {
            html.classList.remove('dark');
            html.style.colorScheme = 'light';
            body.style.backgroundColor = '#f0f0f0';
            body.style.color = '#000';
            document.body.offsetHeight;
        }

        html.classList.add('disable-transitions');
        setTimeout(() => {
            html.classList.remove('disable-transitions');
        }, 50);
    }, []);

    useEffect(() => {
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme !== null) {
            const isDark = savedTheme === 'true';
            setDarkMode(isDark);
            applyTheme(isDark);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setDarkMode(prefersDark);
            applyTheme(prefersDark);
        }
    }, [applyTheme]);

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    /**
     * Alterna tra i temi chiaro e scuro
     * Aggiorna sia il DOM direttamente che lo stato React
     */
    const toggleDarkMode = useCallback(() => {
        const newDarkMode = !darkMode;
        applyTheme(newDarkMode);
        setDarkMode(newDarkMode);
    }, [darkMode, applyTheme]);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook personalizzato per utilizzare il contesto del tema
 * @returns {Object} Contesto del tema con stato darkMode e funzione toggleDarkMode
 */
export const useTheme = () => React.useContext(ThemeContext);
