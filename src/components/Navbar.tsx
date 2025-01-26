import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Plane, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Pingo</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/search" className="text-gray-600 hover:text-blue-600">
              Find Flights
            </Link>
            
            {user ? (
              <>
                <Link to="/profile" className="flex items-center text-gray-600 hover:text-blue-600">
                  <User className="h-5 w-5 mr-1" />
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center text-gray-600 hover:text-blue-600"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
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
}