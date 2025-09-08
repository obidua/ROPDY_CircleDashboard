import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import AddressDisplay from './AddressDisplay';
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import { useStore } from "../Store/UserStore";

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { pathname } = useLocation();
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
  }, [address, isConnected]);

  useEffect(() => {
    if (userAddress) {
      setWalletAddress(userAddress);
    }
  }, [userAddress]);


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


  const isUserExist = useStore((state) => state.isUserExist);

  useEffect(() => {
    const checkUserAfterConnect = async () => {
      if (walletPrompted && isConnected && address) {
        try {

          const isExist = await isUserExist(address);

          if (isExist) {

            console.log("isExist", isExist);
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
  }, [walletPrompted, isConnected, address]);

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
  };

  const menuSections = [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", icon: "📊", path: "/overview/dashboard" },
        { label: "Quick Actions", icon: "⚡", path: "/overview/quick-actions" },
        { label: "Announcements", icon: "📢", path: "/overview/announcements" },
      ]
    },
    {
      title: "My Mint",
      items: [
        { label: "Mint Dashboard", icon: "🏭", path: "/mint/dashboard" },
        { label: "Activate Servers", icon: "🚀", path: "/mint/activate-servers" },
        { label: "Portfolios (All Slots)", icon: "💼", path: "/mint/portfolios" },
        { label: "Claims & History", icon: "📋", path: "/mint/claims-history" },
        { label: "Top-up", icon: "⬆️", path: "/mint/top-up" },
        { label: "My Circles", icon: "🔄", path: "/mint/circles" },
      ]
    },
    {
      title: "Passive Income",
      items: [
        { label: "Spot Commission", icon: "💰", path: "/passive/spot-commission" },
        { label: "Daily Growth", icon: "📈", path: "/passive/daily-growth" },
      ]
    },
    {
      title: "Leadership",
      items: [
        { label: "My Rank & Progress", icon: "🏆", path: "/leadership/rank-progress" },
        { label: "GTO Rewards (Claim)", icon: "🎁", path: "/leadership/gto-rewards" },
        { label: "Qualification Tracker", icon: "📊", path: "/leadership/qualification" },
      ]
    },
    {
      title: "Wallet",
      items: [
        { label: "Balances & Allowances", icon: "💳", path: "/wallet/balances" },
        { label: "Deposit / Withdraw", icon: "🔄", path: "/wallet/deposit-withdraw" },
        { label: "Price Feed", icon: "📊", path: "/wallet/price-feed" },
      ]
    },
    {
      title: "Reports",
      items: [
        { label: "Earnings Report", icon: "📈", path: "/reports/earnings" },
        { label: "Team Business", icon: "👥", path: "/reports/team-business" },
        { label: "Export CSV", icon: "📄", path: "/reports/export" },
      ]
    },
    {
      title: "Contracts",
      items: [
        { label: "Addresses & ABIs", icon: "🔗", path: "/contracts/addresses" },
        { label: "Server Parameters", icon: "⚙️", path: "/contracts/parameters" },
        { label: "Event Logs", icon: "📝", path: "/contracts/events" },
      ]
    },
    {
      title: "Support",
      items: [
        { label: "Create Ticket", icon: "🎫", path: "/support/create" },
        { label: "My Tickets", icon: "📋", path: "/support/tickets" },
        { label: "FAQs & Docs", icon: "📚", path: "/support/docs" },
      ]
    },
    {
      title: "Settings",
      items: [
        { label: "Profile", icon: "👤", path: "/settings/profile" },
        { label: "Notifications", icon: "🔔", path: "/settings/notifications" },
        { label: "Security (2FA/KYC)", icon: "🔒", path: "/settings/security" },
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
    <aside className={`w-64 h-screen bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 shadow-lg fixed border-r border-admin-gold-900/50 transition-transform duration-300 z-50 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
      <div className="p-4 border-b border-admin-gold-900/50 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center justify-center">
          <span className="text-xl font-bold tracking-wide text-admin-cyan dark:text-admin-cyan-dark">
            ⚡ ROPDY MINT
          </span>
        </div>

        <div className="mt-2 text-sm">
          <AddressDisplay value={walletAddress} type="address" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
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
                  onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
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
        {/* Connection Status */}
        <div className="mb-3">
          {isActive && (address == userAddress) ? (
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-admin-new-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-admin-new-green"></span>
              </span>
              <span className="text-sm text-admin-new-green font-medium">Wallet Connected</span>
            </div>
          ) : userAddress ? (
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2 bg-yellow-500 rounded-full"></span>
              <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">View Mode</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2 bg-red-500 rounded-full"></span>
              <span className="text-sm text-red-600 dark:text-red-400 font-medium">Not Connected</span>
            </div>
          )}
        </div>

        {/* Action Button */}
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
              Exit View Mode
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
          <p>ROPDY Mint Platform</p>
          <p>v2.0 Beta</p>
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