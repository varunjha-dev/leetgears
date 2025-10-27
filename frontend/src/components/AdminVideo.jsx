import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { NavLink } from 'react-router';
import AdminNavbar from './AdminNavbar';
import { Video, Upload, Trash2, Search } from 'lucide-react';

const AdminVideo = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);
  const [toast, setToast] = useState(null);
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

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/video/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
      setDeleteModalOpen(false);
      setProblemToDelete(null);
      showToast('Video deleted successfully', 'success');
    } catch (err) {
      showToast('Failed to delete video', 'error');
      console.error(err);
    }
  };

  const openDeleteModal = (problem) => {
    setProblemToDelete(problem);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setProblemToDelete(null);
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
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className={`rounded-lg shadow-2xl max-w-md w-full ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6 space-y-4">
              {/* Icon */}
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              {/* Content */}
              <div className="text-center space-y-2">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Delete Video?
                </h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Are you sure you want to permanently delete the video for "{problemToDelete?.title}"? This action cannot be undone.
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeDeleteModal}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(problemToDelete._id)}
                  className="flex-1 px-4 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium shadow-lg"
                >
                  Delete Video
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-[#282828]' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center shadow-lg">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Video Management
                </h1>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Upload and manage tutorial videos for problems
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
                            <Video className={`w-8 h-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
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
                            <NavLink 
                              to={`/admin/upload/${problem._id}`}
                              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium border border-green-200 flex items-center gap-2"
                            >
                              <Upload size={16} />
                              Upload
                            </NavLink>
                            <button
                              onClick={() => openDeleteModal(problem)}
                              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium border border-red-200 flex items-center gap-2"
                            >
                              <Trash2 size={16} />
                              Delete
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

export default AdminVideo;
