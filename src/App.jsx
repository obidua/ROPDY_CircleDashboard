import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './contexts/ThemeContext';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { projectId, metadata, networks, wagmiAdapter } from './config'
import { createAppKit } from '@reown/appkit/react'

import { WagmiProvider } from 'wagmi'

const App = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isRegister = location.pathname === '/register';
  const isreferral = location.pathname === '/referral';
  const ClaimOwnerNewUser = location.pathname === '/claim-ownership-newUser';




  const queryClient = new QueryClient()

  const generalConfig = {
    projectId,
    networks,
    metadata,
    themeMode: 'light',
    themeVariables: {
      '--w3m-accent': '#000000',
    }
  }

  // Create modal
  createAppKit({
    adapters: [wagmiAdapter],
    ...generalConfig,
    features: {
      analytics: true // Optional - defaults to your Cloud configuration
    }
  })

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {isHome || isRegister || ClaimOwnerNewUser || isreferral ? (
            // Home page: no sidebar layout
            <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
              <AppRoutes />
            </div>
          ) : (
            // Other pages: sidebar layout
            <div className="flex min-h-screen bg-white dark:bg-black transition-colors duration-200">
              <Sidebar />
              <main className="flex-1 lg:pl-64 min-h-screen overflow-auto pt-16 lg:pt-0">
                <AppRoutes />
              </main>
            </div>
          )}
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
