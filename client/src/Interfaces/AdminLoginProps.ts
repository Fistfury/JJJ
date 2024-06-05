interface AdminLoginProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (data: { email: string; password: string }) => void;
  }
  export default AdminLoginProps;