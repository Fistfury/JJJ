import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterWrapper } from './Router/Router';
import { AuthProvider } from './Contexts/AuthContext';
import './index.css';
import './Styles/style.css'
import '@fortawesome/fontawesome-free/css/all.min.css';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterWrapper />
    </AuthProvider>
  </React.StrictMode>,
);
