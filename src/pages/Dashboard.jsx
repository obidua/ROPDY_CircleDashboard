import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';
import AddressDisplay from '../components/AddressDisplay';
import { useStore } from '../Store/UserStore';
import { useAppKitAccount } from '@reown/appkit/react';
import RamaCard, { EarnedRamaCard } from '../components/RamaCard';

const Dashboard = () => {


  const [dashData, setDashData] = useState()

  const { address, isConnected } = useAppKitAccount();
  const userAddress = JSON.parse(localStorage.getItem("UserData") || '{}')?.address;


  const getDashboardInfo = useStore((state) => state.getDashboardInfo);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getDashboardInfo(userAddress);
      setDashData(response);
    }
    if (userAddress)
      fetchData();
  })



  // Global Stats to fetch rama price and wallet Balance

  const [GlobalData, setGlobalData] = useState();

  const globalStats = useStore((state) => state.globalStats)
  useEffect(() => {
    const fetchRamaprice = async () => {
      const response = await globalStats(userAddress);
      setGlobalData(response)

      console.log(response)
    }

    if (userAddress) fetchRamaprice();
  }, [])


  const GetSponserId = useStore((state) => state.GetSponserId);

  const [sponserId, setSponserId] = useState();

  useEffect(() => {
    const fetchSponserId = async () => {
      const res = await GetSponserId(userAddress);
      setSponserId(res);
    }
    if (userAddress) fetchSponserId();
  }, [])


  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-4 sm:p-6 lg:p-8">
        <h1 style={{ "color": "#FFD700" }} className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Global Stats</h1>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">

        
          <RamaCard label="Current Rama Price (Dollar)" value={GlobalData ? ("$" + GlobalData?.globalRama?.toString()) : "Loading"} />
          <StatCard label="Wallet Balance" value={isConnected ? GlobalData?.walletBalance.toString() : "Not Connected"} />

          <StatCard label="👥 Total Registered Users" value={dashData?.totalRegisteredUsers.toString() || 0} />
          <StatCard label="💵 Total RAMA Distributed" value={dashData?.totalRamaDistributed ? (parseFloat(dashData.totalRamaDistributed.toString()) / 1e18).toFixed(5) : '0.00000'} />
          <StatCard label="💲 Total USD Volume" value={dashData?.totalUsdVolume ? (parseFloat(dashData?.totalUsdVolume.toString()) / 1e6).toFixed(5) : '0.00000'} />
        </section>

        <section className="mb-8 sm:mb-10">
          <h2 style={{ "color": "#FFD700" }} className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">User Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <StatCard label="🆔 User ID" value={dashData?.userId.toString() || 'N/A'} />
            <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm p-5 rounded-lg shadow-lg border border-admin-new-green/30 hover:border-admin-new-green hover:shadow-xl hover:shadow-admin-new-green/20 transition-all duration-300">
              <h3 className="text-base text-admin-cyan dark:text-admin-cyan-dark">👛 Wallet Address</h3>
              <div className="mt-2">
                <AddressDisplay value={dashData?.walletAddress || 'N/A'} type="address" />
              </div>
            </div>
            <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm p-5 rounded-lg shadow-lg border border-admin-new-green/30 hover:border-admin-new-green hover:shadow-xl hover:shadow-admin-new-green/20 transition-all duration-300">
              <h3 className="text-base text-admin-cyan dark:text-admin-cyan-dark">🤝 Sponsor Address</h3>
              <div className="mt-2 flex gap-5">
                <AddressDisplay value={dashData?.sponsorAddress || 'N/A'} type="address" />
                <p className='dark:text-admin-cyan-dark'> User ID : {sponserId}</p>
              </div>
            </div>
            <StatCard label="🎫 Current Package" value={dashData?.currentPackage || 'N/A'} />
            <StatCard label="👥 Direct Referrals" value={dashData?.directReferrals.toString() || 0} />
            <StatCard label="💼 Held Funds (RAMA)" value={dashData?.heldFundsRama ? (parseFloat(dashData?.heldFundsRama.toString()) / 1e18).toFixed(5) : '0.00000'} />
          </div>
        </section>

        <section className="mb-8 sm:mb-10">
          <h2 style={{ "color": "#FFD700" }} className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Circle Activity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <StatCard label="🔄 Total Circles Started" value={dashData?.totalCirclesStarted.toString() || 0} />
            <StatCard label="✅ Circles Completed" value={dashData?.circlesCompleted.toString() || 0} />
            <StatCard label="♻️ MOD4 Pool Status" value={dashData?.mod4PoolStatus.toString() || 0} />
            <StatCard label="🚫 Missed Payments" value={dashData?.missedPayments ? (parseFloat(dashData?.missedPayments.toString()) / 1e18).toFixed(5) : '0.00000'} />
          </div>
        </section>

        <section>
          <h2 style={{ "color": "#FFD700" }} className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">💰 Earnings Summary (RAMA)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <StatCard label="CP1 Earnings" value={dashData?.cp1Earnings ? (parseFloat(dashData?.cp1Earnings.toString()) / 1e18).toFixed(5) : '0.00000'} />
            <StatCard label="CP2 Earnings" value={dashData?.cp2Earnings ? (parseFloat(dashData?.cp2Earnings.toString()) / 1e18).toFixed(5) : '0.00000'} />
            <StatCard label="MOD1 Earnings" value={dashData?.modEarnings[0] ? (parseFloat(dashData?.modEarnings[0].toString()) / 1e18).toFixed(5) : '0.00000'} />
            <StatCard label="MOD2 Earnings" value={dashData?.modEarnings[1] ? (parseFloat(dashData?.modEarnings[1].toString()) / 1e18).toFixed(5) : '0.00000'} />
            <StatCard label="MOD3 Earnings" value={dashData?.modEarnings[2] ? (parseFloat(dashData?.modEarnings[2].toString()) / 1e18).toFixed(5) : '0.00000'} />
            <StatCard label="MOD4 Earnings" value={dashData?.modEarnings[3] ? (parseFloat(dashData?.modEarnings[3].toString()) / 1e18).toFixed(5) : '0.00000'} />
            <EarnedRamaCard label="🧾 Total RAMA Earned" value={dashData?.totalRamaEarned ? (parseFloat(dashData?.totalRamaEarned.toString()) / 1e18).toFixed(5) : '0.00000'} />
            <StatCard label="💲 Total USD Equivalent" value={dashData?.totalUsdEquivalent ? (parseFloat(dashData?.totalUsdEquivalent.toString()) / 1e18).toFixed(5) : '0.00000'} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;