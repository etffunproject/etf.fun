// @ts-nocheck
import { supabase } from './supabaseClient'
import { createHash, createCipheriv, randomBytes } from 'crypto'

// If ENCRYPTION_KEY is not set, provide a default 32-byte key in base64.
// In production, you must set ENCRYPTION_KEY in .env.local as a secure 32-byte key.
const defaultKey = 'ZmFsbGJhY2stdG8tMzItYnl0ZS1rZXk='; 
// This is just 'fallback-to-32-byte-key' in base64 for demonstration.
// You should replace it with a real secure base64-encoded 32-byte key later.

const encryptionKeyBase64 = process.env.ENCRYPTION_KEY || defaultKey;
const key = Buffer.from(encryptionKeyBase64, 'base64');

function hashAddress(address) {
  return createHash('sha256').update(address).digest('hex');
}

function encryptAddress(address) {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(address, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

// Portfolios
export async function createPortfolio(creatorAddress, tokens) {
  const id = `portfolio_${Date.now()}`
  const { data, error } = await supabase
    .from('portfolios')
    .insert({ id, creator_address: creatorAddress, tokens })
    .select('*')
    .single()

  if (error) {
    throw new Error('Error creating portfolio')
  }

  return data
}

export async function getPortfoliosByAddress(address) {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('creator_address', address)

  if (error) {
    throw new Error('Error fetching portfolios')
  }

  return data || []
}

export async function getPortfolioById(id) {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return null
  }

  return data
}

export async function recordTrade(buyerAddress, portfolioId, amount) {
  const { data, error } = await supabase
    .from('trades')
    .insert({ buyer_address: buyerAddress, portfolio_id: portfolioId, amount })
    .select('*')
    .single()

  if (error) {
    throw new Error('Error recording trade')
  }

  return data
}

export async function getTradesByAddress(address) {
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .eq('buyer_address', address)
    .order('timestamp', { ascending: false })

  if (error) {
    throw new Error('Error fetching trades')
  }

  return data
}

// Users
export async function getOrCreateUser(address) {
  const hashed = hashAddress(address);
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('hashed_address', hashed)
    .single();

  if (error && !data) {
    const encrypted = encryptAddress(address);
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({ hashed_address: hashed, encrypted_address: encrypted, username: 'NewUser', about: '' })
      .select('*')
      .single();

    if (insertError) {
      return null;
    }
    return newUser;
  }

  if (!error && !data) {
    const encrypted = encryptAddress(address);
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({ hashed_address: hashed, encrypted_address: encrypted, username: 'NewUser', about: '' })
      .select('*')
      .single();

    if (insertError) {
      return null;
    }
    return newUser;
  }

  if (data && !data.username) {
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ username: 'NewUser' })
      .eq('hashed_address', hashed)
      .select('*')
      .single();

    if (updateError) {
      return null;
    }
    return updatedUser;
  }

  return data;
}

export async function updateUserProfile(address, username, about) {
  if (!username || username.trim() === '') {
    username = 'NewUser';
  }
  if (about == null) {
    about = '';
  }

  const hashed = hashAddress(address);
  const { data, error } = await supabase
    .from('users')
    .update({ username, about })
    .eq('hashed_address', hashed)
    .select('*')
    .single()

  if (error) {
    throw error
  }
  return data
}

export async function deletePortfolio(id) {
  const { data, error } = await supabase
    .from('portfolios')
    .delete()
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw new Error('Error deleting portfolio')
  }

  return data
}

// Favorites
export async function addFavorite(userAddress, portfolioId) {
  const hashed = hashAddress(userAddress);
  const { data, error } = await supabase
    .from('favorites')
    .insert({ user_hashed_address: hashed, portfolio_id: portfolioId })
    .select('*')
    .single();

  if (error) {
    throw new Error('Error adding favorite');
  }

  return data;
}

export async function removeFavorite(userAddress, portfolioId) {
  const hashed = hashAddress(userAddress);
  const { data, error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_hashed_address', hashed)
    .eq('portfolio_id', portfolioId)
    .select('*')
    .single();

  if (error) {
    throw new Error('Error removing favorite');
  }

  return data;
}

export async function getFavoritesByUser(userAddress) {
  const hashed = hashAddress(userAddress);
  const { data, error } = await supabase
    .from('favorites')
    .select('portfolio_id, created_at')
    .eq('user_hashed_address', hashed)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Error fetching favorites');
  }

  return data || [];
}
