import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';
import AddressDisplay from '../components/AddressDisplay';
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
      dailyRoiBp: 9,
      claimedDays: 990, // At cap
      totalDays: 990,
      active: true,
      claimedUsd: 15000000 // $15.00 - reached cap
    },
    {
      serverId: 1,
      slotId: 2,
      horizon: '1', // 3X
      principalUsd: 10000000, // $10.00
      capUsd: 30000000, // $30.00
      dailyRoiBp: 14,
      claimedDays: 1350, // At cap
      totalDays: 1350,
      active: true,
      claimedUsd: 30000000 // $30.00 - reached cap
    }
  ],
  userCapRemainingUsd: 0 // At cap, can top-up
};

const staticTopUpHistory = [
  {
    id: 1,
    serverId: 1,
    slotId: 1,
    oldPrincipalUsd: 5.00,
    newPrincipalUsd: 8.00,
    horizon: '2X',
    timestamp: Math.floor(Date.now() / 1000) - (86400 * 30), // 30 days ago
    txHash: '0xbff560bc1b390a3ec37ae2c7ee71f9e972885d3fc924a9196f8411b446726a67',
    status: 'Completed'
  },
  {
    id: 2,
    serverId: 1,
    slotId: 2,
    oldPrincipalUsd: 10.00,
    newPrincipalUsd: 15.00,
    horizon: '3X',
    timestamp: Math.floor(Date.now() / 1000) - (86400 * 15), // 15 days ago
    txHash: '0x3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
    status: 'Completed'
  }
];

const staticGlobalStats = {
  totalVolume: 125000000000, // $125,000
  totalUsers: 2500
};

