"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home, Ticket, Wallet, Zap, MapPin, 
  ChevronRight, ChevronLeft, Loader2, 
  Sun, Moon, ShoppingBag, X, Trophy, RefreshCw, Lock, CheckCircle2, AlertCircle, DollarSign, Tag
} from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useWriteContract, useAccount, usePublicClient, useBalance, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { SWAG_CONTRACT_ADDRESS, SWAG_CONTRACT_ABI } from '../config/contract';

export default function DiscoverDashboard() {
  const [activeTab, setActiveTab] = useState('Home');
  const [isDark, setIsDark] = useState(true);
  const { address } = useAccount();
  const { data: ethBalance } = useBalance({ address });

  // --- STATE ---
  const publicClient = usePublicClient();
  const [liveRaffles, setLiveRaffles] = useState<any[]>([]);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // --- 1. V3 SCANNER ---
  const scanChain = useCallback(async () => {
      if (!publicClient) return;
      setIsLoading(true);
      try {
        const totalIds = await publicClient.readContract({
            address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'tokenIds'
        }) as bigint;
        
        const foundRaffles = [];
        const myFoundTickets = [];
        
        // Scan last 10 items
        for (let i = Number(totalIds); i > Math.max(0, Number(totalIds) - 10); i--) {
          try {
            // A. Get Details
            const details: any = await publicClient.readContract({
              address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'getRaffleDetails', args: [BigInt(i)]
            });
            
            // B. Get Image
            let imageUrl = "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800"; 
            try {
               const uri = await publicClient.readContract({
                  address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'tokenURI', args: [BigInt(i)]
               }) as string;
               if (uri && uri.length > 5) imageUrl = uri;
            } catch (err) {}

            // C. V3 Check
            let hasEntered = false;
            if (address) {
               try {
                 hasEntered = await publicClient.readContract({
                    address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'checkHasTicket', args: [BigInt(i), address]
                 }) as boolean;
               } catch (e) {}
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
                description: details[3] ? "Verified On-Chain Drop. Limited Entry." : "Drop Ended.",
                image: imageUrl,
                progress: Math.min((Number(details[1]) / Number(details[2])) * 100, 100)
            };

            if (details[3]) foundRaffles.push(raffleItem);

            if (hasEntered) {
               if (details[3]) myFoundTickets.push({ ...raffleItem, status: 'ACTIVE' });
               else if (!details[3] && details[4].toLowerCase() === address?.toLowerCase()) myFoundTickets.push({ ...raffleItem, status: 'WON' });
               else myFoundTickets.push({ ...raffleItem, status: 'LOST' });
            }

          } catch (err) { console.warn(`Error reading ID ${i}`, err); }
        }
        setLiveRaffles(foundRaffles);
        setMyTickets(myFoundTickets);
      } catch (e) { console.error("Scanner Error:", e); } 
      finally { setIsLoading(false); }
  }, [publicClient, address]);

  useEffect(() => { scanChain(); }, [scanChain, refreshTrigger]);

  const activeRaffle = liveRaffles.length > 0 ? liveRaffles[currentSlide] : null;

  // --- ACTIONS ---
  const { writeContract, data: hash, isPending, isSuccess } = useWriteContract();
  const { isSuccess: txSuccess } = useWaitForTransactionReceipt({ hash });
  
  useEffect(() => {
    if (txSuccess) {
        setTicketModalOpen(false);
        setListModalOpen(false); // Close listing modal if open
        setTimeout(() => setRefreshTrigger(prev => prev + 1), 2000);
    }
  }, [txSuccess]);

  const handleBuyTicket = () => {
    if (!activeRaffle) return;
    writeContract({ 
      address: SWAG_CONTRACT_ADDRESS, 
      abi: SWAG_CONTRACT_ABI, 
      functionName: 'buyTicket', 
      args: [BigInt(activeRaffle.id)], 
      value: parseEther(activeRaffle.price) 
    });
  };

  const handleSwapTicket = (id: number) => {
    if(!confirm("Are you sure? You will get 70% refund and lose your chance to win.")) return;
    writeContract({ 
      address: SWAG_CONTRACT_ADDRESS, 
      abi: SWAG_CONTRACT_ABI, 
      functionName: 'sellTicket', 
      args: [BigInt(id)]
    });
  };

  // --- MARKETPLACE LOGIC ---
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  
  // NEW: Listing Modal State
  const [listModalOpen, setListModalOpen] = useState(false);
  const [selectedItemToList, setSelectedItemToList] = useState<any>(null);
  const [listingPrice, setListingPrice] = useState('0.5');

  const openListModal = (item: any) => {
      setSelectedItemToList(item);
      setListModalOpen(true);
  };

  const handleListForSale = () => {
      // Since V3 doesn't have P2P listing yet, we mock the success for the UI demo.
      // In V4, this would call 'listTicket(id, price)'
      alert(`Successfully listed ${selectedItemToList.title} for ${listingPrice} ETH! (This is a simulation for V3)`);
      setListModalOpen(false);
  };

  // Filter Winners
  const winningTickets = myTickets.filter(t => t.status === 'WON');

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#FAFAFA] text-[#1a1a1a]'}`}>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        .font-grotesk { font-family: 'Space Grotesk', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .ios-scroll { -webkit-overflow-scrolling: touch; }
      `}</style>

      {/* SIDEBAR */}
      <aside className={`hidden md:flex w-24 flex-col items-center py-8 gap-6 border-r z-20 ${isDark ? 'border-white/10 bg-black' : 'border-black/5 bg-white'}`}>
         <Link href="/">
           <div className="mb-4 hover:scale-110 transition-transform cursor-pointer">
              <img src="/logo.png" alt="SwagClub" className="w-12 h-12 object-contain rounded-full" />
           </div>
         </Link>
         <NavCircle icon={<Home />} active={activeTab === 'Home'} onClick={() => setActiveTab('Home')} isDark={isDark} />
         <NavCircle icon={<ShoppingBag />} active={activeTab === 'Market'} onClick={() => setActiveTab('Market')} isDark={isDark} />
         <NavCircle icon={<Wallet />} active={activeTab === 'Wallet'} onClick={() => setActiveTab('Wallet')} isDark={isDark} />
         <div className="mt-auto">
            <button onClick={() => setIsDark(!isDark)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/10 text-yellow-400' : 'bg-neutral-100 text-black'}`}>
               {isDark ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
            </button>
         </div>
      </aside>

      {/* MOBILE NAV */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 h-20 border-t z-50 flex justify-around items-center px-6 ${isDark ? 'bg-black border-white/10' : 'bg-white border-black/5'}`}>
         <NavCircle icon={<Home />} active={activeTab === 'Home'} onClick={() => setActiveTab('Home')} isDark={isDark} mobile />
         <NavCircle icon={<ShoppingBag />} active={activeTab === 'Market'} onClick={() => setActiveTab('Market')} isDark={isDark} mobile />
         <NavCircle icon={<Wallet />} active={activeTab === 'Wallet'} onClick={() => setActiveTab('Wallet')} isDark={isDark} mobile />
      </div>

      <main className={`flex-1 h-screen overflow-y-auto relative no-scrollbar ios-scroll ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#FAFAFA]'}`}>
        
        <header className={`sticky top-0 z-30 px-6 md:px-8 py-6 flex justify-between items-center backdrop-blur-md ${isDark ? 'bg-[#0a0a0a]/80' : 'bg-[#FAFAFA]/80'}`}>
           <div className="flex items-center gap-2 font-bold font-grotesk text-xl tracking-tight">SwagClub <span className="text-xs bg-teal-500 text-black px-2 py-0.5 rounded-full font-bold">V3</span></div>
           <ConnectButton showBalance={false} accountStatus="avatar" />
        </header>

        <div className="px-6 md:px-8 pb-32 max-w-[1600px] mx-auto">
          
          {/* === HOME TAB === */}
          {activeTab === 'Home' && (
            <>
              <div className="flex items-center justify-between mb-6 animate-in fade-in slide-in-from-bottom-4">
                 <h2 className="text-2xl font-bold font-grotesk flex items-center gap-2">Live Drops <Zap className="w-5 h-5 text-yellow-500 fill-current"/></h2>
              </div>
              {isLoading && <div className="w-full h-[500px] flex items-center justify-center border border-dashed rounded-[40px] opacity-50"><Loader2 className="animate-spin mr-2"/> Scanning Base Sepolia...</div>}
              {!isLoading && liveRaffles.length === 0 && <div className="w-full h-[400px] bg-neutral-100 dark:bg-neutral-900 rounded-[40px] flex flex-col items-center justify-center text-center p-8"><Ticket className="w-16 h-16 text-neutral-300 mb-4"/><h3 className="text-xl font-bold mb-2">No Active Drops</h3></div>}
              {!isLoading && activeRaffle && (
                <section className="relative w-full min-h-[500px] md:h-[600px] rounded-[40px] overflow-hidden bg-black text-white shadow-2xl group flex flex-col md:block animate-in zoom-in-95 duration-500">
                   <img src={activeRaffle.image} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity duration-700"/>
                   <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/40 to-transparent" />
                   <div className="relative h-full p-8 md:p-12 flex flex-col md:flex-row gap-8 z-10">
                      <div className="w-full md:w-[450px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 flex flex-col justify-between hover:bg-white/15 transition-all">
                         <div>
                            <div className="flex items-center gap-2 mb-6"><span className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider">Verified Drop</span><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/></div>
                            <h1 className="text-3xl md:text-5xl font-grotesk font-bold leading-tight mb-4">{activeRaffle.title}</h1>
                            <p className="text-neutral-300 text-sm leading-relaxed mb-6">{activeRaffle.description}</p>
                            <div className="mb-6"><div className="flex justify-between text-xs text-neutral-300 mb-2"><span>{activeRaffle.sold} / {activeRaffle.max} Tickets</span><span>{activeRaffle.progress.toFixed(0)}% Sold</span></div><div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-gradient-to-r from-teal-400 to-purple-500 transition-all duration-700" style={{ width: `${activeRaffle.progress}%` }} /></div></div>
                         </div>
                         <div className="mt-6 pt-6 border-t border-white/10"><p className="text-xs text-neutral-400 uppercase tracking-widest mb-2">Entry Price</p><div className="text-4xl font-bold font-grotesk text-white mb-2">{activeRaffle.price} <span className="text-lg font-normal text-neutral-400">ETH</span></div></div>
                      </div>
                      <div className="flex-1 flex flex-col justify-end items-end">
                         <div className="flex gap-2 mb-4">{liveRaffles.length > 1 && (<><button onClick={() => setCurrentSlide((c) => (c - 1 + liveRaffles.length) % liveRaffles.length)} className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition border border-white/10"><ChevronLeft className="w-5 h-5"/></button><button onClick={() => setCurrentSlide((c) => (c + 1) % liveRaffles.length)} className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition border border-white/10"><ChevronRight className="w-5 h-5"/></button></>)}</div>
                         <button onClick={() => !activeRaffle.hasEntered && setTicketModalOpen(true)} disabled={activeRaffle.hasEntered || activeRaffle.sold >= activeRaffle.max} className={`group relative px-10 py-5 rounded-full font-bold text-lg transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-3 disabled:opacity-90 disabled:cursor-not-allowed ${activeRaffle.hasEntered ? 'bg-green-500 text-black border-2 border-green-400' : activeRaffle.sold >= activeRaffle.max ? 'bg-neutral-800 text-neutral-400' : 'bg-white text-black hover:bg-teal-400 hover:border-teal-400'}`}>
                            {activeRaffle.hasEntered ? (<>Entry Confirmed <CheckCircle2 className="w-6 h-6"/></>) : activeRaffle.sold >= activeRaffle.max ? (<>Sold Out <Lock className="w-5 h-5"/></>) : (<>Mint Ticket <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/></>)}
                         </button>
                         {activeRaffle.hasEntered && (<p className="text-green-400 text-sm mt-3 font-bold text-shadow">You are in the draw.</p>)}
                      </div>
                   </div>
                </section>
              )}
            </>
          )}

          {/* === MARKET TAB (UPDATED FOR WINNERS) === */}
          {activeTab === 'Market' && (
             <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                   <div>
                      <h2 className={`text-3xl font-bold font-grotesk ${isDark ? 'text-white' : 'text-black'}`}>Secondary Market</h2>
                      <p className="text-neutral-500 mt-2">Verified listings from SwagClub winners.</p>
                   </div>
                </div>

                {/* WINNERS SECTION */}
                {winningTickets.length > 0 ? (
                  <div className="mb-12">
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="w-5 h-5 text-yellow-500"/>
                      <h3 className="font-bold text-lg">Your Prize Collection (Eligible to List)</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {winningTickets.map((ticket, idx) => (
                        <div key={idx} className={`p-4 rounded-3xl border flex items-center justify-between ${isDark ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'}`}>
                           <div className="flex items-center gap-4">
                             <img src={ticket.image} className="w-16 h-16 rounded-xl object-cover"/>
                             <div>
                               <h4 className="font-bold">{ticket.title}</h4>
                               <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded font-bold">WINNER</span>
                             </div>
                           </div>
                           <button 
                             onClick={() => openListModal(ticket)}
                             className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors flex items-center gap-2"
                           >
                             <Tag className="w-4 h-4"/> List for Sale
                           </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={`p-8 mb-8 border border-dashed rounded-3xl text-center flex flex-col items-center justify-center gap-3 ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                      <Lock className="w-8 h-8 opacity-50"/>
                      <p className="font-bold">Winners Access Only</p>
                      <p className="text-sm text-neutral-500">You must win a raffle to list items here.</p>
                  </div>
                )}

                {/* PUBLIC LISTINGS (MOCK) */}
                <h3 className="font-bold text-lg mb-4 opacity-50">Community Listings (Coming Soon)</h3>
                <div className={`h-48 border border-dashed rounded-[40px] flex items-center justify-center text-neutral-500 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                    <p>No active listings found.</p>
                </div>
             </div>
          )}

          {/* === WALLET TAB === */}
          {activeTab === 'Wallet' && (
            <div className="animate-in slide-in-from-bottom-4">
               <h2 className={`text-2xl font-bold font-grotesk mb-8 ${isDark ? 'text-white' : 'text-black'}`}>My Collection</h2>
               
               <div className={`p-8 rounded-[40px] mb-12 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 ${isDark ? 'bg-neutral-900 border border-white/10' : 'bg-black text-white'}`}>
                  <div className="text-center md:text-left w-full">
                     <p className="text-neutral-400 text-sm mb-2 uppercase tracking-widest">Available Balance</p>
                     <h3 className="text-4xl md:text-5xl font-grotesk font-bold text-teal-400">{ethBalance ? Number(ethBalance.formatted).toFixed(3) : '0.00'} <span className="text-lg text-white">ETH</span></h3>
                  </div>
               </div>

               <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>Ticket History</h3>
               {myTickets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {myTickets.map((ticket, idx) => (
                        <div key={idx} className={`p-4 rounded-3xl border flex flex-col gap-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
                           <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-gray-800">
                               <img src={ticket.image} className="w-full h-full object-cover"/>
                               <div className="absolute top-3 right-3">
                                   {ticket.status === 'WON' && <span className="text-xs font-bold text-black bg-green-400 px-3 py-1 rounded-full shadow-lg">WINNER</span>}
                                   {ticket.status === 'ACTIVE' && <span className="text-xs font-bold text-white bg-blue-500 px-3 py-1 rounded-full shadow-lg">ACTIVE</span>}
                                   {ticket.status === 'LOST' && <span className="text-xs font-bold text-white bg-red-500 px-3 py-1 rounded-full shadow-lg">ENDED</span>}
                               </div>
                           </div>
                           
                           <div>
                               <h4 className={`font-bold text-lg ${isDark?'text-white':'text-black'}`}>{ticket.title}</h4>
                               <p className="text-xs text-neutral-500">ID: #{ticket.id} • {ticket.price} ETH</p>
                           </div>

                           <div className="mt-auto pt-4 border-t border-dashed border-white/10">
                               {ticket.status === 'ACTIVE' ? (
                                   <button onClick={() => handleSwapTicket(ticket.id)} disabled={isPending} className="w-full flex items-center justify-center gap-2 text-sm font-bold bg-yellow-500/10 text-yellow-500 px-4 py-3 rounded-xl hover:bg-yellow-500 hover:text-black transition-all disabled:opacity-50">
                                     <RefreshCw className="w-4 h-4"/> Swap for 70% Liquidity
                                   </button>
                               ) : ticket.status === 'WON' ? (
                                   <button onClick={() => { setActiveTab('Market'); }} className="w-full py-3 text-center text-green-400 font-bold bg-green-500/10 rounded-xl hover:bg-green-500 hover:text-black transition-colors">
                                       Go to Market to List
                                   </button>
                               ) : (
                                   <div className="w-full py-3 text-center text-neutral-500 font-bold bg-white/5 rounded-xl">Better luck next time</div>
                               )}
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className={`p-12 border border-dashed rounded-[40px] text-center text-neutral-500 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                    You haven't entered any raffles yet.
                  </div>
               )}
            </div>
          )}
        </div>
      </main>

      {/* BUY TICKET MODAL */}
      {ticketModalOpen && activeRaffle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-md animate-in fade-in">
           <div className="bg-white w-full max-w-md p-8 rounded-[40px] relative shadow-2xl text-black">
              <button onClick={() => setTicketModalOpen(false)} className="absolute top-6 right-6 p-2 bg-neutral-100 rounded-full hover:bg-neutral-200"><X className="w-4 h-4"/></button>
              <div className="text-center mb-8">
                 <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"><Ticket className="w-10 h-10"/></div>
                 <h3 className="text-3xl font-bold font-grotesk mb-2">Secure Your Spot</h3>
                 <p className="text-neutral-500 text-sm">You are purchasing 1 entry ticket.</p>
              </div>
              <div className="bg-neutral-50 p-6 rounded-3xl mb-8 border border-neutral-200 text-center"><p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Total Cost</p><span className="text-4xl font-bold font-grotesk text-teal-600">{activeRaffle.price} ETH</span></div>
              <button onClick={handleBuyTicket} disabled={isPending || isSuccess} className="w-full py-5 bg-black text-white rounded-full font-bold text-xl hover:bg-neutral-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2">{isPending ? <><Loader2 className="animate-spin"/> Confirming...</> : isSuccess ? <><CheckCircle2/> Success!</> : 'Confirm Payment'}</button>
              <p className="text-center text-xs text-neutral-400 mt-4">1 Ticket Limit Per Wallet Enforced</p>
           </div>
        </div>
      )}

      {/* NEW: LISTING MODAL */}
      {listModalOpen && selectedItemToList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-md animate-in fade-in">
           <div className="bg-white w-full max-w-md p-8 rounded-[40px] relative shadow-2xl text-black animate-in zoom-in-95">
              <button onClick={() => setListModalOpen(false)} className="absolute top-6 right-6 p-2 bg-neutral-100 rounded-full hover:bg-neutral-200"><X className="w-4 h-4"/></button>
              
              <div className="text-center mb-6">
                 <h3 className="text-2xl font-bold font-grotesk mb-2">List Asset</h3>
                 <p className="text-neutral-500 text-sm">Set your price for the secondary market.</p>
              </div>

              <div className="flex items-center gap-4 mb-6 p-4 bg-neutral-50 rounded-2xl border">
                 <img src={selectedItemToList.image} className="w-16 h-16 rounded-xl object-cover"/>
                 <div className="text-left">
                    <h4 className="font-bold">{selectedItemToList.title}</h4>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-bold">WINNER EDITION</span>
                 </div>
              </div>

              <div className="space-y-4 mb-6">
                 <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Listing Price (ETH)</label>
                    <div className="relative">
                       <input type="number" value={listingPrice} onChange={(e) => setListingPrice(e.target.value)} className="w-full p-4 bg-neutral-50 rounded-2xl text-2xl font-bold border focus:ring-2 focus:ring-black outline-none pl-12"/>
                       <DollarSign className="absolute left-4 top-5 w-6 h-6 text-neutral-400"/>
                    </div>
                 </div>
              </div>

              <button onClick={handleListForSale} className="w-full py-5 bg-black text-white rounded-full font-bold text-xl hover:bg-neutral-800 transition-all shadow-xl">
                 Confirm Listing
              </button>
           </div>
        </div>
      )}
    </div>
  );
}

function NavCircle({ icon, active, onClick, isDark, mobile }: any) {
  const mobileClass = `w-full h-full flex items-center justify-center ${active ? 'text-teal-500' : 'text-neutral-400'}`;
  const desktopClass = `w-12 h-12 rounded-full flex items-center justify-center transition-all ${active ? 'bg-teal-500 text-black shadow-lg shadow-teal-500/20' : isDark ? 'bg-white/10 text-neutral-400 hover:bg-white/20' : 'bg-white text-neutral-400 hover:bg-neutral-100 border border-neutral-100'}`;
  return (
    <button onClick={onClick} className={mobile ? mobileClass : desktopClass}>
      {React.cloneElement(icon, { className: mobile ? "w-6 h-6" : "w-5 h-5" })}
    </button>
  )
}