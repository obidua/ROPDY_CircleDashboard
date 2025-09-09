import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';
import { useStore } from '../Store/UserStore';
import { useAppKitAccount } from '@reown/appkit/react';
import { useTransaction } from '../config/register';
import Swal from 'sweetalert2';

const ActivateServers = () => {
  const [serverData, setServerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activatingServer, setActivatingServer] = useState(null);
  const [trxData, setTrxData] = useState(null);

  const { address, isConnected } = useAppKitAccount();
  const userAddress = JSON.parse(localStorage.getItem("UserData") || '{}')?.address;

  const getServerActivationData = useStore((state) => state.getServerActivationData);
  const activateServer = useStore((state) => state.activateServer);
  const { handleSendTx, hash } = useTransaction(trxData);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (userAddress) {
          const data = await getServerActivationData(userAddress);
          setServerData(data);
        }
      } catch (error) {
        console.error('Error fetching server data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userAddress]);

  useEffect(() => {
    if (trxData) {
      try {
        handleSendTx();
      } catch (error) {
        console.error('Transaction send error:', error);
        Swal.fire({
          title: 'Transaction Failed',
          text: 'Failed to send transaction. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
        });
        setActivatingServer(null);
      }
    }
  }, [trxData, handleSendTx]);

  useEffect(() => {
    if (hash) {
      Swal.fire({
        title: '✅ Server Activation Successful',
        html: `
          <p>Server activation transaction has been sent successfully!</p>
          <p style="margin-top: 10px;">
            <a href="https://ramascan.com/tx/${hash}" target="_blank" rel="noopener noreferrer" style="color:#3b82f6; font-weight:bold;">
              🔗 View Transaction on Ramascan
            </a>
          </p>
        `,
        icon: 'success',
        confirmButtonText: 'Close',
        confirmButtonColor: '#22c55e',
      });

      // Refresh server data
      const refreshData = async () => {
        try {
          const data = await getServerActivationData(userAddress);
          setServerData(data);
        } catch (error) {
          console.error('Error refreshing server data:', error);
        }
      };
      refreshData();
      
      setActivatingServer(null);
      setTrxData(null);
    }
  }, [hash, userAddress, getServerActivationData]);
  const formatUSD = (value) => {
    if (!value) return '0.00';
    return (parseFloat(value) / 1e6).toFixed(2);
  };

  const handleActivateServer = async (serverId) => {
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
          <label class="block text-sm font-medium mb-2 mt-4">Select Horizon</label>
          <select id="swal-input2" class="swal2-input">
            <option value="false">2X Horizon (${server.days2x} days)</option>
            <option value="true">3X Horizon (${server.days3x} days)</option>
          </select>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const principalUsd = document.getElementById('swal-input1').value;
        const horizonThreeX = document.getElementById('swal-input2').value;
        
        if (!principalUsd || parseFloat(principalUsd) < parseFloat(formatUSD(server.minStakeUsd))) {
          Swal.showValidationMessage(`Minimum stake is $${formatUSD(server.minStakeUsd)}`);
          return false;
        }
        
        return [parseFloat(principalUsd), horizonThreeX === 'true'];
      }
    });

    if (formValues) {
      const [principalUsd, horizonThreeX] = formValues;
      
      setActivatingServer(serverId);
      
      try {
        // Call the activate server function from store
        const activationTx = await activateServer(
          userAddress, 
          serverId, 
          Math.floor(principalUsd * 1e6), // Convert to contract units
          horizonThreeX
        );
        
        setTrxData(activationTx);
        
      } catch (error) {
        console.error('Server activation error:', error);
        Swal.fire({
          title: 'Activation Failed',
          text: 'Failed to prepare activation transaction. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
        });
        setActivatingServer(null);
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
        <h1 style={{ "color": "#FFD700" }} className="text-2xl font-bold mb-6">🚀 Activate Servers</h1>

        {/* Status Overview */}
        <section className="mb-8">
          <h2 style={{ "color": "#FFD700" }} className="text-xl font-semibold mb-4">Activation Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard 
              label="Highest Server Activated" 
              value={serverData?.highestActivated || 0} 
            />
            <StatCard 
              label="Cap Remaining (USD)" 
              value={serverData ? `$${formatUSD(serverData.userCapRemaining)}` : '$0.00'} 
            />
            <StatCard 
              label="Available Servers" 
              value={serverData?.servers?.filter(s => s.canActivate && !s.isActivated).length || 0} 
            />
            <StatCard 
              label="Total Slots" 
              value={serverData?.servers?.reduce((sum, s) => sum + s.userSlots, 0) || 0} 
            />
          </div>
        </section>

        {/* Server Configurations */}
        <section>
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-admin-new-green/30">
            <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-6">Server Configurations</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {serverData?.servers?.map((server) => (
                <div 
                  key={server.id} 
                  className={`border rounded-lg p-6 transition-all duration-300 ${
                    server.isActivated 
                      ? 'border-admin-new-green bg-admin-new-green/10' 
                      : server.canActivate 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:border-blue-400' 
                        : 'border-gray-300 bg-gray-50 dark:bg-gray-800/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-admin-cyan dark:text-admin-cyan-dark">
                      Server {server.id}
                    </h3>
                    <div className="flex items-center gap-2">
                      {server.isActivated && (
                        <span className="px-2 py-1 bg-admin-new-green text-white text-xs rounded-full font-semibold">
                          Active ({server.userSlots} slots)
                        </span>
                      )}
                      {!server.isActivated && server.canActivate && (
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-semibold">
                          Available
                        </span>
                      )}
                      {!server.canActivate && (
                        <span className="px-2 py-1 bg-gray-400 text-white text-xs rounded-full font-semibold">
                          Locked
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Min Stake:</span>
                      <span className="font-semibold">${formatUSD(server.minStakeUsd)}</span>
                    </div>
                    
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">2X Horizon</div>
                      <div className="flex justify-between text-sm">
                        <span>Duration:</span>
                        <span>{server.days2x} days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Daily ROI:</span>
                        <span className="font-semibold text-admin-new-green">{(server.dailyBp2x / 100).toFixed(2)}%</span>
                      </div>
                    </div>

                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                      <div className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2">3X Horizon</div>
                      <div className="flex justify-between text-sm">
                        <span>Duration:</span>
                        <span>{server.days3x} days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Daily ROI:</span>
                        <span className="font-semibold text-admin-new-green">{(server.dailyBp3x / 100).toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {server.isActivated ? (
                      <button
                        disabled
                        className="w-full bg-gray-400 text-white px-4 py-3 rounded-lg font-semibold cursor-not-allowed"
                      >
                        ✅ Server Activated
                      </button>
                    ) : server.canActivate ? (
                      <button
                        onClick={() => handleActivateServer(server.id)}
                        disabled={activatingServer === server.id}
                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {activatingServer === server.id ? 'Activating...' : `🚀 Activate Server ${server.id}`}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-400 text-white px-4 py-3 rounded-lg font-semibold cursor-not-allowed"
                      >
                        🔒 Activate Previous Servers First
                      </button>
                    )}
                    
                    {server.canActivate && !server.isActivated && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        You can create multiple slots on this server
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ActivateServers;