import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md p-4 flex gap-6 justify-center text-gray-700">
      <Link
        to="/"
        className={`hover:text-blue-600 ${isActive('/') ? 'text-blue-600 font-bold' : ''}`}
      >
        一覧
      </Link>
      <Link
        to="/add"
        className={`hover:text-blue-600 ${isActive('/add') ? 'text-blue-600 font-bold' : ''}`}
      >
        追加
      </Link>
      <Link
        to="/completed"
        className={`hover:text-blue-600 ${isActive('/completed') ? 'text-blue-600 font-bold' : ''}`}
      >
        完了済み
      </Link>
      <Link
        to="/about"
        className={`hover:text-blue-600 ${isActive('/about') ? 'text-blue-600 font-bold' : ''}`}
      >
      </Link>
    </nav>
  );
}

export default Navbar;
