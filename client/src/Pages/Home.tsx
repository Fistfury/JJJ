import React, { useState } from 'react';
import CustomerLogin from '../Modals/CustomerLogin';
import CustomerRegister from '../Modals/CustomerRegister';

export const Home: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleLogin = (data: { username: string; password: string }) => {
   
    console.log('Login data:', data);
    setIsLoginOpen(false);
  };

  const handleRegister = (data: { username: string; email: string; password: string }) => {
   
    console.log('Register data:', data);
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-red-700">Home</h1>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => setIsLoginOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Customer Login
        </button>
        <button
          onClick={() => setIsRegisterOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Customer Register
        </button>
      </div>
      {isLoginOpen && (
        <CustomerLogin
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLogin={handleLogin}
          onRegister={() => {
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
          }}
        />
      )}
      {isRegisterOpen && (
        <CustomerRegister
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
};


