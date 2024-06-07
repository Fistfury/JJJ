import React from 'react';
import { Link } from 'react-router-dom';

interface NavBarProps {
  isAuthenticated: boolean;
  handleLogout: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ isAuthenticated, handleLogout }) => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">MyApp</div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-white hover:text-gray-300">Home</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/account" className="text-white hover:text-gray-300">Account</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="text-white hover:text-gray-300">Logout</button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};


