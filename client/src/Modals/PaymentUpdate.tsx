interface PaymentUpdateModalProps {
    updateUrl: string;
   
}


export const PaymentUpdateModal = ({ updateUrl }: PaymentUpdateModalProps) => {
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