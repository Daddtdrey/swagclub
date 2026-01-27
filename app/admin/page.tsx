"use client";

import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useBalance } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { SWAG_CONTRACT_ADDRESS, SWAG_CONTRACT_ABI } from '../config/contract';
import { 
  Upload, Ticket, CheckCircle2, Wallet, Lock, Trophy, Loader2, 
  Globe, Clock, DollarSign, ExternalLink, AlertTriangle, Users, Image as ImageIcon
} from 'lucide-react';

export default function AdminPage() {
  // --- STATE: RAFFLE ---
  const [tokenURI, setTokenURI] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [ticketPrice, setTicketPrice] = useState('0.01');
  const [maxTickets, setMaxTickets] = useState('100');
  const [winnerCount, setWinnerCount] = useState('1');
  const [lastMintedId, setLastMintedId] = useState<string | null>(null);

  // --- STATE: CONTENT CAMPAIGN (V5) ---
  const [contentFee, setContentFee] = useState('0.001');
  const [contentMax, setContentMax] = useState('50');
  const [contentDuration, setContentDuration] = useState('24'); // Hours
  const [rewardImage, setRewardImage] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800"); // Default

  // --- WAGMI HOOKS ---
  const { data: contractBalance } = useBalance({ address: SWAG_CONTRACT_ADDRESS });
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isSuccess, data: receipt } = useWaitForTransactionReceipt({ hash });

  // --- READS: SUBMISSIONS & STATUS ---
  const { data: allContent, refetch: refetchContent } = useReadContract({
    address: SWAG_CONTRACT_ADDRESS,
    abi: SWAG_CONTRACT_ABI,
    functionName: 'getAllContent',
  });

  const { data: contentStatus, refetch: refetchStatus } = useReadContract({
    address: SWAG_CONTRACT_ADDRESS,
    abi: SWAG_CONTRACT_ABI,
    functionName: 'getContentStatus',
  });
  
  // Safe Parse Content Stats
  const filledSlots = contentStatus ? Number((contentStatus as any)[0]) : 0;
  const maxSlots = contentStatus ? Number((contentStatus as any)[1]) : 0;
  const isContentActive = contentStatus ? (contentStatus as any)[3] : false; // Index 3 is 'active' in V5

  // Auto-fill Token ID after minting
  useEffect(() => {
    if (isSuccess && receipt) {
       // Refresh lists
       refetchContent();
       refetchStatus();
       
       // Try to parse logs for ID
       if(receipt.logs[0]) {
           try {
             const id = parseInt(receipt.logs[0].topics[3] as string, 16).toString();
             setLastMintedId(id);
             setTokenId(id);
           } catch (e) {}
       }
    }
  }, [isSuccess, receipt, refetchContent, refetchStatus]);

  // --- ACTIONS ---

  // 1. RAFFLE ACTIONS
  const handleMint = () => {
    writeContract({ address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'mintArtwork', args: [tokenURI] });
  };

  const handleApprove = () => {
    writeContract({ address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'approve', args: [SWAG_CONTRACT_ADDRESS, BigInt(tokenId)] });
  };

  const handleStartRaffle = () => {
    writeContract({ address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'startRaffle', args: [BigInt(tokenId), parseEther(ticketPrice), BigInt(maxTickets)] });
  };

  const handlePickWinners = () => {
    writeContract({ address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'pickWinners', args: [BigInt(tokenId), BigInt(winnerCount)] });
  };

  // 2. CONTENT CAMPAIGN ACTIONS (V5 Update)
  const handleSetCampaign = () => {
    // V5 Logic: Fee, Max, Duration (Seconds), Reward Image URI
    const durationInSeconds = BigInt(Number(contentDuration) * 3600);
    
    writeContract({ 
        address: SWAG_CONTRACT_ADDRESS, 
        abi: SWAG_CONTRACT_ABI, 
        functionName: 'setContentCampaign', 
        args: [
            parseEther(contentFee), 
            BigInt(contentMax), 
            durationInSeconds,
            rewardImage
        ]
    });
  };

  // 3. TREASURY ACTIONS
  const handleWithdraw = () => {
    writeContract({ address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'withdrawEarnings', args: [] });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans selection:bg-teal-500 selection:text-black">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3"><Lock className="w-8 h-8 text-teal-500"/> Admin Console <span className="text-xs bg-teal-500 text-black px-2 py-0.5 rounded font-bold">V5</span></h1>
            <p className="text-neutral-500 mt-2">Manage Drops, UGC Campaigns, and Treasury.</p>
          </div>
          <ConnectButton />
        </header>

        {/* NOTIFICATIONS */}
        {isSuccess && (
          <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-xl flex items-center gap-3 text-green-400 animate-in slide-in-from-top">
            <CheckCircle2 className="w-5 h-5"/> <span className="font-bold">Transaction Confirmed!</span>
            {lastMintedId && <span className="text-sm opacity-80">(Token ID #{lastMintedId})</span>}
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm break-all flex gap-3 items-center">
             <AlertTriangle className="w-5 h-5"/> Error: {error.message.split('\n')[0]}
          </div>
        )}

        {/* --- SECTION 1: RAFFLE OPERATIONS --- */}
        <div>
           <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Ticket className="w-6 h-6 text-purple-500"/> Raffle Operations</h3>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* CARD 1: MINT */}
              <div className="bg-[#111] p-8 rounded-3xl border border-white/10 hover:border-purple-500/30 transition-all">
                <h2 className="font-bold text-lg mb-4 text-purple-400">1. Mint Artifact</h2>
                <div className="space-y-4">
                  <input type="text" placeholder="Image URL (IPFS/Unsplash)" value={tokenURI} onChange={(e) => setTokenURI(e.target.value)} className="w-full bg-black border border-white/20 p-4 rounded-xl outline-none focus:border-purple-500 transition-colors"/>
                  <button onClick={handleMint} disabled={isPending} className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-purple-500 hover:text-white transition-all disabled:opacity-50">
                      {isPending ? <Loader2 className="animate-spin mx-auto"/> : "Mint NFT"}
                  </button>
                </div>
              </div>

              {/* CARD 2: START */}
              <div className="bg-[#111] p-8 rounded-3xl border border-white/10 hover:border-purple-500/30 transition-all">
                <h2 className="font-bold text-lg mb-4 text-purple-400">2. Launch Drop</h2>
                <div className="space-y-4">
                  <input type="number" placeholder="Token ID" value={tokenId} onChange={(e) => setTokenId(e.target.value)} className="w-full bg-black border border-white/20 p-3 rounded-xl outline-none focus:border-purple-500"/>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="ETH Price" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} className="bg-black border border-white/20 p-3 rounded-xl outline-none focus:border-purple-500"/>
                    <input type="number" placeholder="Max Spots" value={maxTickets} onChange={(e) => setMaxTickets(e.target.value)} className="bg-black border border-white/20 p-3 rounded-xl outline-none focus:border-purple-500"/>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleApprove} disabled={isPending} className="flex-1 border border-white/20 py-3 rounded-xl font-bold hover:bg-white/10">Approve</button>
                    <button onClick={handleStartRaffle} disabled={isPending} className="flex-[2] bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-500">Launch</button>
                  </div>
                </div>
              </div>

              {/* CARD 3: DRAW */}
              <div className="bg-[#111] p-8 rounded-3xl border border-white/10 hover:border-purple-500/30 transition-all">
                <h2 className="font-bold text-lg mb-4 text-purple-400">3. Pick Winners</h2>
                <div className="space-y-4">
                   <div className="flex gap-3">
                      <input type="number" placeholder="ID" value={tokenId} onChange={(e) => setTokenId(e.target.value)} className="w-20 bg-black border border-white/20 p-3 rounded-xl text-center"/>
                      <input type="number" placeholder="Count" value={winnerCount} onChange={(e) => setWinnerCount(e.target.value)} className="flex-1 bg-black border border-white/20 p-3 rounded-xl text-center"/>
                   </div>
                   <button onClick={handlePickWinners} disabled={isPending} className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-400 shadow-lg shadow-yellow-500/20">
                      Draw Winners
                   </button>
                   <p className="text-xs text-neutral-500 text-center">1st place gets NFT. Others are runners up.</p>
                </div>
              </div>
           </div>
        </div>

        {/* --- SECTION 2: CONTENT CAMPAIGN (UGC) --- */}
        <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Globe className="w-6 h-6 text-blue-500"/> Community Campaign</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* CAMPAIGN SETTINGS */}
                <div className="bg-[#111] p-8 rounded-3xl border border-white/10 hover:border-blue-500/30 transition-all">
                    <h2 className="font-bold text-lg mb-4 text-blue-400">Set Campaign Rules</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-neutral-500 uppercase font-bold">Entry Fee (ETH)</label>
                            <input type="number" value={contentFee} onChange={(e) => setContentFee(e.target.value)} className="w-full bg-black border border-white/20 p-3 rounded-xl focus:border-blue-500 outline-none"/>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-neutral-500 uppercase font-bold">Max Slots</label>
                                <input type="number" value={contentMax} onChange={(e) => setContentMax(e.target.value)} className="w-full bg-black border border-white/20 p-3 rounded-xl focus:border-blue-500 outline-none"/>
                            </div>
                            <div>
                                <label className="text-xs text-neutral-500 uppercase font-bold">Hours</label>
                                <input type="number" value={contentDuration} onChange={(e) => setContentDuration(e.target.value)} className="w-full bg-black border border-white/20 p-3 rounded-xl focus:border-blue-500 outline-none"/>
                            </div>
                        </div>
                        {/* V5: REWARD IMAGE INPUT */}
                        <div>
                            <label className="text-xs text-neutral-500 uppercase font-bold flex items-center gap-1"><ImageIcon className="w-3 h-3"/> Reward NFT Image</label>
                            <input type="text" value={rewardImage} onChange={(e) => setRewardImage(e.target.value)} className="w-full bg-black border border-white/20 p-3 rounded-xl focus:border-blue-500 outline-none text-xs text-neutral-400"/>
                        </div>

                        <button onClick={handleSetCampaign} disabled={isPending} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-500/20">
                            Start New Campaign
                        </button>
                    </div>
                </div>

                {/* CAMPAIGN STATUS & TREASURY */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Status Card */}
                    <div className="bg-[#111] p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
                        <div>
                           <h2 className="font-bold text-lg mb-2 text-neutral-400">Current Status</h2>
                           <div className="flex items-center gap-2">
                               <div className={`w-3 h-3 rounded-full ${isContentActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}/>
                               <span className="text-2xl font-bold">{isContentActive ? "Active" : "Inactive"}</span>
                           </div>
                        </div>
                        <div className="mt-6">
                           <div className="flex justify-between text-sm mb-2 text-neutral-500"><span>Slots Filled</span><span>{filledSlots} / {maxSlots}</span></div>
                           <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-blue-500 transition-all" style={{ width: `${maxSlots > 0 ? (filledSlots/maxSlots)*100 : 0}%` }}/></div>
                        </div>
                    </div>

                    {/* Treasury Card */}
                    <div className="bg-[#111] p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-24 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"/>
                        <h2 className="font-bold text-lg mb-2 text-green-400">Contract Treasury</h2>
                        <div className="text-4xl font-bold mb-6">{contractBalance ? Number(contractBalance.formatted).toFixed(4) : '0.00'} <span className="text-lg text-neutral-500">ETH</span></div>
                        <button onClick={handleWithdraw} disabled={isPending} className="w-full border border-green-500/30 text-green-400 font-bold py-3 rounded-xl hover:bg-green-500 hover:text-black transition-all flex items-center justify-center gap-2">
                            <Wallet className="w-4 h-4"/> Withdraw All
                        </button>
                    </div>
                </div>

            </div>
        </div>

        {/* --- SECTION 3: MODERATION FEED (VIEW SUBMISSIONS) --- */}
        <div className="pb-20">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Users className="w-6 h-6 text-orange-500"/> Submission Feed</h3>
            <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden">
                <div className="grid grid-cols-12 bg-white/5 p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    <div className="col-span-1">#</div>
                    <div className="col-span-3">Submitter</div>
                    <div className="col-span-6">Content URL</div>
                    <div className="col-span-2 text-right">Action</div>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    {(allContent as any[])?.length > 0 ? (allContent as any[]).map((item, idx) => (
                        <div key={idx} className="grid grid-cols-12 p-4 border-b border-white/5 items-center hover:bg-white/5 transition-colors text-sm">
                            <div className="col-span-1 text-neutral-500">{idx + 1}</div>
                            <div className="col-span-3 font-mono text-xs text-blue-400">{item.submitter}</div>
                            <div className="col-span-6 truncate pr-4 text-neutral-300">{item.contentUrl}</div>
                            <div className="col-span-2 text-right">
                                <a href={item.contentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 rounded-lg font-bold hover:bg-teal-400">
                                    View <ExternalLink className="w-3 h-3"/>
                                </a>
                            </div>
                        </div>
                    )) : (
                        <div className="p-12 text-center text-neutral-500">No submissions found in the current campaign.</div>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}