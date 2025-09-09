import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';
import AddressDisplay from '../components/AddressDisplay';
import { useStore } from '../Store/UserStore';

// Static data for UI demonstration
const staticClaimsHistory = [
  {
    id: 1,
    serverId: 1,
    slotId: 1,
    horizon: '2X',
    principalUsd: 5.00,
    daysClaimed: 3,
    roiUsd: 0.303, // 3 days * $0.101 daily (5.00 * 0.202%)
    roiRama: 3.03,
    txHash: '0xbff560bc1b390a3ec37ae2c7ee71f9e972885d3fc924a9196f8411b446726a67',
    status: 'Completed',
    timestamp: Math.floor(Date.now() / 1000) - (86400 * 2), // 2 days ago
    date: new Date(Date.now() - (86400 * 2 * 1000)).toISOString().split('T')[0]
  },
  {
    id: 2,
    serverId: 1,
    slotId: 2,
    horizon: '3X',
    principalUsd: 10.00,
    daysClaimed: 5,
    roiUsd: 1.11, // 5 days * $0.222 daily (10.00 * 0.222%)
    roiRama: 11.10,
    txHash: '0x3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
    status: 'Completed',
    timestamp: Math.floor(Date.now() / 1000) - (86400 * 1), // 1 day ago
    date: new Date(Date.now() - (86400 * 1 * 1000)).toISOString().split('T')[0]
  },
  {
    id: 3,
    serverId: 1,
    slotId: 1,
    horizon: '2X',
    principalUsd: 5.00,
    daysClaimed: 7,
    roiUsd: 0.707, // 7 days * $0.101 daily (5.00 * 0.202%)
    roiRama: 7.07,
    txHash: '0x7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a798',
    status: 'Completed',
    timestamp: Math.floor(Date.now() / 1000) - (86400 * 7), // 7 days ago
    date: new Date(Date.now() - (86400 * 7 * 1000)).toISOString().split('T')[0]
  },
  {
    id: 4,
    serverId: 1,
    slotId: 3,
    horizon: '2X',
    principalUsd: 8.00,
    daysClaimed: 10,
    roiUsd: 1.616, // 10 days * $0.1616 daily (8.00 * 0.202%)
    roiRama: 16.16,
    txHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8',
    status: 'Completed',
    timestamp: Math.floor(Date.now() / 1000) - (86400 * 14), // 14 days ago
    date: new Date(Date.now() - (86400 * 14 * 1000)).toISOString().split('T')[0]
  }
];

const staticUserStats = {
  positions: [
    {
      serverId: 1,
      slotId: 1,
      horizon: '0', // 2X
      principalUsd: 5000000, // $5.00
      dailyRoiBp: 20.2 // 0.202%
    },
    {
      serverId: 1,
      slotId: 2,
      horizon: '1', // 3X
      principalUsd: 10000000, // $10.00
      dailyRoiBp: 22.2 // 0.222%
    },
    {
      serverId: 1,
      slotId: 3,
      horizon: '0', // 2X
      principalUsd: 8000000, // $8.00
      dailyRoiBp: 20.2 // 0.202%
    }
  ],
  highestServerActivated: 1,
  userCapRemainingUsd: 277000000 // $277.00
};

