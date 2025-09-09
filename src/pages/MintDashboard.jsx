import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';
import AddressDisplay from '../components/AddressDisplay';
import { useStore } from '../Store/UserStore';
import { useAppKitAccount } from '@reown/appkit/react';
import RamaCard, { EarnedRamaCard } from '../components/RamaCard';

// Static data for UI demonstration
const staticGlobalStats = {
  poolRamaAccounting: '1500000000000000000000', // 1500 RAMA
  servers: [
    {
      minStakeUsd: 5000000, // $5.00
      days2x: 990,
      dailyBp2x: 9, // 0.09%
      days3x: 1350,
      dailyBp3x: 14 // 0.14%
    },
    {
      minStakeUsd: 10000000, // $10.00
      days2x: 900,
      dailyBp2x: 10, // 0.10%
      days3x: 1260,
      dailyBp3x: 16 // 0.16%
    },
    {
      minStakeUsd: 20000000, // $20.00
      days2x: 810,
      dailyBp2x: 11, // 0.11%
      days3x: 1170,
      dailyBp3x: 17 // 0.17%
    },
    {
      minStakeUsd: 40000000, // $40.00
      days2x: 720,
      dailyBp2x: 12, // 0.12%
      days3x: 1080,
      dailyBp3x: 18 // 0.18%
    },
    {
      minStakeUsd: 80000000, // $80.00
      days2x: 630,
      dailyBp2x: 13, // 0.13%
      days3x: 990,
      dailyBp3x: 19 // 0.19%
    }
  ],
  tiers: [
    { shareBps: 500, selfBiz: 100000000, directs: 2, teamSize: 10 }, // Tier 1: 5%, $100, 2 directs, 10 team
    { shareBps: 800, selfBiz: 250000000, directs: 4, teamSize: 25 }, // Tier 2: 8%, $250, 4 directs, 25 team
    { shareBps: 1200, selfBiz: 500000000, directs: 6, teamSize: 50 }, // Tier 3: 12%, $500, 6 directs, 50 team
    { shareBps: 1600, selfBiz: 1000000000, directs: 8, teamSize: 100 }, // Tier 4: 16%, $1000, 8 directs, 100 team
    { shareBps: 2000, selfBiz: 2000000000, directs: 10, teamSize: 200 }, // Tier 5: 20%, $2000, 10 directs, 200 team
    { shareBps: 2400, selfBiz: 4000000000, directs: 12, teamSize: 400 }, // Tier 6: 24%, $4000, 12 directs, 400 team
    { shareBps: 2800, selfBiz: 8000000000, directs: 15, teamSize: 800 }, // Tier 7: 28%, $8000, 15 directs, 800 team
    { shareBps: 3200, selfBiz: 16000000000, directs: 20, teamSize: 1600 } // Tier 8: 32%, $16000, 20 directs, 1600 team
  ],
  tierStates: [
    { qualifiedCount: 125 },
    { qualifiedCount: 89 },
    { qualifiedCount: 56 },
    { qualifiedCount: 34 },
    { qualifiedCount: 21 },
    { qualifiedCount: 13 },
    { qualifiedCount: 8 },
    { qualifiedCount: 5 }
  ],
  spotBps: [500, 300, 200, 100, 100], // 5%, 3%, 2%, 1%, 1%
  growthBps: [1500, 800, 600, 400, 200] // 15%, 8%, 6%, 4%, 2%
};

const staticUserStats = {
  positions: [
    {
      serverId: 1,
      slotId: 1,
      horizon: '0', // 2X
      principalUsd: 5000000, // $5.00
      capUsd: 15000000, // $15.00
      dailyRoiBp: 9,
      claimedDays: 45,
      totalDays: 990,
      active: true
    },
    {
      serverId: 1,
      slotId: 2,
      horizon: '1', // 3X
      principalUsd: 10000000, // $10.00
      capUsd: 30000000, // $30.00
      dailyRoiBp: 14,
      claimedDays: 30,
      totalDays: 1350,
      active: true
    }
  ],
  highestServerActivated: 1,
  userCapRemainingUsd: 285000000, // $285.00
  selfBusinessUsd: 15000000, // $15.00
  directs: 3,
  teamSize: 12,
  tierUsers: [
    { active: true }, // Tier 1 qualified
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: false }
  ]
};

const MintDashboard = () => {
  const [globalStats, setGlobalStats] = useState(staticGlobalStats);
  const [userStats, setUserStats] = useState(staticUserStats);
  const [loading, setLoading] = useState(false);

  const { address, isConnected } = useAppKitAccount();
  const userAddress = JSON.parse(localStorage.getItem("UserData") || '{}')?.address;

  // Commented out for static implementation
  // const getMintGlobalStats = useStore((state) => state.getMintGlobalStats);
  // const getMintUserStats = useStore((state) => state.getMintUserStats);

  // Static data is already set, no need to fetch
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const globalData = await getMintGlobalStats();
  //       setGlobalStats(globalData);
  //       if (userAddress) {
  //         const userData = await getMintUserStats(userAddress);
  //         setUserStats(userData);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching mint data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [userAddress]);

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