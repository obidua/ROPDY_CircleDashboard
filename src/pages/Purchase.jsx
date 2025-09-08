import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';
import AddressDisplay from '../components/AddressDisplay';
import { useStore } from '../Store/UserStore';
import { useAppKitAccount } from '@reown/appkit/react';
import { useNavigate } from 'react-router-dom';
import { useTransaction } from '../config/register';
import Swal from 'sweetalert2';

const PackageCard = ({ name, usdPrice, required, index, onPurchase }) => (
  <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm p-6 rounded-lg border border-admin-gold-600/30 hover:border-admin-gold-400 transition-all duration-300">
    <h3 className="text-xl font-bold text-admin-cyan dark:text-admin-cyan-dark mb-4">{name}</h3>
    <div className="space-y-3 mb-6">
      <p className="text-gray-900 dark:text-gray-100"><span className="text-admin-cyan dark:text-admin-cyan-dark">Price:</span> ${usdPrice}</p>
      {/* <p className="text-gray-900 dark:text-gray-100"><span className="text-admin-cyan dark:text-admin-cyan-dark">RAMA Value:</span> {ramaValue} RAMA</p> */}
      <p className="text-gray-900 dark:text-gray-100"><span className="text-admin-cyan dark:text-admin-cyan-dark">Required:</span> {required} RAMA</p>
      {/* <p className="text-gray-900 dark:text-gray-100"><span className="text-admin-cyan dark:text-admin-cyan-dark">Available:</span> {available} RAMA</p> */}
    </div>
    <button onClick={() => onPurchase(index)} className="w-full bg-green-800 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:bg-admin-new-green/80 transition-colors border border-admin-new-green/30">
      Purchase Now
    </button>
  </div>
);




