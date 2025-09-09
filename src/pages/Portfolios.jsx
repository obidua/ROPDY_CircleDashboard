import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';
import { useStore } from '../Store/UserStore';
import { useAppKitAccount } from '@reown/appkit/react';
import { useTransaction } from '../config/register';
import Swal from 'sweetalert2';

// Static data for UI demonstration
const staticUserStats = {
  positions: [
    {
      serverId: 1,
      slotId: 1,
      horizon: '0', // 2X
      principalUsd: 5000000, // $5.00
      capUsd: 15000000, // $15.00
      dailyRoiBp: 9, // 0.09%
      claimedDays: 45,
      totalDays: 990,
      active: true,
      startTime: Math.floor(Date.now() / 1000) - (45 * 86400), // 45 days ago
      claimedUsd: 2025000 // $2.025 claimed so far
    },
    {
      serverId: 1,
      slotId: 2,
      horizon: '1', // 3X
      principalUsd: 10000000, // $10.00
      capUsd: 30000000, // $30.00
      dailyRoiBp: 14, // 0.14%
      claimedDays: 30,
      totalDays: 1350,
      active: true,
      startTime: Math.floor(Date.now() / 1000) - (30 * 86400), // 30 days ago
      claimedUsd: 4200000 // $4.20 claimed so far
    },
    {
      serverId: 1,
      slotId: 3,
      horizon: '0', // 2X
      principalUsd: 8000000, // $8.00
      capUsd: 24000000, // $24.00
      dailyRoiBp: 9, // 0.09%
      claimedDays: 60,
      totalDays: 990,
      active: true,
      startTime: Math.floor(Date.now() / 1000) - (62 * 86400), // 62 days ago (2 pending days)
      claimedUsd: 4320000 // $4.32 claimed so far
    }
  ],
  userCapRemainingUsd: 277000000 // $277.00 remaining
};

const staticGlobalStats = {
  servers: [
    { minStakeUsd: 5000000, days2x: 990, dailyBp2x: 9, days3x: 1350, dailyBp3x: 14 },
    { minStakeUsd: 10000000, days2x: 900, dailyBp2x: 10, days3x: 1260, dailyBp3x: 16 },
    { minStakeUsd: 20000000, days2x: 810, dailyBp2x: 11, days3x: 1170, dailyBp3x: 17 },
    { minStakeUsd: 40000000, days2x: 720, dailyBp2x: 12, days3x: 1080, dailyBp3x: 18 },
    { minStakeUsd: 80000000, days2x: 630, dailyBp2x: 13, days3x: 990, dailyBp3x: 19 }
  ]
};

