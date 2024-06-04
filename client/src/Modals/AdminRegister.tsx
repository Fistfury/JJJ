import React from 'react';
import { useForm } from 'react-hook-form';
import AdminRegisterProps from '../Interfaces/AdminRegisterProps';



const AdminRegister: React.FC<AdminRegisterProps> = ({ isOpen, onClose, onRegister, onOpenLogin }) => {
  const { register, handleSubmit } = useForm<{ email: string; password: string }>();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Admin Register</h2>
        <form onSubmit={handleSubmit(onRegister)}>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Email</label>
            <input
              {...register('email', { required: true })}
              type="email"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Enter email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Password</label>
            <input
              {...register('password', { required: true })}
              type="password"
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
              Register
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onOpenLogin}
            className="text-blue-600 hover:underline"
          >
            Already have an account? Login here
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
