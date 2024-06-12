import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { CustomerLoginFormData } from '../Interfaces/CustomerLoginFormData';
import { CustomerLoginProps } from '../Interfaces/CustomerLoginProps';

export const CustomerLogin: React.FC<CustomerLoginProps> = ({ isOpen, onClose, onLogin, onRegister }) => {
  const { register, handleSubmit } = useForm<CustomerLoginFormData>();

  const onSubmit: SubmitHandler<CustomerLoginFormData> = (data) => {
    onLogin(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-black text-gray-500 p-8 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4 text-white">Customer Login</h2>
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
              className="px-4 py-2 bg-slate-900 rounded hover:bg-slate-800"
            >
              Cancel
            </button>
            <button type="submit" className="relative overflow-hidden rounded-lg bg-black px-20 py-6 ring-blue-500/50 ring-offset-black will-change-transform focus:outline-none focus:ring-1 focus:ring-offset-2">
            <span className="absolute inset-px z-10 grid place-items-center rounded-lg bg-black bg-gradient-to-t from-neutral-800 text-white">Login</span>
            <span aria-hidden className="absolute inset-0 z-0 scale-x-[2.0] blur before:absolute before:inset-0 before:top-1/2 before:aspect-square before:animate-disco before:bg-gradient-conic before:from-blue-700 before:via-blue-500 before:to-blue-300" />
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


