"use client";

import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { SWAG_CONTRACT_ADDRESS, SWAG_CONTRACT_ABI } from '../config/contract';
import { Loader2, Upload, Gavel, CheckCircle2, Lock } from 'lucide-react';

export default function AdminPage() {
  const [tokenURI, setTokenURI] = useState('');
  
  // Auction Form State
  const [tokenIdToAuction, setTokenIdToAuction] = useState('');
  const [startPrice, setStartPrice] = useState('0.01');
  const [duration, setDuration] = useState('60');

  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // 1. MINT FUNCTION
  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    writeContract({
      address: SWAG_CONTRACT_ADDRESS,
      abi: SWAG_CONTRACT_ABI,
      functionName: 'mintArtwork',
      args: [tokenURI || "demo-nft"], // Fallback for testing
    });
  };

  // 2. APPROVE FUNCTION (The Missing Step!)
  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    writeContract({
      address: SWAG_CONTRACT_ADDRESS,
      abi: SWAG_CONTRACT_ABI,
      functionName: 'approve', // Standard ERC721 function
      args: [SWAG_CONTRACT_ADDRESS, BigInt(tokenIdToAuction)],
    });
  };

  // 3. START AUCTION FUNCTION
  const handleStartAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    writeContract({
      address: SWAG_CONTRACT_ADDRESS,
      abi: SWAG_CONTRACT_ABI,
      functionName: 'startAuction',
      args: [BigInt(tokenIdToAuction), parseEther(startPrice), BigInt(duration)],
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-12">
        <header className="flex justify-between items-center border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard 🛡️</h1>
          <ConnectButton />
        </header>

        {/* ERROR DISPLAY */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
             Error: {error.message.split('\n')[0]}
          </div>
        )}

        {/* SUCCESS DISPLAY */}
        {isSuccess && (
           <div className="p-4 bg-green-900/20 border border-green-500/50 text-green-200 rounded-xl text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5"/> Transaction Confirmed!
           </div>
        )}

        {/* --- STEP 1: MINT --- */}
        <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Upload className="w-5 h-5 text-teal-400"/> Step 1: Mint NFT</h2>
          <form onSubmit={handleMint} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Metadata URI</label>
              <input 
                type="text" 
                placeholder="ipfs://... (or leave blank for demo)" 
                value={tokenURI}
                onChange={(e) => setTokenURI(e.target.value)}
                className="w-full bg-black border border-gray-700 p-3 rounded-lg mt-1 outline-none focus:border-teal-500"
              />
            </div>
            <button disabled={isPending || isConfirming} className="bg-teal-500 text-black px-6 py-3 rounded-lg font-bold w-full hover:bg-teal-400 disabled:opacity-50">
              {isPending ? 'Check Wallet...' : isConfirming ? 'Minting...' : 'Mint Artwork'}
            </button>
          </form>
        </section>

        {/* --- STEP 2: START AUCTION --- */}
        <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Gavel className="w-5 h-5 text-purple-400"/> Step 2: Start Auction</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-sm text-gray-400">Token ID</label>
                  <input type="number" placeholder="e.g. 1" value={tokenIdToAuction} onChange={e => setTokenIdToAuction(e.target.value)} className="w-full bg-black border border-gray-700 p-3 rounded-lg mt-1 outline-none focus:border-purple-500"/>
               </div>
               <div>
                  <label className="text-sm text-gray-400">Duration (Mins)</label>
                  <input type="number" placeholder="60" value={duration} onChange={e => setDuration(e.target.value)} className="w-full bg-black border border-gray-700 p-3 rounded-lg mt-1 outline-none focus:border-purple-500"/>
               </div>
            </div>
            <div>
              <label className="text-sm text-gray-400">Start Price (ETH)</label>
              <input type="number" step="0.001" placeholder="0.01" value={startPrice} onChange={e => setStartPrice(e.target.value)} className="w-full bg-black border border-gray-700 p-3 rounded-lg mt-1 outline-none focus:border-purple-500"/>
            </div>

            <div className="flex gap-4 pt-2">
               {/* APPROVE BUTTON */}
               <button 
                 onClick={handleApprove}
                 disabled={isPending || isConfirming || !tokenIdToAuction} 
                 className="flex-1 bg-white/10 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/20 disabled:opacity-50 border border-white/10 flex justify-center items-center gap-2"
               >
                 <Lock className="w-4 h-4"/> 
                 {isPending ? 'Approving...' : '1. Approve Contract'}
               </button>

               {/* START BUTTON */}
               <button 
                 onClick={handleStartAuction}
                 disabled={isPending || isConfirming || !tokenIdToAuction} 
                 className="flex-[2] bg-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-400 disabled:opacity-50"
               >
                 {isPending ? 'Confirming...' : '2. Start Auction'}
               </button>
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">Note: You must click "Approve" first, wait for success, then click "Start Auction".</p>
          </div>
        </section>

      </div>
    </div>
  );
}