const Purchase = () => {

  const [walletBalance, setWalletBalance] = useState(0);

  const { address, isConnected } = useAppKitAccount();
  const [trxData, setTrxData] = useState();
  const navigate = useNavigate();

  const { handleSendTx, hash } = useTransaction(trxData !== null && trxData);



  useEffect(() => {
    if (trxData) {
      try {
        handleSendTx(trxData);
      } catch (error) {
        alert("somthing went Wrong");
      }
    }
  }, [trxData]);


  useEffect(() => {
    if (hash) {
      Swal.fire({
        title: '✅ Purchase Successful',
        html: `
          <p>Package purchase completed successfully.</p>
          <p style="margin-top: 10px;">
            <a href="https://ramascan.com/tx/${hash}" target="_blank" rel="noopener noreferrer" style="color:#3b82f6; font-weight:bold;">
              🔗 View Transaction
            </a>
          </p>
        `,
        icon: 'success',
        confirmButtonText: 'Close',
        confirmButtonColor: '#22c55e',
      });

    }
  }, [hash]);



  const userAddress = JSON.parse(localStorage.getItem("UserData") || '{}')?.address;


  const [packages, setPackages] = useState([]);
  const [activePkg, setActivePkg] = useState();


  // const packages = [
  //   {
  //     name: "Starter",
  //     usdPrice: 20,
  //     ramaValue: 200,
  //     required: 200,
  //     available: 500
  //   },
  //   {
  //     name: "Silver",
  //     usdPrice: 40,
  //     ramaValue: 400,
  //     required: 400,
  //     available: 500
  //   },
  //   {
  //     name: "Gold",
  //     usdPrice: 80,
  //     ramaValue: 800,
  //     required: 800,
  //     available: 500
  //   },
  //   {
  //     name: "Diamond",
  //     usdPrice: 160,
  //     ramaValue: 1600,
  //     required: 1600,
  //     available: 500
  //   },
  //   {
  //     name: "Platinum",
  //     usdPrice: 320,
  //     ramaValue: 3200,
  //     required: 3200,
  //     available: 500
  //   }
  // ];




  const purchaseInfo = useStore((state) => state.purchaseInfo);

  useEffect(() => {
    const fetchPurchaseData = async () => {
      try {
        const response = await purchaseInfo(userAddress);

        console.log("Purchase Data:", response);

        setPackages(response.packages || []);
        setWalletBalance(response.UserBalance)
        setActivePkg(response.userPackage)

      } catch (error) {
        console.log(error)
        console.error("Error fetching purchase data:", error);
      }
    }

    fetchPurchaseData();
  }, []);



  const PurchasePackage = useStore((state) => state.PurchasePackage)

  const PruchaseNewPkg = async (selectedPackageIndex) => {
    try {

      if (isConnected && address && (address == userAddress)) {
        const res = await PurchasePackage(address, selectedPackageIndex);
        setTrxData(res)
        console.log("payment", res);
      }
      else {
        Swal.fire({
          title: 'Wallet not connected',
          text: 'Please connect your wallet before purchasing.',
          icon: 'warning',
          confirmButtonColor: '#f59e0b',
        });
      }
    } catch (error) {
      console.log(error)
      Swal.fire({
        title: 'Purchase Failed',
        text: 'Something went wrong while processing your transaction.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      });
    }
  }

  // ========================================
  // Table Data come here
  // ========================================

  const [selectedPkg, setSelectedPkg] = useState('all');
  const [historyData, setHistoryData] = useState([]);

  const getPurchaseHistory = useStore((state) => state.getPurchaseHistory);
  const packagesTag = ['Starter', 'Silver', 'Gold', 'Platinum', 'Diamond'];




  useEffect(() => {
    const fetchData = async () => {
      const res = await getPurchaseHistory(userAddress);

      const allData = [];

      res.forEach((pkg) => {
        const { pkgName, recievedPkg } = pkg;

        recievedPkg.forEach((entry, index) => {
          allData.push({
            srNo: allData.length + 1,
            package: pkgName,
            index: entry.index?.toString(),
            paymentCount: entry.paymentCount?.toString(),
            isCompleted: entry.isCompleted ? 'Completed' : 'Pending',
            createdAt: new Date(Number(entry.createdAt) * 1000).toLocaleString(),
            completedAt: entry.isCompleted ? new Date(Number(entry.completedAt) * 1000).toLocaleString() : '-',
            paymentInCount: entry.paymentsIn?.length || 0,
            paymentOutCount: entry.paymentsOut?.length || 0,
            txHash: entry.paymentsOut?.[0]?.txHash || '',
          });
        });
      });

      setHistoryData(allData);
    };

    if (userAddress) fetchData();
  }, [userAddress]);


  // Filtered version based on selected package
  const filteredHistory =
    selectedPkg === 'all'
      ? historyData
      : historyData.filter(item => item.package.toLowerCase() === selectedPkg.toLowerCase());


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

  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-admin-cyan dark:text-admin-cyan-dark mb-6">🛒 Purchase Circle</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard label="Wallet Balance" value={isConnected ? `${walletBalance} RAMA` : "Not Connected"} />
          <StatCard label="Current Package" value={activePkg || "N/A"} />
          <StatCard label="Current Rama Price (Dollar)" value={GlobalData ? ("$" + GlobalData?.globalRama?.toString()) : "Loading"} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {packages?.map((pkg, index) => (
            <PackageCard
              key={pkg.packageName}
              name={pkg.packageName}
              usdPrice={pkg.priceInUSD}
              required={parseFloat(pkg.priceInRAMA).toFixed(5)}
              index={index}
              onPurchase={PruchaseNewPkg}
            />
          ))}
        </div>

        <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-admin-new-green/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark">Circle Purchase History</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Package:</label>
              <select
                value={selectedPkg}
                onChange={(e) => setSelectedPkg(e.target.value)}
                className="px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100 border border-admin-new-green rounded-md"
              >
                <option value="all">All Packages</option>
                {packagesTag.map((name) => (
                  <option className='text-black' key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-white/70 dark:bg-gray-800/50">
                <tr>
                  {['Sr. No', 'Package', 'Index', 'Status', 'Created', 'Completed', 'IN', 'OUT'].map((heading, idx) => (
                    <th key={idx} className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item, index) => (
                    <tr key={`pkg-${index}`} className="hover:bg-gray-100/50 dark:hover:bg-gray-800/30">
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{item.srNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{item.package}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{item.index}</td>
                      {/* <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${item.isCompleted === 'Completed'
                          ? 'bg-admin-new-green/20 text-admin-new-green'
                          : 'bg-yellow-400/20 text-yellow-700'
                          }`}>
                          {item.isCompleted}
                        </span>
                      </td> */}

                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full  bg-admin-new-green/20 text-admin-new-green`}>
                          success
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{item.createdAt}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{item.completedAt}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{item.paymentInCount}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{item.paymentOutCount}</td>
                      {/* <td className="px-4 py-3 text-sm">
                        <AddressDisplay value={item.txHash} type="tx" />
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">No history found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Purchase;