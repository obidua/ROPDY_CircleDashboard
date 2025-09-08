import React from 'react';

const MobileHeader = ({ 
  isConnected,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}) => {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-b border-admin-gold-900/50 px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold tracking-wide text-admin-cyan dark:text-admin-cyan-dark">
          ⚡ ROPDY
        </span>
        <div className="flex items-center gap-3">
          {isConnected && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-admin-new-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-admin-new-green"></span>
            </span>
          )}
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

export default MobileHeader;