"use client";
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { createPortfolio } from '../../lib/db';
import { useRouter } from 'next/navigation';

export default function CreatePortfolioPage() {
  const { publicKey, connected } = useWallet();
  const [tokenAddresses, setTokenAddresses] = useState(['', '']);
  const router = useRouter();

  if (!connected) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Create a Portfolio</h2>
        <p>Please connect your wallet before creating a portfolio.</p>
      </div>
    );
  }

  const creatorAddress = publicKey.toBase58();

  const handleTokenAddressChange = (index, value) => {
    const updated = [...tokenAddresses];
    updated[index] = value;
    setTokenAddresses(updated);
  };

  const addTokenField = () => {
    if (tokenAddresses.length < 10) {
      setTokenAddresses([...tokenAddresses, '']);
    }
  };

  const removeTokenField = (index) => {
    if (tokenAddresses.length > 2) {
      const updated = [...tokenAddresses];
      updated.splice(index, 1);
      setTokenAddresses(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalTokens = tokenAddresses.filter(addr => addr.trim() !== '');
    if (finalTokens.length < 2) {
      alert('Please provide at least two token addresses.');
      return;
    }

    const newPortfolio = createPortfolio(creatorAddress, finalTokens);
    alert(`Portfolio created with ID: ${newPortfolio.id}`);
    router.push('/profile');
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create a Portfolio</h2>
      <p className="mb-4 text-gray-600">Enter 2-10 SPL token addresses to form your portfolio.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {tokenAddresses.map((addr, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Token Address"
              value={addr}
              onChange={(e) => handleTokenAddressChange(index, e.target.value)}
              className="flex-1 border border-gray-300 rounded p-2"
            />
            {tokenAddresses.length > 2 && (
              <button
                type="button"
                onClick={() => removeTokenField(index)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={addTokenField}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
            disabled={tokenAddresses.length >= 10}
          >
            + Add Token
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Portfolio
          </button>
        </div>
      </form>
    </div>
  );
}
