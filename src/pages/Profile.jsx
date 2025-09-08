import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import BlockchainAnimation from '../components/BlockchainAnimation';
import AddressDisplay from '../components/AddressDisplay';
import { useStore } from '../Store/UserStore';

const Profile = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const userAddress = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("UserData") || '{}')?.address || '';
    } catch {
      return '';
    }
  }, []);

  const getProfileDetails = useStore((state) => state.getProfileDetails);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      if (!userAddress) return;
      try {
        const res = await getProfileDetails(userAddress);
        setProfileData(res);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfileDetails();
  }, [userAddress, getProfileDetails]);

  const referralLink = profileData?.userId
    ? `${window.location.origin}/referral?ref=ROPDY${profileData.userId}`
    : '';

  const handleCopyLink = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShareLink = async () => {
    if (!referralLink) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join ROPDY with me!',
          text: 'Check out this amazing opportunity on ROPDY.',
          url: referralLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Sharing not supported on this device. Please use the "Copy Link" button instead.');
    }
  };

  return (
    <div className="relative min-h-screen">
      <BlockchainAnimation />
      <div className="relative p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-admin-cyan dark:text-admin-cyan-dark mb-6">👤 Profile</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm p-5 rounded-lg shadow-lg border border-admin-new-green/30 hover:border-admin-new-green hover:shadow-xl hover:shadow-admin-new-green/20 transition-all duration-300">
            <h3 className="text-base text-admin-cyan dark:text-admin-cyan-dark">Wallet Address</h3>
            <div className="mt-2">
              <AddressDisplay value={userAddress} type="address" />
            </div>
          </div>
          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm p-5 rounded-lg shadow-lg border border-admin-new-green/30 hover:border-admin-new-green hover:shadow-xl hover:shadow-admin-new-green/20 transition-all duration-300">
            <h3 className="text-base text-admin-cyan dark:text-admin-cyan-dark">Sponsor Address</h3>
            <div className="mt-2">
              <AddressDisplay value={profileData?.sponserAdd || 'N/A'} type="address" />
            </div>
          </div>
          <StatCard label="Membership Tier" value={profileData?.memberTier || 'N/A'} />
        </div>

        <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-admin-new-green/30 mb-8">
          <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">🔗 Your Referral Link</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={referralLink || 'Loading...'}
              readOnly
              className="flex-1 px-4 py-2 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-green-800 text-white rounded-lg font-semibold hover:bg-admin-new-green/80 transition-colors border border-admin-new-green/30 min-w-[100px]"
              >
                {copied ? '✓ Copied!' : 'Copy Link'}
              </button>
              <button
                onClick={handleShareLink}
                className="px-4 py-2 bg-admin-cyan dark:bg-cyan-800 text-white rounded-lg font-semibold hover:opacity-80 transition-opacity"
              >
                Share
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-admin-new-green/30">
          <h2 className="text-xl font-semibold text-admin-cyan dark:text-admin-cyan-dark mb-4">Account Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard label="Total Earnings" value={`${profileData?.TotalEarning || 0} RAMA`} />
            <StatCard label="Referral Count" value={profileData?.RefferalCount || 0} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
