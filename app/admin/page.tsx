"use client";

import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { SWAG_CONTRACT_ADDRESS, SWAG_CONTRACT_ABI } from '../config/contract';
import { Upload, Ticket, CheckCircle2, Wallet, Lock, Trophy, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const [tokenURI, setTokenURI] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [ticketPrice, setTicketPrice] = useState('0.01');
  const [maxTickets, setMaxTickets] = useState('100');
  const [lastMintedId, setLastMintedId] = useState<string | null>(null);

  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isSuccess, data: receipt } = useWaitForTransactionReceipt({ hash });

  // Auto-fill Token ID after minting
  useEffect(() => {
    if (isSuccess && receipt && receipt.logs[0]) {
       try {
         const id = parseInt(receipt.logs[0].topics[3] as string, 16).toString();
         setLastMintedId(id);
         setTokenId(id);
       } catch (e) {}
    }
  }, [isSuccess, receipt]);

  // --- ACTIONS ---
  const handleMint = () => {
    writeContract({ address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'mintArtwork', args: [tokenURI] });
  };

  const handleApprove = () => {
    writeContract({ address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'approve', args: [SWAG_CONTRACT_ADDRESS, BigInt(tokenId)] });
  };

  const handleStartRaffle = () => {
    writeContract({ address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'startRaffle', args: [BigInt(tokenId), parseEther(ticketPrice), BigInt(maxTickets)] });
  };

  const handlePickWinner = () => {
    writeContract({ address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'pickWinner', args: [BigInt(tokenId)] });
  };

  // NEW: WITHDRAW FUNCTION
  const handleWithdraw = () => {
    writeContract({ 
      address: SWAG_CONTRACT_ADDRESS, 
      abi: SWAG_CONTRACT_ABI, 
      functionName: 'withdrawEarnings', 
      args: [] 
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans selection:bg-purple-500 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <header className="flex justify-between items-center border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2"><Lock className="w-8 h-8 text-teal-500"/> Admin Command</h1>
          <ConnectButton />
        </header>

        {isSuccess && (
          <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-xl flex items-center gap-3 text-green-400">
            <CheckCircle2 className="w-5 h-5"/> 
            <span className="font-bold">Transaction Successful!</span>
            {lastMintedId && <span className="text-sm opacity-80">(Token ID #{lastMintedId})</span>}
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm break-all">
             Error: {error.message.split('\n')[0]}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CARD 1: MINT */}
            <div className="bg-[#111] p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all shadow-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-purple-400"><Upload className="w-5 h-5"/> 1. Create Artifact</h2>
              <div className="space-y-4">
                 <input type="text" placeholder="Image URL (e.g. Unsplash/IPFS)" value={tokenURI} onChange={(e) => setTokenURI(e.target.value)} className="w-full bg-black border border-white/20 p-4 rounded-xl outline-none focus:border-purple-500 transition-colors"/>
                 <button onClick={handleMint} disabled={isPending} className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-purple-500 hover:text-white transition-all disabled:opacity-50">
                    {isPending ? <Loader2 className="animate-spin mx-auto"/> : "Mint NFT"}
                 </button>
              </div>
            </div>

            {/* CARD 2: START RAFFLE */}
            <div className="bg-[#111] p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all shadow-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-teal-400"><Ticket className="w-5 h-5"/> 2. Launch Raffle</h2>
              <div className="space-y-4">
                <input type="number" placeholder="Token ID" value={tokenId} onChange={(e) => setTokenId(e.target.value)} className="w-full bg-black border border-white/20 p-4 rounded-xl outline-none focus:border-teal-500 transition-colors"/>
                <div className="grid grid-cols-2 gap-4">
                   <input type="number" placeholder="Price (ETH)" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} className="bg-black border border-white/20 p-4 rounded-xl outline-none focus:border-teal-500"/>
                   <input type="number" placeholder="Max Tickets" value={maxTickets} onChange={(e) => setMaxTickets(e.target.value)} className="bg-black border border-white/20 p-4 rounded-xl outline-none focus:border-teal-500"/>
                </div>
                <div className="flex gap-3 pt-2">
                   <button onClick={handleApprove} disabled={isPending} className="flex-1 border border-white/20 hover:bg-white/10 py-3 rounded-xl font-bold transition-colors">Approve</button>
                   <button onClick={handleStartRaffle} disabled={isPending} className="flex-[2] bg-teal-500 text-black font-bold py-3 rounded-xl hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/20">Start Live</button>
                </div>
              </div>
            </div>
        </div>

        {/* BOTTOM ROW: MANAGE & WITHDRAW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           
           {/* CARD 3: PICK WINNER */}
           <div className="bg-[#111] p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-yellow-500"><Trophy className="w-5 h-5"/> 3. End Raffle</h2>
              <p className="text-neutral-500 text-sm mb-6">This will randomly select a winner from the pool and transfer the NFT to them.</p>
              <div className="flex gap-4">
                 <input type="number" placeholder="ID to End" value={tokenId} onChange={(e) => setTokenId(e.target.value)} className="w-24 bg-black border border-white/20 p-3 rounded-xl text-center"/>
                 <button onClick={handlePickWinner} disabled={isPending} className="flex-1 bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-400 shadow-lg shadow-yellow-500/20">
                    Pick Random Winner
                 </button>
              </div>
           </div>

           {/* CARD 4: TREASURY (NEW) */}
           <div className="bg-[#111] p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-green-500/5 rounded-full blur-3xl pointer-events-none"/>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-400"><Wallet className="w-5 h-5"/> 4. Treasury</h2>
              <p className="text-neutral-500 text-sm mb-6">Withdraw all ETH collected from ticket sales to the admin wallet.</p>
              
              <button onClick={handleWithdraw} disabled={isPending} className="w-full border border-green-500/30 text-green-400 font-bold py-4 rounded-xl hover:bg-green-500 hover:text-black transition-all flex items-center justify-center gap-3">
                 {isPending ? <Loader2 className="animate-spin"/> : <Wallet className="w-5 h-5"/>}
                 Withdraw All Funds
              </button>
           </div>

        </div>

      </div>
    </div>
  );
}