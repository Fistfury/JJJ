import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Contexts/UserContext';  // Använder UserContext för att hämta användardata
import { PaymentUpdateModal } from '../Modals/PaymentUpdate';

export const SubscriptionCheckStatus = () => {
    const { user } = useUser(); // Hämta användarinfo från kontext
    const [subscriptionStatus, setSubscriptionStatus] = useState('');
    const [updateUrl, setUpdateUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.subscriptionId) {
            console.log(`Checking status for subscription ID: ${user.subscriptionId}`);
            const fetchSubscriptionStatus = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/api/subscriptions/status/${user.subscriptionId}`);
                    const data = await response.json();
                    console.log(`Subscription status response: `, data);
                    setSubscriptionStatus(data.status);
                    setUpdateUrl(data.updateUrl);
                    if (data.status !== 'past_due') {
                        navigate('/'); // Navigera bort om inte past_due
                    }
                } catch (error) {
                    console.error('Failed to fetch subscription status', error);
                }
            };

            fetchSubscriptionStatus();
        }
    }, [user, navigate]);

    useEffect(() => {
        console.log(`Current subscription status: ${subscriptionStatus}`);
        if (subscriptionStatus !== 'past_due' && subscriptionStatus) {
            navigate('/'); // Om betalningen lyckas, navigera användaren till huvudsidan
        }
    }, [subscriptionStatus, navigate]);

    return subscriptionStatus === 'past_due' && updateUrl ? (
        <PaymentUpdateModal updateUrl={updateUrl} />
    ) : null;
};