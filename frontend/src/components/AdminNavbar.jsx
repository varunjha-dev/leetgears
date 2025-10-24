import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { BrainCircuit, Sun, Moon } from 'lucide-react';

function AdminNavbar() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className={`navbar ${isDarkMode ? 'bg-[#282828] shadow-lg' : 'bg-base-100 shadow-lg'} px-4`}>
      <div className="flex-1">
        <button onClick={handleLogoClick} className="btn btn-ghost text-xl normal-case">
          <BrainCircuit size={24} className="text-green-500 mr-2" />
          <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>LeetGears</span>
        </button>
      </div>
      <div className="flex-none">
        <button onClick={toggleDarkMode} className="btn btn-ghost btn-circle">
          {isDarkMode ? <Sun size={24} className="text-white" /> : <Moon size={24} className="text-gray-800" />}
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
