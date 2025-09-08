import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import MobileHeader from './MobileHeader';
import AddressDisplay from './AddressDisplay';
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import { useStore } from "../Store/UserStore";

const Sidebar = () => {
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [walletAddress, setWalletAddress] = useState();
  const [walletPrompted, setWalletPrompted] = useState(false);
  const [userDisconnected, setUserDisconnected] = useState(false);

  const { address, isConnected } = useAppKitAccount();
  const userAddress = JSON.parse(localStorage.getItem("UserData"))?.address;


  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      setIsActive(true);
    }
  }, [address, isConnected])

  useEffect(() => {
    if (userAddress) {
      setWalletAddress(userAddress);
    }
  }, [userAddress])


  // useEffect(() => {
  //   const checkUserAfterConnect = async () => {
  //     if (walletPrompted && isConnected && address) {
  //       try {
  //         const userData = {
  //           address: address,
  //           data: {}
  //         };

  //         localStorage.setItem("UserData", JSON.stringify(userData));

  //         navigate("/dashboard");
  //       } catch (err) {
  //         console.error("Error checking user:", err);
  //         toast.error("Failed to verify user.");
  //       }
  //     }
  //   };
  //   checkUserAfterConnect();
  // }, [walletPrompted, isConnected, address])


  const isUserExist = useStore((state) => state.isUserExist)

  useEffect(() => {
    const checkUserAfterConnect = async () => {
      if (walletPrompted && isConnected && address) {
        try {

          const isExist = await isUserExist(address);

          if (isExist) {

            console.log("isExist", isExist)
            const userData = {
              address: address,
              data: {}
            };

            localStorage.setItem("UserData", JSON.stringify(userData));
            navigate("/dashboard");
          } else {
            navigate("/register");
          }

        } catch (err) {
          console.error("Error checking user:", err);
          toast.error("Failed to verify user.");
        }
      }
    };
    checkUserAfterConnect();
  }, [walletPrompted, isConnected, address])

  const handleConnect = async () => {
    try {
      await open(); // Always call open first
      setWalletPrompted(true); // Trigger effect to navigate
    } catch (err) {
      console.error("Wallet connect error:", err);
      Swal.fire("Connection Failed", "Could not connect to wallet", "error");
    }
  };


  useEffect(() => {
    if (userDisconnected) {
      setUserDisconnected(false);
      navigate("/");
    }
  }, [userDisconnected, navigate]);

  const handleDisconnect = async () => {
    setIsActive(false);
    localStorage.removeItem("UserData");
    await disconnect();

    setUserDisconnected(true);

  };
  const handleViewLogout = async () => {
    localStorage.removeItem("UserData");

    setUserDisconnected(true);
  }

  const menuSections = [
    {
      title: "Main",
      items: [
        { label: "Dashboard", icon: "⚡", path: "/dashboard" },
        { label: "Overview / Tree", icon: "📈", path: "/overview" },
        { label: "My Direct", icon: "👥", path: "/my-direct" },
      ]
    },
    {
      title: "Programs",
      items: [
        { label: "Circle Program", icon: "🔄", path: "/dashboard" },
        { label: "ROPDY Mint", icon: "🏭", path: "/mint-dashboard" },
      ]
    },
    {
      title: "Circles",
      items: [
        { label: "My Circles", icon: "🔄", path: "/circles" },
        { label: "Purchase Circle", icon: "🛒", path: "/purchase" },
      ]
    },
    {
      title: "Finance",
      items: [
        { label: "Settlements", icon: "📥", path: "/settlements" },
        { label: "Earnings", icon: "💰", path: "/earnings" },
        { label: "CP1 (Direct)", icon: "🧾", path: "/direct-payment" },
        { label: "CP2 (Random)", icon: "🎲", path: "/random-payment" },
        { label: "Missed Payments", icon: "🚫", path: "/missed" },
      ]
    },
    {
      title: "Account",
      items: [
        { label: "Profile", icon: "👤", path: "/profile" },
        // { label: "Support Tickets", icon: "🎟️", path: "/support" },
        // { label: "Claim Ownership", icon: "🔄", path: "/claim-ownership" },
        { label: "Settings", icon: "⚙️", path: "/settings" },
      ]
    },
  ];

  // useEffect(() => {
  //   if (userAddress && address && userAddress !== address) {
  //     handleDisconnect();
  //   }
  // }, [isConnected])

  return (
    <>
      <MobileHeader
        isConnected={isActive}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <aside className={`w-64 h-screen bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 shadow-lg fixed border-r border-admin-gold-900/50 transition-transform duration-300 z-50 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        <div className="p-4 border-b border-admin-gold-900/50 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold tracking-wide text-admin-cyan dark:text-admin-cyan-dark">
              ⚡ ROPDY
            </span>
            {isActive && (address == userAddress) ? (
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-admin-new-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-admin-new-green"></span>
                </span>
                <button
                  onClick={handleDisconnect}
                  className="text-lg text-red-500 hover:text-red-400 transition-colors"
                >
                  ⏻
                </button>
              </div>
            ) : userAddress ? (
              (
                <button
                  onClick={handleViewLogout}
                  className="bg-red-600 text-white px-3 py-1.5 text-sm rounded-lg font-semibold shadow-md hover:bg-red-800/80 transition-colors border border-red-900/30"
                >
                  Logout
                </button>
              )
            ) : (
              (
                <button
                  onClick={handleConnect}
                  className="bg-admin-new-green text-white px-3 py-1.5 text-sm rounded-lg font-semibold shadow-md hover:bg-admin-new-green/80 transition-colors border border-admin-new-green/30"
                >
                  Connect
                </button>
              )
            )}
          </div>

          <div className="mt-2 text-sm">
            <AddressDisplay value={walletAddress} type="address" />
          </div>

        </div>

        <div className="flex-1 overflow-y-auto pb-20">
          <nav className="px-2 py-4">
            {menuSections.map((section) => (
              <div key={section.title} className="mb-4">
                <div className="px-4 py-2 text-sm font-semibold text-admin-cyan dark:text-admin-cyan-dark">
                  {section.title}
                </div>
                {section.items.map(({ label, icon, path }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-2 rounded-lg mb-1 transition-colors ${pathname === path
                      ? "bg-admin-gold-900/50 backdrop-blur-sm text-admin-cyan dark:text-admin-cyan-dark border border-admin-gold-700/50"
                      : "hover:bg-admin-gold-900/30 text-gray-700 dark:text-gray-300 hover:text-admin-cyan dark:hover:text-admin-cyan-dark"
                      }`}
                  >
                    <span className="mr-3 text-lg">{icon}</span>
                    <span className="text-sm">{label}</span>
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-admin-gold-900/50 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex-shrink-0">
          {/* Disconnect Button */}
          <div className="mb-3">
            {isActive && (address == userAddress) ? (
              <button
                onClick={handleDisconnect}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-red-700 transition-colors border border-red-700/30 flex items-center justify-center gap-2"
              >
                <span>⏻</span>
                <span>Disconnect</span>
              </button>
            ) : userAddress ? (
              <button
                onClick={handleViewLogout}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-red-700 transition-colors border border-red-700/30"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleConnect}
                className="w-full bg-admin-new-green text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-admin-new-green/80 transition-colors border border-admin-new-green/30"
              >
                Connect Wallet
              </button>
            )}
          </div>
          
          {/* Version Info */}
          <div className="text-center text-sm text-admin-cyan dark:text-admin-cyan-dark">
          <p>Powered by RAMA</p>
          <p>v1.0 Beta</p>
          </div>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-200 dark:bg-black bg-opacity-50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;