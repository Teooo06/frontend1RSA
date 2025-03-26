import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/Main.css';
import App from './App.jsx';

import store from './redux/store.js';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Pages
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import UploadKey from './pages/UploadKey.jsx';
import UserSection from "./UserSection.jsx";

// Define routes
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/upload',
        element: <UploadKey />,
    },
    {
        path: '/userSection',
        element: <UserSection />,
    },
]);

// Render application
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </StrictMode>
);
