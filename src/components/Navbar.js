// Navbar.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaList, FaPlusCircle, FaCheckCircle, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function Navbar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/', label: '一覧', icon: <FaList /> },
    { path: '/add', label: '追加', icon: <FaPlusCircle /> },
    { path: '/completed', label: '完了済み', icon: <FaCheckCircle /> },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <nav className="w-48 bg-white shadow-md h-screen p-4 flex flex-col justify-between">
      {user && (
        <div className="flex flex-col space-y-4">
          {menuItems.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                text-gray-700 hover:bg-blue-100 hover:text-blue-700
                transition
                ${isActive(path) ? 'bg-blue-600 text-white font-semibold' : ''}
              `}
            >
              <span className="text-lg">{icon}</span>
              <span className="text-base">{label}</span>
            </Link>
          ))}
        </div>
      )}

      <div>
        {user ? (
          <button
            onClick={handleLogout}
            className="mt-6 flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-100 hover:text-red-800 transition w-full justify-center"
            title="ログアウト"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="text-base font-semibold">ログアウト</span>
          </button>
        ) : (
          <Link
            to="/login"
            className="mt-6 flex items-center gap-3 px-4 py-3 rounded-lg text-green-600 hover:bg-green-100 hover:text-green-800 transition w-full justify-center"
            title="ログイン"
          >
            <FaSignInAlt className="text-lg" />
            <span className="text-base font-semibold">ログイン</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
