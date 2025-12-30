// 1. Apna Token/Contract Address yaha daalo (Base Chain)
export const CONTRACT_ADDRESS = "0x39BF2317CF08c10c7eb54960d146c53D403bC186"; 

// 2. Updated ABI for 'claim' function
export const CONTRACT_ABI = [
  {
    // Agar tumhara claim function alag inputs leta hai, to ise adjust karna padega
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "claim", // ✅ Updated from 'mint' to 'claim'
    "outputs": [],
    "stateMutability": "public", 
    "type": "function"
  }
] as const;
