import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';
import { useStore } from '../Store/UserStore';

const Cp2 = () => {
    const [modData, setModData] = useState(null);
    const [activeTab, setActiveTab] = useState("MOD4");
    const [loading, setLoading] = useState(true);

    const Package = ["Starter", "Silver", "Gold", "Diamond", "Platinum"];

    const cp2Earning = useStore((state) => state.cp2Earning);
    const userAddress = JSON.parse(localStorage.getItem("UserData") || '{}')?.address;

    useEffect(() => {
        const fetchModData = async () => {
            if (!userAddress) return;
            try {
                const res = await cp2Earning(userAddress);
                setModData(res);
            } catch (err) {
                console.error("Error fetching cp2Earning:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchModData();
    }, [userAddress]);

    const renderPoolStatus = () => {
        const poolData = modData?.isInMod4Pool || [];

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {Package.map((pkg, i) => (
                    <StatCard
                        key={`pool-${pkg}`}
                        label={`Current Pool ${pkg}`}
                        value={poolData[i] ? "In Pool" : "Not In Pool"}
                    />
                ))}
            </div>
        );
    };

    const renderEarnings = (type) => {
        const dataMap = {
            MOD1: modData?.data?.MOD1 || [],
            MOD2: modData?.data?.MOD2 || [],
            MOD4: modData?.data?.MOD4 || [],
        };

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Package.map((pkg, i) => (
                    <StatCard
                        key={`${type}-${pkg}`}
                        label={pkg}
                        value={`${parseFloat(dataMap[type][i] || 0).toFixed(5)} RAMA`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="relative min-h-screen">
            <BlockchainAnimation />
            <div className="relative p-6">
                <h1 className="text-2xl font-bold text-admin-cyan dark:text-admin-cyan-dark mb-6">
                    ♻️ CP2 (Earnings Overview)
                </h1>

                {loading ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">Loading data...</p>
                ) : (
                    <>
                        {renderPoolStatus()}

                        <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-admin-new-green/30">
                            <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">
                                Income
                            </h2>

                            <div className="flex gap-4 mb-6">
                                {["MOD1", "MOD2", "MOD4"].map((tab) => (
                                    <button
                                        key={tab}
                                        className={`px-4 py-2 rounded-lg font-semibold border ${activeTab === tab
                                            ? "bg-green-800 text-white"
                                            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-400 dark:border-gray-600"
                                            }`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab} Income
                                    </button>
                                ))}
                            </div>

                            {renderEarnings(activeTab)}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cp2;
