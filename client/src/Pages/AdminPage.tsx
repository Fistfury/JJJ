import React, { useState } from 'react';
import { Admin } from '../Components/Admin';
import { AdminLogin } from '../Modals/AdminLogin';

export const AdminPage: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // <-- Change to false once you fix login

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
