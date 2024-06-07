import React, { useState } from 'react';
import {CustomerRegister} from '../Modals/CustomerRegister';
import { CustomerRegisterFormData } from '../Interfaces/CustomerRegisterFormData';

export const CustomerRegisterWrapper: React.FC = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(true);

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
    <CustomerRegister
      isOpen={isRegisterOpen}
      onClose={() => {
        console.log('Close register modal');
        setIsRegisterOpen(false);
      }}
      onRegister={handleRegister}
    />
  );
};


