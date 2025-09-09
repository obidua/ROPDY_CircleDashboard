import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';
import ServerCard from '../components/ServerCard';
import { useStore } from '../Store/UserStore';
import { useAppKitAccount } from '@reown/appkit/react';
import { useTransaction } from '../config/register';
import Swal from 'sweetalert2';

// Static server data for UI demonstration
const staticServerData = {
  servers: [
    {
      id: 1,
      minStakeUsd: 5000000, // $5.00 in contract units (6 decimals)
      days2x: 990,
      dailyBp2x: 20.2, // 0.202% in basis points (200% ÷ 990 days)
      days3x: 1350,
      dailyBp3x: 22.2, // 0.222% in basis points (300% ÷ 1350 days)
      isActivated: true,
      canActivate: false,
      userSlots: 0
    },
    {
      id: 2,
      minStakeUsd: 10000000, // $10.00
      days2x: 900,
      dailyBp2x: 22.2, // 0.222% in basis points (200% ÷ 900 days)
      days3x: 1260,
      dailyBp3x: 23.8, // 0.238% in basis points (300% ÷ 1260 days)
      isActivated: false,
      canActivate: true,
      userSlots: 0
    },
    {
      id: 3,
      minStakeUsd: 20000000, // $20.00
      days2x: 810,
      dailyBp2x: 24.7, // 0.247% in basis points (200% ÷ 810 days)
      days3x: 1170,
      dailyBp3x: 25.6, // 0.256% in basis points (300% ÷ 1170 days)
      isActivated: false,
      canActivate: false,
      userSlots: 0
    },
    {
      id: 4,
      minStakeUsd: 40000000, // $40.00
      days2x: 720,
      dailyBp2x: 27.8, // 0.278% in basis points (200% ÷ 720 days)
      days3x: 1080,
      dailyBp3x: 27.8, // 0.278% in basis points (300% ÷ 1080 days)
      isActivated: false,
      canActivate: false,
      userSlots: 0
    },
    {
      id: 5,
      minStakeUsd: 80000000, // $80.00
      days2x: 600,
      dailyBp2x: 33.3, // 0.333% in basis points (200% ÷ 600 days)
      days3x: 930,
      dailyBp3x: 32.3, // 0.323% in basis points (300% ÷ 930 days)
      isActivated: false,
      canActivate: false,
      userSlots: 0
    }
  ],
  highestActivated: 1,
  userCapRemaining: 285000000 // $285.00
};

// Static user mint stats for UI demonstration
const staticUserMintStats = {
  positions: [
    {
      serverId: 1,
      slotId: 1,
      horizon: '0', // 2X
      principalUsd: 5000000, // $5.00
      capUsd: 15000000, // $15.00
      dailyRoiBp: 20.2, // 0.202%
      claimedDays: 45,
      totalDays: 990,
      active: true,
      startTime: Math.floor(Date.now() / 1000) - (45 * 86400)
    },
    {
      serverId: 1,
      slotId: 2,
      horizon: '1', // 3X
      principalUsd: 10000000, // $10.00
      capUsd: 30000000, // $30.00
      dailyRoiBp: 22.2, // 0.222%
      claimedDays: 30,
      totalDays: 1350,
      active: true,
      startTime: Math.floor(Date.now() / 1000) - (30 * 86400)
    }
  ],
  highestServerActivated: 1,
  userCapRemainingUsd: 285000000, // $285.00
  selfBusinessUsd: 15000000 // $15.00
};

