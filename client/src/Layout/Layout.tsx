
import { Outlet } from 'react-router-dom';
import { Footer } from '../Components/Footer';
import { NavBar } from '../Components/Navbar';
import { useAuth } from '../Contexts/AuthContext';


export const Layout: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div>
      <NavBar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      <Outlet />
      <Footer />
    </div>
  );
};
