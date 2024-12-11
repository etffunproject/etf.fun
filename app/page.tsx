"use client";

import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';

export default function HomePage() {
  const { connected } = useWallet();

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold mt-10">Welcome to etf.fun</h1>
      <p className="text-textSecondary">
        etf.fun is a platform where you can create and explore multi-token portfolios on the Solana blockchain.
        Connect your wallet, build a portfolio, and browse what others have created. 
        Our system ensures anonymity for your personal wallet, while still allowing you to benefit from fees and participate in a thriving ecosystem.
      </p>
      <p className="text-textSecondary">
        Get started by connecting your wallet, creating a portfolio, or exploring the existing ports to find interesting token bundles.
      </p>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-center mt-8">
        <Link href="/create-portfolio" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
          Create Portfolio
        </Link>
        <Link href="/ports" className="bg-gray-200 text-textPrimary px-4 py-2 rounded hover:bg-gray-300 transition-colors">
          Browse Ports
        </Link>
        <Link href="/profile" className="bg-gray-200 text-textPrimary px-4 py-2 rounded hover:bg-gray-300 transition-colors">
          {connected ? 'View Profile' : 'Connect Wallet'}
        </Link>
      </div>
    </div>
  );
}
