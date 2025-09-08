import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavigationBar from './TopNavigationBar';
import BlockchainAnimation from './BlockchainAnimation';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Pages that don't use the main layout (home, register, referral, etc.)
  const noLayoutPages = ['/', '/register', '/referral', '/claim-ownership-newUser'];
  const shouldUseLayout = !noLayoutPages.includes(location.pathname);

  if (!shouldUseLayout) {
    return (
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
        <BlockchainAnimation />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
      <BlockchainAnimation />
      <TopNavigationBar />
      
      <div className="flex pt-16">
        <Sidebar 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        
        <main className="flex-1 lg:pl-64 min-h-screen overflow-auto">
          <div className="relative">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-200 dark:bg-black bg-opacity-50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Header for menu toggle */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-b border-admin-gold-900/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold tracking-wide text-admin-cyan dark:text-admin-cyan-dark">
            ⚡ ROPDY
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-2 rounded-lg border border-admin-gold-600/30"
          >
            <span className="text-admin-cyan dark:text-admin-cyan-dark text-xl">
              {isMobileMenuOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;