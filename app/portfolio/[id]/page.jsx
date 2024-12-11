// @ts-nocheck
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { getPortfolioById, recordTrade } from '../../../lib/db';
import Card from '../../../components/Card';
import Spinner from '../../../components/Spinner';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { getTokenInfo } from '../../../lib/getTokenInfo'; // Import our new token info function

export default function PortfolioDetailPage() {
  const { id } = useParams();
  const { publicKey, connected } = useWallet();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [amount, setAmount] = useState('');
  const [buying, setBuying] = useState(false);

  const [solPrice, setSolPrice] = useState(null);

  // Mock price data for the chart (still mock for now)
  const mockPriceData = [
    { time: '10:00', price: 1.2 },
    { time: '10:30', price: 1.25 },
    { time: '11:00', price: 1.18 },
    { time: '11:30', price: 1.22 },
    { time: '12:00', price: 1.3 },
    { time: '12:30', price: 1.27 },
    { time: '13:00', price: 1.35 },
  ];

  // For now, let's skip the external API fetch for SOL price to focus on token images.
  // We'll just leave solPrice as null or a hard-coded price.
  // Later, we can reintroduce the internal API route solution.
  useEffect(() => {
    // If you have a price fetching mechanism, you can add it here.
    // For demonstration, let's just leave solPrice as 20 (for example)
    setSolPrice(20);
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      const p = await getPortfolioById(id);
      if (!p) {
        setError('Portfolio not found.');
        setLoading(false);
        return;
      }
      setPortfolio(p);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Portfolio Detail</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const tokens = Array.isArray(portfolio?.tokens) ? portfolio.tokens : [];

  // Function to determine the token price
  // Right now, we only have a hard-coded SOL price. If token is SOL, show that price.
  // If not SOL, "Price not available"
  function getTokenPrice(token) {
    const upperToken = token.toUpperCase();
    if (upperToken === "SOL") {
      return solPrice !== null ? `$${solPrice.toFixed(2)}` : "Price not available";
    } else {
      return "Price not available";
    }
  }

  let investAmount = parseFloat(amount);
  if (isNaN(investAmount) || investAmount <= 0) {
    investAmount = 0;
  }
  const fee = investAmount * 0.01; // 1% fee
  const totalCost = investAmount + fee;

  async function handleBuy(e) {
    e.preventDefault();
    if (!connected || !publicKey) {
      alert('Please connect your wallet to buy this portfolio.');
      return;
    }
    if (investAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    setBuying(true);
    try {
      await recordTrade(publicKey.toBase58(), portfolio.id, investAmount);
      alert(`You have purchased ${portfolio.id} for ${investAmount} SOL plus a fee of ${fee.toFixed(4)} SOL.`);
      setAmount('');
    } catch (err) {
      console.error(err);
      alert('Error purchasing portfolio. Check console for details.');
    } finally {
      setBuying(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold mb-4">Portfolio: {portfolio.id}</h1>

      <Card>
        {tokens.length > 0 ? (
          <div className="text-sm text-textSecondary mb-2">
            <p><strong>Tokens:</strong></p>
            <ul className="space-y-2">
              {tokens.map((token, idx) => {
                const info = getTokenInfo(token);
                const tokenPrice = getTokenPrice(token);
                return (
                  <li key={idx} className="flex items-center space-x-2">
                    <img
                      src={info.logoURI}
                      alt={info.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{info.symbol}</span>
                    <span>-</span>
                    <span>{tokenPrice}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-textSecondary mb-2">No tokens found.</p>
        )}
      </Card>

      {/* Price History Chart (mock data) */}
      <div className="bg-surface p-4 rounded-lg border border-gray-100">
        <h2 className="text-lg font-medium mb-2">Price History (Mock Data)</h2>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockPriceData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280"/>
              <Tooltip />
              <Area type="monotone" dataKey="price" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPrice)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Buy Form */}
      {!connected ? (
        <p className="text-sm text-textSecondary">
          Please connect your wallet to purchase this portfolio.
        </p>
      ) : (
        <form onSubmit={handleBuy} className="space-y-4 max-w-sm">
          <div>
            <label className="block mb-2 font-medium">Amount to Invest (SOL):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>

          {investAmount > 0 && (
            <div className="text-sm text-textSecondary space-y-1">
              <p>Fee (1%): {fee.toFixed(4)} SOL</p>
              <p>Total Cost: {totalCost.toFixed(4)} SOL</p>
            </div>
          )}

          <button
            type="submit"
            className="bg-accent text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            disabled={buying}
          >
            {buying ? 'Processing...' : 'Buy This Portfolio'}
          </button>
        </form>
      )}
    </div>
  );
}
