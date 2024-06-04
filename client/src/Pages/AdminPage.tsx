import React, { useState } from 'react';
import { Admin } from '../Components/Admin';
import { AdminLogin } from '../Modals/AdminLogin';

export const AdminPage: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setIsLoginOpen(false);
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

