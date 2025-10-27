import { useEffect, useState } from 'react';
import { NavLink } from 'react-router'; 
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { 
  BrainCircuit, 
  Sun, 
  Moon, 
  CheckCircle, 
  TrendingUp,
  Target,
  Zap,
  Filter,
  Search,
  X,
  Award,
  Clock,
  BarChart3,
  User
} from 'lucide-react';

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
  const [allProblems, setAllProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const problemsPerPage = 10;

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
  }, []);

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
    setSolvedProblems([]);
  };

  // Calculate stats
  const stats = {
    total: allProblems.length,
    solved: solvedProblems.length,
    easy: allProblems.filter(p => p.difficulty === 'easy').length,
    medium: allProblems.filter(p => p.difficulty === 'medium').length,
    hard: allProblems.filter(p => p.difficulty === 'hard').length,
    easySolved: solvedProblems.filter(p => p.difficulty === 'easy').length,
    mediumSolved: solvedProblems.filter(p => p.difficulty === 'medium').length,
    hardSolved: solvedProblems.filter(p => p.difficulty === 'hard').length,
  };

  const filteredProblems = allProblems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' || 
      (filters.status === 'solved' && solvedProblems.some(sp => sp._id === problem._id));
    const searchMatch = searchQuery === '' || 
      problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    return difficultyMatch && tagMatch && statusMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = filteredProblems.slice(indexOfFirstProblem, indexOfLastProblem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({ difficulty: 'all', tag: 'all', status: 'all' });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const hasActiveFilters = () => {
    return filters.difficulty !== 'all' || filters.tag !== 'all' || 
           filters.status !== 'all' || searchQuery !== '';
  };

  const renderPaginationButtons = () => {
    const pageButtons = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pageButtons.push(
        <button key={1} onClick={() => handlePageChange(1)} className="join-item btn btn-sm">
          1
        </button>
      );
      if (startPage > 2) {
        pageButtons.push(<span key="ellipsis1" className="join-item btn btn-sm btn-disabled">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`join-item btn btn-sm ${currentPage === i ? 'btn-active btn-primary' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(<span key="ellipsis2" className="join-item btn btn-sm btn-disabled">...</span>);
      }
      pageButtons.push(
        <button key={totalPages} onClick={() => handlePageChange(totalPages)} className="join-item btn btn-sm">
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#282828]' : 'bg-gray-100'}`}>
      {/* Navbar */}
      <nav className={`navbar p-0.5 ${isDarkMode ? 'bg-[#282828] text-white' : 'bg-white text-gray-900'}`}>
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost text-xl normal-case">
            <BrainCircuit size={24} className="text-green-500 mr-2" />
            LeetGears
          </NavLink>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 gap-4">
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
            <li>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} className="btn btn-ghost gap-2">
                  <div className="relative">
                    <User 
                      size={40} 
                      className={`${isDarkMode ? 'text-green-500' : 'text-green-600'}`}
                      strokeWidth={2}
                    />
                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white">
                      {user?.firstName?.charAt(0)}
                    </span>
                  </div>
                  <span className="hidden md:inline">{user?.firstName}</span>
                </div>
                <ul className={`mt-3 p-2 shadow-xl menu menu-sm dropdown-content rounded-box w-52 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <li className="menu-title">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Account</span>
                  </li>
                  {user?.role === 'admin' && (
                    <li>
                      <NavLink to="/admin" className="flex items-center gap-2">
                        <Award size={16} />
                        Admin Panel
                      </NavLink>
                    </li>
                  )}
                  <li>
                    <button onClick={handleLogout} className="text-red-500 flex items-center gap-2">
                      <X size={16} />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className={`card shadow-xl rounded-lg p-6 ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Solved
                </p>
                <p className="text-3xl font-bold">
                  <span className="text-green-500">{stats.solved}</span>
                  <span className={`text-lg ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    /{stats.total}
                  </span>
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${stats.total > 0 ? (stats.solved / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className={`card shadow-xl rounded-lg p-6 ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Easy
                </p>
                <p className="text-3xl font-bold">
                  <span className="text-emerald-500">{stats.easySolved}</span>
                  <span className={`text-lg ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    /{stats.easy}
                  </span>
                </p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Target className="text-emerald-600" size={24} />
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: `${stats.easy > 0 ? (stats.easySolved / stats.easy) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className={`card shadow-xl rounded-lg p-6 ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Medium
                </p>
                <p className="text-3xl font-bold">
                  <span className="text-amber-500">{stats.mediumSolved}</span>
                  <span className={`text-lg ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    /{stats.medium}
                  </span>
                </p>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <Zap className="text-amber-600" size={24} />
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-amber-500 h-2 rounded-full"
                style={{ width: `${stats.medium > 0 ? (stats.mediumSolved / stats.medium) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className={`card shadow-xl rounded-lg p-6 ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Hard
                </p>
                <p className="text-3xl font-bold">
                  <span className="text-red-500">{stats.hardSolved}</span>
                  <span className={`text-lg ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    /{stats.hard}
                  </span>
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <BarChart3 className="text-red-600" size={24} />
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${stats.hard > 0 ? (stats.hardSolved / stats.hard) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className={`card shadow-xl rounded-lg mb-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="card-body p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} size={20} />
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className={`input input-bordered w-full pl-10 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
              </div>

              {/* Filter Toggle Button (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline lg:hidden gap-2"
              >
                <Filter size={20} />
                Filters
                {hasActiveFilters() && (
                  <span className="badge badge-primary badge-sm">Active</span>
                )}
              </button>

              {/* Filters */}
              <div className={`flex flex-col lg:flex-row gap-4 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
                <select 
                  className={`select select-bordered ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                  value={filters.status}
                  onChange={(e) => {
                    setFilters({...filters, status: e.target.value});
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="solved">Solved</option>
                </select>

                <select 
                  className={`select select-bordered ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                  value={filters.difficulty}
                  onChange={(e) => {
                    setFilters({...filters, difficulty: e.target.value});
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>

                <select 
                  className={`select select-bordered ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                  value={filters.tag}
                  onChange={(e) => {
                    setFilters({...filters, tag: e.target.value});
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Tags</option>
                  <option value="Array">Array</option>
                  <option value="LinkedList">Linked List</option>
                  <option value="Graph">Graph</option>
                  <option value="DP">Dynamic Programming</option>
                </select>

                {hasActiveFilters() && (
                  <button
                    onClick={clearFilters}
                    className="btn btn-ghost gap-2 text-red-500 hover:bg-red-500/10"
                  >
                    <X size={20} />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters() && (
              <div className={`flex flex-wrap gap-2 mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Active filters:
                </span>
                {filters.status !== 'all' && (
                  <span className="badge badge-primary gap-2">
                    Status: {filters.status}
                    <X 
                      size={14} 
                      className="cursor-pointer"
                      onClick={() => setFilters({...filters, status: 'all'})}
                    />
                  </span>
                )}
                {filters.difficulty !== 'all' && (
                  <span className="badge badge-primary gap-2">
                    Difficulty: {filters.difficulty}
                    <X 
                      size={14} 
                      className="cursor-pointer"
                      onClick={() => setFilters({...filters, difficulty: 'all'})}
                    />
                  </span>
                )}
                {filters.tag !== 'all' && (
                  <span className="badge badge-primary gap-2">
                    Tag: {filters.tag}
                    <X 
                      size={14} 
                      className="cursor-pointer"
                      onClick={() => setFilters({...filters, tag: 'all'})}
                    />
                  </span>
                )}
                {searchQuery && (
                  <span className="badge badge-primary gap-2">
                    Search: "{searchQuery}"
                    <X 
                      size={14} 
                      className="cursor-pointer"
                      onClick={() => setSearchQuery('')}
                    />
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing <span className="font-semibold text-green-500">{indexOfFirstProblem + 1}</span> to{' '}
            <span className="font-semibold text-green-500">
              {Math.min(indexOfLastProblem, filteredProblems.length)}
            </span>{' '}
            of <span className="font-semibold text-green-500">{filteredProblems.length}</span> problems
          </p>
        </div>

        {/* Problems List */}
        <div className="space-y-3">
          {currentProblems.length > 0 ? (
            currentProblems.map((problem) => (
              <div 
                key={problem._id}
                className={`card shadow-xl rounded-lg hover:shadow-2xl transition-shadow ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="card-body p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 ${
                          solvedProblems.some(sp => sp._id === problem._id)
                            ? 'text-green-500'
                            : isDarkMode ? 'text-gray-600' : 'text-gray-300'
                        }`}>
                          <CheckCircle 
                            size={20} 
                            className={
                              solvedProblems.some(sp => sp._id === problem._id)
                                ? 'fill-green-500'
                                : ''
                            }
                          />
                        </div>
                        <div className="flex-1">
                          <NavLink 
                            to={`/problem/${problem._id}`}
                            className={`text-lg font-semibold hover:text-green-500 ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {problem.title}
                          </NavLink>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <div className={`badge badge-sm ${getDifficultyBadgeStyle(problem.difficulty)}`}>
                              {problem.difficulty}
                            </div>
                            <div className="badge badge-sm badge-info badge-outline">
                              {problem.tags}
                            </div>
                            {solvedProblems.some(sp => sp._id === problem._id) && (
                              <div className="badge badge-sm badge-success gap-1">
                                <CheckCircle size={12} />
                                Solved
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <NavLink
                      to={`/problem/${problem._id}`}
                      className="btn btn-sm btn-primary gap-2"
                    >
                      {solvedProblems.some(sp => sp._id === problem._id) ? 'Solve Again' : 'Solve'}
                      <Clock size={16} />
                    </NavLink>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={`card shadow-xl rounded-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="card-body items-center text-center py-16">
                <Search size={48} className={isDarkMode ? 'text-gray-600' : 'text-gray-300'} />
                <h3 className={`text-xl font-semibold mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  No problems found
                </h3>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Try adjusting your filters or search query
                </p>
                {hasActiveFilters() && (
                  <button
                    onClick={clearFilters}
                    className="btn btn-primary btn-sm mt-4 gap-2"
                  >
                    <X size={16} />
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && currentProblems.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Page <span className="font-semibold text-green-500">{currentPage}</span> of{' '}
              <span className="font-semibold text-green-500">{totalPages}</span>
            </div>
            <div className="join">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`join-item btn btn-sm ${
                  currentPage === 1 ? 'btn-disabled' : ''
                }`}
              >
                «
              </button>
              {renderPaginationButtons()}
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`join-item btn btn-sm ${
                  currentPage === totalPages ? 'btn-disabled' : ''
                }`}
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

export default Homepage;