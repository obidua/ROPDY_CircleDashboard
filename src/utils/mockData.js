// Utility functions for generating mock blockchain data
export const generateFullAddress = () => {
  return '0x' + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

export const generateFullHash = () => {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Common mock addresses
export const mockAddresses = {
  wallet: '0x742d9B2C5e6A1A579B8AC8F4e793aCAeA27B2c88',
  sponsor: '0x156c4C8F82fF7bD43B2D37B7E8F8F3a12E12345',
  user1: '0x389D5eF568B9B6789aCAeA27B2c884321234567',
  user2: '0x901F7C5e6A1A579B8AC8F4e793aB9876543210F',
};

// Common mock transaction hashes
export const mockHashes = {
  tx1: '0xbff560bc1b390a3ec37ae2c7ee71f9e972885d3fc924a9196f8411b446726a67',
  tx2: '0x3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
  tx3: '0x7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a798',
};