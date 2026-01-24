// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SwagAuction is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Auction State
    struct Auction {
        uint256 tokenId;
        address payable seller;
        uint256 minBid;
        uint256 highestBid;
        address payable highestBidder;
        uint256 endTime;
        bool active;
    }

    mapping(uint256 => Auction) public auctions;
    mapping(address => uint256) public pendingReturns; // For outbid users to claim refunds

    event Minted(uint256 tokenId, address owner);
    event AuctionStarted(uint256 tokenId, uint256 endTime);
    event NewBid(uint256 tokenId, address bidder, uint256 amount);
    event AuctionEnded(uint256 tokenId, address winner, uint256 amount);
    event Withdrawal(address bidder, uint256 amount);

    constructor() ERC721("SwagClub", "SWAG") Ownable(msg.sender) {}

    // 1. MINT (Creates the Ticket/Art)
    function mintArtwork(string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        // In a real app, you would setTokenURI here
        emit Minted(newItemId, msg.sender);
        return newItemId;
    }

    // 2. START AUCTION (Locks the NFT)
    function startAuction(uint256 tokenId, uint256 startingBid, uint256 durationMinutes) public onlyOwner {
        require(ownerOf(tokenId) == msg.sender, "You must own the NFT");
        require(!auctions[tokenId].active, "Auction already active");

        // Transfer NFT to contract to lock it
        transferFrom(msg.sender, address(this), tokenId);

        auctions[tokenId] = Auction({
            tokenId: tokenId,
            seller: payable(msg.sender),
            minBid: startingBid,
            highestBid: 0,
            highestBidder: payable(address(0)),
            endTime: block.timestamp + (durationMinutes * 1 minutes),
            active: true
        });

        emit AuctionStarted(tokenId, auctions[tokenId].endTime);
    }

    // 3. PLACE BID (or "Enter Pop-Up")
    function placeBid(uint256 tokenId) public payable nonReentrant {
        Auction storage auction = auctions[tokenId];
        require(auction.active, "Auction not active");
        require(block.timestamp < auction.endTime, "Auction ended");
        require(msg.value > auction.highestBid && msg.value >= auction.minBid, "Bid too low");

        // Refund the previous highest bidder (Add to pendingReturns)
        if (auction.highestBidder != address(0)) {
            pendingReturns[auction.highestBidder] += auction.highestBid;
        }

        auction.highestBid = msg.value;
        auction.highestBidder = payable(msg.sender);

        emit NewBid(tokenId, msg.sender, msg.value);
    }

    // 4. END AUCTION (Settles the win)
    function endAuction(uint256 tokenId) public nonReentrant {
        Auction storage auction = auctions[tokenId];
        require(auction.active, "Auction not active");
        require(block.timestamp >= auction.endTime, "Auction not yet ended");

        auction.active = false;

        if (auction.highestBidder != address(0)) {
            // Transfer NFT to Winner
            _transfer(address(this), auction.highestBidder, tokenId);
            // Transfer ETH to Seller (Admin)
            auction.seller.transfer(auction.highestBid);
            emit AuctionEnded(tokenId, auction.highestBidder, auction.highestBid);
        } else {
            // No bids? Return NFT to Seller
            _transfer(address(this), auction.seller, tokenId);
        }
    }

    // 5. WITHDRAW (For users who were outbid)
    function withdraw() public nonReentrant returns (bool) {
        uint256 amount = pendingReturns[msg.sender];
        if (amount > 0) {
            pendingReturns[msg.sender] = 0;
            if (!payable(msg.sender).send(amount)) {
                pendingReturns[msg.sender] = amount;
                return false;
            }
        }
        emit Withdrawal(msg.sender, amount);
        return true;
    }

    // 6. ADMIN WITHDRAW (For general ticket sales if using direct buy)
    function withdrawAllFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds");
        payable(msg.sender).transfer(balance);
    }
    
    // Helper to see total supply
    function tokenIds() public view returns (uint256) {
        return _tokenIds.current();
    }
}