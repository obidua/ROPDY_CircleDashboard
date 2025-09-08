import React, { useState } from 'react';
import BlockchainAnimation from '../components/BlockchainAnimation';
import AddressDisplay from '../components/AddressDisplay';
import { mockAddresses } from '../utils/mockData';

const InstructionsBlock = () => (
  <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-admin-gold-600/30 mb-8">
    <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">
      Welcome Back, ROPDY User!
    </h2>
    <p className="text-gray-700 dark:text-gray-300">
      If you've migrated from an older wallet or your data was imported during the transition, 
      enter your old wallet address and the PIN provided by admin to reclaim your position, 
      earnings, and circles.
    </p>
  </div>
);

const MigrationSummary = ({ oldWallet, newWallet }) => (
  <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-admin-new-green/30 mt-8">
    <h3 className="text-lg font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Migration Summary</h3>
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Old Wallet</p>
        <AddressDisplay value={oldWallet} type="address" />
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">New Wallet</p>
        <AddressDisplay value={newWallet} type="address" />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex items-center gap-2">
          <span className="text-admin-new-green">✓</span>
          <span className="text-gray-700 dark:text-gray-300">Verified PIN</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-admin-new-green">✓</span>
          <span className="text-gray-700 dark:text-gray-300">Circles Migrated</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-admin-new-green">✓</span>
          <span className="text-gray-700 dark:text-gray-300">Earnings Migrated</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-admin-new-green">✓</span>
          <span className="text-gray-700 dark:text-gray-300">MOD4 Pool Entry</span>
        </div>
      </div>
    </div>
  </div>
);

const ClaimOwnership = () => {
  const [step, setStep] = useState(1);
  const [claimStatus, setClaimStatus] = useState('initial'); // initial, pending, verified, failed
  const [formData, setFormData] = useState({
    oldWalletAddress: '',
    pin: '',
    newWalletAddress: mockAddresses.wallet // Simulated connected wallet
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setClaimStatus('pending');
    
    // Simulate verification delay
    setTimeout(() => {
      setClaimStatus('verified');
      setStep(2);
    }, 1500);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setClaimStatus('pending');
    
    // Simulate migration delay
    setTimeout(() => {
      setClaimStatus('migrated');
    }, 2000);
  };

  const renderStepOne = () => (
    <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-admin-new-green/30">
      <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-6">Step 1: Verify Ownership</h2>
      
      <form onSubmit={handleInitialSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Old Wallet Address
          </label>
          <input
            type="text"
            name="oldWalletAddress"
            value={formData.oldWalletAddress}
            onChange={handleInputChange}
            placeholder="Enter your old wallet address"
            required
            className="w-full px-3 py-2 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            PIN Code
          </label>
          <input
            type="password"
            name="pin"
            value={formData.pin}
            onChange={handleInputChange}
            placeholder="Enter your secure PIN"
            required
            minLength={4}
            className="w-full px-3 py-2 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={claimStatus === 'pending'}
          className="w-full bg-admin-new-green text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-admin-new-green/80 transition-colors border border-admin-new-green/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {claimStatus === 'pending' ? 'Verifying...' : 'Submit Claim'}
        </button>
      </form>
    </div>
  );

  const renderStepTwo = () => (
    <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-admin-new-green/30">
      <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-6">
        🔐 Finalize Your Claim — Verify with PIN
      </h2>
      
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        You've successfully verified your old wallet. Now, connect your new wallet and re-enter your secure PIN to finalize the migration.
      </p>

      <div className="bg-admin-new-green/10 border border-admin-new-green/30 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-admin-new-green mb-2">This will permanently move your:</h3>
        <ul className="list-none space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-center gap-2">✅ User ID</li>
          <li className="flex items-center gap-2">✅ Circles & Positions</li>
          <li className="flex items-center gap-2">✅ Earnings</li>
          <li className="flex items-center gap-2">✅ Referral Team</li>
        </ul>
      </div>

      <form onSubmit={handleFinalSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            New Wallet Address
          </label>
          <div className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md">
            <AddressDisplay value={formData.newWalletAddress} type="address" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Re-enter PIN
          </label>
          <input
            type="password"
            name="pin"
            value={formData.pin}
            onChange={handleInputChange}
            placeholder="Enter the same PIN"
            required
            minLength={4}
            className="w-full px-3 py-2 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={claimStatus === 'pending'}
          className="w-full bg-admin-new-green text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-admin-new-green/80 transition-colors border border-admin-new-green/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {claimStatus === 'pending' ? 'Migrating Data...' : '🔄 Migrate Data to New Wallet'}
        </button>
      </form>
    </div>
  );

  const renderSuccess = () => (
    <>
      <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-admin-new-green/30 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">
          Congratulations!
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Your ROPDY profile, earnings, and referral network have been migrated successfully to your new wallet.
        </p>
        <p className="text-admin-new-green">
          You may now access the full dashboard and continue your journey.
        </p>
      </div>

      <MigrationSummary 
        oldWallet={formData.oldWalletAddress}
        newWallet={formData.newWalletAddress}
      />
    </>
  );

  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-admin-cyan dark:text-admin-cyan-dark mb-6">
          🔄 Claim Ownership
        </h1>

        <div className="max-w-2xl mx-auto">
          <InstructionsBlock />
          
          {claimStatus === 'migrated' 
            ? renderSuccess()
            : step === 1 
              ? renderStepOne() 
              : renderStepTwo()
          }

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ⚠️ Entered wrong PIN or wallet? 
              <button className="text-admin-new-green hover:text-admin-new-green/80 transition-colors ml-2">
                Submit a ticket
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimOwnership;