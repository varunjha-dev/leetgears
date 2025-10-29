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
              <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg">
                <Edit className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Select Problem to Update</h1>
                <p className="opacity-70">Choose a problem to modify its details</p>
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
                              onClick={() => handleEdit(problem._id)}
                              className="btn btn-sm btn-warning gap-2"
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