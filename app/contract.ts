// 1. Apna Token/Contract Address yaha daalo (Base Chain)
export const CONTRACT_ADDRESS = "0xYourTokenAddressHere"; 

// 2. ABI (Standard Mint function)
// Agar tumhare contract me 'claim' function hai to name: "mint" ko "claim" kar dena
export const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "mint", 
    "outputs": [],
    "stateMutability": "public", 
    "type": "function"
  }
] as const;
