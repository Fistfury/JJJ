import React from 'react'
import { SubscribeFormData, SubscribeFormProps } from '../Interfaces/SubscribeFormData'
import { SubmitHandler, useForm } from 'react-hook-form';

const Subscribe: React.FC<SubscribeFormProps> = ({ isOpen, onClose, onSubscribe }) => {
    const { handleSubmit, register } = useForm<SubscribeFormData>();
    const onSubmit: SubmitHandler<SubscribeFormData> = (data) => {
        onSubscribe(data);
    };

    if (!isOpen) return null;


return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Påbörja prenumaration</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Välj prenumerationsnivå:</label>
            <select {...register('subscriptionLevel', { required: true })} className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            <option value="DevBasic">DevBasic</option>
            <option value="DevPlus">DevPlus</option>
            <option value="DevDominator">DevDominator</option>
            </select>
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
              Subscibe
            </button>
          </div>
        </form>
      </div>
    </div>
)
};

export default Subscribe