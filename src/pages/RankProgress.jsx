import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';
import { useStore } from '../Store/UserStore';

// Static data for UI demonstration
const staticLeadershipData = {
  progress: {
    currentTier: 1,
    nextTier: 2,
    selfBusiness: 15000000, // $15.00
    requiredSelfBusiness: 250000000, // $250.00
    directs: 3,
    requiredDirects: 4,
    teamSize: 12,
    requiredTeamSize: 25
  },
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
  userTiers: [
    { active: true }, // Tier 1 qualified
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: false }
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
  ]
};

const RankProgress = () => {
  const [leadershipData, setLeadershipData] = useState(staticLeadershipData);
  const [loading, setLoading] = useState(false);

  const userAddress = JSON.parse(localStorage.getItem("UserData") || '{}')?.address;
  
  // Commented out for static implementation
  // const getLeadershipData = useStore((state) => state.getLeadershipData);

  // Static data is already set, no need to fetch
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       if (userAddress) {
  //         const data = await getLeadershipData(userAddress);
  //         setLeadershipData(data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching leadership data:', error);
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

  const calculateProgress = (current, required) => {
    if (required === 0) return 100;
    return Math.min((current / required) * 100, 100);
  };

  const getTierName = (tier) => {
    const tierNames = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Elite', 'Master', 'Legend'];
    return tierNames[tier - 1] || 'Unranked';
  };

  const getTierColor = (tier) => {
    const colors = [
      'bg-orange-500', 'bg-gray-400', 'bg-yellow-500', 'bg-purple-500',
      'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-pink-500'
    ];
    return colors[tier - 1] || 'bg-gray-300';
  };

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <BlockchainAnimation />
        <div className="relative p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-admin-new-green"></div>
            <p className="mt-4 text-admin-cyan dark:text-admin-cyan-dark">Loading leadership data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-4 sm:p-6 lg:p-8">
        <h1 style={{ "color": "#FFD700" }} className="text-2xl font-bold mb-6">🏆 My Rank & Progress</h1>

        {/* Current Status */}
        <section className="mb-8">
          <h2 style={{ "color": "#FFD700" }} className="text-xl font-semibold mb-4">Current Leadership Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard 
              label="Current Tier" 
              value={`Tier ${leadershipData?.progress?.currentTier || 0} - ${getTierName(leadershipData?.progress?.currentTier || 0)}`} 
            />
            <StatCard 
              label="Self Business (USD)" 
              value={`$${formatUSD(leadershipData?.progress?.selfBusiness || 0)}`} 
            />
            <StatCard 
              label="Direct Referrals" 
              value={leadershipData?.progress?.directs || 0} 
            />
            <StatCard 
              label="Team Size" 
              value={leadershipData?.progress?.teamSize || 0} 
            />
          </div>
        </section>

        {/* Progress to Next Tier */}
        {leadershipData?.progress?.currentTier < 8 && (
          <section className="mb-8">
            <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-admin-new-green/30">
              <h3 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-6">
                Progress to Tier {leadershipData.progress.nextTier} - {getTierName(leadershipData.progress.nextTier)}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Self Business Progress */}
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Self Business</h4>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm">
                      <span>${formatUSD(leadershipData.progress.selfBusiness)}</span>
                      <span>${formatUSD(leadershipData.progress.requiredSelfBusiness)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-admin-new-green h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${calculateProgress(
                            leadershipData.progress.selfBusiness, 
                            leadershipData.progress.requiredSelfBusiness
                          )}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {calculateProgress(leadershipData.progress.selfBusiness, leadershipData.progress.requiredSelfBusiness).toFixed(1)}% Complete
                  </p>
                </div>

                {/* Direct Referrals Progress */}
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Direct Referrals</h4>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm">
                      <span>{leadershipData.progress.directs}</span>
                      <span>{leadershipData.progress.requiredDirects}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${calculateProgress(
                            leadershipData.progress.directs, 
                            leadershipData.progress.requiredDirects
                          )}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {calculateProgress(leadershipData.progress.directs, leadershipData.progress.requiredDirects).toFixed(1)}% Complete
                  </p>
                </div>

                {/* Team Size Progress */}
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Team Size</h4>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm">
                      <span>{leadershipData.progress.teamSize}</span>
                      <span>{leadershipData.progress.requiredTeamSize}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${calculateProgress(
                            leadershipData.progress.teamSize, 
                            leadershipData.progress.requiredTeamSize
                          )}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {calculateProgress(leadershipData.progress.teamSize, leadershipData.progress.requiredTeamSize).toFixed(1)}% Complete
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All Tiers Overview */}
        <section>
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-admin-new-green/30">
            <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-6">Leadership Tiers Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {leadershipData?.tiers?.map((tier, index) => {
                const tierNumber = index + 1;
                const isCurrentTier = tierNumber === leadershipData.progress.currentTier;
                const isQualified = leadershipData.userTiers[index]?.active;
                const qualifiedCount = leadershipData.tierStates[index]?.qualifiedCount || 0;
                
                return (
                  <div 
                    key={index} 
                    className={`border rounded-lg p-4 transition-all duration-300 ${
                      isCurrentTier 
                        ? 'border-admin-new-green bg-admin-new-green/10 shadow-lg' 
                        : isQualified 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-300 bg-gray-50 dark:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${getTierColor(tierNumber)}`}>
                        {tierNumber}
                      </div>
                      <div className="text-right">
                        {isCurrentTier && (
                          <span className="px-2 py-1 bg-admin-new-green text-white text-xs rounded-full font-semibold">
                            Current
                          </span>
                        )}
                        {isQualified && !isCurrentTier && (
                          <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-semibold">
                            Qualified
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
                      Tier {tierNumber} - {getTierName(tierNumber)}
                    </h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Share:</span>
                        <span className="font-semibold">{(tier.shareBps / 100).toFixed(3)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Self Biz:</span>
                        <span className="font-semibold">${formatUSD(tier.selfBiz)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Directs:</span>
                        <span className="font-semibold">{tier.directs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Team Size:</span>
                        <span className="font-semibold">{tier.teamSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Qualified:</span>
                        <span className="font-semibold text-admin-new-green">{qualifiedCount}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RankProgress;