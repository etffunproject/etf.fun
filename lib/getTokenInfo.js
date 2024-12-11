// @ts-nocheck
// lib/getTokenInfo.js
//
// This file exports a function getTokenInfo(symbol) that returns metadata for known tokens.
// If the token is not known, it returns a default "unknown token" object.

export function getTokenInfo(symbol) {
    const upperSymbol = symbol.toUpperCase();
  
    // Hard-coded token metadata map
    // Add more tokens as needed.
    const tokenMap = {
      SOL: {
        symbol: 'SOL',
        name: 'Solana',
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png'
      },
      USDC: {
        symbol: 'USDC',
        name: 'USD Coin',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/2XfKHHwBp9YyQ2XFZ2ZXk3RFYtm3geWZrLLUC7zG1UzM/logo.png'
      },
      ETH: {
        symbol: 'ETH',
        name: 'Ethereum (Wormhole)',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7vfCXTroCLnAdWdsVMTk8ZeNDDyZfE7UojQQ9uPBTutM/logo.png'
      }
      // Add more tokens here if you want.
    };
  
    if (tokenMap[upperSymbol]) {
      return tokenMap[upperSymbol];
    } else {
      // If token not found, return a default object
      return {
        symbol: upperSymbol,
        name: upperSymbol,
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/placeholder.png'
      };
    }
  }
  