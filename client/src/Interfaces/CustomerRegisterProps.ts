import { CustomerRegisterFormData } from "./CustomerRegisterFormData";

export interface CustomerRegisterProps {
    isOpen: boolean;
    onClose: () => void;
    onRegister: (data: CustomerRegisterFormData) => void;
  }