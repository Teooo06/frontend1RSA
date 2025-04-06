import { createBrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import UploadKey from './pages/UploadKey.jsx';
import UserSection from './UserSection.jsx';

const routes = [
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
];

// Crea il router con le rotte definite
const router = createBrowserRouter(routes);

export default router;
