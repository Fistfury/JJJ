import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo_3.png';

interface NavBarProps {
  isAuthenticated: boolean;
  handleLogout: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ isAuthenticated, handleLogout }) => {
    return (
        <nav className="glass fixed top-0 left-0 right-0 z-50 p-2 bg-opacity-50">
        <div className="container mx-auto flex justify-between items-center h-16 pt-2 pb-2">
          <div className="flex items-center">
            <img src={logo} alt="Logo" style={{ height: '100px', width: '100px', marginRight: '8px' }} /> 
            
          </div>
          <ul className="flex space-x-4 text-xl gap-8">
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