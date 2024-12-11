"use client";

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getPortfoliosByAddress, getTradesByAddress, getOrCreateUser, updateUserProfile, getFavoritesByUser, getPortfolioById } from '../../lib/db';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';

export default function ProfilePage() {
  const { publicKey, connected } = useWallet();
  const [userPortfolios, setUserPortfolios] = useState([]);
  const [userTrades, setUserTrades] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState('');
  const [about, setAbout] = useState('');
  const [userLoading, setUserLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!connected || !publicKey) {
        setUserPortfolios([]);
        setUserTrades([]);
        setFavorites([]);
        setUsername('');
        setAbout('');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const address = publicKey.toBase58();

      const user = await getOrCreateUser(address);
      if (!user) {
        setError('Failed to get or create user record.');
        setLoading(false);
        return;
      }

      setUsername(user.username || '');
      setAbout(user.about || '');

      const portfolios = await getPortfoliosByAddress(address) || [];
      const trades = await getTradesByAddress(address) || [];

      // Fetch favorites
      const favs = await getFavoritesByUser(address);
      const favoritePortfolios = [];
      for (const f of favs) {
        const pf = await getPortfolioById(f.portfolio_id);
        if (pf) {
          favoritePortfolios.push(pf);
        }
      }

      setUserPortfolios(portfolios);
      setUserTrades(trades);
      setFavorites(favoritePortfolios);
      setLoading(false);
    }
    fetchData();
  }, [connected, publicKey]);

  if (!connected) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Your Profile</h1>
        <p className="text-textSecondary">Please connect your wallet to view your data.</p>
      </div>
    );
  }

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Your Profile</h1>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  async function handleProfileUpdate(e) {
    e.preventDefault();
    if (!publicKey) return;
    setUserLoading(true);
    try {
      await updateUserProfile(publicKey.toBase58(), username, about);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error updating profile.');
    } finally {
      setUserLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>

      <div className="bg-surface p-4 rounded-lg border border-gray-100 space-y-4 max-w-md">
        <h2 className="text-xl font-medium">Profile Info</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">About Me</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-accent text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            disabled={userLoading}
          >
            {userLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>

        {username && <p className="text-sm text-textSecondary">Username: {username}</p>}
        {about && <p className="text-sm text-textSecondary">About: {about}</p>}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-medium">Your Portfolios</h2>
        {userPortfolios.length === 0 ? (
          <p className="text-textSecondary">You haven’t created any portfolios yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {userPortfolios.map((p) => (
              <Card key={p.id}>
                <h3 className="text-lg font-medium mb-1">{p.id}</h3>
                {p.tokens && p.tokens.length > 0 ? (
                  <p className="text-sm text-textSecondary">Tokens: {p.tokens.join(', ')}</p>
                ) : (
                  <p className="text-sm text-textSecondary">No tokens.</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-medium">Your Trades</h2>
        {userTrades.length === 0 ? (
          <p className="text-textSecondary">No trades recorded.</p>
        ) : (
          <div className="space-y-2">
            {userTrades.map((t) => (
              <Card key={t.id}>
                <p className="text-sm">Portfolio ID: {t.portfolio_id}</p>
                <p className="text-sm">Amount: {t.amount} SOL</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-medium">Your Favorites</h2>
        {favorites.length === 0 ? (
          <p className="text-textSecondary">You haven’t favorited any portfolios yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((f) => (
              <Card key={f.id}>
                <h3 className="text-lg font-medium mb-1">{f.id}</h3>
                {f.tokens && f.tokens.length > 0 ? (
                  <p className="text-sm text-textSecondary">Tokens: {f.tokens.join(', ')}</p>
                ) : (
                  <p className="text-sm text-textSecondary">No tokens.</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
