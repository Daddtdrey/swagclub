// REPLACE WITH YOUR NEW V5 ADDRESS
export const SWAG_CONTRACT_ADDRESS = "0x427CD28846FBe32B1e83cFb31d4C87CeFEBBE6B8"; 

export const SWAG_CONTRACT_ABI = [
  // ... (Previous Functions: mintArtwork, startRaffle, buyTicket, sellTicket, pickWinners, checkHasTicket) ...

  // UPDATE: setContentCampaign (Now takes 4 args including Image URL)
  {
    "inputs": [
      { "internalType": "uint256", "name": "_fee", "type": "uint256" },
      { "internalType": "uint256", "name": "_max", "type": "uint256" },
      { "internalType": "uint256", "name": "_duration", "type": "uint256" },
      { "internalType": "string", "name": "_rewardURI", "type": "string" }
    ],
    "name": "setContentCampaign",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // submitContent (Keep same)
  {
    "inputs": [{ "internalType": "string", "name": "_url", "type": "string" }],
    "name": "submitContent",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },

  // UPDATE: getContentStatus (Returns user status too)
  {
    "inputs": [],
    "name": "getContentStatus",
    "outputs": [
      { "internalType": "uint256", "name": "count", "type": "uint256" },
      { "internalType": "uint256", "name": "max", "type": "uint256" },
      { "internalType": "uint256", "name": "fee", "type": "uint256" },
      { "internalType": "bool", "name": "active", "type": "bool" },
      { "internalType": "bool", "name": "userHasSubmitted", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // getAllContent
  {
    "inputs": [],
    "name": "getAllContent",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "submitter", "type": "address" },
          { "internalType": "string", "name": "contentUrl", "type": "string" },
          { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "internalType": "struct SwagRaffle.ContentSubmission[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // ADD: Required for Wallet Scanning
  {
      "inputs": [],
      "name": "tokenIds",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
      "name": "getRaffleDetails",
      "outputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" },
        { "internalType": "uint256", "name": "", "type": "uint256" },
        { "internalType": "uint256", "name": "", "type": "uint256" },
        { "internalType": "bool", "name": "", "type": "bool" },
        { "internalType": "address", "name": "", "type": "address" }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
      "name": "tokenURI",
      "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "address", "name": "user", "type": "address" }],
      "name": "checkHasTicket",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
      "name": "ownerOf",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
  },
  // Keep mintArtwork, withdrawEarnings, startRaffle, buyTicket, sellTicket, pickWinners...
  { "inputs": [{ "internalType": "string", "name": "_tokenURI", "type": "string" }], "name": "mintArtwork", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "uint256", "name": "maxTickets", "type": "uint256" }], "name": "startRaffle", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "buyTicket", "outputs": [], "stateMutability": "payable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "sellTicket", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "uint256", "name": "count", "type": "uint256" }], "name": "pickWinners", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "withdrawEarnings", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
] as const;