import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/Main.css';

import store from './redux/store.js';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

// Importa il contesto di autenticazione e tema
import { AuthProvider } from './contex/AuthContext.jsx';
import { ThemeProvider } from './contex/ThemeContext.jsx';

// Importa il router configurato
import router from './router.jsx';

/**
 * Punto di Ingresso dell'Applicazione
 * 
 * Questo file serve come punto di ingresso per l'applicazione React.
 * Configura i provider necessari e renderizza l'applicazione nel DOM.
 * 
 * L'albero dei componenti è avvolto da:
 * - StrictMode: Per evidenziare potenziali problemi nell'applicazione
 * - ThemeProvider: Per una gestione coerente del tema in tutta l'applicazione
 * - AuthProvider: Per la gestione dello stato di autenticazione
 * - Provider Redux: Per la gestione dello stato globale
 * - RouterProvider: Per la gestione della navigazione
 */
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
