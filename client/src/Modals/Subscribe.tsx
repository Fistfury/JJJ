import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUser } from "../Contexts/UserContext";
import { SubscribeFormData, SubscribeFormProps } from "../Interfaces/SubscribeFormData";
import { Price } from "../Interfaces/Price";

const Subscribe: React.FC<SubscribeFormProps> = ({ isOpen, onClose, onSubscribe }) => {
  const { handleSubmit, register } = useForm<SubscribeFormData>();
  const [prices, setPrices] = useState<Price[]>([]);
  const { user } = useUser();
  

  useEffect(() => {
    async function fetchPrices() {
      try {
        const response = await fetch("http://localhost:3000/api/stripe/prices");
        if (!response.ok) {
          throw new Error("Failed to fetch prices");
        }
        const data: Price[] = await response.json();
        setPrices(data);
        console.log("Fetched prices:", data);
      } catch (error) {
        console.error("Error loading prices:", error);
      }
    }
    if (isOpen) {
      fetchPrices();
    }
  }, [isOpen]);

  const handleSubscription = async (dataToSend: SubscribeFormData) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify(dataToSend),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server responded with ${response.status}: ${errorText}`
        );
      }
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  const onSubmit: SubmitHandler<SubscribeFormData> = (data) => {
    if (!user) {
      console.error("User is not logged in");
      return;
    }
    console.log("User data:", user);
    const selectedPrice = prices.find(price => price.id === data.priceId);
    const dataToSend: SubscribeFormData = {
      priceId: data.priceId,
      email: user.email,
      stripeCustomerId: user.stripeCustomerId,
      subscriptionLevel: selectedPrice ? selectedPrice.name : "",
    };
    console.log("Sending data:", dataToSend);
    handleSubscription(dataToSend);
    onSubscribe(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Start Subscription</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">
              Choose Price:
            </label>
            <select
              {...register("priceId", { required: true })}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {prices.map((price) => (
                <option key={price.id} value={price.id}>
                  {price.name} - {price.unit_amount / 100} {price.currency.toUpperCase()}
                </option>
              ))}
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
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Subscribe;
