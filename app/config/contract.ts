export const SWAG_CONTRACT_ADDRESS = "0xcE5BB9a519EB12BfA1816F196fc3beBbc13f6f26";

export const SWAG_CONTRACT_ABI = [
  // 1. MINT
  {
    "inputs": [{ "internalType": "string", "name": "tokenURI", "type": "string" }],
    "name": "mintArtwork",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // 2. APPROVE (Added this!)
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
  // 3. START AUCTION
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "internalType": "uint256", "name": "startingBid", "type": "uint256" },
      { "internalType": "uint256", "name": "durationMinutes", "type": "uint256" }
    ],
    "name": "startAuction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // 4. PLACE BID
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "placeBid",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  // 5. READ AUCTIONS
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "auctions",
    "outputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "internalType": "address payable", "name": "seller", "type": "address" },
      { "internalType": "uint256", "name": "minBid", "type": "uint256" },
      { "internalType": "uint256", "name": "highestBid", "type": "uint256" },
      { "internalType": "address payable", "name": "highestBidder", "type": "address" },
      { "internalType": "uint256", "name": "endTime", "type": "uint256" },
      { "internalType": "bool", "name": "active", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // 6. READ LATEST TOKEN ID
  {
    "inputs": [],
    "name": "tokenIds",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;