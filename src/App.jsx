import React from 'react';
import AppLayout from './components/AppLayout';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './contexts/ThemeContext';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { projectId, metadata, networks, wagmiAdapter } from './config'
import { createAppKit } from '@reown/appkit/react'

import { WagmiProvider } from 'wagmi'

const App = () => {
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
          <AppLayout>
            <AppRoutes />
          </AppLayout>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
