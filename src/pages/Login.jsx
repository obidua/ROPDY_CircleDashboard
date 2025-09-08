import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlockchainAnimation from '../components/BlockchainAnimation';
import { mockAddresses } from '../utils/mockData';

const Login = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnecting(false);
      navigate('/');
    }, 1500);
  };

  const handleViewDashboard = (e) => {
    e.preventDefault();
    if (userId.trim()) {
      navigate(`/?view=${userId}`);
    }
  };

  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-admin-cyan dark:text-admin-cyan-dark mb-4 text-center">
            Welcome to ROPDY — Choose Your Access Mode
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            Your Gateway to Decentralized Earnings
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Authorized Access */}
            <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-admin-new-green/30 hover:border-admin-new-green transition-colors">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🦊</div>
                <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-2">
                  Authorized User Login
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Connect your Web3 wallet (e.g., MetaMask) to securely log into ROPDY.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-transparent rounded-lg p-4 border border-admin-new-green/30">
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="text-admin-new-green">✓</span>
                      Access your personal dashboard
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-admin-new-green">✓</span>
                      Manage your circles and earnings
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-admin-new-green">✓</span>
                      Full platform functionality
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="w-full bg-admin-new-green text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-admin-new-green/80 transition-colors border border-admin-new-green/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConnecting ? 'Connecting...' : '🔌 Connect Wallet to Continue'}
                </button>
              </div>
            </div>

            {/* View Mode */}
            <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-admin-gold-600/30 hover:border-admin-gold-400 transition-colors">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">👁️</div>
                <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-2">
                  View Dashboard by User ID
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Just want to explore? Enter any valid ROPDY User ID to view that user's public dashboard.
                </p>
              </div>

              <form onSubmit={handleViewDashboard} className="space-y-4">
                <div className="bg-transparent rounded-lg p-4 border border-admin-cyan/30 dark:border-admin-cyan-dark/30">
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="text-admin-cyan dark:text-admin-cyan-dark">👀</span>
                      View current package
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-admin-cyan dark:text-admin-cyan-dark">👀</span>
                      Check circles status
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-admin-cyan dark:text-admin-cyan-dark">👀</span>
                      See MOD4 Pool status
                    </li>
                  </ul>
                </div>

                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter ROPDY User ID"
                  className="w-full px-4 py-2 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100"
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-admin-cyan dark:bg-admin-cyan-dark text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:opacity-80 transition-opacity"
                >
                  🔍 View Dashboard
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;