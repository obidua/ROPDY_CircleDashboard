import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';
import { useStore } from '../Store/UserStore';

const Missed = () => {
  const [missedData, setMissedData] = useState([]);
  const [activePkg, setActivePkg] = useState(null);

  const getMissedPayments = useStore((state) => state.getMissedPayments);
  const userAddress = JSON.parse(localStorage.getItem("UserData") || '{}')?.address;

  const PackageNames = ['Starter', 'Silver', 'Gold', 'Diamond', 'Platinum'];

  useEffect(() => {
    const fetchMissedPayment = async () => {
      if (!userAddress) return;

      try {
        const res = await getMissedPayments(userAddress);
        setMissedData(res);
      } catch (err) {
        console.error("Failed to fetch missed data:", err);
      }
    };
    fetchMissedPayment();
  }, [userAddress]);

  const filtered = activePkg !== null
    ? missedData.filter(mp => parseInt(mp.pkg) === activePkg)
    : [];

  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-6">
        <h1 className="text-2xl font-bold text-admin-cyan dark:text-admin-cyan-dark mb-6">🚫 Missed Payments</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {PackageNames.map((pkg, index) => (
            <div key={index} onClick={() => setActivePkg(index)} className="cursor-pointer">
              <StatCard
                label={pkg}
                value={`${missedData.filter(m => parseInt(m.pkg) === index).length} missed`}
                className={activePkg === index ? 'border-2 border-admin-new-green' : ''}
              />
            </div>
          ))}
        </div>

        {activePkg !== null && (
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-admin-new-green/30 mt-6">
            <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">
              {PackageNames[activePkg]} Missed Payments
            </h2>

            {filtered.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300">No missed payments for this package.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                  <thead className="bg-white/70 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-white">From</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-white">Amount (RAMA)</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-white">Amount (USD)</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-white">Time</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-white">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filtered.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-100/50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-2 text-sm text-white">{row.from}</td>
                        <td className="px-4 py-2 text-sm text-white">{(parseFloat(row.amount) / 1e18).toFixed(5)}</td>
                        <td className="px-4 py-2 text-sm text-white">{(parseFloat(row.amountInUSD) / 1e6).toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-white">{new Date(Number(row.timestamp) * 1000).toLocaleString()}</td>
                        <td className="px-4 py-2 text-sm text-white">{row.reason.toString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Missed;
