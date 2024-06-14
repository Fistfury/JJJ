export interface SubscribeFormData {
    priceId: string;
    email: string;
    subscriptionLevel: string;
    stripeCustomerId: string;
    subscriptionId?: string;
}

export interface SubscribeFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubscribe: (data: SubscribeFormData) => void;
}

export interface UpdateFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubscribe: (data: SubscribeFormData) => void;
}