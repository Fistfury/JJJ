import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentUpdateModal } from '../Modals/PaymentUpdate';


export const SubscriptionCheckStatus = () => {
    const [subscriptionStatus, setSubscriptionStatus] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        // API-anrop för att hämta prenumerationsstatus
        const fetchSubscriptionStatus = async () => {
            try {
                const response = await fetch('/api/subscription/status');
                const data = await response.json();
                setSubscriptionStatus(data.status);
            } catch (error) {
                console.error('Failed to fetch subscription status', error);
            }
        };

        fetchSubscriptionStatus();
    }, []);

    const checkAndRedirect = () => {
        if (subscriptionStatus !== 'past_due') {
            navigate('/'); // Om betalningen lyckas, navigera användaren
        }
    };

    return (
        <>
            {subscriptionStatus === 'past_due' && (
                <PaymentUpdateModal
                    updateUrl="https://billing.stripe.com/p/subscription/update_payment_method_link/CBcaFwoVYWNjdF8xUDFURU9SdFJDYVpYeEV4KLupp7MGMgbJo6lFIPg6OtbTpW0_cQnAWN5SO2j9W9jUUU8JtGxM5X_eIryPFx6YLEOHg4RQ4U1DQt-bHTjB6Qbl1-lZ0OV8HFM"
                />
            )}
        </>
    );
};