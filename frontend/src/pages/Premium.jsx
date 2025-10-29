import React, { useState } from 'react';
import { Coffee, ArrowLeft, Heart, Sparkles, QrCode, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router';

const Premium = () => {
  const navigate = useNavigate();
  const [showUPI, setShowUPI] = useState(true);

  // Replace with your actual UPI ID
  const upiId = "Demo@gmail :)";
  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-8 text-sm font-medium hover:text-green-500 transition-colors opacity-70"
        >
          <ArrowLeft size={16} />
          Back to Problems
        </button>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="card bg-base-100 shadow-xl rounded-lg p-8 md:p-12 max-w-2xl w-full">
            {/* Icon and Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-20"></div>
                <div className="relative bg-green-100 p-6 rounded-full">
                  <Coffee size={64} className="text-green-600" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                Support LeetGears
              </h1>
              
              <p className="text-lg md:text-xl text-center max-w-xl opacity-80">
                Support us with a small contribution! Your support helps us keep LeetGears running and build more awesome features.
              </p>
            </div>

            {/* Payment Method Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setShowUPI(true)}
                className={`flex-1 btn btn-sm ${
                  showUPI ? 'btn-primary' : 'btn-outline'
                }`}
              >
                <Smartphone size={18} />
                UPI (India)
              </button>
              <button
                onClick={() => setShowUPI(false)}
                className={`flex-1 btn btn-sm ${
                  !showUPI ? 'btn-warning' : 'btn-outline'
                }`}
              >
                <Coffee size={18} />
                International
              </button>
            </div>

            {/* UPI Payment Section */}
            {showUPI ? (
              <div className="space-y-6">
                {/* UPI ID Display */}
                <div className="card bg-base-200 shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <QrCode className="text-green-500" size={24} />
                      <h3 className="font-semibold">
                        UPI ID
                      </h3>
                    </div>
                    <span className="badge badge-success badge-sm">Instant</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg bg-base-100">
                    <code className="font-mono text-lg text-green-600">
                      {upiId}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(upiId);
                        alert('UPI ID copied to clipboard!');
                      }}
                      className="btn btn-sm btn-primary"
                    >
                      Copy
                    </button>
                  </div>
                  
                  <p className="text-sm mt-3 opacity-70">
                    Open any UPI app, enter this UPI ID and send any amount you wish!
                  </p>
                </div>
              </div>
            ) : (
              /* International Payment Section */
              <div className="space-y-4">
                <a
                  href="https://www.buymeacoffee.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-warning btn-lg text-white gap-2 w-full hover:shadow-xl transition-shadow"
                >
                  <Coffee size={24} /> 
                  Buy Me a Coffee
                </a>
                <p className="text-sm text-center opacity-70">
                  For international supporters (Credit/Debit Cards)
                </p>
              </div>
            )}

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mb-6">
              <div className="card bg-base-200 shadow-lg p-4 text-center">
                <Sparkles className="mx-auto mb-2 text-yellow-500" size={32} />
                <h3 className="font-semibold text-sm">
                  New Features
                </h3>
              </div>

              <div className="card bg-base-200 shadow-lg p-4 text-center">
                <Heart className="mx-auto mb-2 text-red-500" size={32} />
                <h3 className="font-semibold text-sm">
                  Free Education
                </h3>
              </div>

              <div className="card bg-base-200 shadow-lg p-4 text-center">
                <Coffee className="mx-auto mb-2 text-green-600" size={32} />
                <h3 className="font-semibold text-sm">
                  More Problems
                </h3>
              </div>
            </div>

            {/* Thank You Message */}
            <div className="text-center mt-6 p-4 rounded-lg bg-green-50">
              <p className="text-sm flex items-center justify-center gap-2">
                <Heart size={16} className="text-red-500 fill-red-500" />
                Thank you for considering supporting us! Every contribution counts!
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-2xl w-full">
            <div className="card bg-base-100 shadow-xl rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-500 mb-1">100%</p>
              <p className="text-sm opacity-70">
                Free Forever
              </p>
            </div>

            <div className="card bg-base-100 shadow-xl rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-yellow-500 mb-1">21+</p>
              <p className="text-sm opacity-70">
                DSA Problems
              </p>
            </div>

            <div className="card bg-base-100 shadow-xl rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-500 mb-1">24/7</p>
              <p className="text-sm opacity-70">
                Available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
