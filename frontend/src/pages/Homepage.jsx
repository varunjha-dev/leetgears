import { useEffect, useState } from 'react';
import { NavLink } from 'react-router'; 
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { BrainCircuit, Sun, Moon, CheckCircle } from 'lucide-react';

function Homepage() {
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

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [allProblems, setAllProblems] = useState([]); // Store all problems
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 5;

  useEffect(() => {
    const fetchAllProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setAllProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    fetchAllProblems();
  }, []); // Fetch all problems only once on component mount

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]); // Clear solved problems on logout
  };

  const filteredProblems = allProblems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' || 
                      solvedProblems.some(sp => sp._id === problem._id);
    return difficultyMatch && tagMatch && statusMatch;
  });

  // Calculate total pages based on filtered problems
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);

  // Get current problems for display based on pagination
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = filteredProblems.slice(indexOfFirstProblem, indexOfLastProblem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const renderPaginationButtons = () => {
    const pageButtons = [];
    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`join-item btn ${currentPage === i ? 'btn-active btn-primary' : ''}`}
        >
          {i}
        </button>
      );
    }
    return pageButtons;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#282828] text-white' : 'bg-base-200'}`}>
      {/* Navigation Bar */}
      <nav className={`navbar ${isDarkMode ? 'bg-[#282828] shadow-lg' : 'bg-base-100 shadow-lg'} px-4`}>
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost text-xl normal-case text-white">
            <BrainCircuit size={24} className="text-green-500 mr-2" />
            <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>LeetGears</span>
          </NavLink>
        </div>
        <div className="flex-none gap-4">
          <button onClick={toggleDarkMode} className="btn btn-ghost btn-circle">
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />} 
          </button>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost">
              {user?.firstName}
            </div>
            <ul className={`mt-3 p-2 shadow menu menu-sm dropdown-content ${isDarkMode ? 'bg-gray-700' : 'bg-base-100'} rounded-box w-52`}>
              <li><button onClick={handleLogout}>Logout</button></li>
              {user.role === 'admin' && <li><NavLink to="/admin">Admin</NavLink></li>}
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Status Filter */}
          <select 
            className={`select select-bordered ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value, currentPage: 1})}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
          </select>

          <select 
            className={`select select-bordered ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
            value={filters.difficulty}
            onChange={(e) => setFilters({...filters, difficulty: e.target.value, currentPage: 1})}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select 
            className={`select select-bordered ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
            value={filters.tag}
            onChange={(e) => setFilters({...filters, tag: e.target.value, currentPage: 1})}
          >
            <option value="all">All Tags</option>
            <option value="Array">Array</option>
            <option value="LinkedList">Linked List</option>
            <option value="Graph">Graph</option>
            <option value="DP">DP</option>
          </select>
        </div>

        {/* Problems List */}
        <div className="grid gap-4">
          {currentProblems.map(problem => (
            <div key={problem._id} className={`card shadow-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-base-100'}`}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <h2 className="card-title">
                    <NavLink to={`/problem/${problem._id}`} className={`${isDarkMode ? 'hover:text-green-400 text-white' : 'hover:text-green-400 text-gray-800'}`}>
                      {problem.title}
                    </NavLink>
                  </h2>
                  {solvedProblems.some(sp => sp._id === problem._id) && (
                    <div className="badge badge-success gap-2">
                      <CheckCircle size={16} />
                      Solved
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </div>
                  <div className="badge badge-info">
                    {problem.tags}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="join">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="join-item btn"
              >
                «
              </button>
              {renderPaginationButtons()}
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="join-item btn"
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'badge-success';
    case 'medium': return 'badge-warning';
    case 'hard': return 'badge-error';
    default: return 'badge-neutral';
  }
};

export default Homepage;