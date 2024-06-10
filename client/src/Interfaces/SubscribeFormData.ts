export interface SubscribeFormData {
    email: string;
    subscriptionLevel: string;
    //stripeCustomerId: string;
}

export interface SubscribeFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubscribe: (data: SubscribeFormData) => void;
}