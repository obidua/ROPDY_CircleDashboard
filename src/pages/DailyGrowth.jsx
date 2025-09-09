import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';
import AddressDisplay from '../components/AddressDisplay';
import { useStore } from '../Store/UserStore';

// Static data for UI demonstration
const staticGrowthData = [
  {
    id: 1,
    poolShare: 2.50, // $2.50 share
    poolShareRama: 25.00, // 25 RAMA
    totalPoolVolume: 1000.00, // $1000 total pool
    userShare: 0.25, // 0.25% share
    txHash: '0xbff560bc1b390a3ec37ae2c7ee71f9e972885d3fc924a9196f8411b446726a67',
    timestamp: Math.floor(Date.now() / 1000) - (86400 * 1), // 1 day ago
    date: new Date(Date.now() - (86400 * 1 * 1000)).toISOString().split('T')[0]
  },
  {
    id: 2,
    poolShare: 3.75, // $3.75 share
    poolShareRama: 37.50, // 37.5 RAMA
    totalPoolVolume: 1500.00, // $1500 total pool
    userShare: 0.25, // 0.25% share
    txHash: '0x3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
    timestamp: Math.floor(Date.now() / 1000) - (86400 * 2), // 2 days ago
    date: new Date(Date.now() - (86400 * 2 * 1000)).toISOString().split('T')[0]
  },
  {
    id: 3,
    poolShare: 1.25, // $1.25 share
    poolShareRama: 12.50, // 12.5 RAMA
    totalPoolVolume: 500.00, // $500 total pool
    userShare: 0.25, // 0.25% share
    txHash: '0x7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a798',
    timestamp: Math.floor(Date.now() / 1000) - (86400 * 3), // 3 days ago
    date: new Date(Date.now() - (86400 * 3 * 1000)).toISOString().split('T')[0]
  },
  {
    id: 4,
    poolShare: 5.00, // $5.00 share
    poolShareRama: 50.00, // 50 RAMA
    totalPoolVolume: 2000.00, // $2000 total pool
    userShare: 0.25, // 0.25% share
    txHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8',
    timestamp: Math.floor(Date.now() / 1000) - (86400 * 7), // 7 days ago
    date: new Date(Date.now() - (86400 * 7 * 1000)).toISOString().split('T')[0]
  },
  {
    id: 5,
    poolShare: 4.25, // $4.25 share
    poolShareRama: 42.50, // 42.5 RAMA
    totalPoolVolume: 1700.00, // $1700 total pool
    userShare: 0.25, // 0.25% share
    txHash: '0x1f2e3d4c5b6a798f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7980f1e2d3c4b',
    timestamp: Math.floor(Date.now() / 1000) - (86400 * 14), // 14 days ago
    date: new Date(Date.now() - (86400 * 14 * 1000)).toISOString().split('T')[0]
  }
];

