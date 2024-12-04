// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom'; // Gunakan Link untuk routing di React

const Header = () => {
  return (
    <header className="bg-blue-600 py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo di Pojok Kiri */}
        <div className="text-white text-2xl font-bold">
          <Link to="/">Logo</Link>
        </div>

        {/* Navigasi di Tengah */}
        <div className="flex space-x-8 mx-auto">
          <Link to="/" className="text-white hover:text-gray-300">Beranda</Link>
          <Link to="/data-rekap" className="text-white hover:text-gray-300">Data Rekap</Link>
        </div>

        {/* Tombol Login Admin di Pojok Kanan */}
        <div>
          <Link to="/login" className="px-6 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition duration-300">
            Login Admin
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
