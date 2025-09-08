import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import MintDashboard from '../pages/MintDashboard';
import Portfolios from '../pages/Portfolios';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Referral from '../pages/Referral';
import ClaimOwnership from '../pages/ClaimOwnership';

// Placeholder components for new routes
const PlaceholderPage = ({ title, description }) => (
  <div className="relative p-4 sm:p-6">
    <h1 className="text-2xl font-bold text-admin-cyan dark:text-admin-cyan-dark mb-6">{title}</h1>
    <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-admin-new-green/30">
      <p className="text-gray-700 dark:text-gray-300">{description}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        This page is under development and will be available soon.
      </p>
    </div>
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes (no layout) */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/referral" element={<Referral />} />
      <Route path="/claim-ownership-newUser" element={<ClaimOwnership />} />

      {/* Overview routes */}
      <Route path="/overview/dashboard" element={<Dashboard />} />
      <Route path="/overview/quick-actions" element={<PlaceholderPage title="⚡ Quick Actions" description="Access frequently used actions and shortcuts for your ROPDY Mint account." />} />
      <Route path="/overview/announcements" element={<PlaceholderPage title="📢 Announcements" description="Stay updated with the latest news and announcements from ROPDY." />} />

      {/* My Mint routes */}
      <Route path="/mint/activate-servers" element={<MintDashboard />} />
      <Route path="/mint/portfolios" element={<Portfolios />} />
      <Route path="/mint/claims-history" element={<PlaceholderPage title="📋 Claims & History" description="Track your ROI claims and view detailed transaction history." />} />
      <Route path="/mint/top-up" element={<PlaceholderPage title="⬆️ Top-up" description="Top-up your portfolios when you reach the 3x cap limit." />} />

      {/* Passive Income routes */}
      <Route path="/passive/spot-commission" element={<PlaceholderPage title="💰 Spot Commission" description="View your spot commission earnings from direct referrals." />} />
      <Route path="/passive/daily-growth" element={<PlaceholderPage title="📈 Daily Growth" description="Track your daily growth income from the pool distribution." />} />

      {/* Leadership routes */}
      <Route path="/leadership/rank-progress" element={<PlaceholderPage title="🏆 My Rank & Progress" description="Monitor your leadership tier progress and qualification status." />} />
      <Route path="/leadership/gto-rewards" element={<PlaceholderPage title="🎁 GTO Rewards (Claim)" description="Claim your Global Turnover (GTO) leadership rewards." />} />
      <Route path="/leadership/qualification" element={<PlaceholderPage title="📊 Qualification Tracker" description="Track your progress towards leadership tier qualifications." />} />

      {/* Wallet routes */}
      <Route path="/wallet/balances" element={<PlaceholderPage title="💳 Balances & Allowances" description="View your RAMA balance and contract allowances." />} />
      <Route path="/wallet/deposit-withdraw" element={<PlaceholderPage title="🔄 Deposit / Withdraw" description="Manage your RAMA deposits and withdrawals." />} />
      <Route path="/wallet/price-feed" element={<PlaceholderPage title="📊 Price Feed" description="View current RAMA to USD exchange rates and oracle information." />} />

      {/* Reports routes */}
      <Route path="/reports/earnings" element={<PlaceholderPage title="📈 Earnings Report" description="Generate detailed reports of your earnings across all income streams." />} />
      <Route path="/reports/team-business" element={<PlaceholderPage title="👥 Team Business" description="Analyze your team's business volume and growth metrics." />} />
      <Route path="/reports/export" element={<PlaceholderPage title="📄 Export CSV" description="Export your data in CSV format for external analysis." />} />

      {/* Contracts routes */}
      <Route path="/contracts/addresses" element={<PlaceholderPage title="🔗 Addresses & ABIs" description="View contract addresses and ABI information." />} />
      <Route path="/contracts/parameters" element={<PlaceholderPage title="⚙️ Server Parameters" description="View server configurations and system parameters." />} />
      <Route path="/contracts/events" element={<PlaceholderPage title="📝 Event Logs" description="Browse blockchain event logs and transaction history." />} />

      {/* Support routes */}
      <Route path="/support/create" element={<PlaceholderPage title="🎫 Create Ticket" description="Create a new support ticket for assistance." />} />
      <Route path="/support/tickets" element={<PlaceholderPage title="📋 My Tickets" description="View and manage your support tickets." />} />
      <Route path="/support/docs" element={<PlaceholderPage title="📚 FAQs & Docs" description="Access frequently asked questions and documentation." />} />

      {/* Settings routes */}
      <Route path="/settings/profile" element={<PlaceholderPage title="👤 Profile" description="Manage your profile information and preferences." />} />
      <Route path="/settings/notifications" element={<PlaceholderPage title="🔔 Notifications" description="Configure your notification preferences." />} />
      <Route path="/settings/security" element={<PlaceholderPage title="🔒 Security (2FA/KYC)" description="Manage your security settings including 2FA and KYC verification." />} />

      {/* Legacy routes for backward compatibility */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/mint-dashboard" element={<MintDashboard />} />
    </Routes>
  );
}

export default AppRoutes;