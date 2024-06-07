import React, { useState } from 'react';
import {CustomerLogin} from '../Modals/CustomerLogin';
import {CustomerRegister} from '../Modals/CustomerRegister';
import { CustomerRegisterFormData } from '../Interfaces/CustomerRegisterFormData';
import { CustomerLoginFormData } from '../Interfaces/CustomerLoginFormData';
import { useAuth } from '../Contexts/AuthContext';
import Subscribe from '../Modals/Subscribe';
import { SubscribeFormData } from '../Interfaces/SubscribeFormData';

export const Home: React.FC = () => {
  const { setIsAuthenticated } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

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
        setIsSubscribeOpen(true); 
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

/*   const handleLogout = async () => {
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
  }; */

  const handleSubscribe = async (data: SubscribeFormData) => {
    try {
      const response = await fetch('http://localhost:3000/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Subscription data:', result);
      } else {
        const error = await response.json();
        console.error('Subscription error:', error);
      }
    } catch (error) {
      console.error('Subscription error:', error);
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-center">
    <div className="flex flex-col items-center justify-center h-full text-white bg-opacity-50 bg-black">
      <h1 className="text-5xl font-bold mt-32">Triple J</h1>
      <p className="mt-4 text-lg">CHOOSE A CATEGORY</p>
      <div className="mt-8 mb-20 p-20 glass rounded-xl shadow-lg grid grid-cols-3 gap-9" style={{ width: "660px" }}>
        <div className="flex flex-col items-center cursor-pointer" onClick={() => setIsLoginOpen(true)}>
          <div className="p-4 bg-opacity-50 bg-gray-900 rounded-full">
            <i className="fas fa-robot text-4xl"></i>
          </div>
          <p className="mt-2">AI</p>
        </div>
        <div className="flex flex-col items-center cursor-pointer" onClick={() => setIsLoginOpen(true)}>
          <div className="p-4 bg-opacity-50 bg-gray-900 rounded-full">
            <i className="fas fa-shield-alt text-4xl"></i> 
          </div>
          <p className="mt-2">Cybersecurity</p>
        </div>
        <div className="flex flex-col items-center cursor-pointer" onClick={() => setIsLoginOpen(true)}>
          <div className="p-4 bg-opacity-50 bg-gray-900 rounded-full">
            <i className="fas fa-cube text-4xl"></i> 
          </div>
          <p className="mt-2">Blockchain</p>
        </div>
        <div className="flex flex-col items-center cursor-pointer" onClick={() => setIsLoginOpen(true)}>
          <div className="p-4 bg-opacity-50 bg-gray-900 rounded-full">
            <i className="fas fa-cloud text-4xl"></i> 
          </div>
          <p className="mt-2">Cloud Computing</p>
        </div>
        <div className="flex flex-col items-center cursor-pointer" onClick={() => setIsLoginOpen(true)}>
          <div className="p-4 bg-opacity-50 bg-gray-900 rounded-full">
            <i className="fas fa-laptop text-4xl"></i> 
          </div>
          <p className="mt-2">Tech Industri</p>
        </div>
        <div className="flex flex-col items-center cursor-pointer" onClick={() => setIsLoginOpen(true)}>
          <div className="p-4 bg-opacity-50 bg-gray-900 rounded-full">
            <i className="fas fa-network-wired text-4xl"></i> 
          </div>
          <p className="mt-2">IoT</p>
        </div>
      </div>
      <div className="mt-12 flex space-x-4">
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram text-2xl"></i>
        </a>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook text-2xl"></i>
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-twitter text-2xl"></i>
        </a>
      </div>
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
    {isSubscribeOpen && (
      <Subscribe
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
        onSubscribe={handleSubscribe}
      />
    )}
  </div>
);
}