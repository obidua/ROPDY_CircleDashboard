import React from 'react';
import { useAppKitAccount } from '@reown/appkit/react';

const ServerCard = ({ 
  server, 
  userAddress, 
  isConnected, 
  activatingServer, 
  handleActivateServer, 
  highestActivatedServer 
}) => {
  const { address } = useAppKitAccount();

  const formatUSD = (value) => {
    if (!value) return '0.00';
    return (parseFloat(value) / 1e6).toFixed(2);
  };

  const getServerColor = (serverId) => {
    const colors = {
      1: 'border-admin-new-green text-admin-new-green',
      2: 'border-blue-600 text-blue-600',
      3: 'border-purple-600 text-purple-600',
      4: 'border-orange-600 text-orange-600',
      5: 'border-red-600 text-red-600'
    };
    return colors[serverId] || 'border-gray-400 text-gray-400';
  };

  const getServerBgColor = (serverId) => {
    const colors = {
      1: 'bg-admin-new-green/10',
      2: 'bg-blue-600/10',
      3: 'bg-purple-600/10',
      4: 'bg-orange-600/10',
      5: 'bg-red-600/10'
    };
    return colors[serverId] || 'bg-gray-400/10';
  };

  const isLocked = server.id > (highestActivatedServer + 1);
  const isAvailable = !server.isActivated && !isLocked;
  const isActive = server.isActivated;

  const getStatusChip = () => {
    if (isLocked) {
      return (
        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
          🔒 Locked
        </span>
      );
    }
    if (isActive) {
      return (
        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-admin-new-green/20 text-admin-new-green">
          ✅ Active
        </span>
      );
    }
    return (
      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
        Available
      </span>
    );
  };

  const handleActivate = (horizonThreeX) => {
    handleActivateServer(server.id, horizonThreeX);
  };

  return (
    <div className={`bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border-2 transition-all duration-300 hover:shadow-lg ${getServerColor(server.id)} ${getServerBgColor(server.id)}`}>
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${getServerColor(server.id)} border`}>
          Server {server.id}
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 dark:text-gray-400">Min Stake</div>
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">${formatUSD(server.minStakeUsd)}</div>
        </div>
      </div>

      {/* Card Body */}
      <div className="space-y-3 mb-4">
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">⏱ 2× Horizon</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{server.days2x} days</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-medium text-blue-600">📈 Daily ROI</span>
            <span className="text-sm font-bold text-blue-600">{(server.dailyBp2x / 100).toFixed(2)}%</span>
          </div>
        </div>

        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">⏱ 3× Horizon</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{server.days3x} days</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-medium text-purple-600">📈 Daily ROI</span>
            <span className="text-sm font-bold text-purple-600">{(server.dailyBp3x / 100).toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      {isActive && (
        <div className="mb-4 p-3 bg-admin-new-green/10 border border-admin-new-green/30 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-admin-new-green">✅ Activated</span>
            <span className="text-sm text-admin-new-green">{server.userSlots || 0} slots</span>
          </div>
        </div>
      )}

      {/* Status Chip */}
      <div className="mb-4">
        {getStatusChip()}
      </div>

      {/* CTA Buttons */}
      <div className="space-y-2">
        {isActive ? (
          <button
            className="w-full bg-admin-new-green text-white px-4 py-2 rounded-lg font-semibold hover:bg-admin-new-green/80 transition-colors"
            onClick={() => {
              // Navigate to portfolios page or show add portfolio modal
              window.location.href = '/mint/portfolios';
            }}
          >
            + Add Portfolio
          </button>
        ) : (
          <>
            <button
              onClick={() => handleActivate(false)}
              disabled={isLocked || activatingServer === server.id}
              className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${
                isLocked 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } ${activatingServer === server.id ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {activatingServer === server.id ? 'Activating...' : 'Activate 2× Horizon'}
            </button>
            
            <button
              onClick={() => handleActivate(true)}
              disabled={isLocked || activatingServer === server.id}
              className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${
                isLocked 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              } ${activatingServer === server.id ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {activatingServer === server.id ? 'Activating...' : 'Activate 3× Horizon'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ServerCard;