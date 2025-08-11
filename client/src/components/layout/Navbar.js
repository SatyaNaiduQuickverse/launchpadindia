import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            ResumeBuilder Pro
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-purple-200">
                  Dashboard
                </Link>
                <span className="text-purple-200">
                  Hi, {user.firstName}
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-purple-700 hover:bg-purple-800 px-3 py-2 rounded text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-purple-200">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-purple-700 hover:bg-purple-800 px-3 py-2 rounded text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
