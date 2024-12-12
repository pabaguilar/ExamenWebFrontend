import React from 'react';
import { Link } from 'react-router-dom';
import GoogleLog from './Log/GoogleLog';

const Navbar = () => {
  return (
    <nav className="w-full flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-800 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-semibold bg-white rounded-full">
          <Link to="/" className="text-black px-4 py-2 rounded hover:text-blue-400 transition">
            Inicio
          </Link>
        </div>
         <div className="flex space-x-4">
          <GoogleLog/>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
