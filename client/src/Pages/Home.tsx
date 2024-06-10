import React, { useState } from 'react';
import CustomerLogin from '../Modals/CustomerLogin';
import CustomerRegister from '../Modals/CustomerRegister';
import { CustomerRegisterFormData } from '../Interfaces/CustomerRegisterFormData';
import { CustomerLoginFormData } from '../Interfaces/CustomerLoginFormData';
import Subscribe from '../Modals/Subscribe';
import { SubscribeFormData } from '../Interfaces/SubscribeFormData';

export const Home: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  const handleLogin = async (data: CustomerLoginFormData) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
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
        <button onClick={() => setIsSubscribeOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Subscribe</button> 
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
      {isSubscribeOpen && (
        <Subscribe
          isOpen={isSubscribeOpen}
          onClose={() => setIsSubscribeOpen(false)}
          onSubscribe={handleSubscribe}
        />
      )}
    </div>
  );
};


