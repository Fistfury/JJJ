import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-15.png';

interface NavBarProps {
  isAuthenticated: boolean;
  handleLogout: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ isAuthenticated, handleLogout }) => {
    return (
      <nav className="glass fixed top-0 left-0 right-0 z-50 p-2 bg-opacity-50">
        <div className="flex justify-between items-center h-12 mx-4">
          <div className="flex items-center ml-4">
            <img src={logo} alt="Logo" style={{ height: '3rem', width: '3rem'}} /> 
          </div>
          <ul className="flex space-x-4 text-xl gap-8 mr-4">
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