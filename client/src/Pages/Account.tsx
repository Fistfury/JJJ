import { useEffect, useState } from "react";
import PauseSub from "../Components/PauseSub"

export const Account = () => {
    const [subscription, setSubscription] = useState([]);
        const fetchSubscription = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/subscriptions', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                },
);
                const data = await response.json();
                setSubscription(data);
            } catch (error) {
                console.error('Error fetching subscription:', error);
            }
        };
    
        useEffect(() => {
            fetchSubscription();
        }, []);


    return (
        <div>
            <p className="flex items-center mt-32">Your subscription level: {subscription}</p>
             <PauseSub />
        </div>
    )
}