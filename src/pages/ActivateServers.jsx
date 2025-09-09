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
          console.log('Server activation data received:', data);
          console.log('Servers array:', data?.servers);
          console.log('Servers length:', data?.servers?.length);
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
            
            {!serverData?.servers || serverData.servers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Server Configurations Found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {!serverData ? 'Loading server data...' : 'No servers are available for activation at this time.'}
                </p>
                {serverData && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <p>Debug Info:</p>
                    <p>Server data exists: {serverData ? 'Yes' : 'No'}</p>
                    <p>Servers array: {serverData?.servers ? `Array with ${serverData.servers.length} items` : 'Not found'}</p>
                  </div>
                )}
              </div>
            ) : (
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
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {serverData?.servers?.map((server) => (
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
                        {(server.dailyBp2x / 100).toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {server.days3x}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-600 dark:text-purple-400">
                        {(server.dailyBp3x / 100).toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {server.isActivated ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-admin-new-green/20 text-admin-new-green">
                            Active ({server.userSlots} slots)
                          </span>
                        ) : server.canActivate ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Available
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Locked
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {server.isActivated ? (
                          <button
                            disabled
                            className="bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold cursor-not-allowed text-xs"
                          >
                            ✅ Activated
                          </button>
                        ) : server.canActivate ? (
                          <button
                            onClick={() => handleActivateServer(server.id)}
                            disabled={activatingServer === server.id}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 text-xs"
                          >
                            {activatingServer === server.id ? 'Activating...' : '🚀 Activate'}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold cursor-not-allowed text-xs"
                          >
                            🔒 Locked
                          </button>
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

export default ActivateServers;