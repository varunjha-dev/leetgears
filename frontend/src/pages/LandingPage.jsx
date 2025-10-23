import React from 'react';
import { ChevronRight, GraduationCap, SquareStack, Globe, Lightbulb, BrainCircuit } from 'lucide-react'; // Example Lucide React icons, add more as needed
import { useNavigate } from 'react-router';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleCreateAccountClick = () => {
    navigate('/signup');
  };

  const handleSignInClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#282828] text-white">
      {/* Navbar */}
      <nav className="navbar bg-[#282828] text-white p-4">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl normal-case">
            <BrainCircuit size={24} className="text-green-500 mr-2" />
            LeetGears
          </a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 gap-4">
            <li><a className="text-orange-400 font-semibold">Premium</a></li>
            <li><a>Explore</a></li>
            <li><a>Product</a></li>
            <li><a>Developer</a></li>
            <li><a className="btn btn-ghost" onClick={handleSignInClick}>Sign in</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero min-h-[70vh] bg-[#282828] relative overflow-hidden">
        <div className="hero-content flex-col lg:flex-row-reverse z-10">
          {/* Image Placeholder - A simple div for now */}
          <div className="relative w-[400px] h-[300px] bg-gray-800 rounded-lg shadow-xl transform rotate-[-8deg] lg:rotate-[-8deg] lg:ml-20">
            <div className="absolute top-4 left-4 w-[calc(100%-32px)] h-[calc(100%-32px)] bg-gray-700 rounded-md p-4">
                {/* Colored squares */}
                <div className="flex space-x-2 mb-4">
                    <div className="w-12 h-12 bg-cyan-500 rounded"></div>
                    <div className="w-12 h-12 bg-green-500 rounded"></div>
                    <div className="w-12 h-12 bg-orange-500 rounded"></div>
                    <div className="w-12 h-12 bg-red-500 rounded"></div>
                    {/* Pie Chart Placeholder */}
                    <div className="w-16 h-12 relative flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-blue-300 absolute" style={{ clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%, 50% 50%)' }}></div>
                        <div className="w-12 h-12 rounded-full bg-green-300 absolute" style={{ clipPath: 'polygon(50% 0%, 50% 50%, 100% 50%, 100% 0%)' }}></div>
                        <div className="w-12 h-12 rounded-full bg-yellow-300 absolute" style={{ clipPath: 'polygon(50% 50%, 0% 50%, 0% 100%, 100% 100%, 100% 50%)' }}></div>
                    </div>

                </div>
                {/* List items */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-600 rounded w-full"></div>
                    <div className="h-4 bg-gray-600 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-600 rounded w-4/5"></div>
                    <div className="h-4 bg-gray-600 rounded w-full"></div>
                </div>
                {/* Small circles */}
                <div className="absolute bottom-4 right-4 space-y-2">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="w-20 h-3 bg-gray-600 rounded"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-20 h-3 bg-gray-600 rounded"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-20 h-3 bg-gray-600 rounded"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="w-20 h-3 bg-gray-600 rounded"></div>
                    </div>
                </div>
            </div>
          </div>
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">A New Way to Learn</h1>
            <p className="py-6 text-lg">
              LeetCode is the best platform to help you enhance your skills, expand
              your knowledge and prepare for technical interviews.
            </p>
            <button className="btn btn-primary bg-[#00A68A] hover:bg-[#008F77] border-none text-white" onClick={handleCreateAccountClick}>
              Create Account <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#282828] to-transparent"></div>
      </header>

      {/* Start Exploring Section */}
      <section className="relative py-20 bg-[#282828] text-white text-center flex flex-col items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5"></div> {/* Light overlay */}
        <div className="z-10 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-4">Start Exploring</h2>
          <div className="bg-[#00A68A] p-4 rounded-full mb-4">
            <GraduationCap size={40} className="text-white" />
          </div>
          <p className="text-lg max-w-2xl">
            Explore is a well-organized tool that helps you get the most out of your programming journey.
          </p>
        </div>
      </section>

      {/* Cards Section */}
      <section className="py-20 bg-gray-100 text-gray-800">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card bg-white shadow-xl rounded-lg p-6 text-center">
            <div className="card-body items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <SquareStack size={30} className="text-blue-600" />
              </div>
              <h2 className="card-title text-2xl font-bold mb-2">Learn from Our Curated Library</h2>
              <p className="text-gray-600">Explore a well-organized tool that helps you get the most out of your programming journey.</p>
            </div>
          </div>
          <div className="card bg-white shadow-xl rounded-lg p-6 text-center">
            <div className="card-body items-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <Globe size={30} className="text-green-600" />
              </div>
              <h2 className="card-title text-2xl font-bold mb-2">Connect with a Global Community</h2>
              <p className="text-gray-600">Join millions of users worldwide and discuss solutions, share insights, and collaborate.</p>
            </div>
          </div>
          <div className="card bg-white shadow-xl rounded-lg p-6 text-center">
            <div className="card-body items-center">
              <div className="bg-yellow-100 p-4 rounded-full mb-4">
                <Lightbulb size={30} className="text-yellow-600" />
              </div>
              <h2 className="card-title text-2xl font-bold mb-2">Master Key Concepts with Ease</h2>
              <p className="text-gray-600">Understand complex algorithms and data structures through clear explanations and examples.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
