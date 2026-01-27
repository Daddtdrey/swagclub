"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home, Ticket, Wallet, Zap, 
  ChevronRight, Loader2, Sun, Moon, ShoppingBag, X, Trophy, RefreshCw, Lock, CheckCircle2, Globe, Link as LinkIcon, DollarSign, ExternalLink, Search, Sparkles, Tag // ADDED TAG HERE
} from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useWriteContract, useAccount, usePublicClient, useBalance, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { SWAG_CONTRACT_ADDRESS, SWAG_CONTRACT_ABI } from '../config/contract';

const MARKET_LISTINGS = [
  { id: 101, title: "Cultural Pop #4", price: "0.85", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400", seller: "0x8a...42B" },
  { id: 102, title: "Cultural Pop #9", price: "1.20", image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400", seller: "0x3c...99A" },
];

export default function DiscoverDashboard() {
  const [activeTab, setActiveTab] = useState('Home');
  const [isDark, setIsDark] = useState(true);
  const { address } = useAccount();
  const { data: ethBalance } = useBalance({ address });

  // --- CONTRACT READS ---
  const { data: contentStatus, refetch: refetchStatus } = useReadContract({
    address: SWAG_CONTRACT_ADDRESS,
    abi: SWAG_CONTRACT_ABI,
    functionName: 'getContentStatus',
    account: address,
  });
  
  const { data: allContent, refetch: refetchContent } = useReadContract({
    address: SWAG_CONTRACT_ADDRESS,
    abi: SWAG_CONTRACT_ABI,
    functionName: 'getAllContent',
  });

  // Safe Stats Parsing (V5 ABI)
  // [count, max, fee, active, userHasSubmitted]
  const filledSlots = contentStatus ? Number((contentStatus as any)[0]) : 0;
  const maxSlots = contentStatus ? Number((contentStatus as any)[1]) : 50;
  const fee = contentStatus ? formatEther((contentStatus as any)[2]) : '0.001';
  const isActive = contentStatus ? (contentStatus as any)[3] : false;
  const hasUserSubmitted = contentStatus ? (contentStatus as any)[4] : false;

  // --- SCANNER ---
  const publicClient = usePublicClient();
  const [liveRaffles, setLiveRaffles] = useState<any[]>([]);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [mySupporterNFTs, setMySupporterNFTs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const scanChain = useCallback(async () => {
      if (!publicClient) return;
      setIsLoading(true);
      try {
        const totalIds = await publicClient.readContract({
            address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'tokenIds'
        }) as bigint;
        
        const foundRaffles = [];
        const myFoundTickets = [];
        const myNFTs = [];
        
        // Scan last 15 items
        for (let i = Number(totalIds); i > Math.max(0, Number(totalIds) - 15); i--) {
          try {
            // Check ownership
            let owner = "";
            try {
                owner = await publicClient.readContract({
                    address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'ownerOf', args: [BigInt(i)]
                }) as string;
            } catch(e) {}

            // Try to get Raffle Details (Will fail if it's just a Supporter NFT, which is expected)
            let isRaffle = false;
            let details: any = null;
            try {
                details = await publicClient.readContract({ address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'getRaffleDetails', args: [BigInt(i)] });
                // If maxTickets > 0, it's likely a raffle
                if(Number(details[2]) > 0) isRaffle = true;
            } catch(e) {}

            // Get Image
            let imageUrl = "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800"; 
            try {
               const uri = await publicClient.readContract({ address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'tokenURI', args: [BigInt(i)] }) as string;
               if (uri && uri.length > 5) imageUrl = uri;
            } catch (err) {}

            if (isRaffle) {
                // RAFFLE LOGIC
                let hasEntered = false;
                if (address) {
                    try { hasEntered = await publicClient.readContract({ address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'checkHasTicket', args: [BigInt(i), address] }) as boolean; } catch (e) {}
                }

                const raffleItem = {
                    id: i,
                    price: formatEther(details[0]),
                    sold: Number(details[1]),
                    max: Number(details[2]),
                    active: details[3],
                    winner: details[4],
                    hasEntered: hasEntered, 
                    title: `Cultural Pop #${i}`, 
                    description: details[3] ? "Verified On-Chain Drop." : "Drop Ended.",
                    image: imageUrl,
                    progress: Math.min((Number(details[1]) / Number(details[2])) * 100, 100)
                };

                if (details[3]) foundRaffles.push(raffleItem);
                
                if (hasEntered) {
                   if (details[3]) myFoundTickets.push({ ...raffleItem, status: 'ACTIVE' });
                   else if (!details[3] && details[4].toLowerCase() === address?.toLowerCase()) myFoundTickets.push({ ...raffleItem, status: 'WON' });
                   else myFoundTickets.push({ ...raffleItem, status: 'LOST' });
                }
            } else {
                // SUPPORTER NFT LOGIC (It's not a raffle, it's a minted NFT)
                if (address && owner.toLowerCase() === address.toLowerCase()) {
                    myNFTs.push({
                        id: i,
                        title: `Supporter Badge #${i}`,
                        image: imageUrl,
                        type: 'SUPPORTER'
                    });
                }
            }
          } catch (err) { console.warn(`Error reading ID ${i}`, err); }
        }
        setLiveRaffles(foundRaffles);
        setMyTickets(myFoundTickets);
        setMySupporterNFTs(myNFTs);
      } catch (e) { console.error("Scanner Error:", e); } 
      finally { setIsLoading(false); }
  }, [publicClient, address]);

  useEffect(() => { scanChain(); }, [scanChain]);
  const activeRaffle = liveRaffles.length > 0 ? liveRaffles[currentSlide] : null;

  // --- ACTIONS ---
  const { writeContract, data: hash, isPending, isSuccess } = useWriteContract();
  const { isSuccess: txSuccess } = useWaitForTransactionReceipt({ hash });
  
  // NEW: Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => { 
      if (txSuccess) { 
          setTicketModalOpen(false); 
          setContentModalOpen(false); 
          setListModalOpen(false);
          setShowSuccessModal(true); // Trigger Animation
          scanChain(); 
          refetchStatus();
          refetchContent();
      } 
  }, [txSuccess, scanChain, refetchStatus, refetchContent]);

  // Actions
  const handleBuyTicket = () => {
    if (!activeRaffle) return;
    writeContract({ address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'buyTicket', args: [BigInt(activeRaffle.id)], value: parseEther(activeRaffle.price) });
  };

  const handleSwapTicket = (id: number) => {
    if(!confirm("Are you sure? 70% of ticket price will be refunded.")) return;
    writeContract({ address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'sellTicket', args: [BigInt(id)] });
  };

  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [submissionUrl, setSubmissionUrl] = useState('');
  
  const handleSubmitContent = () => {
      if(!submissionUrl) return;
      writeContract({
          address: SWAG_CONTRACT_ADDRESS,
          abi: SWAG_CONTRACT_ABI,
          functionName: 'submitContent',
          args: [submissionUrl],
          value: parseEther(fee)
      });
  };

  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  
  // Listing logic (Simulated)
  const [listModalOpen, setListModalOpen] = useState(false);
  const [selectedItemToList, setSelectedItemToList] = useState<any>(null);
  const [listingPrice, setListingPrice] = useState('0.5');

  const openListModal = (item: any) => { setSelectedItemToList(item); setListModalOpen(true); };
  const handleListForSale = () => { alert(`Listed for ${listingPrice} ETH`); setListModalOpen(false); };

  const winningTickets = myTickets.filter(t => t.status === 'WON');

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#FAFAFA] text-[#1a1a1a]'}`}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        .font-grotesk { font-family: 'Space Grotesk', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* SIDEBAR (Same as before) */}
      <aside className={`hidden md:flex w-24 flex-col items-center py-8 gap-6 border-r z-20 ${isDark ? 'border-white/10 bg-black' : 'border-black/5 bg-white'}`}>
         <Link href="/"><div className="mb-4 hover:scale-110 transition-transform cursor-pointer"><img src="/logo.png" className="w-12 h-12 object-contain rounded-full" /></div></Link>
         <NavCircle icon={<Home />} active={activeTab === 'Home'} onClick={() => setActiveTab('Home')} isDark={isDark} />
         <NavCircle icon={<Globe />} active={activeTab === 'Community'} onClick={() => setActiveTab('Community')} isDark={isDark} />
         <NavCircle icon={<ShoppingBag />} active={activeTab === 'Market'} onClick={() => setActiveTab('Market')} isDark={isDark} />
         <NavCircle icon={<Wallet />} active={activeTab === 'Wallet'} onClick={() => setActiveTab('Wallet')} isDark={isDark} />
         <div className="mt-auto"><button onClick={() => setIsDark(!isDark)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/10 text-yellow-400' : 'bg-neutral-100 text-black'}`}>{isDark ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}</button></div>
      </aside>

      {/* MOBILE NAV (Same as before) */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 h-20 border-t z-50 flex justify-around items-center px-6 ${isDark ? 'bg-black border-white/10' : 'bg-white border-black/5'}`}>
         <NavCircle icon={<Home />} active={activeTab === 'Home'} onClick={() => setActiveTab('Home')} isDark={isDark} mobile />
         <NavCircle icon={<Globe />} active={activeTab === 'Community'} onClick={() => setActiveTab('Community')} isDark={isDark} mobile />
         <NavCircle icon={<ShoppingBag />} active={activeTab === 'Market'} onClick={() => setActiveTab('Market')} isDark={isDark} mobile />
         <NavCircle icon={<Wallet />} active={activeTab === 'Wallet'} onClick={() => setActiveTab('Wallet')} isDark={isDark} mobile />
      </div>

      <main className={`flex-1 h-screen overflow-y-auto relative no-scrollbar ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#FAFAFA]'}`}>
        <header className={`sticky top-0 z-30 px-6 md:px-8 py-6 flex justify-between items-center backdrop-blur-md ${isDark ? 'bg-[#0a0a0a]/80' : 'bg-[#FAFAFA]/80'}`}>
           <div className="flex items-center gap-2 font-bold font-grotesk text-xl tracking-tight">SwagClub <span className="text-xs bg-teal-500 text-black px-2 py-0.5 rounded-full font-bold">V5</span></div>
           <ConnectButton showBalance={false} accountStatus="avatar" />
        </header>

        <div className="px-6 md:px-8 pb-32 max-w-[1600px] mx-auto">
          
          {/* HOME TAB */}
          {activeTab === 'Home' && (
            <>
              <div className="flex items-center justify-between mb-6 animate-in fade-in"><h2 className="text-2xl font-bold font-grotesk flex items-center gap-2">Live Drops <Zap className="w-5 h-5 text-yellow-500 fill-current"/></h2></div>
              {!isLoading && activeRaffle ? (
                 <section className="relative w-full min-h-[500px] rounded-[40px] overflow-hidden bg-black text-white shadow-2xl group animate-in zoom-in-95">
                    <img src={activeRaffle.image} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-60 transition-all duration-700"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    <div className="relative h-full p-12 flex flex-col justify-end items-start z-10">
                        <div className="flex items-center gap-2 mb-4"><span className="px-3 py-1 bg-white text-black text-xs font-bold rounded-full">LIVE</span><span className="text-sm font-bold">{activeRaffle.sold} / {activeRaffle.max} Tickets</span></div>
                        <h1 className="text-4xl md:text-6xl font-grotesk font-bold mb-4">{activeRaffle.title}</h1>
                        <p className="max-w-md text-neutral-300 mb-8">{activeRaffle.description}</p>
                        <button onClick={() => !activeRaffle.hasEntered && setTicketModalOpen(true)} disabled={activeRaffle.hasEntered} className={`px-10 py-5 rounded-full font-bold text-lg transition-all ${activeRaffle.hasEntered ? 'bg-green-500 text-black' : 'bg-white text-black hover:bg-teal-400'}`}>
                            {activeRaffle.hasEntered ? 'Entry Confirmed' : `Mint Ticket (${activeRaffle.price} ETH)`}
                        </button>
                    </div>
                 </section>
              ) : ( <div className="p-20 text-center border border-dashed rounded-[40px] opacity-50">No Active Raffles.</div> )}
            </>
          )}

          {/* COMMUNITY TAB */}
          {activeTab === 'Community' && (
             <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                   <div>
                      <h2 className={`text-3xl font-bold font-grotesk ${isDark ? 'text-white' : 'text-black'}`}>Community Board</h2>
                      <p className="text-neutral-500 mt-2">Back your content on-chain. Admin curated.</p>
                   </div>
                   <button 
                      onClick={() => setContentModalOpen(true)} 
                      disabled={hasUserSubmitted}
                      className={`px-6 py-3 font-bold rounded-full flex items-center gap-2 shadow-lg ${hasUserSubmitted ? 'bg-green-500 text-black cursor-default' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
                   >
                       {hasUserSubmitted ? <><CheckCircle2 className="w-4 h-4"/> Submitted</> : <><LinkIcon className="w-4 h-4"/> Submit Content</>}
                   </button>
                </div>
                
                <div className={`p-6 rounded-3xl border mb-8 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-neutral-200'}`}>
                    <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400"/> Live Slots</span>
                        <span>{filledSlots} / {maxSlots}</span>
                    </div>
                    <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(filledSlots/maxSlots)*100}%` }}></div>
                    </div>
                    {!isActive && <p className="text-red-400 text-xs mt-2 font-bold uppercase">Submissions Closed</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(allContent as any[])?.length > 0 ? (allContent as any[]).map((item, i) => (
                        <div key={i} className={`p-6 rounded-3xl border flex flex-col justify-between h-40 group hover:border-blue-500/50 transition-colors ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-neutral-200'}`}>
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-xs font-bold bg-neutral-800 text-neutral-400 px-3 py-1 rounded-full">#{i+1}</div>
                                    <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-white"/>
                                </div>
                                <a href={item.contentUrl} target="_blank" className="text-lg font-bold truncate block hover:text-blue-400 transition-colors">{item.contentUrl}</a>
                            </div>
                            <p className="text-xs text-neutral-500 font-mono">{item.submitter.slice(0,6)}...{item.submitter.slice(-4)}</p>
                        </div>
                    )) : (<div className="col-span-2 p-12 text-center text-neutral-500 border border-dashed rounded-3xl">No submissions yet.</div>)}
                </div>
             </div>
          )}

          {/* MARKET TAB */}
          {activeTab === 'Market' && (
             <div className="animate-in fade-in slide-in-from-bottom-4">
                {/* Winners Area */}
                {winningTickets.length > 0 && (
                  <div className={`p-8 mb-12 rounded-[40px] border relative overflow-hidden ${isDark ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'}`}>
                     <div className="flex items-center gap-2 mb-6 text-yellow-500"><Trophy className="w-6 h-6"/><h3 className="font-bold text-xl">Winner's Access</h3></div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {winningTickets.map((ticket, idx) => (
                           <div key={idx} className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl">
                              <img src={ticket.image} className="w-16 h-16 rounded-xl object-cover"/>
                              <div><h4 className="font-bold">{ticket.title}</h4><button onClick={() => openListModal(ticket)} className="text-xs bg-yellow-500 text-black px-3 py-1.5 rounded-lg font-bold mt-1 hover:bg-yellow-400 flex items-center gap-1"><Tag className="w-3 h-3"/> List Asset</button></div>
                           </div>
                        ))}
                     </div>
                  </div>
                )}
                {/* Public Area */}
                <h2 className={`text-3xl font-bold font-grotesk mb-6 ${isDark ? 'text-white' : 'text-black'}`}>Marketplace</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MARKET_LISTINGS.map((item) => (
                        <div key={item.id} className={`p-4 rounded-3xl border group ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-neutral-200'}`}>
                            <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-4"><img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/></div>
                            <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                            <div className="flex items-center justify-between"><span className="text-lg font-bold">{item.price} ETH</span><button className="px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-teal-400 transition-colors">Buy</button></div>
                        </div>
                    ))}
                </div>
             </div>
          )}

          {/* WALLET TAB */}
          {activeTab === 'Wallet' && (
            <div className="animate-in slide-in-from-bottom-4">
               <h2 className={`text-2xl font-bold font-grotesk mb-8 ${isDark ? 'text-white' : 'text-black'}`}>My Wallet</h2>
               <div className={`p-8 rounded-[40px] mb-12 flex flex-col md:flex-row justify-between items-center gap-8 ${isDark ? 'bg-neutral-900 border border-white/10' : 'bg-black text-white'}`}>
                  <div><p className="text-neutral-400 text-sm mb-2 uppercase tracking-widest">Available Balance</p><h3 className="text-4xl font-grotesk font-bold text-teal-400">{ethBalance ? Number(ethBalance.formatted).toFixed(3) : '0.00'} <span className="text-lg text-white">ETH</span></h3></div>
               </div>
               
               {/* 1. Supporter NFTs */}
               {mySupporterNFTs.length > 0 && (
                   <div className="mb-12">
                       <h3 className="font-bold text-lg mb-4 text-blue-400">Supporter Badges</h3>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           {mySupporterNFTs.map((nft, i) => (
                               <div key={i} className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-2xl text-center">
                                   <img src={nft.image} className="w-full aspect-square rounded-xl object-cover mb-2"/>
                                   <p className="font-bold text-sm">Supporter #{nft.id}</p>
                               </div>
                           ))}
                       </div>
                   </div>
               )}

               {/* 2. Raffle Tickets */}
               <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>Raffle Tickets</h3>
               {myTickets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {myTickets.map((ticket, idx) => (
                        <div key={idx} className={`p-4 rounded-3xl border flex flex-col gap-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
                           <div className="relative h-40 rounded-2xl overflow-hidden bg-gray-800"><img src={ticket.image} className="w-full h-full object-cover"/><div className="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded bg-black/50 backdrop-blur text-white">{ticket.status}</div></div>
                           <h4 className="font-bold">{ticket.title}</h4>
                           {ticket.status === 'ACTIVE' && (<button onClick={() => handleSwapTicket(ticket.id)} disabled={isPending} className="w-full py-3 bg-yellow-500/10 text-yellow-500 rounded-xl font-bold hover:bg-yellow-500 hover:text-black transition-all flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4"/> Swap (70% Refund)</button>)}
                        </div>
                     ))}
                  </div>
               ) : (<div className="p-12 border border-dashed rounded-[40px] text-center text-neutral-500">No tickets found.</div>)}
            </div>
          )}

        </div>
      </main>

      {/* --- MODALS --- */}
      {ticketModalOpen && activeRaffle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md">
           <div className="bg-white w-full max-w-md p-8 rounded-[40px] relative shadow-2xl text-black">
              <button onClick={() => setTicketModalOpen(false)} className="absolute top-6 right-6 p-2 bg-neutral-100 rounded-full hover:bg-neutral-200"><X className="w-4 h-4"/></button>
              <h3 className="text-2xl font-bold text-center mb-6">Secure Ticket</h3>
              <div className="bg-neutral-50 p-6 rounded-3xl mb-6 border text-center"><span className="text-4xl font-bold text-teal-600">{activeRaffle.price} ETH</span></div>
              <button onClick={handleBuyTicket} disabled={isPending} className="w-full py-5 bg-black text-white rounded-full font-bold text-lg hover:bg-neutral-800 transition-all disabled:opacity-50">{isPending ? <Loader2 className="animate-spin mx-auto"/> : 'Confirm Purchase'}</button>
           </div>
        </div>
      )}

      {contentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md">
           <div className="bg-white w-full max-w-md p-8 rounded-[40px] relative shadow-2xl text-black">
              <button onClick={() => setContentModalOpen(false)} className="absolute top-6 right-6 p-2 bg-neutral-100 rounded-full hover:bg-neutral-200"><X className="w-4 h-4"/></button>
              <h3 className="text-2xl font-bold text-center mb-6">Submit Content</h3>
              <div className="bg-neutral-50 p-6 rounded-3xl mb-6 border text-center"><p className="text-xs uppercase text-neutral-500 mb-1">Fee</p><span className="text-3xl font-bold">{fee} ETH</span></div>
              <input type="text" placeholder="https://..." value={submissionUrl} onChange={(e) => setSubmissionUrl(e.target.value)} className="w-full p-4 border rounded-xl mb-4 outline-none focus:border-blue-500"/>
              <button onClick={handleSubmitContent} disabled={isPending || !submissionUrl} className="w-full py-4 bg-black text-white rounded-full font-bold text-lg hover:bg-neutral-800 transition-all disabled:opacity-50">{isPending ? 'Processing...' : 'Pay & Submit'}</button>
           </div>
        </div>
      )}

      {/* SUCCESS MODAL with NFT REVEAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
           <div className="text-center">
               <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in spin-in-12 duration-700">
                   <CheckCircle2 className="w-16 h-16 text-black"/>
               </div>
               <h2 className="text-4xl font-bold text-white mb-2 font-grotesk">Transaction Successful!</h2>
               <p className="text-neutral-400 mb-8">Your support has been recorded on-chain.</p>
               
               <div className="p-6 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-md max-w-sm mx-auto mb-8">
                   <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">Item Received</p>
                   <div className="w-full aspect-square bg-black rounded-xl mb-3 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800" className="w-full h-full object-cover opacity-80"/>
                   </div>
                   <p className="font-bold text-white">Supporter NFT Minted</p>
               </div>
               
               <button onClick={() => setShowSuccessModal(false)} className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-all">
                   Awesome!
               </button>
           </div>
        </div>
      )}
      
      {/* Listing Modal */}
      {listModalOpen && selectedItemToList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md">
           <div className="bg-white w-full max-w-md p-8 rounded-[40px] relative shadow-2xl text-black">
              <button onClick={() => setListModalOpen(false)} className="absolute top-6 right-6 p-2 bg-neutral-100 rounded-full hover:bg-neutral-200"><X className="w-4 h-4"/></button>
              <h3 className="text-2xl font-bold mb-4">List {selectedItemToList.title}</h3>
              <div className="relative mb-6">
                 <input type="number" value={listingPrice} onChange={(e) => setListingPrice(e.target.value)} className="w-full p-4 bg-neutral-50 rounded-2xl text-3xl font-bold border pl-12 outline-none"/>
                 <DollarSign className="absolute left-4 top-6 w-6 h-6 text-neutral-400"/>
              </div>
              <button onClick={handleListForSale} className="w-full py-5 bg-black text-white rounded-full font-bold text-xl hover:bg-neutral-800 transition-all">Confirm Listing</button>
           </div>
        </div>
      )}

    </div>
  );
}

function NavCircle({ icon, active, onClick, isDark, mobile }: any) {
  return <button onClick={onClick} className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${active ? 'bg-teal-500 text-black shadow-lg shadow-teal-500/20' : 'text-neutral-400 hover:bg-white/10'}`}>{icon}</button>
}