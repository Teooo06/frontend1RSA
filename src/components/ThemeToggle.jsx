import React, { memo } from 'react';
import { Button } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from '../contex/ThemeContext';

/**
 * Componente ThemeToggle
 * 
 * Un pulsante che alterna tra i temi chiaro e scuro.
 * Utilizza un'icona a lampadina che cambia in base al tema corrente.
 * 
 * Questo componente è "memoizzato" per evitare re-render non necessari.
 */
const ThemeToggle = memo(() => {
    const { darkMode, toggleDarkMode } = useTheme();
    
    return (
        <Button 
            type="text"
            onClick={toggleDarkMode}
            icon={darkMode ? <BulbOutlined /> : <BulbFilled />}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`${darkMode ? 'text-yellow-400' : 'text-gray-600'}`}
            style={{ transition: 'none' }} /* Remove any transition delay */
        />
    );
});

export default ThemeToggle;
