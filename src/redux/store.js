import { configureStore } from '@reduxjs/toolkit';
import { counterReducer } from './counterSlice';

/**
 * Configurazione dello Store Redux
 * 
 * Questo crea uno store Redux centralizzato per la gestione dello stato in tutta l'applicazione.
 * Lo store combina più reducer per diverse parti dello stato.
 */
export default configureStore({
    reducer: {
        counter: counterReducer,
    },
    });