import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import { BrainCircuit, Sun, Moon, Edit } from 'lucide-react';

const AdminProblemListForUpdate = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
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

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/update/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`alert alert-error shadow-lg my-4 ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}>
        <div>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#282828] text-white' : 'bg-base-200'}`}>
      <nav className={`navbar ${isDarkMode ? 'bg-[#282828] shadow-lg' : 'bg-base-100 shadow-lg'} px-4`}>
        <div className="flex-1">
          <a className="btn btn-ghost text-xl normal-case">
            <BrainCircuit size={24} className="text-green-500 mr-2" />
            <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>LeetGears</span>
          </a>
        </div>
        <div className="flex-none">
          <button onClick={toggleDarkMode} className="btn btn-ghost btn-circle">
            {isDarkMode ? <Sun size={24} className="text-white" /> : <Moon size={24} className="text-gray-800" />}
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Update Problems</h1>
        </div>

        <div className="overflow-x-auto">
          <table className={`table table-zebra w-full ${isDarkMode ? 'text-white' : ''}`}>
            <thead>
              <tr>
                <th className={`${isDarkMode ? 'bg-gray-700 text-white' : ''} w-1/12`}>#</th>
                <th className={`${isDarkMode ? 'bg-gray-700 text-white' : ''} w-4/12`}>Title</th>
                <th className={`${isDarkMode ? 'bg-gray-700 text-white' : ''} w-2/12`}>Difficulty</th>
                <th className={`${isDarkMode ? 'bg-gray-700 text-white' : ''} w-3/12`}>Tags</th>
                <th className={`${isDarkMode ? 'bg-gray-700 text-white' : ''} w-2/12`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem, index) => (
                <tr key={problem._id}>
                  <th className={`${isDarkMode ? 'text-white' : ''}`}>{index + 1}</th>
                  <td>{problem.title}</td>
                  <td>
                    <span className={`badge ${
                      problem.difficulty.toLowerCase() === 'easy' 
                        ? 'badge-success' 
                        : problem.difficulty.toLowerCase() === 'medium' 
                          ? 'badge-warning' 
                          : 'badge-error'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-outline">
                      {problem.tags}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(problem._id)}
                        className="btn btn-sm btn-info"
                      >
                        <Edit size={16} /> Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProblemListForUpdate;
