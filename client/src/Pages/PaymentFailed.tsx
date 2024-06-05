import { useLocation } from "react-router-dom";

export const PaymentFailed = () => {
    const location = useLocation();
    const retryUrl = location.state?.retryUrl;

    return (
        <div className="container mx-auto text-center mt-20">
            <h2 className="text-2xl font-bold text-red-500">Payment Failed</h2>
            <p>There was an issue with your payment. Please try again.</p>
            {retryUrl && (
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={() => window.location.href = retryUrl}>
                    Try Again
                </button>
            )}
        </div>
    );
}