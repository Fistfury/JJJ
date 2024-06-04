import React, { useState } from 'react';
import { Admin } from '../Components/Admin';
import { AdminLogin } from '../Modals/AdminLogin';

import AdminRegister from '../Modals/AdminRegister';

export const AdminPage: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setIsLoginOpen(false);
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleRegister = async (data: { email: string; password: string }) => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
        alert('Registration successful. Please login.');
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <div className="bg-gray-300 min-h-screen py-10">
      <div className="container mx-auto">
        {isAuthenticated ? (
          <Admin />
        ) : (
          <>
            <AdminLogin
              isOpen={isLoginOpen}
              onClose={() => setIsLoginOpen(false)}
              onLogin={handleLogin}
              onOpenRegister={openRegister}
            />
            <AdminRegister
              isOpen={isRegisterOpen}
              onClose={() => setIsRegisterOpen(false)}
              onRegister={handleRegister}
              onOpenLogin={openLogin}
            />
          </>
        )}
      </div>
    </div>
  );
};
