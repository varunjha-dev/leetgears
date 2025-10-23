import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Home, RefreshCw, Zap, Video, BrainCircuit, Sun, Moon } from 'lucide-react';
import { NavLink } from 'react-router';

function Admin() {
  const [selectedOption, setSelectedOption] = useState(null);
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

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: 'btn-success',
      bgColor: 'bg-success/10',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      color: 'btn-warning',
      bgColor: 'bg-warning/10',
      route: '/admin/update' // This will lead to a page listing problems for update
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      color: 'btn-error',
      bgColor: 'bg-error/10',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Video Problem',
      description: 'Upload And Delete Videos',
      icon: Video,
      color: 'btn-success',
      bgColor: 'bg-success/10',
      route: '/admin/video'
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#282828] text-white' : 'bg-base-200'}`}>
      {/* Navbar */}
      <nav className={`navbar ${isDarkMode ? 'bg-[#282828] shadow-lg' : 'bg-base-100 shadow-lg'} px-4`}>
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost text-xl normal-case">
            <BrainCircuit size={24} className="text-green-500 mr-2" /> 
            <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>LeetGears</span>
          </NavLink>
        </div>
        <div className="flex-none">
          <button onClick={toggleDarkMode} className="btn btn-ghost btn-circle">
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-base-content'} mb-4`}>
            Admin Panel
          </h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-base-content/70'} text-lg`}>
            Manage coding problems on your platform
          </p>
        </div>

        {/* Admin Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className={`card shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer ${isDarkMode ? 'bg-gray-800' : 'bg-base-100'}`}
              >
                <div className="card-body items-center text-center p-8">
                  {/* Icon */}
                  <div className={`${option.bgColor} p-4 rounded-full mb-4`}>
                    <IconComponent size={32} className={`${isDarkMode ? 'text-white' : 'text-base-content'}`} />
                  </div>
                  
                  {/* Title */}
                  <h2 className={`card-title text-xl mb-2 ${isDarkMode ? 'text-white' : ''}`}>
                    {option.title}
                  </h2>
                  
                  {/* Description */}
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-base-content/70'} mb-6`}>
                    {option.description}
                  </p>
                  
                  {/* Action Button */}
                  <div className="card-actions">
                    <div className="card-actions">
                    <NavLink 
                    to={option.route}
                   className={`btn ${option.color} btn-wide ${isDarkMode ? 'text-white' : ''}`}
                   >
                   {option.title}
                   </NavLink>
                   </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );}
export default Admin;