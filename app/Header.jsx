// @ts-nocheck
"use client";

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import WalletMultiButton to prevent SSR-related hydration issues.
const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function Header() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="w-full bg-surface border-b border-gray-200">
      <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold hover:text-accent">
          etf.fun
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/create-portfolio" className="hover:text-accent">Create Portfolio</Link>
            <Link href="/ports" className="hover:text-accent">Ports</Link>
            <Link href="/profile" className="hover:text-accent">Profile</Link>
          </div>
          <div className="hidden md:block">
            {/* Dynamically loaded WalletMultiButton */}
            <WalletMultiButton className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors text-sm" />
          </div>
          <button
            className="md:hidden bg-gray-200 p-2 rounded"
            onClick={() => setNavOpen(!navOpen)}
          >
            {navOpen ? 'X' : '☰'}
          </button>
        </div>
      </div>
      {navOpen && (
        <div className="md:hidden bg-surface border-t border-gray-200 p-4 space-y-4 text-sm font-medium">
          <Link href="/create-portfolio" className="block hover:text-accent" onClick={() => setNavOpen(false)}>Create Portfolio</Link>
          <Link href="/ports" className="block hover:text-accent" onClick={() => setNavOpen(false)}>Ports</Link>
          <Link href="/profile" className="block hover:text-accent" onClick={() => setNavOpen(false)}>Profile</Link>
          <WalletMultiButton className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors text-sm" />
        </div>
      )}
    </header>
  );
}
