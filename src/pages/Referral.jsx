import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import BlockchainAnimation from "../components/BlockchainAnimation";
import StatCard from "../components/StatCard";
import { useStore } from "../Store/UserStore";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useTransaction } from "../config/register";
import Swal from "sweetalert2";
import { Spinner } from "../utils/helpingAnimation";

const Referral = () => {
  const [countdown, setCountdown] = useState(15);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [sponserAdd, setSponserAdd] = useState("");

  const [trxData, setTrxData] = useState();

  const [loading, setLoading] = useState(false);

  const referralId = searchParams.get("ref") || "Direct";

  const RegisterUser = useStore((state) => state.RegisterUser);

  const { address, isConnected } = useAppKitAccount();

  const { open } = useAppKit();

  const { handleSendTx, hash } = useTransaction(trxData !== null && trxData);

  useEffect(() => {
    if (trxData) {
      try {
        handleSendTx(trxData);
      } catch (error) {
        setLoading(false);
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

      // Start countdown timer
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval); // stop interval earlier
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      // Navigate after 15 seconds
      const timeout = setTimeout(() => {
        navigate("/dashboard");
      }, 15000);

      // Clean up both timers on unmount
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [hash]);

  const handleSubmit = async (e) => {
    try {
      setLoading(true);

      if (!isConnected) {
        await open();
        setLoading(false);
        return;
      }

      if (address && isConnected) {
        const res = await RegisterUser(address, sponserAdd);

        console.log(res);
        setLoading(false);
        setTrxData(res);
      } else {
        setLoading(false);
        alert("Connect yout Wallet First");
      }
    } catch (error) {
      setLoading(false);
    }
  };

  // ====================================================
  //Check User ALready Registerd or not
  // ===================================================

  const [isAlreadyRegUser, setIsAlreadyRegUser] = useState();

  const isUserExist = useStore((state) => state.isUserExist);

  useEffect(() => {
    const fetchUserExist = async () => {
      const res = await isUserExist(address);

      if (res) {
        setIsAlreadyRegUser(res);
      }
    };

    if (isConnected && address) {
      fetchUserExist();
    }
  }, [address]);

  // ====================================================
  //Get the Referral to to Address of user
  // ===================================================

  const getUserAddress = useStore((state) => state.getUserAddress);

  useEffect(() => {
    const fetchSponserAddress = async () => {
      try {
        const number = referralId.replace("ROPDY", "");
        const res = await getUserAddress(number);

        if (res?.toLowerCase().startsWith("0x000000000000000000000000000")) {
          const result = await Swal.fire({
            icon: "error",
            title: "Invalid Referral ID",
            text: "The referral address does not exist or is not registered.",
            confirmButtonColor: "#d33",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showCloseButton: false,
          });

          if (result.isConfirmed) {
            navigate("/"); // Redirect to home on button click
          }

          return;
        }

        setSponserAdd(res);
      } catch (error) {
        console.error("Error fetching sponsor address:", error);
        const result = await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch referral information.",
          confirmButtonColor: "#d33",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showCloseButton: false,
        });

        if (result.isConfirmed) {
          navigate("/");
        }
      }
    };

    fetchSponserAddress();
  }, []);

  // ====================================================
  //Get the Required Rama For Registration
  // ===================================================
  const getReqRamaForReg = useStore((state) => state.getReqRamaForReg);

  const [requiredData, setRequiredData] = useState();

  useEffect(() => {
    const fetchRequiredRama = async () => {
      const res = await getReqRamaForReg(address); // add await
      setRequiredData(res);
    };
    if (address) fetchRequiredRama();
  }, [isConnected]);

  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-6">
        <div className="max-w-4xl mx-auto">
          <div className="w-full flex flex-wrap justify-between items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-admin-cyan dark:text-admin-cyan-dark">
              {isRegistered
                ? "✅ Registration Successful!"
                : "👋 Welcome to ROPDY"}
            </h1>

            {address && (
              <button
                className="bg-gray-800 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-gray-700 transition duration-200 text-sm sm:text-base tracking-wide"
                title={address}
              >
                Connected: {address.slice(0, 6) + "..." + address.slice(-4)}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard
              label="Required RAMA"
              value={requiredData?.packagePriceEth || "Loading..."}
            />
            {address && (
              <StatCard
                label="Available RAMA"
                value={requiredData?.currentBalanceRama || "Loading..."}
              />
            )}
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
                    readOnly
                  />
                </div>

                {isAlreadyRegUser ? (
                  <button
                    type="submit"
                    className="w-full text-white px-6 py-3 rounded-lg font-semibold shadow-md  transition-colors border border-admin-new-green/30"
                  >
                    User Already Registerd
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    className="w-full bg-green-800 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-admin-new-green/80 transition-colors border border-admin-new-green/30"
                  >
                    {loading ? (
                      <Spinner loading={loading} />
                    ) : isConnected ? (
                      "Register"
                    ) : (
                      "Connect Wallet"
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Referral;
