import React, { useState, useEffect } from 'react';
import { ChevronRight, GraduationCap, SquareStack, Globe, Lightbulb, BrainCircuit, Sun, Moon, Code, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';

const LandingPage = () => {
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

  const handleCreateAccountClick = () => {
    navigate('/signup');
  };

  const handleSignInClick = () => {
    navigate('/login');
  };

  const handlePremiumClick = () => {
    navigate('/premium');
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar */}
      <nav className="navbar bg-base-100 shadow-sm sticky top-0 z-50 border-b border-base-300">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl normal-case gap-2">
            <BrainCircuit size={28} className="text-green-500" />
            <span className="font-bold">LeetGears</span>
          </a>
        </div>
        {/* <div className="navbar-end hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            <li><a className="font-medium hover:text-green-500" onClick={handlePremiumClick} style={{cursor: 'pointer'}}>Premium</a></li>
            <li><a className="font-medium hover:text-green-500">Explore</a></li>
            <li><a className="font-medium hover:text-green-500">Product</a></li>
            <li><a className="font-medium hover:text-green-500">Developer</a></li>
          </ul>
        </div> */}
        <div className="navbar-end gap-2">
          <button
            onClick={toggleDarkMode}
            className="btn btn-ghost btn-circle"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="btn btn-ghost" onClick={handleSignInClick}>
            Sign in
          </button>
          <button className="btn btn-success text-white" onClick={handleCreateAccountClick}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero min-h-[80vh] bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse gap-12 max-w-7xl">
          {/* Illustration */}
          <div className="relative w-full max-w-md">
            <div className="mockup-window bg-base-300 shadow-2xl border border-base-content/10">
              <div className="bg-base-200 p-6">
                {/* Colored squares */}
                <div className="flex gap-3 mb-6">
                  <div className="w-12 h-12 bg-success rounded-lg shadow-md"></div>
                  <div className="w-12 h-12 bg-warning rounded-lg shadow-md"></div>
                  <div className="w-12 h-12 bg-error rounded-lg shadow-md"></div>
                  <div className="w-12 h-12 bg-info rounded-lg shadow-md"></div>
                </div>
                {/* List items */}
                <div className="space-y-3">
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-5/6"></div>
                  <div className="skeleton h-4 w-4/5"></div>
                  <div className="skeleton h-4 w-full"></div>
                </div>
                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="stat bg-base-100 rounded-lg p-3 shadow-sm">
                    <div className="stat-value text-2xl text-success">50+</div>
                    <div className="stat-title text-xs">Problems</div>
                  </div>
                  <div className="stat bg-base-100 rounded-lg p-3 shadow-sm">
                    <div className="stat-value text-2xl text-info">1k+</div>
                    <div className="stat-title text-xs">Users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center lg:text-left max-w-xl">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              A New Way to <span className="text-green-500">Learn</span>
            </h1>
            <p className="text-lg lg:text-xl opacity-80 mb-8">
              LeetGears is the best platform to help you enhance your skills, expand
              your knowledge and prepare for technical interviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                className="btn btn-success btn-lg text-white gap-2"
                onClick={handleCreateAccountClick}
              >
                Create Account
                <ChevronRight size={20} />
              </button>
              <button 
                className="btn btn-outline btn-lg gap-2"
                onClick={handleSignInClick}
              >
                Sign in
              </button>
            </div>

            {/* Stats Row */}
            <div className="stats shadow-lg mt-8 bg-base-100">
              <div className="stat">
                <div className="stat-figure text-success">
                  <Code size={24} />
                </div>
                <div className="stat-title">Problems</div>
                <div className="stat-value text-success">50+</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-info">
                  <Users size={24} />
                </div>
                <div className="stat-title">Active Users</div>
                <div className="stat-value text-info">1k+</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-warning">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-title">Success Rate</div>
                <div className="stat-value text-warning">90%</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Start Exploring Section */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Green Circle Background */}
              <div className="w-24 h-24 bg-success rounded-full"></div>
              {/* Icon positioned on top */}
              <div className="absolute inset-0 flex items-center justify-center">
                <GraduationCap size={48} className="text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4">Start Exploring</h2>
          <p className="text-xl opacity-70 max-w-2xl mx-auto">
            Explore a well-organized tool that helps you get the most out of your programming journey.
          </p>
        </div>
      </section>

      {/* Features Cards Section */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose LeetGears?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Card 1 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body items-center text-center">
                <div className="bg-info/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <SquareStack size={32} className="text-info" />
                </div>
                <h3 className="card-title text-2xl mb-2">Curated Library</h3>
                <p className="opacity-70">
                  Explore a well-organized tool that helps you get the most out of your programming journey.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body items-center text-center">
                <div className="bg-success/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Globe size={32} className="text-success" />
                </div>
                <h3 className="card-title text-2xl mb-2">Global Community</h3>
                <p className="opacity-70">
                  Join millions of users worldwide and discuss solutions, share insights, and collaborate.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body items-center text-center">
                <div className="bg-warning/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Lightbulb size={32} className="text-warning" />
                </div>
                <h3 className="card-title text-2xl mb-2">Master Key Concepts</h3>
                <p className="opacity-70">
                  Understand complex algorithms and data structures through clear explanations and examples.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl opacity-70 mb-8">
            Join thousands of developers improving their skills every day.
          </p>
          <button 
            className="btn btn-success btn-lg text-white gap-2"
            onClick={handleCreateAccountClick}
          >
            Get Started for Free
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <aside>
          <BrainCircuit size={40} className="text-green-500" />
          <p className="font-bold text-lg">LeetGears</p>
          <p className="opacity-70">Empowering developers since 2024</p>
        </aside>
        <nav>
          <div className="grid grid-flow-col gap-4">
            <a 
              href="GOOGLE_DRIVE_LINK_HERE" 
              target="_blank" 
              rel="noopener noreferrer"
              className="link link-hover"
            >
              About
            </a>
            <a 
              href="https://www.linkedin.com/in/varunjha-dev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="link link-hover"
            >
              Contact
            </a>
            <a 
              href="#" 
              className="link link-hover"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="link link-hover"
            >
              Terms of Service
            </a>
            <a className="font-medium hover:text-green-500" 
          onClick={handlePremiumClick} style={{cursor: 'pointer'}}>
            Support
          </a>
          </div>
        </nav>

      </footer>
    </div>
  );
};

export default LandingPage;
