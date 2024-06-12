import React, { useState } from 'react';
import {CustomerLogin} from '../Modals/CustomerLogin';
import {CustomerRegister} from '../Modals/CustomerRegister';
import { CustomerLoginFormData } from '../Interfaces/CustomerLoginFormData';
import { CustomerRegisterFormData } from '../Interfaces/CustomerRegisterFormData';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

export const CustomerLoginWrapper: React.FC = () => {
    const { setIsAuthenticated } = useAuth();
    const { setUser } = useUser();
    const [isLoginOpen, setIsLoginOpen] = useState(true);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const navigate = useNavigate();
  
    const handleLogin = async (data: CustomerLoginFormData) => {
      console.log('handleLogin called', data);
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
          setUser(result);
          setIsAuthenticated(true);
          setIsLoginOpen(false);
          navigate('/'); 
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
  
    return (
      <>
        {isLoginOpen && (
          <CustomerLogin
            isOpen={isLoginOpen}
            onClose={() => {
                setIsLoginOpen(false);
                navigate('/'); 
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
                setIsRegisterOpen(false);
                navigate('/');
              }}
            onRegister={handleRegister}
          />
        )}
      </>
    );
  };
  