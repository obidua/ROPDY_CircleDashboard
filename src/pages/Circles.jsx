import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';
import CircleDisplay from '../components/CircleDisplay';
import AddressDisplay from '../components/AddressDisplay';
import { generateFullHash, mockAddresses } from '../utils/mockData';
import { useStore } from '../Store/UserStore';

const Circles = () => {


  const getActiveCircles = useStore((state) => state.getActiveCircles);
  const ViewDetailedPartner = useStore((state) => state.ViewDetailedPartner);




  const [circleNumbers, setCircleNumber] = useState([])

  const userAddress = JSON.parse(localStorage.getItem("UserData") || '{}')?.address;



  const [selectedPackage, setSelectedPackage] = useState(0);
  const [selectedCircle, setSelectedCircle] = useState(0);
  const [currentCircle, setCurrentCircle] = useState(null);
  const [positionDetails, setPositionDetails] = useState([]);

  const packages = [
    { id: 0, name: 'Starter', value: 200 },
    { id: 1, name: 'Silver', value: 400 },
    { id: 2, name: 'Gold', value: 800 },
    { id: 3, name: 'Platinum', value: 1600 },
    { id: 4, name: 'Diamond', value: 3200 },
  ];




  const [mockPositions, setMockPosition] = useState([])


  const getCircleDetails = () => {
    const details = mockPositions.map((pos, index) => ({
      srNo: index + 1,
      idNumber: pos.userId || 'N/A',
      address: pos.fromAddress || 'N/A',
      rama: pos.rama || 'N/A',
      usd: pos.usd ? `$${pos.usd}` : 'N/A',
      hashId: pos.userId ? generateFullHash() : 'N/A'
    }));

    return {
      id: selectedCircle,
      package: selectedPackage,
      centerUser: {
        userId: 'Me',
        isFilled: true
      },
      positions: mockPositions
    };
  };

  const handleViewCircle = () => {
    if (typeof selectedPackage === 'number' && typeof selectedCircle === 'number') {
      const details = getCircleDetails();
      setCurrentCircle(details);
      setPositionDetails(details.positions.map((pos, index) => ({
        srNo: index + 1,
        idNumber: pos.userId || 'N/A',
        address: pos.fromAddress || 'N/A',
        type: pos.type || 'N/A',
        // rama: pos.rama || 'N/A',
        // usd: pos.usd ? `$${pos.usd}` : 'N/A',
        // hashId: pos.userId ? generateFullHash() : 'N/A'
      })));
    }
  };




  useEffect(() => {
    const getSelectedPkg = async () => {
      const res = await getActiveCircles(userAddress, selectedPackage);
      console.log('Circle Data:', res[0]);

      const rawData = res[0]; // [0n, 1n, 2n]
      const circleData = rawData.map(Number);

      console.log('Circle Data:', circleData);

      setCircleNumber(circleData || []);
    }


    // Reset previous state to avoid showing stale data
    // setSelectedCircle(0);
    setMockPosition([]);
    setPositionDetails([]);
    setCurrentCircle(null);

    console.log('Selected Package:', userAddress, selectedPackage);

    if (selectedPackage !== null && selectedPackage !== undefined && selectedCircle !== null && selectedCircle !== undefined) getSelectedPkg();
  }, [selectedPackage, selectedCircle])


  useEffect(() => {

    const ViewDetails = async () => {
      const res = await ViewDetailedPartner(userAddress, selectedPackage, selectedCircle);
      console.log('Detailed Circle Data:', res);
      fetchPaymentDetails(userAddress, selectedPackage, selectedCircle)

      setMockPosition(res);
    }

    console.log("selectedPackage,selectedCircle", selectedPackage, selectedCircle)

    if (selectedPackage !== null && selectedCircle !== null) ViewDetails();
  }, [selectedCircle, selectedPackage]);


  // Fetching the CircleInfo

  const [circleData, setCircleData] = useState()


  const CircleInfo = useStore((state) => state.CircleInfo)

  useEffect(() => {
    const fetchCircleInfo = async () => {
      const res = await CircleInfo(userAddress)
      setCircleData(res)
    }
    fetchCircleInfo()
  }, [])

// =======================================================
  // Each position Payment With Modal 
// =======================================================


  const getCirclePosPayment = useStore((state)=>state.getCirclePosPayment);

  const fetchPaymentDetails = async (userAddress, selectedPackage, selectedCircle)=>{
    try {
      console.log(userAddress, selectedPackage, selectedCircle)
      const res = await getCirclePosPayment(userAddress, selectedPackage, selectedCircle);
    console.log('Payment Details:', res);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-admin-cyan dark:text-admin-cyan-dark mb-6">🔄 My Circles</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Circles" value={circleData?.totalCircle} />
          {/* <StatCard label="Active Circles" value={circleData?.pendingCircle + circleData?.CompleteCircle} /> */}
          <StatCard label="Completed Circles" value={circleData?.completeCircle} />
          <StatCard label="Pending Circles" value={circleData?.pendingCircle} />
        </div>

        <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-green-800 mb-8">
          <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">View Circle</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Package
              </label>
              <select
                value={selectedPackage}
                onChange={(e) => {
                  setSelectedPackage(Number(e.target.value));
                  setSelectedCircle(0); // Reset circle selection when package changes
                  setCurrentCircle(null); // Reset current circle
                  setPositionDetails([]); // Reset position details
                }}
                className="w-full px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100 border border-green-800 rounded-md"
              >
                <option value="" className='text-black'>Select a package</option>
                {packages.map(pkg => (
                  <option className='text-black' key={pkg.id} value={pkg.id}>{pkg.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Circle Number
              </label>
              <select
                value={selectedCircle}
                onChange={(e) => setSelectedCircle(Number(e.target.value))}
                className="w-full px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100 border border-green-800 rounded-md"
              >
                <option value="" className='text-black'>Select a Circle</option>
                {circleNumbers.map(num => (
                  <option className='text-black' key={num} value={num}>Circle {num} - ID #{num}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleViewCircle}
            disabled={mockPositions.length === 0 || selectedPackage === null || selectedCircle === null}
            className={`px-6 py-2.5 rounded-lg font-semibold shadow-md transition-colors border border-green-800 ${mockPositions.length === 0
              ? "bg-transparent text-green-800 opacity-50 cursor-wait"
              : "bg-green-800 text-white hover:bg-admin-new-green/10"
              }`}
          >
            {mockPositions.length === 0 ? "Loading..." : "View Circle"}
          </button>
        </div>

        {currentCircle && (
          <>
            <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-admin-new-green/30 mb-8">
              <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">
                Circle # - {packages.find(p => p.id === currentCircle.package)?.name}
              </h2>
              <CircleDisplay circleDetails={currentCircle} />
            </div>

            <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-admin-new-green/30 overflow-x-auto">
              <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Position Details</h2>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-white/70 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Sr. No</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">ID Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Address</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Payment Type</th>

                    {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">RAMA</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">USD</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Hash ID</th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {positionDetails.map((position) => (
                    <tr key={position.srNo} className="hover:bg-gray-100/50 dark:hover:bg-gray-800/30">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{position?.srNo}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{position?.idNumber}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{position?.address}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {position?.address?.startsWith("0x0000000000000000000000000000000000000000")
                          ? "--"
                          : (position?.type === '1' ? "Direct Payment" : "Random Payment")}
                      </td>

                      {/* <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{position.rama}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{position.usd}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{position.hashId}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Circles;