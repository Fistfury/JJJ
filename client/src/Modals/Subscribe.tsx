import React, { useEffect, useState } from "react";
import {
  SubscribeFormData,
  SubscribeFormProps,
} from "../Interfaces/SubscribeFormData";
import { SubmitHandler, useForm } from "react-hook-form";
import { Price } from "../Interfaces/Price";

const Subscribe: React.FC<SubscribeFormProps> = ({
  isOpen,
  onClose,
}) => {
  const { handleSubmit, register } = useForm<SubscribeFormData>();
  const [prices, setPrices] = useState<Price[]>([]);

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

  const handleSubscription = async (priceId: string) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ priceId }),
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
    handleSubscription(data.subscriptionLevel);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-black text-gray-500 p-8 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4 text-white">Påbörja prenumaration</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-500">
              Välj prenumerationsnivå:
            </label>
            <select
              {...register("subscriptionLevel", { required: true })}
              className="block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {prices.map((price) => (
                <option key={price.id} value={price.id}>
                  {price.name} - {price.unit_amount / 100}{" "}
                  {price.currency.toUpperCase()}
                </option>
              ))}
            </select>
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
          <span className="absolute inset-px z-10 grid place-items-center rounded-lg bg-black bg-gradient-to-t from-neutral-800 text-white">Subscribe</span>
          <span aria-hidden className="absolute inset-0 z-0 scale-x-[2.0] blur before:absolute before:inset-0 before:top-1/2 before:aspect-square before:animate-disco before:bg-gradient-conic before:from-blue-700 before:via-blue-500 before:to-blue-300" />
  </button>
</div>
        </form>
      </div>
    </div>
  );
};

export default Subscribe;
