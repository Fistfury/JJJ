interface AdminLoginProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (data: { username: string; password: string }) => void;
  }
  export default AdminLoginProps;