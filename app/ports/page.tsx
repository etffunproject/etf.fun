// @ts-nocheck
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import SkeletonCard from '../../components/SkeletonCard';
import { supabase } from '../../lib/supabaseClient';

function calculateReturns(purchased) {
  return purchased * (1 + Math.random() * 0.5);
}

export default function PortsPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('time'); // 'time', 'purchased', 'returns'
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchPortfolios() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('portfolios')
        .select('*');

      if (error) {
        console.error(error);
        setError('Failed to load portfolios. Please try again later.');
        setLoading(false);
        return;
      }

      const dbPortfolios = data || [];
      const enriched = dbPortfolios.map((p) => {
        const purchased = (p.purchased !== undefined) ? p.purchased : Math.random() * 100;
        const returns = calculateReturns(purchased);
        const tokens = Array.isArray(p.tokens) ? p.tokens : [];
        const created_at = p.created_at || new Date().toISOString();
        return {
          id: p.id,
          tokens: tokens,
          created_at: created_at,
          purchased: purchased,
          returns: returns
        };
      });

      setPortfolios(enriched);
      setLoading(false);
    }

    fetchPortfolios();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold mb-4">All Ports (Leaderboard)</h1>
        <p className="text-textSecondary">Loading ports...</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold mb-4">All Ports (Leaderboard)</h1>
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => { setLoading(true); setError(null); location.reload(); }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const searchLower = search.toLowerCase();
  const filteredPortfolios = portfolios.filter((p) => {
    const tokensStr = p.tokens.join(', ').toLowerCase();
    return p.id.toLowerCase().includes(searchLower) || tokensStr.includes(searchLower);
  });

  const sortedPortfolios = [...filteredPortfolios].sort((a, b) => {
    if (sortBy === 'time') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortBy === 'purchased') {
      return b.purchased - a.purchased;
    } else if (sortBy === 'returns') {
      return b.returns - a.returns;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold mb-4">All Ports (Leaderboard)</h1>
      <p className="text-textSecondary">
        Browse through available portfolios. Sort by different criteria and use the search bar to find specific portfolios.
      </p>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded p-2 text-sm"
          >
            <option value="time">Time Created (Newest)</option>
            <option value="purchased">Most Purchased</option>
            <option value="returns">Best Returns</option>
          </select>
        </div>

        <div className="flex-1 md:flex-none w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name or tokens..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded p-2 text-sm w-full"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedPortfolios.length === 0 ? (
          <p className="text-textSecondary">No portfolios found.</p>
        ) : (
          sortedPortfolios.map((p) => (
            <Link key={p.id} href={`/portfolio/${p.id}`} className="block group">
              <Card>
                <h3 className="text-lg font-medium mb-1 group-hover:underline">{p.id}</h3>
                {p.tokens.length > 0 ? (
                  <p className="text-sm text-textSecondary mb-2">Tokens: {p.tokens.join(', ')}</p>
                ) : (
                  <p className="text-sm text-textSecondary mb-2">No tokens.</p>
                )}
                <p className="text-sm text-textSecondary">Purchased: {p.purchased.toFixed(2)} SOL</p>
                <p className="text-sm text-textSecondary">Returns: {p.returns.toFixed(2)} SOL</p>
                <p className="text-sm text-textSecondary">Created: {new Date(p.created_at).toLocaleString()}</p>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
