import React, { useContext } from 'react';
import { assets } from '../assets/assets_admin/assets';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { aToken, setaToken } = useContext(AdminContext);
  const { dToken, setdToken } = useContext(DoctorContext);
  const { theme, setTheme } = useContext(AppContext);
  const navigate = useNavigate();

  const logout = () => {
    // ✅ Clear both Admin and Doctor tokens
    if (aToken) {
      setaToken('');
      localStorage.removeItem('atoken');
    }
    if (dToken) {
      setdToken('');
      localStorage.removeItem('dtoken');
    }

    // ✅ Navigate after clearing tokens
    navigate('/');
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center gap-2 text-xs">
        <img
          className="w-36 sm:w-40 cursor-pointer"
          src={assets.admin_logo}
          alt="Logo"
          onClick={() => navigate('/')}
          style={{ filter: theme === 'dark' ? 'invert(1) hue-rotate(180deg)' : 'none' }}
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 dark:text-gray-300 dark:border-gray-600">
          {aToken ? 'Admin' : dToken ? 'Doctor' : ''}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xl"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <button
          onClick={logout}
          className="bg-[#5f6fff] dark:bg-blue-600 text-white text-sm px-10 py-2 rounded-full hover:bg-[#4e57ff] dark:hover:bg-blue-500 transition-all shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
