import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiCalendar, FiSettings } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">CB</span>
              </div>
              <span className="font-bold text-xl text-gray-900">CourtBook</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
              Home
            </Link>
            <Link to="/booking" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
              Book Now
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/my-bookings" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                  My Bookings
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                  <span className="text-sm text-gray-600">Hi, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline text-sm py-1.5"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md"
            >
              <FiHome /> <span>Home</span>
            </Link>
            <Link
              to="/booking"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md"
            >
              <FiCalendar /> <span>Book Now</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-bookings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md"
                >
                  <FiUser /> <span>My Bookings</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md"
                  >
                    <FiSettings /> <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-3 py-2 rounded-md w-full text-left"
                >
                  <FiLogOut /> <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="pt-2 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block btn btn-outline w-full text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block btn btn-primary w-full text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
