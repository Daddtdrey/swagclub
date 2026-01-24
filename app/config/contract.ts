// REPLACE THIS ADDRESS WITH YOUR NEW V2 DEPLOYMENT FROM REMIX
export const SWAG_CONTRACT_ADDRESS = "0x0Ae49fa0B972583d9BAc23BD2f982de48A74E761"; 

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

  // 3. BUY TICKET
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "buyTicket",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },

  // 4. SELL TICKET (SWAP FOR LIQUIDITY - NEW IN V2)
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "sellTicket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // 5. PICK WINNER
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "pickWinner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // 6. APPROVE (For Admin Locking)
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

  // 7. WITHDRAW ADMIN FUNDS
  {
    "inputs": [],
    "name": "withdrawEarnings",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // 8. READ RAFFLE DETAILS
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

  // 9. READ TOTAL MINTED COUNT
  {
    "inputs": [],
    "name": "tokenIds",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
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
  }
] as const;