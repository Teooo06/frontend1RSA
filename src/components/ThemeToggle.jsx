import React from 'react';
import { Button } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from '../contex/ThemeContext';

const ThemeToggle = () => {
    const { darkMode, toggleDarkMode } = useTheme();
    
    return (
        <Button 
            type="text"
            onClick={toggleDarkMode}
            icon={darkMode ? <BulbOutlined /> : <BulbFilled />}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`transition-all duration-300 ${darkMode ? 'text-yellow-400' : 'text-gray-600'}`}
        />
    );
};

export default ThemeToggle;
