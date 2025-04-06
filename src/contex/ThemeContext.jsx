import React, { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Check for saved theme preference or use system preference
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme !== null) {
            setDarkMode(savedTheme === 'true');
        } else {
            // Use system preference as default if available
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setDarkMode(prefersDark);
        }
    }, []);

    useEffect(() => {
        // Apply theme to document
        if (darkMode) {
            document.documentElement.classList.add('dark');
            document.body.style.backgroundColor = '#1a1a1a';
            document.body.style.color = '#fff';
        } else {
            document.documentElement.classList.remove('dark');
            document.body.style.backgroundColor = '#f0f0f0';
            document.body.style.color = '#000';
        }
        // Save preference
        localStorage.setItem('darkMode', darkMode);

        // Force re-rendering of problematic components
        const event = new CustomEvent('themeChange', { detail: { darkMode } });
        window.dispatchEvent(event);
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => React.useContext(ThemeContext);
