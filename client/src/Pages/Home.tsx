import React, { useState } from 'react';
import {CustomerLogin} from '../Modals/CustomerLogin';
import {CustomerRegister} from '../Modals/CustomerRegister';
import { CustomerRegisterFormData } from '../Interfaces/CustomerRegisterFormData';
import { CustomerLoginFormData } from '../Interfaces/CustomerLoginFormData';
import { useAuth } from '../Contexts/AuthContext';
import Subscribe from '../Modals/Subscribe';
import { SubscribeFormData } from '../Interfaces/SubscribeFormData';
import logo from '../assets/logo-14.png';
import { motion } from 'framer-motion';
import Articles from '../Components/Articles';

export const Home: React.FC = () => {
  const { setIsAuthenticated } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  const handleLogin = async (data: CustomerLoginFormData) => {
    console.log('handleLogin called', data);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
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
      const response = await fetch('http://localhost:3000/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
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
    <div className="flex items-center mt-32">
            <img src={logo} alt="Logo" style={{ height: '13rem', width: '27rem', marginRight: '2rem' }} /> 
            
          </div>
      <p className=" text-lg">CHOOSE A CATEGORY</p>
      <motion.div
          initial={{ x: '-100vw' }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="mt-8 mb-20 p-20 glass rounded-xl shadow-lg grid grid-cols-3 gap-9"
          style={{ width: "660px" }}
        >

          <div className="flex flex-col items-center cursor-pointer transform transition-transform duration-300 hover:scale-105" onClick={() => setIsLoginOpen(true)}>
            <div className="p-4 bg-opacity-50 bg-gray-900 rounded-full">
              <i className="fas fa-robot text-4xl"></i>
            </div>
            <p className="mt-2">AI</p>
          </div>
          <div className="flex flex-col items-center cursor-pointer transform transition-transform duration-300 hover:scale-105" onClick={() => setIsLoginOpen(true)}>
            <div className="p-4 bg-opacity-50 bg-gray-900 rounded-full">
              <i className="fas fa-shield-alt text-4xl"></i> 
            </div>
            <p className="mt-2">Cybersecurity</p>
          </div>
          <div className="flex flex-col items-center cursor-pointer transform transition-transform duration-300 hover:scale-105" onClick={() => setIsLoginOpen(true)}>
            <div className="p-4 bg-opacity-50 bg-gray-900 rounded-full">
              <i className="fas fa-cube text-4xl"></i> 
            </div>
            <p className="mt-2">Blockchain</p>
          </div>
          <div className="flex flex-col items-center cursor-pointer transform transition-transform duration-300 hover:scale-105" onClick={() => setIsLoginOpen(true)}>
            <div className="p-4 bg-opacity-50 bg-gray-900 rounded-full">
              <i className="fas fa-cloud text-4xl"></i> 
            </div>
            <p className="mt-2">Cloud Computing</p>
          </div>
          <div className="flex flex-col items-center cursor-pointer transform transition-transform duration-300 hover:scale-105" onClick={() => setIsLoginOpen(true)}>
            <div className="p-4 bg-opacity-50 bg-gray-900 rounded-full">
              <i className="fas fa-laptop text-4xl"></i> 
            </div>
            <p className="mt-2">Tech Industri</p>
          </div>
          <div className="flex flex-col items-center cursor-pointer transform transition-transform duration-300 hover:scale-105" onClick={() => setIsLoginOpen(true)}>
            <div className="p-4 bg-opacity-50 bg-gray-900 rounded-full">
              <i className="fas fa-network-wired text-4xl"></i> 
            </div>
            <p className="mt-2">IoT</p>
          </div>
        </motion.div>
      <Articles />
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