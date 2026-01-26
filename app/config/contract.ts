// REPLACE THIS WITH YOUR NEW V3 CONTRACT ADDRESS FROM REMIX
export const SWAG_CONTRACT_ADDRESS = "0x38d4A3CDdD6458922A586ffE48EeBACE1423FE2F"; 

export const SWAG_CONTRACT_ABI = [
  // 1. MINT ARTWORK
  {
    "inputs": [{ "internalType": "string", "name": "_tokenURI", "type": "string" }],
    "name": "mintArtwork",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  
  // 2. START RAFFLE
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "internalType": "uint256", "name": "price", "type": "uint256" },
      { "internalType": "uint256", "name": "maxTickets", "type": "uint256" }
    ],
    "name": "startRaffle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // 3. BUY TICKET (Now enforces 1 per wallet)
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "buyTicket",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },

  // 4. SELL TICKET (70% Liquidity Swap)
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "sellTicket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // 5. PICK WINNERS (NEW: Takes 'count' for multiple winners)
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "internalType": "uint256", "name": "count", "type": "uint256" }
    ],
    "name": "pickWinners",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // 6. CHECK TICKET STATUS (NEW: Helper to see if user entered)
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "checkHasTicket",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },

  // 7. APPROVE (For locking NFT)
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // 8. WITHDRAW FUNDS (Treasury)
  {
    "inputs": [],
    "name": "withdrawEarnings",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // 9. READ RAFFLE DETAILS
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "getRaffleDetails",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }, // Price
      { "internalType": "uint256", "name": "", "type": "uint256" }, // Sold
      { "internalType": "uint256", "name": "", "type": "uint256" }, // Max
      { "internalType": "bool", "name": "", "type": "bool" },       // Active
      { "internalType": "address", "name": "", "type": "address" }   // Winner
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // 10. READ IMAGE URL
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "tokenURI",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },

  // 11. TOKEN IDS
  {
    "inputs": [],
    "name": "tokenIds",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;