import React, { useState } from 'react';
import {CustomerLogin} from '../Modals/CustomerLogin';
import {CustomerRegister} from '../Modals/CustomerRegister';
import { CustomerRegisterFormData } from '../Interfaces/CustomerRegisterFormData';
import { CustomerLoginFormData } from '../Interfaces/CustomerLoginFormData';
import { useAuth } from '../Contexts/AuthContext';

export const Home: React.FC = () => {
  const { setIsAuthenticated } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
 
  const handleLogin = async (data: CustomerLoginFormData) => {
    console.log('handleLogin called', data);
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
 
      if (response.ok) {
        const result = await response.json();
        console.log('Login data:', result);
        setIsAuthenticated(true);
        setIsLoginOpen(false);
      } else {
        const error = await response.json();
        console.error('Login error:', error);
        alert('Login failed: ' + error);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
 
  const handleRegister = async (data: CustomerRegisterFormData) => {
    console.log('handleRegister called', data);
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
 
      if (response.ok) {
        const result = await response.json();
        console.log('Register data:', result);
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
      } else {
        const error = await response.json();
        console.error('Register error:', error);
        alert('Registration failed: ' + error);
      }
    } catch (error) {
      console.error('Register error:', error);
    }
  };
 
  const handleLogout = async () => {
    console.log('handleLogout called');
    try {
      const response = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
 
      if (response.ok) {
        console.log('Logout successful');
        setIsAuthenticated(false);
      } else {
        const error = await response.json();
        console.error('Logout error:', error);
        alert('Logout failed: ' + error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
 
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-red-700">Home</h1>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => {
            console.log('Open login modal');
            setIsLoginOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Customer Login
        </button>
        <button
          onClick={() => {
            console.log('Open register modal');
            setIsRegisterOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Customer Register
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Logout
        </button>
      </div>
      {isLoginOpen && (
        <CustomerLogin
          isOpen={isLoginOpen}
          onClose={() => {
            console.log('Close login modal');
            setIsLoginOpen(false);
          }}
          onLogin={handleLogin}
          onRegister={() => {
            console.log('Switch to register modal');
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
          }}
        />
      )}
      {isRegisterOpen && (
        <CustomerRegister
          isOpen={isRegisterOpen}
          onClose={() => {
            console.log('Close register modal');
            setIsRegisterOpen(false);
          }}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
 };