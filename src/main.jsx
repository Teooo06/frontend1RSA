import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/Main.css';

import store from './redux/store.js';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

// Importa il contesto di autenticazione
import { AuthProvider } from './contex/AuthContext.jsx';
import { ThemeProvider } from './contex/ThemeContext.jsx';

// Importa il router che hai creato
import router from './router.jsx'; // Modifica l'importazione del router

// Render application
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <Provider store={store}>
                    <RouterProvider router={router} />
                </Provider>
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>
);
