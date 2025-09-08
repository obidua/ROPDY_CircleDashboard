import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlockchainAnimation from '../components/BlockchainAnimation';

import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import { useStore } from "../Store/UserStore";
import Swal from 'sweetalert2';
import { Spinner } from '../utils/helpingAnimation';

const Home = () => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [inputId, setInputId] = useState("");

    const navigate = useNavigate();

    const { address, isConnected } = useAppKitAccount();
    const [walletPrompted, setWalletPrompted] = useState(false);
    const checkUserById = useStore((state) => state.checkUserById);

    const [loading, setLoading] = useState(false)


    const { open } = useAppKit();
    const { disconnect } = useDisconnect();

    const handleDisconnect = async () => {
        try {
            localStorage.removeItem("UserData");

            await disconnect(); // assume this is your wallet disconnect function


            navigate('/'); // optional: redirect to home after disconnect
        } catch (error) {
            console.error("❌ Error disconnecting wallet:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to disconnect. Please try again.',
                confirmButtonColor: '#d33',
            });
        }
    };

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


    const handleUserIdClick = async () => {
        setLoading(true)

        handleDisconnect();

        if (!inputId || isNaN(inputId)) {
            Swal.fire({
                icon: "warning",
                title: "Invalid ID",
                text: "Please enter a valid numeric User ID."
            });
            setLoading(false)
            return;
        }

        const userAddress = await checkUserById(inputId);

        if (userAddress.startsWith("0x000000000000000000")) {
            Swal.fire({
                icon: "error",
                title: "<strong class='text-lg'>Wallet Error</strong>",
                html: "<p class='text-sm text-white/80'>Not a valid ID. Please try again.</p>",
                footer: '<a href="#" class="text-gray-400 hover:text-white hover:underline text-xs">Why do I have this issue?</a>',
                background: "rgba(30, 41, 59)", // semi-transparent for glass feel
                color: "#ffffff",
                confirmButtonText: "Okay",
                showClass: {
                    popup: "animate__animated animate__fadeInDown"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp"
                },
                customClass: {
                    popup: "glass-swal-popup",
                    title: "glass-swal-title",
                    confirmButton: "glass-swal-button"
                },
                width: "420px"
            });
            setLoading(false)
            return;
        }

        // Create structured object
        const userData = {
            address: userAddress,
            data: {}
        };

        localStorage.setItem("UserData", JSON.stringify(userData));

        setLoading(false)
        navigate("/dashboard")

    }


    const handleConnect = async () => {

        setIsConnecting(true);
        // Simulate wallet connection
        setTimeout(() => {
            setIsConnecting(false);
        }, 3500);

        try {
            if (isConnected) {
                setWalletPrompted(true); // Trigger effect to navigate
            } else {
                await open(); // Always call open first
                setWalletPrompted(true); // Trigger effect to navigate
            }
        } catch (err) {
            console.error("Wallet connect error:", err);
            Swal.fire("Connection Failed", "Could not connect to wallet", "error");
        } finally {
            setIsConnecting(false);
        }
    }


    return (
        <div className="relative min-h-screen">
            <BlockchainAnimation />
            <div className="relative p-4 sm:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl font-bold text-admin-cyan dark:text-admin-cyan-dark mb-4 text-center">
                        Welcome to ROPDY — Choose Your Access Mode
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
                        Your Gateway to Decentralized Earnings
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Authorized Access */}
                        <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-admin-new-green/30 hover:border-admin-new-green transition-colors">
                            <div className="text-center mb-6">
                                <div className="text-4xl mb-4">🦊</div>
                                <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-2">
                                    Authorized User Login
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Connect your Web3 wallet (e.g., MetaMask) to securely log into ROPDY.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-transparent rounded-lg p-4 border border-admin-new-green/30">
                                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                        <li className="flex items-center gap-2">
                                            <span className="text-admin-new-green">✓</span>
                                            Access your personal dashboard
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-admin-new-green">✓</span>
                                            Manage your circles and earnings
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-admin-new-green">✓</span>
                                            Full platform functionality
                                        </li>
                                    </ul>
                                </div>

                                <button
                                    onClick={handleConnect}
                                    disabled={isConnecting}
                                    className="w-full bg-green-800 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-admin-new-green/80 transition-colors border border-admin-new-green/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isConnecting ? <Spinner /> : '🔌 Connect Wallet to Continue'}
                                </button>
                            </div>
                        </div>

                        {/* View Mode */}
                        <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-admin-gold-600/30 hover:border-admin-gold-400 transition-colors">
                            <div className="text-center mb-6">
                                <div className="text-4xl mb-4">👁️</div>
                                <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-2">
                                    View Dashboard by User ID
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Just want to explore? Enter any valid ROPDY User ID to view that user's public dashboard.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-transparent rounded-lg p-4 border border-admin-cyan/30 dark:border-admin-cyan-dark/30">
                                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                        <li className="flex items-center gap-2">
                                            <span className="text-admin-cyan dark:text-admin-cyan-dark">👀</span>
                                            View current package
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-admin-cyan dark:text-admin-cyan-dark">👀</span>
                                            Check circles status
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-admin-cyan dark:text-admin-cyan-dark">👀</span>
                                            See MOD4 Pool status
                                        </li>
                                    </ul>
                                </div>

                                <input
                                    type="text"
                                    value={inputId}
                                    onChange={(e) => setInputId(e.target.value)}
                                    placeholder="Enter ROPDY User ID"
                                    className="w-full px-4 py-2 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100"
                                    required
                                />

                                <button
                                    onClick={handleUserIdClick}
                                    type="submit"
                                    className="w-full bg-admin-cyan dark:bg-cyan-800 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:opacity-80 transition-opacity"
                                >
                                    {loading ? <Spinner /> : "🔍 View Dashboard"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;