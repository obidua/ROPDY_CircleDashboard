import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';
import AddressDisplay from '../components/AddressDisplay';
import { mockAddresses, mockHashes } from '../utils/mockData';
import { useStore } from '../Store/UserStore';

const PaymentDetails = ({ title, details = {} }) => (
  <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-admin-new-green/30 mb-6">
    <h3 className="text-lg font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-3">
        <p className="text-sm">
          <span className="text-gray-600 dark:text-gray-400">From: </span>
          <AddressDisplay value={details.from} type="address" />
        </p>
        <p className="text-sm">
          <span className="text-gray-600 dark:text-gray-400">To: </span>
          <AddressDisplay value={details.to} type="address" />
        </p>
        <p className="text-sm">
          <span className="text-gray-600 dark:text-gray-400">RAMA Amount: </span>
          <span className="text-gray-900 dark:text-gray-100">{details.ramaAmount} RAMA</span>
        </p>
      </div>
      <div className="space-y-3">
        <p className="text-sm">
          <span className="text-gray-600 dark:text-gray-400">USD Amount: </span>
          <span className="text-gray-900 dark:text-gray-100">${details.usdAmount}</span>
        </p>
        <p className="text-sm">
          <span className="text-gray-600 dark:text-gray-400">Fee (RAMA): </span>
          <span className="text-gray-900 dark:text-gray-100">{details.feeRama} RAMA</span>
        </p>
        <p className="text-sm">
          <span className="text-gray-600 dark:text-gray-400">Fee (USD): </span>
          <span className="text-gray-900 dark:text-gray-100">${details.feeUSD}</span>
        </p>
      </div>
      <div className="space-y-3">
        <p className="text-sm">
          <span className="text-gray-600 dark:text-gray-400">Net RAMA: </span>
          <span className="text-gray-900 dark:text-gray-100">{details.netRama} RAMA</span>
        </p>
        <p className="text-sm">
          <span className="text-gray-600 dark:text-gray-400">Net USD: </span>
          <span className="text-gray-900 dark:text-gray-100">${details.netUSD}</span>
        </p>
        <p className="text-sm">
          <span className="text-gray-600 dark:text-gray-400">Payment Type: </span>
          <span className="text-gray-900 dark:text-gray-100">{details.paymentType}</span>
        </p>
        <p className="text-sm">
          <span className="text-gray-600 dark:text-gray-400">Timestamp: </span>
          <span className="text-gray-900 dark:text-gray-100">{details.timestamp == 0 ? "N/A" : new Date(details.timestamp * 1000).toLocaleString()}</span>
        </p>
        <p className="text-sm">
          <span className="text-gray-600 dark:text-gray-400">Circle Index: </span>
          <span className="text-gray-900 dark:text-gray-100">{details.circleIndex}</span>
        </p>
      </div>
    </div>
  </div>
);

