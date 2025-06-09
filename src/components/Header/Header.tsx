import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-black text-white py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Logo/Brand */}
        <Link
          to="/"
          className="text-3xl font-light tracking-wider mb-6 hover:text-gray-300 transition duration-300"
        >
          MyWebsite
        </Link>

        {/* Navigation */}
        <nav className="flex space-x-10">
          <Link
            to="/"
            className="text-white hover:text-gray-300 transition duration-300 relative group"
          >
            Anasayfa
            <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/about"
            className="text-white hover:text-gray-300 transition duration-300 relative group"
          >
            Hakkında
            <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/contact"
            className="text-white hover:text-gray-300 transition duration-300 relative group"
          >
            İletişim
            <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;