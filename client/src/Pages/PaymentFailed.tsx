import { useLocation, useNavigate } from "react-router-dom";

export const PaymentFailed = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const retryUrl = location.state?.retryUrl;
    const errorMessage = location.state?.errorMessage || "There was an issue with your payment. Please try again.";

    return (
        <div className="container mx-auto text-center mt-20">
            <h2 className="text-2xl font-bold text-red-500">Payment Failed</h2>
            <p>{errorMessage}</p>
            {retryUrl && (
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={() => navigate(retryUrl)}>
                    Try Again
                </button>
            )}
        </div>
    );
}
