interface AdminRegisterProps {
    isOpen: boolean;
    onClose: () => void;
    onRegister: (data: { email: string; password: string }) => void;
    onOpenLogin: () => void;
  }
    export default AdminRegisterProps;