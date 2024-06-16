import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useUser } from "../Contexts/UserContext";
import { Price } from "../Interfaces/Price";
import { SubscribeFormProps, SubscribeFormData } from "../Interfaces/SubscribeFormData";

export const UpdateSub: React.FC<SubscribeFormProps> = ({ isOpen, onClose, onSubscribe }) => {
    const { handleSubmit, register } = useForm<SubscribeFormData>();
    const [prices, setPrices] = useState<Price[]>([]);
    const { user } = useUser();
    const [subscriptionLevel, setSubscriptionLevel] = useState<string>("");


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
    
      const onSubmit: SubmitHandler<SubscribeFormData> = async (data) => {
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
        setSubscriptionLevel(selectedPrice ? selectedPrice.name : "");
        await handleSubscription(dataToSend);
        onSubscribe(data);
        try {
        const response = await fetch(`http://localhost:3000/api/subscriptions/update/${user?.subscriptionId}`,
            {   method: 'PUT',
              headers: {
                  "Content-Type": "application/json",
              },
              credentials: 'include',
              body: JSON.stringify({ subscriptionLevel: selectedPrice ? selectedPrice.name : "" }),
          });
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
              `Server responded with ${response.status}: ${errorText}`
            );
          }
            const result = await response.json();
            console.log("Subscription updated", result);
          } catch(error) {
            console.error("Error updating subscription:", error);
          
          }    
      };
    
      if (!isOpen) return null;

    return (
        <div className="subscription-test mt-32">
            <h1>Change your subscription</h1>
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

    );
};

export default UpdateSub 

