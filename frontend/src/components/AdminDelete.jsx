import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axiosClient from '../utils/axiosClient';
import AdminNavbar from './AdminNavbar';
import { Trash2, Search, AlertCircle, FileText, ArrowLeft } from 'lucide-react';

const AdminDelete = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblems, setSelectedProblems] = useState(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
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
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
      setSelectedProblems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setDeleteModalOpen(false);
      setProblemToDelete(null);
      showToast('Problem deleted successfully', 'success');
    } catch (err) {
      showToast('Failed to delete problem', 'error');
      console.error(err);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedProblems.size === 0) return;
    
    try {
      await Promise.all(
        Array.from(selectedProblems).map(id =>
          axiosClient.delete(`/problem/delete/${id}`)
        )
      );
      setProblems(problems.filter(problem => !selectedProblems.has(problem._id)));
      setSelectedProblems(new Set());
      setDeleteModalOpen(false);
      showToast(`${selectedProblems.size} problem(s) deleted successfully`, 'success');
    } catch (err) {
      showToast('Failed to delete selected problems', 'error');
      console.error(err);
    }
  };

  const openDeleteModal = (problem = null) => {
    if (problem) {
      setProblemToDelete(problem);
    }
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setProblemToDelete(null);
  };

  const toggleSelectAll = () => {
    if (selectedProblems.size === filteredProblems.length) {
      setSelectedProblems(new Set());
    } else {
      setSelectedProblems(new Set(filteredProblems.map(p => p._id)));
    }
  };

  const toggleSelectProblem = (id) => {
    setSelectedProblems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
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
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            
            {/* Content */}
            <h3 className="font-bold text-xl text-center mb-2">
              {problemToDelete ? 'Delete Problem?' : `Delete ${selectedProblems.size} Problems?`}
            </h3>
            <p className="text-center opacity-70 mb-6">
              {problemToDelete 
                ? `Are you sure you want to permanently delete "${problemToDelete.title}"? This action cannot be undone.`
                : `This will permanently delete ${selectedProblems.size} selected problem(s). This action cannot be undone.`
              }
            </p>
            
            {/* Actions */}
            <div className="modal-action">
              <button onClick={closeDeleteModal} className="btn btn-ghost">
                Cancel
              </button>
              <button
                onClick={() => problemToDelete ? handleDelete(problemToDelete._id) : handleBatchDelete()}
                className="btn btn-error"
              >
                Delete {problemToDelete ? 'Problem' : `(${selectedProblems.size})`}
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
              <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center shadow-lg">
                <Trash2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Problem Management</h1>
                <p className="opacity-70">Review and remove problems from the platform</p>
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
                  className="input input-bordered w-full pl-12"
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
                <span className="text-sm opacity-70">Total:</span>
                <span className="font-bold text-lg">{filteredProblems.length}</span>
              </div>
              {selectedProblems.size > 0 && (
                <>
                  <div className="divider divider-horizontal"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-success text-sm">Selected:</span>
                    <span className="text-success font-bold text-lg">{selectedProblems.size}</span>
                  </div>
                  <button
                    onClick={() => openDeleteModal()}
                    className="ml-auto btn btn-error gap-2"
                  >
                    <Trash2 size={16} />
                    Delete Selected
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Table Card */}
          <div className="card bg-base-100 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedProblems.size === filteredProblems.length && filteredProblems.length > 0}
                        onChange={toggleSelectAll}
                        className="checkbox checkbox-success"
                      />
                    </th>
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
                      <td colSpan="6" className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center">
                            <FileText className="w-8 h-8 opacity-50" />
                          </div>
                          <p className="font-medium">No problems found</p>
                          <p className="text-sm opacity-70">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProblems.map((problem, index) => (
                      <tr key={problem._id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedProblems.has(problem._id)}
                            onChange={() => toggleSelectProblem(problem._id)}
                            className="checkbox checkbox-success"
                          />
                        </td>
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

export default AdminDelete;
