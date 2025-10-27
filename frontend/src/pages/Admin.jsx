import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import {
  Plus,
  Edit,
  Trash2,
  Home,
  Video,
  BrainCircuit,
  Sun,
  Moon,
  Settings,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { NavLink } from 'react-router';

function Admin() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode === 'dark';
  });

  const [stats, setStats] = useState({
    totalProblems: 0,
    easyProblems: 0,
    mediumProblems: 0,
    hardProblems: 0,
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

  const fetchProblemStats = async () => {
    try {
      const response = await axiosClient.get('/problem/getAllProblem');
      const problems = response.data;

      const total = problems.length;
      const easy = problems.filter(p => p.difficulty === 'Easy').length;
      const medium = problems.filter(p => p.difficulty === 'Medium').length;
      const hard = problems.filter(p => p.difficulty === 'Hard').length;

      setStats({
        totalProblems: total,
        easyProblems: easy,
        mediumProblems: medium,
        hardProblems: hard,
      });
    } catch (error) {
      console.error('Error fetching problem data:', error);
    }
  };

  useEffect(() => {
    fetchProblemStats();
  }, []);

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: 'bg-green-500',
      route: '/admin/create',
      stats: `${stats.totalProblems} Total`
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      color: 'bg-amber-500',
      route: '/admin/update',
      stats: 'Manage All'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      color: 'bg-red-500',
      route: '/admin/delete',
      stats: 'Bulk Actions'
    },
    {
      id: 'video',
      title: 'Video Management',
      description: 'Upload and manage tutorial videos',
      icon: Video,
      color: 'bg-purple-500',
      route: '/admin/video',
      stats: `Manage Videos`
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#282828]' : 'bg-gray-100'}`}>
      {/* Navbar */}
      <nav className={`navbar p-4 ${isDarkMode ? 'bg-[#282828] text-white' : 'bg-white text-gray-900'}`}>
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost text-xl normal-case">
            <BrainCircuit size={24} className="text-green-500 mr-2" />
            LeetGears
          </NavLink>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 gap-4">
            <li>
              <NavLink to="/" className="btn btn-ghost gap-2">
                <Home size={20} />
                <span className="hidden md:inline">Home</span>
              </NavLink>
            </li>
            <li>
              <button 
                onClick={toggleDarkMode} 
                className="btn btn-ghost btn-circle"
              >
                {isDarkMode ? (
                  <Sun size={20} className="text-yellow-400" />
                ) : (
                  <Moon size={20} />
                )}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 mb-4">
            <Settings size={16} className="text-green-500" />
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              Administrator Access
            </span>
          </div>
          <h1 className={`text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Admin Dashboard
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage problems, monitor platform activity, and maintain content quality
          </p>
        </div>

        {/* Stats Card */}
        <div className="max-w-md mx-auto mb-12">
          <div className={`card shadow-xl rounded-lg p-6 text-center ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="card-body items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <FileText size={30} className="text-blue-600" />
              </div>
              <h2 className="card-title text-2xl font-bold mb-2">Total Problems</h2>
              <p className="text-4xl font-bold text-green-500">{stats.totalProblems}</p>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Easy: {stats.easyProblems} | Medium: {stats.mediumProblems} | Hard: {stats.hardProblems}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {adminOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={option.id}
                  className={`card shadow-xl rounded-lg p-6 hover:shadow-2xl transition-shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <div className="card-body">
                    <div className={`${option.color} p-4 rounded-lg w-fit mb-4`}>
                      <IconComponent size={32} className="text-white" />
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {option.title}
                    </h3>
                    
                    <p className={`mb-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {option.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {option.stats}
                      </span>
                      
                      <NavLink 
                        to={option.route}
                        className={`btn btn-sm gap-2 ${option.color} text-white border-none hover:opacity-90`}
                      >
                        Go
                        <ArrowRight size={16} />
                      </NavLink>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
