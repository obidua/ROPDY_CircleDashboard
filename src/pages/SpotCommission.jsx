import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';
import AddressDisplay from '../components/AddressDisplay';
import { useStore } from '../Store/UserStore';

const SpotCommission = () => {
  const [commissionData, setCommissionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');

  const userAddress = JSON.parse(localStorage.getItem("UserData") || '{}')?.address;
  const getSpotCommissionData = useStore((state) => state.getSpotCommissionData);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (userAddress) {
          const data = await getSpotCommissionData(userAddress);
          setCommissionData(data);
        }
      } catch (error) {
        console.error('Error fetching spot commission data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userAddress]);

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

    const todaysCommissions = commissionData.filter(comm => comm.date === today);
    const weeksCommissions = commissionData.filter(comm => comm.date >= weekAgo);
    const monthsCommissions = commissionData.filter(comm => comm.date >= monthAgo);

    const todaysTotal = todaysCommissions.reduce((sum, comm) => sum + comm.commissionUsd, 0);
    const weeksTotal = weeksCommissions.reduce((sum, comm) => sum + comm.commissionUsd, 0);
    const monthsTotal = monthsCommissions.reduce((sum, comm) => sum + comm.commissionUsd, 0);
    const totalCommissions = commissionData.reduce((sum, comm) => sum + comm.commissionUsd, 0);

    return {
      todaysTotal,
      weeksTotal,
      monthsTotal,
      totalCommissions,
      totalCount: commissionData.length
    };
  };

  // Filter commissions based on selected filters
  const getFilteredCommissions = () => {
    let filtered = [...commissionData];

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(comm => comm.level.toString() === selectedLevel);
    }

    if (selectedTimeframe !== 'all') {
      const now = new Date();
      let cutoffDate;
      
      switch (selectedTimeframe) {
        case 'today':
          cutoffDate = now.toISOString().split('T')[0];
          filtered = filtered.filter(comm => comm.date === cutoffDate);
          break;
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          filtered = filtered.filter(comm => comm.date >= cutoffDate);
          break;
        case 'month':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          filtered = filtered.filter(comm => comm.date >= cutoffDate);
          break;
      }
    }

    return filtered;
  };

  const summaryStats = calculateSummaryStats();
  const filteredCommissions = getFilteredCommissions();

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <BlockchainAnimation />
        <div className="relative p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-admin-new-green"></div>
            <p className="mt-4 text-admin-cyan dark:text-admin-cyan-dark">Loading spot commission data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-4 sm:p-6 lg:p-8">
        <h1 style={{ "color": "#FFD700" }} className="text-2xl font-bold mb-6">💰 Spot Commission</h1>

        {/* Summary Tickers */}
        <section className="mb-8">
          <h2 style={{ "color": "#FFD700" }} className="text-xl font-semibold mb-4">Commission Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            <StatCard 
              label="Today's Commission (USD)" 
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
              label="Total Commission (USD)" 
              value={`$${formatUSD(summaryStats.totalCommissions)}`} 
            />
            <StatCard 
              label="Total Transactions" 
              value={summaryStats.totalCount} 
            />
          </div>
        </section>

        {/* Commission Structure */}
        <section className="mb-8">
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-admin-new-green/30">
            <h3 className="text-lg font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Commission Structure (10% Total)</h3>
            <div className="grid grid-cols-5 gap-4">
              {[
                { level: 1, percentage: 5, color: 'bg-green-500' },
                { level: 2, percentage: 3, color: 'bg-blue-500' },
                { level: 3, percentage: 2, color: 'bg-purple-500' },
                { level: 4, percentage: 1, color: 'bg-orange-500' },
                { level: 5, percentage: 1, color: 'bg-red-500' }
              ].map((item) => (
                <div key={item.level} className="text-center">
                  <div className={`${item.color} text-white p-3 rounded-lg mb-2`}>
                    <div className="font-bold text-lg">L{item.level}</div>
                    <div className="text-sm">{item.percentage}%</div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Level {item.level}</div>
                </div>
              ))}
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
                  Filter by Level
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100 border border-admin-new-green rounded-md"
                >
                  <option value="all" className="text-black">All Levels</option>
                  {[1, 2, 3, 4, 5].map(level => (
                    <option key={level} value={level.toString()} className="text-black">
                      Level {level}
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

        {/* Commission History Table */}
        <section>
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-admin-new-green/30 overflow-x-auto">
            <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-6">
              Commission History ({filteredCommissions.length} records)
            </h2>
            
            {filteredCommissions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Commissions Found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {commissionData.length === 0 
                    ? "You haven't earned any spot commissions yet. Commissions are earned when your direct referrals activate servers."
                    : "No commissions match your current filters. Try adjusting the filter criteria."
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-white/70 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">From User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Level</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Percentage</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Commission (USD)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Commission (RAMA)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Transaction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredCommissions.map((commission) => (
                      <tr key={commission.id} className="hover:bg-gray-100/50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {new Date(commission.timestamp * 1000).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {commission.fromUser}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            commission.level === 1 ? 'bg-green-100 text-green-800' :
                            commission.level === 2 ? 'bg-blue-100 text-blue-800' :
                            commission.level === 3 ? 'bg-purple-100 text-purple-800' :
                            commission.level === 4 ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            Level {commission.level}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {commission.percentage}%
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-semibold text-admin-new-green">
                          ${formatUSD(commission.commissionUsd)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {formatRama(commission.commissionRama)} RAMA
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          <AddressDisplay value={commission.txHash} type="tx" />
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

export default SpotCommission;