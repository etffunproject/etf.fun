// @ts-nocheck
import { NextResponse } from 'next/server';

export async function GET() {
  const SOL_FEED_ID = "J83AhoA7MPp1hGMSE7MknSL5r2Mg2Ab6rQgmfMkjD9K";
  const url = `https://xc-mainnet.pyth.network/api/v2/price_feeds?ids=${SOL_FEED_ID}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Failed to fetch SOL price from Pyth API. Status:', res.status);
      return NextResponse.json({ error: 'Failed to fetch data from Pyth' }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Error fetching SOL price:', err);
    return NextResponse.json({ error: 'Network error fetching data' }, { status: 500 });
  }
}
