// 1. Apna Token/Contract Address yaha daalo (Base Chain)
export const CONTRACT_ADDRESS = "0x1C55020c22D7e8f4eF8CcC27fE9E342301DAEa93"; 

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
