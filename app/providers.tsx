"use client";

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import {
  baseSepolia, // <--- CHANGED FROM 'base' TO 'baseSepolia'
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http } from 'wagmi';
import '@rainbow-me/rainbowkit/styles.css';

/* --- 1. SETUP WAGMI CONFIG --- */
const config = getDefaultConfig({
  appName: 'SwagClub',
  projectId: '62b7b18115e2cf405a22952b2ae49e3b', // Replace with a real ID from cloud.walletconnect.com if needed
  chains: [baseSepolia], // <--- CHANGED
  transports: {
    [baseSepolia.id]: http(), // <--- CHANGED
  },
  ssr: true, 
});

/* --- 2. SETUP QUERY CLIENT --- */
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          initialChain={baseSepolia} // <--- Forces connection to Testnet
          theme={darkTheme({
            accentColor: '#2DD4BF', // Teal
            accentColorForeground: 'black',
            borderRadius: 'large',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}