const ClaimsHistory = () => {
  const [claimsHistory, setClaimsHistory] = useState(staticClaimsHistory);
  const [userStats, setUserStats] = useState(staticUserStats);
  const [loading, setLoading] = useState(false);
  const [selectedServer, setSelectedServer] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');

  const userAddress = JSON.parse(localStorage.getItem("UserData") || '{}')?.address;
  
  // Commented out for static implementation
  // const getMintClaimsHistory = useStore((state) => state.getMintClaimsHistory);
  // const getMintUserStats = useStore((state) => state.getMintUserStats);

  // Static data is already set, no need to fetch
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       if (userAddress) {
  //         const [historyData, statsData] = await Promise.all([
  //           getMintClaimsHistory(userAddress),
  //           getMintUserStats(userAddress)
  //         ]);
  //         setClaimsHistory(historyData);
  //         setUserStats(statsData);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching claims history:', error);
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

  const formatRama = (value) => {
    if (!value) return '0.00000';
    return parseFloat(value).toFixed(5);
  };

  // Calculate summary statistics
  const calculateSummaryStats = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const todaysClaims = claimsHistory.filter(claim => claim.date === today);
    const weeksClaims = claimsHistory.filter(claim => claim.date >= weekAgo);
    const monthsClaims = claimsHistory.filter(claim => claim.date >= monthAgo);

    const todaysROI = todaysClaims.reduce((sum, claim) => sum + claim.roiUsd, 0);
    const weeksROI = weeksClaims.reduce((sum, claim) => sum + claim.roiUsd, 0);
    const monthsROI = monthsClaims.reduce((sum, claim) => sum + claim.roiUsd, 0);
    const totalROI = claimsHistory.reduce((sum, claim) => sum + claim.roiUsd, 0);

    return {
      todaysROI,
      weeksROI,
      monthsROI,
      totalROI,
      totalClaims: claimsHistory.length
    };
  };

  // Filter claims based on selected filters
  const getFilteredClaims = () => {
    let filtered = [...claimsHistory];

    if (selectedServer !== 'all') {
      filtered = filtered.filter(claim => claim.serverId.toString() === selectedServer);
    }

    if (selectedTimeframe !== 'all') {
      const now = new Date();
      let cutoffDate;
      
      switch (selectedTimeframe) {
        case 'today':
          cutoffDate = now.toISOString().split('T')[0];
          filtered = filtered.filter(claim => claim.date === cutoffDate);
          break;
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          filtered = filtered.filter(claim => claim.date >= cutoffDate);
          break;
        case 'month':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          filtered = filtered.filter(claim => claim.date >= cutoffDate);
          break;
      }
    }

    return filtered;
  };

  const summaryStats = calculateSummaryStats();
  const filteredClaims = getFilteredClaims();

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <BlockchainAnimation />
        <div className="relative p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-admin-new-green"></div>
            <p className="mt-4 text-admin-cyan dark:text-admin-cyan-dark">Loading claims history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-4 sm:p-6 lg:p-8">
        <h1 style={{ "color": "#FFD700" }} className="text-2xl font-bold mb-6">📋 Claims & History</h1>

        {/* Summary Tickers */}
        <section className="mb-8">
          <h2 style={{ "color": "#FFD700" }} className="text-xl font-semibold mb-4">Claims Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            <StatCard 
              label="Today's Claims (USD)" 
              value={`$${formatUSD(summaryStats.todaysROI)}`} 
            />
            <StatCard 
              label="This Week (USD)" 
              value={`$${formatUSD(summaryStats.weeksROI)}`} 
            />
            <StatCard 
              label="This Month (USD)" 
              value={`$${formatUSD(summaryStats.monthsROI)}`} 
            />
            <StatCard 
              label="Total Claimed (USD)" 
              value={`$${formatUSD(summaryStats.totalROI)}`} 
            />
            <StatCard 
              label="Total Claims" 
              value={summaryStats.totalClaims} 
            />
          </div>
        </section>

        {/* Quick Stats */}
        <section className="mb-8">
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-admin-new-green/30">
            <h3 className="text-lg font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Portfolio Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                label="Active Positions" 
                value={userStats?.positions?.length || 0} 
              />
              <StatCard 
                label="Highest Server" 
                value={userStats?.highestServerActivated || 0} 
              />
              <StatCard 
                label="Cap Remaining (USD)" 
                value={userStats ? `$${formatUSD(parseFloat(userStats.userCapRemainingUsd) / 1e6)}` : '$0.00'} 
              />
              <StatCard 
                label="Average Daily ROI" 
                value={userStats?.positions?.length > 0 ? 
                  `${(userStats.positions.reduce((sum, pos) => sum + pos.dailyRoiBp, 0) / userStats.positions.length / 100).toFixed(3)}%` : 
                  '0.000%'} 
              />
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-6">
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-admin-new-green/30">
            <h3 className="text-lg font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Filters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter by Server
                </label>
                <select
                  value={selectedServer}
                  onChange={(e) => setSelectedServer(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100 border border-admin-new-green rounded-md"
                >
                  <option value="all" className="text-black">All Servers</option>
                  {[1, 2, 3, 4, 5].map(serverId => (
                    <option key={serverId} value={serverId.toString()} className="text-black">
                      Server {serverId}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter by Time
                </label>
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100 border border-admin-new-green rounded-md"
                >
                  <option value="all" className="text-black">All Time</option>
                  <option value="today" className="text-black">Today</option>
                  <option value="week" className="text-black">This Week</option>
                  <option value="month" className="text-black">This Month</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Claims History Table */}
        <section>
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-admin-new-green/30 overflow-x-auto">
            <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-6">
              Claims History ({filteredClaims.length} records)
            </h2>
            
            {filteredClaims.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Claims Found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {claimsHistory.length === 0 
                    ? "You haven't made any ROI claims yet. Start by activating a server and claiming your daily ROI."
                    : "No claims match your current filters. Try adjusting the filter criteria."
                  }
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Horizon</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Principal (USD)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Days Claimed</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">ROI (USD)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">ROI (RAMA)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Transaction</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredClaims.map((claim) => (
                      <tr key={claim.id} className="hover:bg-gray-100/50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {new Date(claim.timestamp * 1000).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          Server {claim.serverId}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          #{claim.slotId}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            claim.horizon === '2X' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {claim.horizon}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          ${formatUSD(claim.principalUsd)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {claim.daysClaimed}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-semibold text-admin-new-green">
                          ${formatUSD(claim.roiUsd)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {formatRama(claim.roiRama)} RAMA
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          <AddressDisplay value={claim.txHash} type="tx" />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-admin-new-green/20 text-admin-new-green">
                            {claim.status}
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

export default ClaimsHistory;