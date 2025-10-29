import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import axiosClient from '../utils/axiosClient';
import AdminNavbar from './AdminNavbar';
import { Video, Upload, Trash2, Search, AlertCircle, ArrowLeft } from 'lucide-react';

const AdminVideo = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);
  const [toast, setToast] = useState(null);

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
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin mx-auto"></div>
            <p className="font-medium">Loading problems...</p>
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
          <div className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'} shadow-xl`}>
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-red-600" />
            </div>
            
            {/* Content */}
            <h3 className="font-bold text-xl text-center mb-2">Delete Video?</h3>
            <p className="text-center opacity-70 mb-6">
              Are you sure you want to permanently delete the video for "{problemToDelete?.title}"? This action cannot be undone.
            </p>
            
            {/* Actions */}
            <div className="modal-action">
              <button onClick={closeDeleteModal} className="btn btn-ghost">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(problemToDelete._id)}
                className="btn btn-error"
              >
                Delete Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-screen py-8 bg-base-200">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header Section */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 mb-4 text-sm font-medium hover:text-green-500 transition-colors opacity-70"
            >
              <ArrowLeft size={16} />
              Back to Admin Dashboard
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center shadow-lg">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Video Management</h1>
                <p className="opacity-70">Upload and manage tutorial videos for problems</p>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="card bg-base-100 shadow-xl p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
                <input
                  type="text"
                  placeholder="Search problems by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input input-bordered w-full pl-3"
                />
              </div>

              {/* Difficulty Filter */}
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="select select-bordered font-medium min-w-[160px]"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-base-300">
              <div className="flex items-center gap-2">
                <span className="text-sm opacity-70">Total Problems:</span>
                <span className="font-bold text-lg">{filteredProblems.length}</span>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="card bg-base-100 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Problem Title</th>
                    <th>Difficulty</th>
                    <th>Tags</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProblems.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center">
                            <Video className="w-8 h-8 opacity-50" />
                          </div>
                          <p className="font-medium">No problems found</p>
                          <p className="text-sm opacity-70">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProblems.map((problem, index) => (
                      <tr key={problem._id}>
                        <td className="font-medium opacity-70">{index + 1}</td>
                        <td>
                          <span className="font-medium">{problem.title}</span>
                        </td>
                        <td>
                          <span className={`badge badge-sm ${getDifficultyBadgeStyle(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-1.5">
                            {problem.tags && problem.tags.split(',').slice(0, 2).map((tag, i) => (
                              <span key={i} className="badge badge-sm badge-info badge-outline">
                                {tag.trim()}
                              </span>
                            ))}
                            {problem.tags && problem.tags.split(',').length > 2 && (
                              <span className="badge badge-sm badge-ghost">
                                +{problem.tags.split(',').length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="flex justify-center gap-2">
                            <NavLink 
                              to={`/admin/upload/${problem._id}`}
                              className="btn btn-sm btn-success gap-2"
                            >
                              <Upload size={16} />
                              Upload
                            </NavLink>
                            <button
                              onClick={() => openDeleteModal(problem)}
                              className="btn btn-sm btn-error gap-2"
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
