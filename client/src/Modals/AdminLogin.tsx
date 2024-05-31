// src/Modals/AdminLogin.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import AdminLoginFormData from '../Interfaces/AdminLoginFormData';
import AdminLoginProps from '../Interfaces/AdminLoginProps';




export const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onLogin }) => {
  const { register, handleSubmit } = useForm<AdminLoginFormData>();

  const onSubmit = (data: AdminLoginFormData) => {
    onLogin(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Username</label>
            <input
              {...register('username', { required: true })}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Enter username"
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
        </form>
      </div>
    </div>
  );
};

