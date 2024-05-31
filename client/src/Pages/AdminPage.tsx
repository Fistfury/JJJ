// src/Pages/AdminPage.tsx
import React, { useState } from 'react';

import { Admin } from '../Components/Admin';
import { AdminLogin } from '../Modals/AdminLogin';

export const AdminPage: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);// <--- Change to false once ive fixed login

  const handleLogin = (data: { username: string; password: string }) => {

    if (data.username === 'admin' && data.password === 'password') {
      setIsAuthenticated(true);
      setIsLoginOpen(false);
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="bg-gray-300 min-h-screen py-10">
      <div className="container mx-auto">
        {isAuthenticated ? (
          <Admin />
        ) : (
          <AdminLogin
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onLogin={handleLogin}
          />
        )}
      </div>
    </div>
  );
};


