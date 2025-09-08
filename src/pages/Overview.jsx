import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';
import { useStore } from '../Store/UserStore';

const Overview = () => {
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [overviewData, setOverviewData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false)

  const getOverview = useStore((state) => state.getOverView);
  const userAddress = JSON.parse(localStorage.getItem('UserData') || '{}')?.address;

  const levels = Array.from({ length: 3 }, (_, i) => ({ level: i, label: `Level ${i + 1}` }));

  useEffect(() => {
    const fetchOverview = async () => {
      if (!userAddress) return;
      setLoading(true);
      try {
        const pageSize = 10;
        const result = await getOverview(userAddress, selectedLevel, currentPage, pageSize);
        console.log("result", result);

        // ✅ FIXED: use direct object structure, not array indexing
        setLoading(false);
        const downlines = result?.downlines || [];
        setOverviewData(downlines);
        setTotalPages(result?.totalPages || 1);
      } catch (err) {
        console.error('Overview fetch error:', err);
      }
    };

    fetchOverview();
  }, [userAddress, selectedLevel, currentPage]);



  const getOverViewBasicInfo = useStore((state) => state.getOverViewBasicInfo);

  const [basicData, setBasicData] = useState();
  useEffect(() => {
    setLoading(true);
    const basinfo = async () => {
      const res = await getOverViewBasicInfo(userAddress);
      console.log("---->", res)
      setLoading(false);
      setBasicData(res)
    }
    basinfo();
  }, [])


  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-6">
        <h1 className="text-2xl font-bold text-admin-cyan dark:text-admin-cyan-dark mb-6">📈 Overview</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard label={`Total Users in Level ${selectedLevel + 1}`} value={overviewData.length || 0} />
          <StatCard label="Direct Referrals" value={basicData?.directReferral || 0} />
          <StatCard label="Total Downline" value={basicData?.totalDownline || 0} />
        </div>

        {/* Level Tabs */}
        <div className="flex gap-2 mb-6">
          {levels.map((tab) => (
            <button
              key={tab.level}
              onClick={() => {
                setSelectedLevel(tab.level);
                setCurrentPage(0);
              }}
              className={`px-4 py-2 rounded-lg font-semibold border ${selectedLevel === tab.level
                ? 'bg-green-800 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-400 dark:border-gray-600'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Downline Table */}
        <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-admin-new-green/30 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="bg-white/70 dark:bg-gray-800/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Sno</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Wallet</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">User ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Level</th>
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Earnings (RAMA)</th> */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {!loading ? (

                overviewData.length !== 0 ? (
                  overviewData.map((entry, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-white text-sm">{idx + 1}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-white text-sm">{entry?.wallet}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-white text-sm">{entry?.userId}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-white text-sm">{entry?.level}</td>

                      <td className="px-4 py-3 whitespace-nowrap text-gray-600  dark:text-white  text-sm">
                        {new Date(parseInt(entry?.registrationTime
                        ) * 1000).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <td className="px-4 py-3 whitespace-nowrap text-white text-sm">No Data Found</td>
                )

              ) : (
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-white text-sm">Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {/* <div className="mt-6 flex justify-between items-center">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            disabled={currentPage + 1 >= totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Overview;