const ActivateServers = () => {
  const [serverData, setServerData] = useState(staticServerData);
  const [userMintStats, setUserMintStats] = useState(staticUserMintStats);
  const [loading, setLoading] = useState(false);
  const [activatingServer, setActivatingServer] = useState(null);

  const { address, isConnected } = useAppKitAccount();
  const userAddress = JSON.parse(localStorage.getItem("UserData") || '{}')?.address;

  // Commented out for static implementation
  // const getServerActivationData = useStore((state) => state.getServerActivationData);
  // const getMintUserStats = useStore((state) => state.getMintUserStats);
  // const activateServer = useStore((state) => state.activateServer);

  // Static data is already set in useState, no need to fetch
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       if (userAddress) {
  //         const [serverActivationData, userStatsData] = await Promise.all([
  //           getServerActivationData(userAddress),
  //           getMintUserStats(userAddress)
  //         ]);
  //         setServerData(serverActivationData);
  //         setUserMintStats(userStatsData);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching server data:', error);
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

  const handleActivateServer = async (serverId, horizonThreeX = false) => {
    if (!isConnected || address !== userAddress) {
      Swal.fire({
        title: 'Wallet not connected',
        text: 'Please connect your wallet to activate servers.',
        icon: 'warning',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    const server = serverData.servers.find(s => s.id === serverId);
    if (!server) return;

    const { value: formValues } = await Swal.fire({
      title: `Activate Server ${serverId}`,
      html: `
        <div class="text-left">
          <div class="mb-4 p-3 bg-gray-100 rounded">
            <p><strong>Server ${serverId} Configuration:</strong></p>
            <p>Min Stake: $${formatUSD(server.minStakeUsd)}</p>
            <p>2X Horizon: ${server.days2x} days @ ${(server.dailyBp2x / 100).toFixed(2)}% daily</p>
            <p>3X Horizon: ${server.days3x} days @ ${(server.dailyBp3x / 100).toFixed(2)}% daily</p>
          </div>
          <label class="block text-sm font-medium mb-2">Principal Amount (USD)</label>
          <input id="swal-input1" class="swal2-input" placeholder="Enter USD amount" type="number" min="${formatUSD(server.minStakeUsd)}" step="0.01">
          <div class="mt-4 p-3 bg-blue-50 rounded">
            <p><strong>Selected Horizon:</strong> ${horizonThreeX ? '3X' : '2X'} (${horizonThreeX ? server.days3x : server.days2x} days @ ${horizonThreeX ? (server.dailyBp3x / 100).toFixed(2) : (server.dailyBp2x / 100).toFixed(2)}% daily)</p>
          </div>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const principalUsd = document.getElementById('swal-input1').value;
        
        if (!principalUsd || parseFloat(principalUsd) < parseFloat(formatUSD(server.minStakeUsd))) {
          Swal.showValidationMessage(`Minimum stake is $${formatUSD(server.minStakeUsd)}`);
          return false;
        }
        
        return [parseFloat(principalUsd), horizonThreeX];
      }
    });

    if (formValues) {
      const [principalUsd, selectedHorizon] = formValues;
      
      setActivatingServer(serverId);
      
      // Simulate activation process with delay
      setTimeout(() => {
        try {
          // Calculate new portfolio details
          const principalUsdWei = principalUsd * 1e6; // Convert to contract units
          const capUsdWei = principalUsdWei * (selectedHorizon ? 3 : 2); // 2x or 3x cap
          const dailyRoiBp = selectedHorizon ? server.dailyBp3x : server.dailyBp2x;
          const totalDays = selectedHorizon ? server.days3x : server.days2x;
          
          // Find next slot ID for this server
          const existingSlots = userMintStats?.positions?.filter(p => p.serverId === serverId) || [];
          const nextSlotId = existingSlots.length + 1;
          
          // Create new portfolio
          const newPortfolio = {
            serverId: serverId,
            slotId: nextSlotId,
            horizon: selectedHorizon ? '1' : '0', // 3X : 2X
            principalUsd: principalUsdWei,
            capUsd: capUsdWei,
            dailyRoiBp: dailyRoiBp,
            claimedDays: 0,
            totalDays: totalDays,
            active: true,
            startTime: Math.floor(Date.now() / 1000),
            claimedUsd: 0
          };
          
          // Update server data
          setServerData(prev => ({
            ...prev,
            servers: prev.servers.map(server => {
              if (server.id === serverId) {
                return { 
                  ...server, 
                  isActivated: true, 
                  userSlots: (server.userSlots || 0) + 1 
                };
              }
              // Enable next server if this was the highest activated
              if (server.id === serverId + 1 && prev.highestActivated === serverId - 1) {
                return { ...server, canActivate: true };
              }
              return server;
            }),
            highestActivated: Math.max(prev.highestActivated, serverId),
            userCapRemaining: prev.userCapRemaining - capUsdWei
          }));
          
          // Update user mint stats
          setUserMintStats(prev => ({
            ...prev,
            positions: [...(prev?.positions || []), newPortfolio],
            highestServerActivated: Math.max(prev?.highestServerActivated || 0, serverId),
            selfBusinessUsd: (prev?.selfBusinessUsd || 0) + principalUsdWei,
            userCapRemainingUsd: (prev?.userCapRemainingUsd || 0) - capUsdWei
          }));
          
          // Show success message
          Swal.fire({
            title: '✅ Server Activation Successful',
            html: `
              <div class="text-left">
                <p><strong>Server ${serverId} Activated Successfully!</strong></p>
                <ul class="mt-2 space-y-1">
                  <li><strong>Slot:</strong> #${nextSlotId}</li>
                  <li><strong>Principal:</strong> $${formatUSD(principalUsdWei)}</li>
                  <li><strong>Horizon:</strong> ${selectedHorizon ? '3X' : '2X'} (${totalDays} days)</li>
                  <li><strong>Daily ROI:</strong> ${(dailyRoiBp / 100).toFixed(3)}%</li>
                  <li><strong>Cap:</strong> $${formatUSD(capUsdWei)}</li>
                </ul>
                <p class="mt-3 text-sm text-gray-600">You can now add more portfolios to this server or activate the next server.</p>
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'Continue',
            confirmButtonColor: '#22c55e',
          });
          
        } catch (error) {
          console.error('Server activation error:', error);
          Swal.fire({
            title: 'Activation Failed',
            text: 'Something went wrong during activation. Please try again.',
            icon: 'error',
            confirmButtonColor: '#ef4444',
          });
        } finally {
          setActivatingServer(null);
        }
      }, 1500); // 1.5 second delay to simulate processing
    }
  };

  const handleAddPortfolio = async (server) => {
    if (!isConnected || address !== userAddress) {
      Swal.fire({
        title: 'Wallet not connected',
        text: 'Please connect your wallet to add portfolios.',
        icon: 'warning',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: `Add Portfolio to Server ${server.id}`,
      html: `
        <div class="text-left">
          <div class="mb-4 p-3 bg-gray-100 rounded">
            <p><strong>Server ${server.id} Configuration:</strong></p>
            <p>Min Stake: $1.00 (for additional portfolios)</p>
            <p>2X Horizon: ${server.days2x} days @ ${(server.dailyBp2x / 100).toFixed(3)}% daily</p>
            <p>3X Horizon: ${server.days3x} days @ ${(server.dailyBp3x / 100).toFixed(3)}% daily</p>
          </div>
          <label class="block text-sm font-medium mb-2">Principal Amount (USD)</label>
          <input id="swal-input1" class="swal2-input" placeholder="Enter USD amount" type="number" min="1" step="0.01">
          <label class="block text-sm font-medium mb-2 mt-4">Select Horizon</label>
          <select id="swal-input2" class="swal2-input">
            <option value="false">2X Horizon (${server.days2x} days @ ${(server.dailyBp2x / 100).toFixed(3)}% daily)</option>
            <option value="true">3X Horizon (${server.days3x} days @ ${(server.dailyBp3x / 100).toFixed(3)}% daily)</option>
          </select>
          <div class="mt-4 p-3 bg-green-50 rounded text-sm">
            <p><strong>Note:</strong> Additional portfolios on activated servers have a minimum stake of $1.00.</p>
          </div>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const principalUsd = document.getElementById('swal-input1').value;
        const horizonThreeX = document.getElementById('swal-input2').value;
        
        if (!principalUsd || parseFloat(principalUsd) < 1) {
          Swal.showValidationMessage('Minimum stake for additional portfolios is $1.00');
          return false;
        }
        
        return [parseFloat(principalUsd), horizonThreeX === 'true'];
      }
    });

    if (formValues) {
      const [principalUsd, selectedHorizon] = formValues;
      
      setActivatingServer(server.id);
      
      // Simulate portfolio creation with delay
      setTimeout(() => {
        try {
          // Calculate new portfolio details
          const principalUsdWei = principalUsd * 1e6; // Convert to contract units
          const capUsdWei = principalUsdWei * (selectedHorizon ? 3 : 2); // 2x or 3x cap
          const dailyRoiBp = selectedHorizon ? server.dailyBp3x : server.dailyBp2x;
          const totalDays = selectedHorizon ? server.days3x : server.days2x;
          
          // Find next slot ID for this server
          const existingSlots = userMintStats?.positions?.filter(p => p.serverId === server.id) || [];
          const nextSlotId = existingSlots.length + 1;
          
          // Create new portfolio
          const newPortfolio = {
            serverId: server.id,
            slotId: nextSlotId,
            horizon: selectedHorizon ? '1' : '0', // 3X : 2X
            principalUsd: principalUsdWei,
            capUsd: capUsdWei,
            dailyRoiBp: dailyRoiBp,
            claimedDays: 0,
            totalDays: totalDays,
            active: true,
            startTime: Math.floor(Date.now() / 1000),
            claimedUsd: 0
          };
          
          // Update server data (increment slot count)
          setServerData(prev => ({
            ...prev,
            servers: prev.servers.map(s => 
              s.id === server.id 
                ? { ...s, userSlots: (s.userSlots || 0) + 1 }
                : s
            ),
            userCapRemaining: prev.userCapRemaining - capUsdWei
          }));
          
          // Update user mint stats
          setUserMintStats(prev => ({
            ...prev,
            positions: [...(prev?.positions || []), newPortfolio],
            selfBusinessUsd: (prev?.selfBusinessUsd || 0) + principalUsdWei,
            userCapRemainingUsd: (prev?.userCapRemainingUsd || 0) - capUsdWei
          }));
          
          // Show success message
          Swal.fire({
            title: '✅ Portfolio Added Successfully',
            html: `
              <div class="text-left">
                <p><strong>New Portfolio Created on Server ${server.id}!</strong></p>
                <ul class="mt-2 space-y-1">
                  <li><strong>Slot:</strong> #${nextSlotId}</li>
                  <li><strong>Principal:</strong> $${formatUSD(principalUsdWei)}</li>
                  <li><strong>Horizon:</strong> ${selectedHorizon ? '3X' : '2X'} (${totalDays} days)</li>
                  <li><strong>Daily ROI:</strong> ${(dailyRoiBp / 100).toFixed(3)}%</li>
                  <li><strong>Cap:</strong> $${formatUSD(capUsdWei)}</li>
                </ul>
                <p class="mt-3 text-sm text-gray-600">Your new portfolio is now active and earning daily ROI!</p>
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'Continue',
            confirmButtonColor: '#22c55e',
          });
          
        } catch (error) {
          console.error('Portfolio creation error:', error);
          Swal.fire({
            title: 'Portfolio Creation Failed',
            text: 'Something went wrong while creating your portfolio.',
            icon: 'error',
            confirmButtonColor: '#ef4444',
          });
        } finally {
          setActivatingServer(null);
        }
      }, 1500); // 1.5 second delay to simulate processing
    }
  };
  if (loading) {
    return (
      <div className="relative min-h-screen">
        <BlockchainAnimation />
        <div className="relative p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-admin-new-green"></div>
            <p className="mt-4 text-admin-cyan dark:text-admin-cyan-dark">Loading server configurations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-4 sm:p-6 lg:p-8">
        {/* Header / Hero */}
        <div className="text-center mb-8">
          <h1 style={{ "color": "#FFD700" }} className="text-3xl font-bold mb-2">🚀 Start RAMA Minting</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Choose a Server to Activate. Each server unlocks in series, starting from Server 1.
          </p>
        </div>

        {/* Tickers */}
        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard 
              label="Your Highest Server" 
              value={serverData?.highestActivated || 0} 
            />
            <StatCard 
              label="Active Portfolios" 
              value={userMintStats?.positions?.length || 0} 
            />
            <StatCard 
              label="Cap Remaining" 
              value={serverData ? `$${formatUSD(serverData.userCapRemaining)}` : '$0.00'} 
            />
            <StatCard 
              label="Total Self Business" 
              value={userMintStats ? `$${formatUSD(userMintStats.selfBusinessUsd)}` : '$0.00'} 
            />
          </div>
        </section>

        {/* Server Cards Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {serverData.servers.map((server) => (
              <ServerCard
                key={server.id}
                server={server}
                userAddress={userAddress}
                isConnected={isConnected}
                activatingServer={activatingServer}
                handleActivateServer={handleActivateServer}
                highestActivatedServer={serverData.highestActivated || 0}
                onAddPortfolio={handleAddPortfolio}
              />
            ))}
          </div>
        </section>

        {/* Server Table (Optional) */}
        <section className="mb-8">
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-admin-new-green/30">
            <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-6">Server Configurations (Table View)</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-white/70 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Server
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Min Stake
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      2x Horizon (days)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      2x Daily ROI %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      3x Horizon (days)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      3x Daily ROI %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Activation Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {serverData.servers.map((server) => {
                    // Find the first active position for this server to get activation details
                    const serverPosition = userMintStats?.positions?.find(pos => pos.serverId === server.id && pos.active);
                    
                    // Calculate activation and end dates
                    const activationDate = serverPosition 
                      ? new Date(serverPosition.startTime * 1000).toLocaleString()
                      : 'N/A';
                    
                    const endDate = serverPosition 
                      ? new Date((serverPosition.startTime + (serverPosition.totalDays * 86400)) * 1000).toLocaleString()
                      : 'N/A';
                    
                    return (
                    <tr 
                      key={server.id} 
                      className={`hover:bg-gray-100/50 dark:hover:bg-gray-800/30 transition-colors ${
                        server.isActivated 
                          ? 'bg-admin-new-green/10' 
                          : server.canActivate 
                            ? 'bg-blue-50/50 dark:bg-blue-900/10' 
                            : 'bg-gray-50/50 dark:bg-gray-800/20 opacity-60'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        Server {server.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        ${formatUSD(server.minStakeUsd)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {server.days2x}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {(server.dailyBp2x / 100).toFixed(3)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {server.days3x}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-600 dark:text-purple-400">
                        {(server.dailyBp3x / 100).toFixed(3)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {server.isActivated ? (
                          <div className="text-xs">
                            <div className="font-medium text-admin-new-green">{activationDate}</div>
                            {serverPosition && (
                              <div className="text-gray-500 dark:text-gray-400 mt-1">
                                {serverPosition.horizon === '0' ? '2X' : '3X'} Horizon
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Not Activated</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {server.isActivated ? (
                          <div className="text-xs">
                            <div className="font-medium text-orange-600 dark:text-orange-400">{endDate}</div>
                            {serverPosition && (
                              <div className="text-gray-500 dark:text-gray-400 mt-1">
                                {serverPosition.totalDays} days total
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {server.isActivated ? (
                          <div className="space-y-1">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-admin-new-green/20 text-admin-new-green">
                              ✅ Active
                            </span>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {server.userSlots} slot{server.userSlots !== 1 ? 's' : ''}
                            </div>
                            {serverPosition && (
                              <div className="text-xs">
                                <div className="text-admin-new-green font-medium">
                                  ${formatUSD(serverPosition.principalUsd)} invested
                                </div>
                                <div className="text-gray-500 dark:text-gray-400">
                                  Cap: ${formatUSD(serverPosition.capUsd)}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : server.canActivate ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            🔓 Available
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            🔒 Locked
                          </span>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Notes Section */}
        <section>
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-admin-gold-600/30">
            <h3 className="text-lg font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">📌 Important Notes</h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p className="flex items-start gap-2">
                <span className="text-admin-new-green mt-0.5">•</span>
                <span><em>Servers must be activated in sequence (S1 → S5).</em></span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-admin-new-green mt-0.5">•</span>
                <span><em>Once opened, you may add unlimited portfolios on that server with min $1.</em></span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-admin-new-green mt-0.5">•</span>
                <span><em>Rewards capped at 3× of your stake. Top-up required to continue.</em></span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ActivateServers;