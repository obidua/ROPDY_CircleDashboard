import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';
import { useStore } from '../Store/UserStore';

const packageTabs = [
  { label: 'Starter', value: 0 },
  { label: 'Silver', value: 1 },
  { label: 'Gold', value: 2 },
  { label: 'Platinum', value: 3 },
  { label: 'Diamond', value: 4 },
];

const Earnings = () => {
  const [activePkg, setActivePkg] = useState(0);
  const [data, setData] = useState(null);

  const userAddress = JSON.parse(localStorage.getItem("UserData") || '{}')?.address;



  const getPackageWiseData = useStore((state) => state.getPackageWiseData)

  useEffect(() => {
    if (!userAddress) return;
    const fetchData = async () => {
      const result = await getPackageWiseData(userAddress, activePkg);
      setData(result);
    };
    fetchData();
  }, [userAddress, activePkg]);

  return (
    <div className="relative min-h-screen text-white">
      <BlockchainAnimation />
      <div className="relative p-6">
        <h1 className="text-3xl font-bold text-neon-green mb-6">💰 Earnings Dashboard</h1>

        {/* Neon Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {packageTabs.map((pkg) => (
            <button
              key={pkg.value}
              className={`px-4 py-2 rounded-md text-sm font-semibold border transition-all duration-300
                ${activePkg === pkg.value
                  ? 'bg-green-800 border-neon-green shadow-lg'
                  : 'border-neon-green text-gray-600 hover:bg-neon-green/10'}
              `}
              onClick={() => setActivePkg(pkg.value)}
            >
              {pkg.label}
            </button>
          ))}
        </div>

        {data ? (
          <>
            {/* Section: Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              <StatCard label="Total RAMA Earned" value={`${parseFloat(data.totalRamaEarned).toFixed(5)} RAMA`} />
              <StatCard label="USD Equivalent" value={`$${data.totalUsdEquivalent}`} />
              <StatCard label="Direct Referrals" value={data.directReferrals} />
            </div>

            {/* Section: Earnings Breakdown */}
            <div className="bg-black/40 border border-neon-green rounded-xl p-6 shadow-neon mb-10">
              <h2 className="text-xl font-semibold text-neon-green mb-4">📊 Earnings Breakdown</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <StatCard label="CP1 Earnings" value={`${parseFloat(data.cp1Earnings).toFixed(5)} RAMA`} />
                <StatCard label="CP2 Earnings" value={`${parseFloat(data.cp2Earnings).toFixed(5)} RAMA`} />
                <StatCard label="MOD1 Earnings" value={`${parseFloat(data.modEarnings[0]).toFixed(5)} RAMA`} />
                <StatCard label="MOD2 Earnings" value={`${parseFloat(data.modEarnings[1]).toFixed(5)} RAMA`} />
                <StatCard label="MOD4 Earnings" value={`${parseFloat(data.modEarnings[2]).toFixed(5)} RAMA`} />
                <StatCard label="Held Funds (RAMA)" value={`${parseFloat(data.heldFundsRama).toFixed(5)} RAMA`} />
                <StatCard label="Missed Payments" value={data.missedPayments} />
                <StatCard label="Circles Started" value={data.totalCirclesStarted} />
                <StatCard label="Circles Completed" value={data.circlesCompleted} />
                <StatCard label="MOD4 Pool Status" value={data.mod4PoolStatus} />
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-400">Loading package data...</p>
        )}
      </div>
    </div>
  );
};

export default Earnings;
