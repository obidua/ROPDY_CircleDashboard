import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';
import AddressDisplay from '../components/AddressDisplay';
import { useStore } from '../Store/UserStore';
import { useAppKitAccount } from '@reown/appkit/react';
import Swal from 'sweetalert2';

// Static data for UI demonstration
const staticRewardsData = [
  {
    id: 1,
    month: 'December 2024',
    tier: 1,
    rewardUsd: 125.50,
    rewardRama: 1255.00,
    globalTurnover: 25000.00,
    sharePercentage: 0.50,
    status: 'Pending',
    txHash: null
  },
  {
    id: 2,
    month: 'November 2024',
    tier: 1,
    rewardUsd: 98.75,
    rewardRama: 987.50,
    globalTurnover: 19750.00,
    sharePercentage: 0.50,
    status: 'Claimed',
    txHash: '0xbff560bc1b390a3ec37ae2c7ee71f9e972885d3fc924a9196f8411b446726a67'
  },
  {
    id: 3,
    month: 'October 2024',
    tier: 1,
    rewardUsd: 156.25,
    rewardRama: 1562.50,
    globalTurnover: 31250.00,
    sharePercentage: 0.50,
    status: 'Claimed',
    txHash: '0x3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1'
  }
];

const GTORewards = () => {
  const [rewardsData, setRewardsData] = useState(staticRewardsData);
  const [loading, setLoading] = useState(false);
  const [claimingReward, setClaimingReward] = useState(null);

  const { address, isConnected } = useAppKitAccount();
  const userAddress = JSON.parse(localStorage.getItem("UserData") || '{}')?.address;
  
  // Commented out for static implementation
  // const getGTORewardsData = useStore((state) => state.getGTORewardsData);

  // Static data is already set, no need to fetch
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       if (userAddress) {
  //         const data = await getGTORewardsData(userAddress);
  //         setRewardsData(data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching GTO rewards data:', error);
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
    const pendingRewards = rewardsData.filter(reward => reward.status === 'Pending');
    const claimedRewards = rewardsData.filter(reward => reward.status === 'Claimed');

    const totalPending = pendingRewards.reduce((sum, reward) => sum + reward.rewardUsd, 0);
    const totalClaimed = claimedRewards.reduce((sum, reward) => sum + reward.rewardUsd, 0);
    const totalRewards = totalPending + totalClaimed;

    return {
      totalPending,
      totalClaimed,
      totalRewards,
      pendingCount: pendingRewards.length,
      claimedCount: claimedRewards.length
    };
  };

  const handleClaimReward = async (reward) => {
    if (!isConnected || address !== userAddress) {
      Swal.fire({
        title: 'Wallet not connected',
        text: 'Please connect your wallet to claim GTO rewards.',
        icon: 'warning',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    if (reward.status !== 'Pending') {
      Swal.fire({
        title: 'Already Claimed',
        text: 'This reward has already been claimed.',
        icon: 'info',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Claim GTO Reward',
      html: `
        <div class="text-left">
          <p><strong>Month:</strong> ${reward.month}</p>
          <p><strong>Tier:</strong> ${reward.tier}</p>
          <p><strong>Reward:</strong> $${formatUSD(reward.rewardUsd)} (${formatRama(reward.rewardRama)} RAMA)</p>
          <p><strong>Global Turnover:</strong> $${formatUSD(reward.globalTurnover)}</p>
          <p><strong>Your Share:</strong> ${reward.sharePercentage}%</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Claim Reward',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      setClaimingReward(reward.id);
      
      try {
        // In a real implementation, this would call a contract method
        // const claimTx = await claimGTOReward(userAddress, reward.month, reward.tier);
        // handleSendTx(claimTx);
        
        // For now, show success message and update local state
        await Swal.fire({
          title: 'Claim Initiated',
          html: `
            <p>GTO reward claim has been initiated:</p>
            <ul class="text-left mt-2">
              <li><strong>Amount:</strong> $${formatUSD(reward.rewardUsd)}</li>
              <li><strong>RAMA:</strong> ${formatRama(reward.rewardRama)}</li>
            </ul>
            <p class="mt-2 text-sm text-gray-600">This functionality will be fully implemented with contract integration.</p>
          `,
          icon: 'success',
          confirmButtonColor: '#22c55e',
        });
        
        // Update local state to show as claimed
        setRewardsData(prev => prev.map(r => 
          r.id === reward.id 
            ? { ...r, status: 'Claimed', txHash: `0x${Math.random().toString(16).substr(2, 64)}` }
            : r
        ));
        
      } catch (error) {
        console.error('Claim error:', error);
        Swal.fire({
          title: 'Claim Failed',
          text: 'Something went wrong while processing your claim.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
        });
      } finally {
        setClaimingReward(null);
      }
    }
  };

  const handleClaimAll = async () => {
    const pendingRewards = rewardsData.filter(reward => reward.status === 'Pending');
    
    if (pendingRewards.length === 0) {
      Swal.fire({
        title: 'No Pending Rewards',
        text: 'You have no pending GTO rewards to claim.',
        icon: 'info',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (!isConnected || address !== userAddress) {
      Swal.fire({
        title: 'Wallet not connected',
        text: 'Please connect your wallet to claim GTO rewards.',
        icon: 'warning',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    const totalPending = pendingRewards.reduce((sum, reward) => sum + reward.rewardUsd, 0);

    const result = await Swal.fire({
      title: 'Claim All GTO Rewards',
      html: `
        <p>This will claim all ${pendingRewards.length} pending GTO rewards:</p>
        <p class="mt-2"><strong>Total Amount:</strong> $${formatUSD(totalPending)}</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Claim All',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      // Implementation would batch claim all pending rewards
      Swal.fire({
        title: 'Bulk Claim Function',
        text: 'Bulk claim functionality will be implemented with contract integration.',
        icon: 'info',
        confirmButtonColor: '#22c55e',
      });
    }
  };

  const summaryStats = calculateSummaryStats();

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <BlockchainAnimation />
        <div className="relative p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-admin-new-green"></div>
            <p className="mt-4 text-admin-cyan dark:text-admin-cyan-dark">Loading GTO rewards data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-4 sm:p-6 lg:p-8">
        <h1 style={{ "color": "#FFD700" }} className="text-2xl font-bold mb-6">🎁 GTO Rewards (Claim)</h1>

        {/* Summary Tickers */}
        <section className="mb-8">
          <h2 style={{ "color": "#FFD700" }} className="text-xl font-semibold mb-4">Rewards Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            <StatCard 
              label="Pending Rewards (USD)" 
              value={`$${formatUSD(summaryStats.totalPending)}`} 
            />
            <StatCard 
              label="Claimed Rewards (USD)" 
              value={`$${formatUSD(summaryStats.totalClaimed)}`} 
            />
            <StatCard 
              label="Total Rewards (USD)" 
              value={`$${formatUSD(summaryStats.totalRewards)}`} 
            />
            <StatCard 
              label="Pending Claims" 
              value={summaryStats.pendingCount} 
            />
            <StatCard 
              label="Claimed Count" 
              value={summaryStats.claimedCount} 
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-admin-new-green/30">
            <h3 className="text-lg font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleClaimAll}
                className="bg-admin-new-green text-white px-6 py-2 rounded-lg font-semibold hover:bg-admin-new-green/80 transition-colors"
              >
                🎁 Claim All Pending Rewards
              </button>
              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                <span>💡 GTO rewards are distributed monthly based on global turnover and your leadership tier.</span>
              </div>
            </div>
          </div>
        </section>

        {/* GTO Information */}
        <section className="mb-8">
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-admin-gold-600/30">
            <h3 className="text-lg font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">About GTO (Global Turnover) Rewards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">How It Works</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Monthly distribution based on platform's global turnover</li>
                  <li>• Your share depends on your leadership tier qualification</li>
                  <li>• Higher tiers receive larger percentage shares</li>
                  <li>• Automatic calculation and distribution</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Eligibility</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Must qualify for leadership tier (Tier 1-8)</li>
                  <li>• Meet tier requirements for self business, directs, and team size</li>
                  <li>• Maintain active status throughout the month</li>
                  <li>• Claims available after month-end processing</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* GTO Rewards Table */}
        <section>
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-admin-new-green/30 overflow-x-auto">
            <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-6">
              GTO Rewards History ({rewardsData.length} records)
            </h2>
            
            {rewardsData.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No GTO Rewards Yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You haven't qualified for any GTO rewards yet. Achieve leadership tier qualification to start earning monthly GTO rewards.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-white/70 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Month</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Tier</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Reward (USD)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Reward (RAMA)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Global Turnover</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Share %</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {rewardsData.map((reward) => (
                      <tr key={reward.id} className="hover:bg-gray-100/50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {reward.month}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            Tier {reward.tier}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-semibold text-admin-new-green">
                          ${formatUSD(reward.rewardUsd)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {formatRama(reward.rewardRama)} RAMA
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          ${formatUSD(reward.globalTurnover)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {reward.sharePercentage.toFixed(3)}%
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            reward.status === 'Pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-admin-new-green/20 text-admin-new-green'
                          }`}>
                            {reward.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {reward.status === 'Pending' ? (
                            <button
                              onClick={() => handleClaimReward(reward)}
                              disabled={claimingReward === reward.id}
                              className="bg-admin-new-green text-white px-3 py-1 rounded text-xs font-semibold hover:bg-admin-new-green/80 transition-colors disabled:opacity-50"
                            >
                              {claimingReward === reward.id ? 'Claiming...' : 'Claim'}
                            </button>
                          ) : reward.txHash ? (
                            <AddressDisplay value={reward.txHash} type="tx" />
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
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

export default GTORewards;