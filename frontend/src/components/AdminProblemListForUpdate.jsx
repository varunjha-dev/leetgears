import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import AdminNavbar from './AdminNavbar';
import { Edit, Search, ArrowLeft, AlertCircle, FileText } from 'lucide-react';

const AdminProblemListForUpdate = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode === 'dark';
  });

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      showToast('Failed to fetch problems', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleEdit = (id) => {
    navigate(`/admin/update/${id}`);
  };

  // Case-insensitive filtering
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || 
      problem.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyBadgeStyle = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'badge-success';
      case 'medium':
        return 'badge-warning';
      case 'hard':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? 'bg-[#282828]' : 'bg-gray-100'
        }`}>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin mx-auto"></div>
            <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Loading problems...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top">
          <div className={`px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 min-w-[320px] ${
            toast.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-[#282828]' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header Section */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/admin')}
              className={`flex items-center gap-2 mb-4 text-sm font-medium hover:text-green-500 transition-colors ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <ArrowLeft size={16} />
              Back to Admin Dashboard
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg">
                <Edit className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Select Problem to Update
                </h1>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Choose a problem to modify its details
                </p>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className={`card shadow-xl rounded-lg p-6 mb-6 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search problems by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 placeholder-gray-400'
                  }`}
                />
              </div>

              {/* Difficulty Filter */}
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-medium min-w-[160px] ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Stats Bar */}
            <div className={`flex items-center gap-6 mt-4 pt-4 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Problems:
                </span>
                <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {filteredProblems.length}
                </span>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className={`card shadow-xl rounded-lg overflow-hidden ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>#</th>
                    <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Problem Title</th>
                    <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Difficulty</th>
                    <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Tags</th>
                    <th className={`px-6 py-4 text-center text-xs font-bold uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                  {filteredProblems.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                          }`}>
                            <FileText className={`w-8 h-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          </div>
                          <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            No problems found
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            Try adjusting your search or filters
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProblems.map((problem, index) => (
                      <tr 
                        key={problem._id}
                        className={`hover:bg-opacity-50 ${
                          isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className={`px-6 py-4 text-sm font-medium ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>{index + 1}</td>
                        <td className="px-6 py-4">
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {problem.title}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`badge badge-sm ${getDifficultyBadgeStyle(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {problem.tags && problem.tags.split(',').slice(0, 2).map((tag, i) => (
                              <span key={i} className="badge badge-sm badge-info badge-outline">
                                {tag.trim()}
                              </span>
                            ))}
                            {problem.tags && problem.tags.split(',').length > 2 && (
                              <span className={`badge badge-sm ${
                                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                              }`}>
                                +{problem.tags.split(',').length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(problem._id)}
                              className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg font-medium border border-amber-200 flex items-center gap-2"
                            >
                              <Edit size={16} />
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProblemListForUpdate;
