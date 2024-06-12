import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { CustomerLoginFormData } from '../Interfaces/CustomerLoginFormData';
import { CustomerLoginProps } from '../Interfaces/CustomerLoginProps';
import { useUser } from '../Contexts/UserContext';

export const CustomerLogin: React.FC<CustomerLoginProps> = ({ isOpen, onClose, onLogin, onRegister }) => {
  const { register, handleSubmit } = useForm<CustomerLoginFormData>();
  const { setUser} = useUser();

  const onSubmit: SubmitHandler<CustomerLoginFormData> = async (data) => {
    try {
      // Replace this with your actual API call
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const userData = await response.json();
      console.log('User data:', userData);
  
      setUser(userData);
    } catch (error) {
      console.error(error);
    }
    onLogin(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Customer Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Email</label>
            <input
              {...register('email', { required: true })}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Enter email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...register('password', { required: true })}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Enter password"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </button>
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onRegister}
              className="text-blue-600 hover:underline"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


