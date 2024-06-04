interface AdminLoginProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (data: { email: string; password: string }) => void;
    onOpenRegister: () => void;
  }
  export default AdminLoginProps;