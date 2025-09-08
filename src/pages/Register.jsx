import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import BlockchainAnimation from "../components/BlockchainAnimation";
import StatCard from "../components/StatCard";
import { useStore } from "../Store/UserStore";
import { useAppKitAccount, useDisconnect } from "@reown/appkit/react";
import { useTransaction } from "../config/register";
import Swal from "sweetalert2";
import { Spinner } from "../utils/helpingAnimation";

const Register = () => {
  const [countdown, setCountdown] = useState(15);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [sponserAdd, setSponserAdd] = useState("");
  const [loading, setLoading] = useState();

  const [trxData, setTrxData] = useState();

  const referralId = searchParams.get("ref") || "Direct";

  const RegisterUser = useStore((state) => state.RegisterUser);

  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();

  const [Validate, setValidate] = useState(false);

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
      const userData = {
        address: address,
        data: {},
      };

      localStorage.setItem("UserData", JSON.stringify(userData));
      setLoading(false);
      setIsRegistered(true);

      // Countdown logic
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval); // stop interval earlier
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Redirect after 15 seconds
      const timeout = setTimeout(() => {
        navigate("/dashboard");
      }, 15000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [hash]);

  const handleConnect = async () => {
    try {
      setLoading(true);

      if (address && isConnected) {
        const res = await RegisterUser(address, sponserAdd);

        console.log(res);

        setTrxData(res);
      } else {
        setLoading(false);
        alert("Connect your Wallet First");
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const CondUserIdAddres = useStore((state) => state.CondUserIdAddres);

  const [showAddId, setShowAddId] = useState();
  const [message, setMessage] = useState("");

  const ValidateSponser = async () => {
    try {
      setMessage("");
      setLoading(true);
      if (!sponserAdd) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please Enter the Sponser Address or Id",
          confirmButtonColor: "#d33",
        });
        setLoading(false);
        return;
      }
      const response = await CondUserIdAddres(sponserAdd);

      console.log(response);
      if (
        !response ||
        response?.data === "0x0000000000000000000000000000000000000000"
      ) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: '"Sponsor address does not exist".',
          confirmButtonColor: "#d33",
        });
        setLoading(false);
        return;
      }
      console.log(response);
      setShowAddId(response);
      setLoading(false);
      setValidate(true);
    } catch (error) {
      setLoading(false);
      setMessage("User Not Registerd");
      console.log(error);
    }
  };

  const [userDisconnected, setUserDisconnected] = useState(false);
  useEffect(() => {
    if (userDisconnected) {
      setUserDisconnected(false);
      navigate("/");
    }
  }, [userDisconnected, navigate]);

  const handleViewLogout = async () => {
    await disconnect();

    setUserDisconnected(true);
  };

  // ====================================================
  //Get the Required Rama For Registration
  // ===================================================
  const getReqRamaForReg = useStore((state) => state.getReqRamaForReg);

  const [requiredData, setRequiredData] = useState();

  useEffect(() => {
    const fetchRequiredRama = async () => {
      if (address && isConnected) {
        const res = await getReqRamaForReg(address);
        setRequiredData(res);
      }
    };

    fetchRequiredRama();
  }, [address, isConnected]);

  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between my-5 relative">
            <div>
              <h1 className="text-2xl font-bold text-admin-cyan dark:text-admin-cyan-dark mb-6">
                {isRegistered
                  ? "✅ Registration Successful!"
                  : "👋 Welcome to ROPDY"}
              </h1>
              {address && (
                <p className="p-2 border border-green-700 rounded text-sm sm:text-base text-gray-200 font-medium">
                 <span className="bg-green-600 p-1 rounded-xl"> Connected</span>
                 {"  "}
                  <span className="font-mono">
                    {address.slice(0, 6)}...{address.slice(-6)}
                  </span>
                </p>
              )}
            </div>

            <div>
              <div className="absolute top-4 right-4 z-50">
                <button
                  onClick={handleViewLogout}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-md transition duration-200 border border-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                  title="Disconnect Wallet"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard
              label="Required RAMA"
              value={requiredData?.packagePriceEth || "Loading..."}
            />
            <StatCard
              label="Available RAMA"
              value={requiredData?.currentBalanceRama || "Loading..."}
            />
            <StatCard label="Referral ID" value={referralId} />
          </div>

          {isRegistered ? (
            <div className="flex flex-col bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-admin-new-green/30 text-center">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                ✅ Registration successful! Redirecting to dashboard in{" "}
                <span className="font-semibold text-admin-new-green">
                  {countdown}
                </span>{" "}
                seconds...
              </p>

              <a
                href={`https://ramascan.com/tx/${hash}`}
                target="_blank"
                className="text-lg text-blue-700  mb-4"
              >
                View on RamaScan
              </a>
              <Link
                to="/dashboard"
                className="text-admin-new-green hover:text-admin-new-green/80 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-admin-new-green/30">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark">
                  Register Account
                </h2>
                <Link
                  to="/claim-ownership-newUser"
                  className="text-admin-new-green hover:text-admin-new-green/80 transition-colors"
                >
                  {/* Claim OwnerShip */}
                </Link>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sponser Wallet Address
                  </label>
                  <input
                    type="text"
                    name="walletAddress"
                    value={sponserAdd || ""} // extra safe fallback
                    onChange={(e) => setSponserAdd(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
                    placeholder="Enter Sponser Address or ID"
                    disabled={Validate || isRegistered}
                  />
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4">
                    {Validate && `${showAddId?.tagName}: ${showAddId?.data}`}
                    {message && message}
                  </label>
                </div>

                <button
                  onClick={Validate ? handleConnect : ValidateSponser}
                  type="submit"
                  className="w-full bg-green-800 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-admin-new-green/80 transition-colors border border-admin-new-green/30"
                >
                  {loading ? (
                    <Spinner loading={loading} />
                  ) : Validate ? (
                    "Register"
                  ) : (
                    "Validate Sponser"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
