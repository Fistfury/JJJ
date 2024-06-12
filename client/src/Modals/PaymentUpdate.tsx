import { useEffect, useState } from "react";

interface PaymentUpdateModalProps {
    updateUrl: string;
   
}

export const PaymentUpdateModal = ({ updateUrl }: PaymentUpdateModalProps) => {

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const checkSubscriptionStatus = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/subscription/status');
                const data = await response.json();
                if (data.status === 'past_due') {
                    setShowModal(true);
                }
            } catch (error) {
                console.error('Error fetching subscription status:', error);
            }
        };

        checkSubscriptionStatus();
    }, []);
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg text-center">
                <h2 className="text-lg font-bold text-white">Betalningsproblem</h2>
                <p className="text-white mt-4">
                    Din senaste betalning kunde inte behandlas. Vänligen uppdatera din betalningsinformation för att fortsätta använda tjänsten.
                </p>
                <a 
                    href={updateUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mt-6 inline-block px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Uppdatera Betalningsinfo
                </a>
            </div>
        </div>
    );
};