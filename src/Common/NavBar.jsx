import React from 'react';
import { Link } from 'react-router-dom';
import GoogleLog from './Log/GoogleLog';

const Navbar = () => {
  return (
    <nav className="w-full flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-800 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-black p-4 text-lg font-semibold bg-white rounded-full">
          MiMapa
        </div>
         <div className="flex space-x-4">
          <GoogleLog/>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