const DailyGrowth = () => {
  const [growthData, setGrowthData] = useState(staticGrowthData);
  const [loading, setLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');

  const userAddress = JSON.parse(localStorage.getItem("UserData") || '{}')?.address;
  
  // Commented out for static implementation
  // const getDailyGrowthData = useStore((state) => state.getDailyGrowthData);

  // Static data is already set, no need to fetch
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       if (userAddress) {
  //         const data = await getDailyGrowthData(userAddress);
  //         setGrowthData(data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching daily growth data:', error);
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

    const todaysGrowth = growthData.filter(growth => growth.date === today);
    const weeksGrowth = growthData.filter(growth => growth.date >= weekAgo);
    const monthsGrowth = growthData.filter(growth => growth.date >= monthAgo);

    const todaysTotal = todaysGrowth.reduce((sum, growth) => sum + growth.poolShare, 0);
    const weeksTotal = weeksGrowth.reduce((sum, growth) => sum + growth.poolShare, 0);
    const monthsTotal = monthsGrowth.reduce((sum, growth) => sum + growth.poolShare, 0);
    const totalGrowth = growthData.reduce((sum, growth) => sum + growth.poolShare, 0);

    const avgDailyGrowth = growthData.length > 0 ? totalGrowth / growthData.length : 0;

    return {
      todaysTotal,
      weeksTotal,
      monthsTotal,
      totalGrowth,
      avgDailyGrowth,
      totalDays: growthData.length
    };
  };

  // Filter growth data based on selected timeframe
  const getFilteredGrowth = () => {
    let filtered = [...growthData];

    if (selectedTimeframe !== 'all') {
      const now = new Date();
      let cutoffDate;
      
      switch (selectedTimeframe) {
        case 'today':
          cutoffDate = now.toISOString().split('T')[0];
          filtered = filtered.filter(growth => growth.date === cutoffDate);
          break;
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          filtered = filtered.filter(growth => growth.date >= cutoffDate);
          break;
        case 'month':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          filtered = filtered.filter(growth => growth.date >= cutoffDate);
          break;
      }
    }

    return filtered;
  };

  const summaryStats = calculateSummaryStats();
  const filteredGrowth = getFilteredGrowth();

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <BlockchainAnimation />
        <div className="relative p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-admin-new-green"></div>
            <p className="mt-4 text-admin-cyan dark:text-admin-cyan-dark">Loading daily growth data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-4 sm:p-6 lg:p-8">
        <h1 style={{ color: "#FFD700" }} className="text-2xl font-bold mb-6">📈 Daily Growth</h1>

        {/* Summary Tickers */}
        <section className="mb-8">
          <h2 style={{ color: "#FFD700" }} className="text-2xl font-semibold mb-4">Growth Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            <StatCard 
              label="Today's Growth (USD)" 
              value={`$${formatUSD(summaryStats.todaysTotal)}`} 
            />
            <StatCard 
              label="This Week (USD)" 
              value={`$${formatUSD(summaryStats.weeksTotal)}`} 
            />
            <StatCard 
              label="This Month (USD)" 
              value={`$${formatUSD(summaryStats.monthsTotal)}`} 
            />
            <StatCard 
              label="Total Growth (USD)" 
              value={`$${formatUSD(summaryStats.totalGrowth)}`} 
            />
            <StatCard 
              label="Avg Daily Growth" 
              value={`$${formatUSD(summaryStats.avgDailyGrowth)}`} 
            />
          </div>
        </section>

        {/* Growth Pool Information */}
        <section className="mb-8">
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-admin-new-green/30">
            <h3 className="text-lg font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Daily Growth Pool (35% Distribution)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-admin-new-green">{summaryStats.totalDays}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Days</div>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">35%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pool Share</div>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">Daily</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Distribution</div>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">Auto</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Payout</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-8">
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-admin-gold-600/30">
            <h3 className="text-lg font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">How Daily Growth Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Pool Distribution</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• 35% of daily platform volume goes to growth pool</li>
                  <li>• Distributed proportionally to all active positions</li>
                  <li>• Based on your total principal amount</li>
                  <li>• Automatic daily distribution</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Eligibility</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Must have active positions</li>
                  <li>• Share calculated by your stake percentage</li>
                  <li>• No additional action required</li>
                  <li>• Compounds with your earnings</li>
                </ul>
              </div>
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

        {/* Growth History Table */}
        <section>
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-admin-new-green/30 overflow-x-auto">
            <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-6">
              Daily Growth History ({filteredGrowth.length} records)
            </h2>
            
            {filteredGrowth.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Growth Records Found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {growthData.length === 0 
                    ? "You haven't received any daily growth distributions yet. Growth is distributed automatically when you have active positions."
                    : "No growth records match your current filters. Try adjusting the filter criteria."
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-white/70 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Pool Share (USD)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Pool Share (RAMA)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Total Pool Volume</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Your Share %</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Transaction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredGrowth.map((growth) => (
                      <tr key={growth.id} className="hover:bg-gray-100/50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {new Date(growth.timestamp * 1000).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-semibold text-admin-new-green">
                          ${formatUSD(growth.poolShare)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {formatRama(growth.poolShareRama)} RAMA
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          ${formatUSD(growth.totalPoolVolume)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {growth.userShare.toFixed(3)}%
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          <AddressDisplay value={growth.txHash} type="tx" />
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

export default DailyGrowth;