import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAppKitAccount } from '@reown/appkit/react';
import AddressDisplay from './AddressDisplay';

const TopNavigationBar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { address, isConnected } = useAppKitAccount();
  const userAddress = JSON.parse(localStorage.getItem("UserData") || '{}')?.address;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-admin-gold-900/50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Network & Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-admin-cyan dark:text-admin-cyan-dark">
              Network:
            </span>
            <span className="px-2 py-1 bg-admin-new-green/20 text-admin-new-green text-xs rounded-full font-semibold">
              Ramestta Mainnet
            </span>
          </div>
          
          {isConnected && userAddress && (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-admin-new-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-admin-new-green"></span>
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Connected</span>
            </div>
          )}
        </div>

        {/* Center - User Address */}
        <div className="flex items-center gap-2">
          {userAddress && (
            <>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Address:
              </span>
              <AddressDisplay value={userAddress} type="address" />
            </>
          )}
        </div>

        {/* Right side - Controls */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="text-lg">🔔</span>
          </button>

          {/* Language */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="text-lg">🌐</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNavigationBar;