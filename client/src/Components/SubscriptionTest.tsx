export const SubscriptionTest = () => {
    const handleSubscription = async (priceId: string) => {
        try {
            const response = await fetch('http://localhost:3000/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ priceId })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server responded with ${response.status}: ${errorText}`);
            }
            const { url } = await response.json();
            window.location.href = url;
        } catch (error) {
            console.error('Error creating checkout session:', error);
        }
    };

    return (
        <div className="subscription-test mt-32">
            <h1>Testa Prenumerationer</h1>
            <button  onClick={() => handleSubscription('price_1PObUYRtRCaZXyExUhlbRhJm')}>Prenumerera på Dev Basics</button>
            <button onClick={() => handleSubscription('price_1PObVURtRCaZXyExHWQoyoRS')}>Prenumerera på Dev Plus</button>
            <button onClick={() => handleSubscription('price_1POcLfRtRCaZXyExsq693pIp')}>Prenumerera på Dev Dominator</button>
        </div>
    );
}