const TopUp = () => {
  const [userStats, setUserStats] = useState(staticUserStats);
  const [topUpHistory, setTopUpHistory] = useState(staticTopUpHistory);
  const [globalStats, setGlobalStats] = useState(staticGlobalStats);
  const [loading, setLoading] = useState(false);
  const [processingTopUp, setProcessingTopUp] = useState(false);

  const { address, isConnected } = useAppKitAccount();
  const userAddress = JSON.parse(localStorage.getItem("UserData") || '{}')?.address;

  // Commented out for static implementation
  // const getMintUserStats = useStore((state) => state.getMintUserStats);
  // const getMintTopUpHistory = useStore((state) => state.getMintTopUpHistory);
  // const getMintGlobalStats = useStore((state) => state.getMintGlobalStats);

  const { handleSendTx, hash } = useTransaction(null);

  // Static data is already set, no need to fetch
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       if (userAddress) {
  //         const [statsData, historyData, globalData] = await Promise.all([
  //           getMintUserStats(userAddress),
  //           getMintTopUpHistory(userAddress),
  //           getMintGlobalStats()
  //         ]);
  //         setUserStats(statsData);
  //         setTopUpHistory(historyData);
  //         setGlobalStats(globalData);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching top-up data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [userAddress]);

  const formatUSD = (value) => {
    if (!value) return '0.00';
    return parseFloat(value).toFixed(2);
  };

  // Check if user is at cap (cap remaining is 0 or very close to 0)
  const isAtCap = () => {
    if (!userStats) return false;
    const capRemaining = parseFloat(userStats.userCapRemainingUsd || 0) / 1e6;
    return capRemaining < 1; // Less than $1 remaining
  };

  // Get positions that are at their individual caps
  const getPositionsAtCap = () => {
    if (!userStats?.positions) return [];
    return userStats.positions.filter(position => {
      const principalUsd = parseFloat(position.principalUsd) / 1e6;
      const capUsd = parseFloat(position.capUsd) / 1e6;
      const claimed = parseFloat(position.claimedUsd || 0) / 1e6;
      return (claimed >= capUsd - 1); // Within $1 of cap
    });
  };

  const handleTopUpPosition = async (position) => {
    if (!isConnected || address !== userAddress) {
      Swal.fire({
        title: 'Wallet not connected',
        text: 'Please connect your wallet to perform top-up.',
        icon: 'warning',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: `Top-up Server ${position.serverId} Slot ${position.slotId}`,
      html: `
        <div class="text-left">
          <div class="mb-4 p-3 bg-gray-100 rounded">
            <p><strong>Current Principal:</strong> $${formatUSD(parseFloat(position.principalUsd) / 1e6)}</p>
            <p><strong>Current Horizon:</strong> ${position.horizon === '0' ? '2X' : '3X'}</p>
          </div>
          <label class="block text-sm font-medium mb-2">New Principal Amount (USD)</label>
          <input id="swal-input1" class="swal2-input" placeholder="Enter USD amount" type="number" min="1" step="0.01">
          <label class="block text-sm font-medium mb-2 mt-4">Select Horizon</label>
          <select id="swal-input2" class="swal2-input">
            <option value="false">2X Horizon (Lower risk, shorter duration)</option>
            <option value="true">3X Horizon (Higher returns, longer duration)</option>
          </select>
          <div class="mt-4 p-3 bg-yellow-50 rounded text-sm">
            <p><strong>Note:</strong> Top-up will reset your position and restart the ROI cycle.</p>
          </div>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const newPrincipal = document.getElementById('swal-input1').value;
        const horizonThreeX = document.getElementById('swal-input2').value;
        
        if (!newPrincipal || parseFloat(newPrincipal) < 1) {
          Swal.showValidationMessage('Please enter a valid USD amount (minimum $1)');
          return false;
        }
        
        return [parseFloat(newPrincipal), horizonThreeX === 'true'];
      }
    });

    if (formValues) {
      const [newPrincipalUsd, horizonThreeX] = formValues;
      
      setProcessingTopUp(true);
      
      try {
        // In a real implementation, this would call a contract method
        // const topUpTx = await topUpAndReset(userAddress, position.serverId, position.slotId, newPrincipalUsd * 1e6, horizonThreeX);
        // handleSendTx(topUpTx);
        
        // For now, show success message
        await Swal.fire({
          title: 'Top-up Initiated',
          html: `
            <p>Top-up transaction has been initiated for:</p>
            <ul class="text-left mt-2">
              <li><strong>Server:</strong> ${position.serverId}</li>
              <li><strong>Slot:</strong> ${position.slotId}</li>
              <li><strong>New Principal:</strong> $${formatUSD(newPrincipalUsd)}</li>
              <li><strong>Horizon:</strong> ${horizonThreeX ? '3X' : '2X'}</li>
            </ul>
            <p class="mt-2 text-sm text-gray-600">This functionality will be fully implemented with contract integration.</p>
          `,
          icon: 'success',
          confirmButtonColor: '#22c55e',
        });
        
        // Refresh data
        const [statsData, historyData] = await Promise.all([
          getMintUserStats(userAddress),
          getMintTopUpHistory(userAddress)
        ]);
        setUserStats(statsData);
        setTopUpHistory(historyData);
        
      } catch (error) {
        console.error('Top-up error:', error);
        Swal.fire({
          title: 'Top-up Failed',
          text: 'Something went wrong while processing your top-up.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
        });
      } finally {
        setProcessingTopUp(false);
      }
    }
  };

  const positionsAtCap = getPositionsAtCap();

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <BlockchainAnimation />
        <div className="relative p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-admin-new-green"></div>
            <p className="mt-4 text-admin-cyan dark:text-admin-cyan-dark">Loading top-up information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-4 sm:p-6 lg:p-8">
        <h1 style={{ color: "#FFD700" }} className="text-2xl font-bold mb-6">⬆️ Top-up</h1>

        {/* Cap Status */}
        <section className="mb-8">
          <h2 style={{ color: "#FFD700" }} className="text-xl font-semibold mb-4">Cap Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard 
              label="Cap Remaining (USD)" 
              value={userStats ? `$${formatUSD(parseFloat(userStats.userCapRemainingUsd) / 1e6)}` : '$0.00'} 
            />
            <StatCard 
              label="Positions at Cap" 
              value={positionsAtCap.length} 
            />
            <StatCard 
              label="Total Active Positions" 
              value={userStats?.positions?.length || 0} 
            />
            <StatCard 
              label="Total Top-ups" 
              value={topUpHistory.length} 
            />
          </div>
        </section>

        {/* At Cap Alert */}
        {isAtCap() && (
          <section className="mb-8">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🎯</div>
                <div>
                  <h3 className="text-xl font-bold text-yellow-800 dark:text-yellow-200">You've Reached Your Cap!</h3>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Congratulations! You've reached your 3x cap limit. You can now top-up and reset your positions for continued earnings.
                  </p>
                </div>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Top-up Benefits:</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Reset your ROI cycle with a fresh principal amount</li>
                  <li>• Choose between 2X or 3X horizon for your new cycle</li>
                  <li>• Continue earning daily ROI without interruption</li>
                  <li>• Compound your earnings for exponential growth</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Positions Ready for Top-up */}
        {positionsAtCap.length > 0 && (
          <section className="mb-8">
            <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-admin-new-green/30">
              <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-6">
                Positions Ready for Top-up ({positionsAtCap.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-white/70 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Server</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Slot</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Current Principal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Horizon</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Cap Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {positionsAtCap.map((position) => (
                      <tr key={`${position.serverId}-${position.slotId}`} className="hover:bg-gray-100/50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          Server {position.serverId}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          #{position.slotId}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          ${formatUSD(parseFloat(position.principalUsd) / 1e6)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            position.horizon === '0' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {position.horizon === '0' ? '2X' : '3X'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            At Cap
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleTopUpPosition(position)}
                            disabled={processingTopUp}
                            className="bg-admin-new-green text-white px-4 py-2 rounded-lg font-semibold hover:bg-admin-new-green/80 transition-colors disabled:opacity-50"
                          >
                            {processingTopUp ? 'Processing...' : 'Top-up & Reset'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Top-up History */}
        <section>
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-admin-new-green/30 overflow-x-auto">
            <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-6">
              Top-up History ({topUpHistory.length} records)
            </h2>
            
            {topUpHistory.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">⬆️</div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Top-ups Yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You haven't performed any top-ups yet. Once you reach your 3x cap, you'll be able to top-up and reset your positions.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-white/70 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Server</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Slot</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Old Principal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">New Principal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Horizon</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Transaction</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {topUpHistory.map((topUp) => (
                      <tr key={topUp.id} className="hover:bg-gray-100/50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {new Date(topUp.timestamp * 1000).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          Server {topUp.serverId}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          #{topUp.slotId}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          ${formatUSD(topUp.oldPrincipalUsd)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-semibold text-admin-new-green">
                          ${formatUSD(topUp.newPrincipalUsd)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            topUp.horizon === '2X' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {topUp.horizon}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          <AddressDisplay value={topUp.txHash} type="tx" />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-admin-new-green/20 text-admin-new-green">
                            {topUp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
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

export default TopUp;