const Settlements = () => {
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [selectedCircle, setSelectedCircle] = useState(0);
  const [showSettlementDetails, setShowSettlementDetails] = useState(false);


  const userAddress = JSON.parse(localStorage.getItem("UserData") || '{}')?.address;

  const [circles, setCircles] = useState([])

  const packages = [
    { id: 0, name: 'Starter' },
    { id: 1, name: 'Silver' },
    { id: 2, name: 'Gold' },
    { id: 3, name: 'Diamond' },
    { id: 4, name: 'Platinum' }
  ];


  const [mockCP1Payment, setmockCP1Payment] = useState();
  const [mockCP2Payment, setmockCP2Payment] = useState();

  // const circles = [1, 2, 3, 4];

  // const mockCP1Payment = {
  //   from: mockAddresses.wallet,
  //   to: mockAddresses.user1,
  //   ramaAmount: 1000,
  //   usdAmount: 100,
  //   feeRama: 10,
  //   feeUSD: 1,
  //   netRama: 990,
  //   netUSD: 99,
  //   paymentType: 'Direct Payment',
  //   timestamp: Math.floor(Date.now() / 1000),
  //   circleIndex: 1,
  //   hash: mockHashes.tx1
  // };

  // const mockCP2Payment = {
  //   from: mockAddresses.user2,
  //   to: mockAddresses.sponsor,
  //   ramaAmount: 800,
  //   usdAmount: 80,
  //   feeRama: 8,
  //   feeUSD: 0.8,
  //   netRama: 792,
  //   netUSD: 79.2,
  //   paymentType: 'Random',
  //   timestamp: Math.floor(Date.now() / 1000),
  //   circleIndex: 1,
  //   hash: mockHashes.tx2
  // };

  const handleShowDetails = async () => {
    try {
      const res = await getUsrSettlement(userAddress, selectedPackage, selectedCircle);
      console.log("Fetched Settlement:", res);
      setmockCP1Payment(res.cp1);
      setmockCP2Payment(res.cp2);
      setShowSettlementDetails(true);
    } catch (err) {
      console.error("Settlement fetch failed", err);
    }
  };




  const CircleCount = useStore((state) => state.CircleCount)

  useEffect(() => {
    const fetchData = async () => {
      const res = await CircleCount(userAddress, selectedPackage)
      setCircles(res)
    }

    if (userAddress !== null && userAddress !== '') {
      fetchData();
    }
  }, [selectedPackage])



  const getUsrSettlement = useStore((state) => state.getUsrSettlement);


  useEffect(() => {
    const fetchData = async () => {
      const res = await getUsrSettlement(userAddress, selectedPackage, selectedCircle);
      setmockCP1Payment(res.cp1);
      setmockCP2Payment(res.cp2);
    };

    if (userAddress !== null && selectedPackage !== null && selectedCircle !== null) {
      fetchData();
    }
  }, [selectedCircle]);


  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-admin-cyan dark:text-admin-cyan-dark mb-6">📥 Settlements</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* <StatCard label="Total Settlements" value="25" /> */}
          {/* <StatCard label="Pending Settlements" value="2" />
          <StatCard label="Last Settlement" value="500 RAMA" /> */}
        </div>

        {/* <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-admin-gold-600/30 mb-8">
          <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Settlement History</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="This Week" value="1,500 RAMA" />
            <StatCard label="This Month" value="5,000 RAMA" />
            <StatCard label="Last Month" value="4,200 RAMA" />
            <StatCard label="Total Value" value="25,000 RAMA" />
          </div>
        </div> */}

        <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-admin-new-green/30 mb-8">
          <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-6">Settlement Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Package
              </label>
              <select
                value={selectedPackage}
                onChange={(e) => {
                  setSelectedPackage(Number(e.target.value));
                  setShowSettlementDetails(false);
                }}

                className="w-full px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100 border border-admin-new-green rounded-md"
              >
                <option value="" className='text-black'>Select a package</option>
                {packages.map(pkg => (
                  <option className='text-black' key={pkg.id} value={pkg.id}>{pkg.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Circle
              </label>
              <select
                value={selectedCircle}
                onChange={(e) => {
                  setSelectedCircle(Number(e.target.value));
                  setShowSettlementDetails(false);
                }}

                className="w-full px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100 border border-admin-new-green rounded-md"
              >
                <option value="" className='text-black'>Select a circle</option>
                {circles?.map(circle => (
                  <option className="text-black" key={circle} value={circle}>Circle {circle}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleShowDetails}
            disabled={selectedPackage === null || selectedCircle === null}

            className="bg-transparent text-admin-new-green px-6 py-2.5 rounded-lg font-semibold shadow-md hover:bg-admin-new-green/10 transition-colors border border-admin-new-green disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            Show Details
          </button>

          {showSettlementDetails && mockCP1Payment && mockCP2Payment && (
            <>
              <PaymentDetails title="CP1 (Direct Payment)" details={mockCP1Payment} />
              <PaymentDetails title="CP2 Payment (Random)" details={mockCP2Payment} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settlements;