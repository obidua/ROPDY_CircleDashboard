import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';
import AddressDisplay from '../components/AddressDisplay';
import { useStore } from '../Store/UserStore';
import { useAppKitAccount } from '@reown/appkit/react';
import RamaCard, { EarnedRamaCard } from '../components/RamaCard';

const MintDashboard = () => {
  const [globalStats, setGlobalStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const { address, isConnected } = useAppKitAccount();
  const userAddress = JSON.parse(localStorage.getItem("UserData") || '{}')?.address;

  const getMintGlobalStats = useStore((state) => state.getMintGlobalStats);
  const getMintUserStats = useStore((state) => state.getMintUserStats);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch global stats
        const globalData = await getMintGlobalStats();
        setGlobalStats(globalData);

        // Fetch user stats if user address is available
        if (userAddress) {
          const userData = await getMintUserStats(userAddress);
          setUserStats(userData);
        }
      } catch (error) {
        console.error('Error fetching mint data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userAddress]);

  const formatRama = (value) => {
    if (!value) return '0.00000';
    return (parseFloat(value) / 1e18).toFixed(5);
  };

  const formatUSD = (value) => {
    if (!value) return '0.00';
    return (parseFloat(value) / 1e6).toFixed(2);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <BlockchainAnimation />
        <div className="relative p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-admin-new-green"></div>
            <p className="mt-4 text-admin-cyan dark:text-admin-cyan-dark">Loading ROPDY Mint Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ "color": "#FFD700" }} className="text-2xl font-bold">🏭 ROPDY Mint Dashboard</h1>
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-admin-new-green/30">
            <span className="text-admin-cyan dark:text-admin-cyan-dark font-semibold">Multi-Portfolio + Leadership GTO</span>
          </div>
        </div>

        {/* Global Stats Section */}
        <section className="mb-8 sm:mb-10">
          <h2 style={{ "color": "#FFD700" }} className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Global Mint Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <RamaCard 
              label="Pool RAMA Balance" 
              value={globalStats ? formatRama(globalStats.poolRamaAccounting) : 'Loading...'} 
            />
            <StatCard 
              label="Total Servers" 
              value="5" 
            />
            <StatCard 
              label="Leadership Tiers" 
              value="8" 
            />
          </div>
        </section>

        {/* Server Configurations */}
        <section className="mb-8 sm:mb-10">
          <h2 style={{ "color": "#FFD700" }} className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Server Configurations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {globalStats?.servers?.map((server, index) => (
              <div key={index} className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm p-4 rounded-lg border border-admin-new-green/30">
                <h3 className="text-lg font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-2">Server {index + 1}</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-600 dark:text-gray-400">Min Stake:</span> ${formatUSD(server.minStakeUsd)}</p>
                  <p><span className="text-gray-600 dark:text-gray-400">2X Days:</span> {server.days2x}</p>
                  <p><span className="text-gray-600 dark:text-gray-400">2X ROI:</span> {(server.dailyBp2x / 100).toFixed(2)}%</p>
                  <p><span className="text-gray-600 dark:text-gray-400">3X Days:</span> {server.days3x}</p>
                  <p><span className="text-gray-600 dark:text-gray-400">3X ROI:</span> {(server.dailyBp3x / 100).toFixed(2)}%</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* User Information */}
        {userAddress && (
          <section className="mb-8 sm:mb-10">
            <h2 style={{ "color": "#FFD700" }} className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Your Mint Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm p-5 rounded-lg shadow-lg border border-admin-new-green/30">
                <h3 className="text-base text-admin-cyan dark:text-admin-cyan-dark">👛 Wallet Address</h3>
                <div className="mt-2">
                  <AddressDisplay value={userAddress} type="address" />
                </div>
              </div>
              <StatCard 
                label="🏗️ Highest Server Activated" 
                value={userStats?.highestServerActivated || '0'} 
              />
              <StatCard 
                label="💰 Cap Remaining (USD)" 
                value={userStats ? `$${formatUSD(userStats.userCapRemainingUsd)}` : 'Loading...'} 
              />
              <StatCard 
                label="💼 Self Business (USD)" 
                value={userStats ? `$${formatUSD(userStats.selfBusinessUsd)}` : 'Loading...'} 
              />
              <StatCard 
                label="👥 Direct Count" 
                value={userStats?.directs || '0'} 
              />
              <StatCard 
                label="🌐 Team Size" 
                value={userStats?.teamSize || '0'} 
              />
            </div>
          </section>
        )}

        {/* User Positions */}
        {userAddress && userStats?.positions && userStats.positions.length > 0 && (
          <section className="mb-8 sm:mb-10">
            <h2 style={{ "color": "#FFD700" }} className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Your Active Positions</h2>
            <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-admin-new-green/30 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-white/70 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Server</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Slot</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Horizon</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Principal (USD)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Cap (USD)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Daily ROI</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Claimed Days</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {userStats.positions.map((position, index) => (
                    <tr key={index} className="hover:bg-gray-100/50 dark:hover:bg-gray-800/30">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{position.serverId}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{position.slotId}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{position.horizon === '0' ? '2X' : '3X'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${formatUSD(position.principalUsd)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${formatUSD(position.capUsd)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{(position.dailyRoiBp / 100).toFixed(2)}%</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{position.claimedDays}/{position.totalDays}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          position.active ? 'bg-admin-new-green/20 text-admin-new-green' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {position.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Leadership Tiers */}
        <section className="mb-8 sm:mb-10">
          <h2 style={{ "color": "#FFD700" }} className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Leadership Tiers (GTO)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {globalStats?.tiers?.map((tier, index) => (
              <div key={index} className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm p-4 rounded-lg border border-admin-gold-600/30">
                <h3 className="text-lg font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-2">Tier {index + 1}</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-600 dark:text-gray-400">Share:</span> {(tier.shareBps / 100).toFixed(2)}%</p>
                  <p><span className="text-gray-600 dark:text-gray-400">Self Biz:</span> ${formatUSD(tier.selfBiz)}</p>
                  <p><span className="text-gray-600 dark:text-gray-400">Directs:</span> {tier.directs}</p>
                  <p><span className="text-gray-600 dark:text-gray-400">Team Size:</span> {tier.teamSize}</p>
                  <p><span className="text-gray-600 dark:text-gray-400">Qualified:</span> {globalStats.tierStates?.[index]?.qualifiedCount || 0}</p>
                  {userStats?.tierUsers?.[index]?.active && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-admin-new-green/20 text-admin-new-green">
                      Qualified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Commission Structure */}
        <section>
          <h2 style={{ "color": "#FFD700" }} className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Commission Structure</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm p-6 rounded-lg border border-admin-new-green/30">
              <h3 className="text-lg font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Spot Commission (10%)</h3>
              <div className="grid grid-cols-5 gap-2 text-sm">
                {globalStats?.spotBps?.map((bps, index) => (
                  <div key={index} className="text-center">
                    <div className="font-semibold">L{index + 1}</div>
                    <div>{(bps / 100).toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm p-6 rounded-lg border border-admin-new-green/30">
              <h3 className="text-lg font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Growth Commission (35%)</h3>
              <div className="grid grid-cols-5 gap-2 text-sm">
                {globalStats?.growthBps?.map((bps, index) => (
                  <div key={index} className="text-center">
                    <div className="font-semibold">L{index + 1}</div>
                    <div>{(bps / 100).toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MintDashboard;