const Portfolios = () => {
  const [userStats, setUserStats] = useState(staticUserStats);
  const [globalStats, setGlobalStats] = useState(staticGlobalStats);
  const [loading, setLoading] = useState(false);
  const [claimingPosition, setClaimingPosition] = useState(null);

  const { address, isConnected } = useAppKitAccount();
  const userAddress = JSON.parse(localStorage.getItem("UserData") || '{}')?.address;

  // Commented out for static implementation
  // const getMintUserStats = useStore((state) => state.getMintUserStats);
  // const getMintGlobalStats = useStore((state) => state.getMintGlobalStats);

  const { handleSendTx, hash } = useTransaction(null);

  // Static data is already set, no need to fetch
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       if (userAddress) {
  //         const [userData, globalData] = await Promise.all([
  //           getMintUserStats(userAddress),
  //           getMintGlobalStats()
  //         ]);
  //         setUserStats(userData);
  //         setGlobalStats(globalData);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching portfolio data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [userAddress]);

  const formatUSD = (value) => {
    if (!value) return '0.00';
    return (parseFloat(value) / 1e6).toFixed(2);
  };

  const formatRama = (value) => {
    if (!value) return '0.00000';
    return (parseFloat(value) / 1e18).toFixed(5);
  };

  const calculatePendingDays = (position) => {
    if (!position.active) return 0;
    const now = Math.floor(Date.now() / 1000);
    const elapsedDays = Math.floor((now - position.startTime) / 86400);
    const maxDays = position.totalDays;
    const actualElapsed = Math.min(elapsedDays, maxDays);
    return Math.max(0, actualElapsed - position.claimedDays);
  };

  const calculatePendingROI = (position) => {
    const pendingDays = calculatePendingDays(position);
    if (pendingDays === 0) return 0;
    const dailyUsd = (parseFloat(position.principalUsd) * position.dailyRoiBp) / 10000;
    return dailyUsd * pendingDays;
  };

  const calculateTotalPendingROI = () => {
    if (!userStats?.positions) return 0;
    return userStats.positions.reduce((total, position) => {
      return total + calculatePendingROI(position);
    }, 0);
  };

  const calculateTotalPrincipal = () => {
    if (!userStats?.positions) return 0;
    return userStats.positions.reduce((total, position) => {
      return total + parseFloat(position.principalUsd || 0) / 1e6;
    }, 0);
  };

  const getServerConfig = (serverId) => {
    if (!globalStats?.servers) return null;
    return globalStats.servers[serverId - 1];
  };

  const handleClaim = async (position) => {
    if (!isConnected || address !== userAddress) {
      Swal.fire({
        title: 'Wallet not connected',
        text: 'Please connect your wallet to claim ROI.',
        icon: 'warning',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    const pendingDays = calculatePendingDays(position);
    if (pendingDays === 0) {
      Swal.fire({
        title: 'No pending ROI',
        text: 'There are no full days to claim for this position.',
        icon: 'info',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    setClaimingPosition(`${position.serverId}-${position.slotId}`);
    
    try {
      // This would need to be implemented in your store
      // const claimTx = await claimROI(userAddress, position.serverId, position.slotId);
      // handleSendTx(claimTx);
      
      // For now, show a placeholder
      Swal.fire({
        title: 'Claim Function',
        text: 'ROI claiming functionality will be implemented with contract integration.',
        icon: 'info',
        confirmButtonColor: '#22c55e',
      });
    } catch (error) {
      console.error('Claim error:', error);
      Swal.fire({
        title: 'Claim Failed',
        text: 'Something went wrong while processing your claim.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setClaimingPosition(null);
    }
  };

  const handleTopUp = async (position) => {
    if (!isConnected || address !== userAddress) {
      Swal.fire({
        title: 'Wallet not connected',
        text: 'Please connect your wallet to top-up.',
        icon: 'warning',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    // Check if user is at cap
    const capRemaining = parseFloat(userStats?.userCapRemainingUsd || 0) / 1e6;
    if (capRemaining > 0) {
      Swal.fire({
        title: 'Cap not reached',
        text: `You still have $${capRemaining.toFixed(2)} cap remaining. Top-up is only available when you reach your 3x cap.`,
        icon: 'info',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    // Show top-up dialog
    const { value: formValues } = await Swal.fire({
      title: 'Top-up & Reset Position',
      html: `
        <div class="text-left">
          <label class="block text-sm font-medium mb-2">New Principal Amount (USD)</label>
          <input id="swal-input1" class="swal2-input" placeholder="Enter USD amount" type="number" min="1">
          <label class="block text-sm font-medium mb-2 mt-4">Horizon</label>
          <select id="swal-input2" class="swal2-input">
            <option value="false">2X Horizon</option>
            <option value="true">3X Horizon</option>
          </select>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value
        ];
      }
    });

    if (formValues) {
      const [usdAmount, horizonThreeX] = formValues;
      if (!usdAmount || parseFloat(usdAmount) < 1) {
        Swal.fire('Invalid amount', 'Please enter a valid USD amount (minimum $1)', 'error');
        return;
      }

      try {
        // This would need to be implemented in your store
        // const topUpTx = await topUpReset(userAddress, position.serverId, position.slotId, parseFloat(usdAmount) * 1e6, horizonThreeX === 'true');
        // handleSendTx(topUpTx);
        
        // For now, show a placeholder
        Swal.fire({
          title: 'Top-up Function',
          text: 'Top-up functionality will be implemented with contract integration.',
          icon: 'info',
          confirmButtonColor: '#22c55e',
        });
      } catch (error) {
        console.error('Top-up error:', error);
        Swal.fire({
          title: 'Top-up Failed',
          text: 'Something went wrong while processing your top-up.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <BlockchainAnimation />
        <div className="relative p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-admin-new-green"></div>
            <p className="mt-4 text-admin-cyan dark:text-admin-cyan-dark">Loading your portfolios...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-4 sm:p-6 lg:p-8">
        <h1 style={{ "color": "#FFD700" }} className="text-2xl font-bold mb-6">💼 Portfolios (All Slots)</h1>

        {/* Summary Tickers */}
        <section className="mb-8">
          <h2 style={{ "color": "#FFD700" }} className="text-xl font-semibold mb-4">Portfolio Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard 
              label="Active Portfolios" 
              value={userStats?.positions?.length || 0} 
            />
            <StatCard 
              label="Total Principal (USD)" 
              value={`$${calculateTotalPrincipal().toFixed(2)}`} 
            />
            <StatCard 
              label="Pending ROI (USD)" 
              value={`$${calculateTotalPendingROI().toFixed(2)}`} 
            />
            <StatCard 
              label="Cap Remaining (USD)" 
              value={userStats ? `$${formatUSD(userStats.userCapRemainingUsd)}` : 'Loading...'} 
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-admin-new-green/30">
            <h3 className="text-lg font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button 
                className="bg-admin-new-green text-white px-4 py-2 rounded-lg font-semibold hover:bg-admin-new-green/80 transition-colors"
                onClick={() => {
                  // Navigate to activate servers or show modal
                  Swal.fire({
                    title: 'Create New Portfolio',
                    text: 'Navigate to "Activate Servers" to create a new portfolio on any opened server.',
                    icon: 'info',
                    confirmButtonColor: '#22c55e',
                  });
                }}
              >
                + Create Portfolio
              </button>
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                onClick={() => {
                  // Claim all available ROI
                  const claimablePositions = userStats?.positions?.filter(p => calculatePendingDays(p) > 0) || [];
                  if (claimablePositions.length === 0) {
                    Swal.fire('No Claims Available', 'There are no positions with claimable ROI.', 'info');
                  } else {
                    Swal.fire({
                      title: 'Claim All ROI',
                      text: `This will claim ROI from ${claimablePositions.length} positions.`,
                      icon: 'info',
                      confirmButtonColor: '#3b82f6',
                    });
                  }
                }}
              >
                Claim All ROI
              </button>
            </div>
          </div>
        </section>

        {/* Portfolios Table */}
        <section>
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-admin-new-green/30 overflow-x-auto">
            <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-6">All Active Positions</h2>
            
            {!userStats?.positions || userStats.positions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Active Portfolios</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You don't have any active portfolios yet. Create your first portfolio by activating a server.
                </p>
                <button 
                  className="bg-admin-new-green text-white px-6 py-2 rounded-lg font-semibold hover:bg-admin-new-green/80 transition-colors"
                  onClick={() => {
                    // Navigate to activate servers
                    window.location.href = '/mint/activate-servers';
                  }}
                >
                  Activate Your First Server
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-white/70 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Server</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Slot</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Horizon</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Principal (USD)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Daily ROI %</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Days Progress</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Pending Days</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Pending ROI (USD)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Cap (USD)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {userStats.positions.map((position, index) => {
                      const pendingDays = calculatePendingDays(position);
                      const pendingROI = calculatePendingROI(position);
                      const serverConfig = getServerConfig(position.serverId);
                      
                      return (
                        <tr key={`${position.serverId}-${position.slotId}`} className="hover:bg-gray-100/50 dark:hover:bg-gray-800/30">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            Server {position.serverId}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            #{position.slotId}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              position.horizon === '0' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {position.horizon === '0' ? '2X' : '3X'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            ${formatUSD(position.principalUsd)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {(position.dailyRoiBp / 100).toFixed(2)}%
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {position.claimedDays}/{position.totalDays}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            <span className={pendingDays > 0 ? 'text-admin-new-green font-semibold' : ''}>
                              {pendingDays}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            <span className={pendingROI > 0 ? 'text-admin-new-green font-semibold' : ''}>
                              ${pendingROI.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            ${formatUSD(position.capUsd)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              position.active ? 'bg-admin-new-green/20 text-admin-new-green' : 'bg-gray-200 text-gray-700'
                            }`}>
                              {position.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              {pendingDays > 0 && (
                                <button
                                  onClick={() => handleClaim(position)}
                                  disabled={claimingPosition === `${position.serverId}-${position.slotId}`}
                                  className="bg-admin-new-green text-white px-3 py-1 rounded text-xs font-semibold hover:bg-admin-new-green/80 transition-colors disabled:opacity-50"
                                >
                                  {claimingPosition === `${position.serverId}-${position.slotId}` ? 'Claiming...' : 'Claim'}
                                </button>
                              )}
                              {parseFloat(userStats?.userCapRemainingUsd || 0) === 0 && (
                                <button
                                  onClick={() => handleTopUp(position)}
                                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700 transition-colors"
                                >
                                  Top-up
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Portfolios;