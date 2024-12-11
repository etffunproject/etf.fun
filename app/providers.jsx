"use client";

import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

// Default styles for wallet adapter UI
import '@solana/wallet-adapter-react-ui/styles.css';

export function Providers({ children }) {
  // Use mainnet or devnet as needed. For simplicity, mainnet:
  const network = 'https://api.mainnet-beta.solana.com';
  const endpoint = network;

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
