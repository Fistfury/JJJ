import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterWrapper } from './Router/Router';
import { AuthProvider } from './Contexts/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterWrapper />
    </AuthProvider>
  </React.StrictMode>,
);
