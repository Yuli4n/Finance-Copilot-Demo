import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg text-white py-4 px-8 flex justify-between items-center fixed top-0 left-0 w-full z-10">
      <div className="font-bold text-2xl">
        Investra
      </div>
      <div className="flex space-x-4">
        <Link to="/" className="hover:text-gray-300 transition-colors duration-200">Copilot</Link>
        <Link to="/graphics" className="hover:text-gray-300 transition-colors duration-200">Top 3 Advice</Link>
      </div>
    </nav>
  );
};

export default NavBar;
