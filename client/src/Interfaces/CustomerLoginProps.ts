import { CustomerLoginFormData } from "./CustomerLoginFormData";

export interface CustomerLoginProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (data: CustomerLoginFormData) => void;
    onRegister: () => void; 
  }