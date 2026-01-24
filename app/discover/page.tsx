"use client";

import React, { useState, useEffect } from 'react';
import { 
  Home, Ticket, Wallet, Zap, Clock, MapPin, 
  ChevronRight, ChevronLeft, Loader2, 
  Sun, Moon, CheckCircle2, ShoppingBag, X, Trophy, RefreshCw, DollarSign
} from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, usePublicClient, useBalance } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { SWAG_CONTRACT_ADDRESS, SWAG_CONTRACT_ABI } from '../config/contract';

export default function DiscoverDashboard() {
  const [activeTab, setActiveTab] = useState('Home');
  const [isDark, setIsDark] = useState(false);
  const { address } = useAccount();
  const { data: ethBalance } = useBalance({ address });

  // --- STATE ---
  const publicClient = usePublicClient();
  const [liveRaffles, setLiveRaffles] = useState<any[]>([]);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- 1. SCANNER ---
  useEffect(() => {
    const scanChain = async () => {
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
            
            // B. Get Image (Forcing String Type)
            let imageUrl = "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800"; 
            try {
               const uri = await publicClient.readContract({
                  address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'tokenURI', args: [BigInt(i)]
               }) as string;
               if (uri && uri.length > 5) imageUrl = uri;
            } catch (err) {}

            const raffleItem = {
                id: i,
                price: formatEther(details[0]),
                sold: Number(details[1]),
                max: Number(details[2]),
                active: details[3],
                winner: details[4],
                title: `Cultural Drop #${i}`, 
                description: details[3] ? "Live Raffle. Ticket Sales Open." : "Raffle Ended.",
                image: imageUrl,
                progress: Math.min((Number(details[1]) / Number(details[2])) * 100, 100)
            };

            // Only show active raffles in "Home"
            if (details[3]) foundRaffles.push(raffleItem);

            // C. Check if I have a ticket (Scanning events would be better, but we assume active if we bought)
            // Note: Since 'participants' is private in array, we rely on local storage or events in V3. 
            // For now, we simulate "My Ticket" if the raffle is active and we clicked buy (Session based) 
            // OR if we are the winner.
            // *Real Production App would index 'TicketPurchased' events via The Graph.*
            
            if (address && details[4].toLowerCase() === address.toLowerCase()) {
                myFoundTickets.push({ ...raffleItem, status: 'WON' });
            }
            // For demo: Show any active raffle as "Watched"
            else if (address && details[3]) {
                 myFoundTickets.push({ ...raffleItem, status: 'ACTIVE' });
            } else if (address && !details[3]) {
                 myFoundTickets.push({ ...raffleItem, status: 'LOST' });
            }

          } catch (err) { console.warn(`Error reading ID ${i}`, err); }
        }
        setLiveRaffles(foundRaffles);
        setMyTickets(myFoundTickets);
      } catch (e) { console.error("Scanner Error:", e); } 
      finally { setIsLoading(false); }
    };
    scanChain();
  }, [publicClient, address]);

  const activeRaffle = liveRaffles.length > 0 ? liveRaffles[currentSlide] : null;

  // --- 2. ACTIONS ---
  const { writeContract, isPending, isSuccess } = useWriteContract();

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
    // Call the Sell/Swap function
    writeContract({ 
      address: SWAG_CONTRACT_ADDRESS, 
      abi: SWAG_CONTRACT_ABI, 
      functionName: 'sellTicket', 
      args: [BigInt(id)]
    });
  };

  // UI STATE
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#FAFAFA] text-[#1a1a1a]'}`}>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        .font-grotesk { font-family: 'Space Grotesk', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* SIDEBAR */}
      <aside className={`hidden md:flex w-24 flex-col items-center py-8 gap-6 border-r z-20 ${isDark ? 'border-white/10 bg-black' : 'border-black/5 bg-white'}`}>
         <Link href="/"><div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-4 hover:scale-105 transition-transform ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>S</div></Link>
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

      <main className={`flex-1 h-screen overflow-y-auto relative no-scrollbar ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#FAFAFA]'}`}>
        
        <header className={`sticky top-0 z-30 px-6 md:px-8 py-6 flex justify-between items-center backdrop-blur-sm ${isDark ? 'bg-[#0a0a0a]/90' : 'bg-[#FAFAFA]/90'}`}>
           <div className="flex items-center gap-2 font-bold font-grotesk text-xl tracking-tight">SwagClub <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">BETA</span></div>
           <ConnectButton showBalance={false} accountStatus="avatar" />
        </header>

        <div className="px-6 md:px-8 pb-32 max-w-[1600px] mx-auto">
          
          {/* === HOME TAB === */}
          {activeTab === 'Home' && (
            <>
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold font-grotesk flex items-center gap-2">Live Drops <Zap className="w-5 h-5 text-yellow-500 fill-current"/></h2>
              </div>

              {isLoading && (
                 <div className="w-full h-[500px] flex items-center justify-center border border-dashed rounded-[40px] opacity-50">
                    <Loader2 className="animate-spin mr-2"/> Syncing with Base...
                 </div>
              )}

              {!isLoading && liveRaffles.length === 0 && (
                 <div className="w-full h-[400px] bg-neutral-100 dark:bg-neutral-900 rounded-[40px] flex flex-col items-center justify-center text-center p-8">
                    <Ticket className="w-16 h-16 text-neutral-300 mb-4"/>
                    <h3 className="text-xl font-bold mb-2">No Active Drops</h3>
                    <p className="text-neutral-500 max-w-md">There are no active raffles right now. Check back later.</p>
                 </div>
              )}

              {!isLoading && activeRaffle && (
                <section className="relative w-full min-h-[500px] md:h-[600px] rounded-[40px] overflow-hidden bg-black text-white shadow-2xl group flex flex-col md:block">
                   <img src={activeRaffle.image} className="absolute inset-0 w-full h-full object-cover opacity-60"/>
                   <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

                   <div className="relative h-full p-8 md:p-12 flex flex-col md:flex-row gap-8 z-10">
                      <div className="w-full md:w-[450px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 flex flex-col justify-between hover:bg-white/15 transition-all">
                         <div>
                            <div className="flex items-center gap-2 mb-6">
                               <span className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider">Live Raffle</span>
                               <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-grotesk font-bold leading-tight mb-4">{activeRaffle.title}</h1>
                            <p className="text-neutral-300 text-sm leading-relaxed mb-6">A verified on-chain raffle. Purchase a ticket to enter the random draw.</p>
                            
                            <div className="mb-6">
                                <div className="flex justify-between text-xs text-neutral-300 mb-2">
                                    <span>{activeRaffle.sold} / {activeRaffle.max} Tickets Sold</span>
                                    <span>{activeRaffle.progress.toFixed(0)}%</span>
                                </div>
                                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-teal-400 transition-all duration-500" style={{ width: `${activeRaffle.progress}%` }} />
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-neutral-200">
                               <div className="flex items-center gap-3"><MapPin className="w-4 h-4 opacity-50"/> Base Sepolia</div>
                            </div>
                         </div>
                         <div className="mt-6">
                            <p className="text-xs text-neutral-400 uppercase tracking-widest mb-2">Ticket Price</p>
                            <div className="text-4xl font-bold font-grotesk text-white mb-2">{activeRaffle.price} <span className="text-lg font-normal text-neutral-400">ETH</span></div>
                         </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-end items-end">
                         <div className="flex gap-2 mb-4">
                            {liveRaffles.length > 1 && (
                              <>
                                <button onClick={() => setCurrentSlide((c) => (c - 1 + liveRaffles.length) % liveRaffles.length)} className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition"><ChevronLeft className="w-5 h-5"/></button>
                                <button onClick={() => setCurrentSlide((c) => (c + 1) % liveRaffles.length)} className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition"><ChevronRight className="w-5 h-5"/></button>
                              </>
                            )}
                         </div>
                         <button 
                            onClick={() => setTicketModalOpen(true)} 
                            disabled={activeRaffle.sold >= activeRaffle.max}
                            className="group relative px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-teal-400 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            {activeRaffle.sold >= activeRaffle.max ? "Sold Out" : "Buy Ticket"} 
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                         </button>
                      </div>
                   </div>
                </section>
              )}
            </>
          )}

          {/* === MARKETPLACE TAB === */}
          {activeTab === 'Market' && (
             <div className="animate-in fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                   <div>
                      <h2 className={`text-3xl font-bold font-grotesk ${isDark ? 'text-white' : 'text-black'}`}>Secondary Market</h2>
                      <p className="text-neutral-500 mt-2">Trade tickets or swap instantly for liquidity.</p>
                   </div>
                </div>
                <div className="p-12 border border-dashed rounded-3xl text-center text-neutral-500">
                    <p>P2P Marketplace listings coming in V2 Contract.</p>
                    <p className="text-sm mt-2">Use the <b>Wallet</b> tab to swap your active tickets for 70% instant liquidity.</p>
                </div>
             </div>
          )}

          {/* === WALLET TAB === */}
          {activeTab === 'Wallet' && (
            <div className="animate-in slide-in-from-bottom-4">
               <h2 className={`text-2xl font-bold font-grotesk mb-8 ${isDark ? 'text-white' : 'text-black'}`}>My Wallet</h2>
               
               <div className={`p-8 rounded-[40px] mb-12 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 ${isDark ? 'bg-neutral-900 border border-white/10' : 'bg-black text-white'}`}>
                  <div className="text-center md:text-left w-full">
                     <p className="text-neutral-400 text-sm mb-2 uppercase tracking-widest">Available Balance</p>
                     <h3 className="text-4xl md:text-5xl font-grotesk font-bold text-teal-400">{ethBalance ? Number(ethBalance.formatted).toFixed(3) : '0.00'} <span className="text-lg text-white">ETH</span></h3>
                  </div>
               </div>

               <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>Ticket History</h3>
               {myTickets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {myTickets.map((ticket, idx) => (
                        <div key={idx} className={`p-4 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
                           <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200"><img src={ticket.image} className="w-full h-full object-cover"/></div>
                              <div>
                                 <h4 className={`font-bold ${isDark?'text-white':'text-black'}`}>{ticket.title}</h4>
                                 <div className="flex items-center gap-2 mt-1">
                                    {ticket.status === 'WON' && <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">WINNER</span>}
                                    {ticket.status === 'ACTIVE' && <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">ACTIVE</span>}
                                    {ticket.status === 'LOST' && <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">LOST</span>}
                                 </div>
                              </div>
                           </div>
                           
                           {/* SWAP / LIQUIDITY BUTTON */}
                           {ticket.status === 'ACTIVE' && (
                               <button 
                                 onClick={() => handleSwapTicket(ticket.id)}
                                 className="flex items-center gap-1 text-xs font-bold bg-yellow-500/10 text-yellow-600 px-3 py-2 rounded-lg hover:bg-yellow-500 hover:text-black transition-colors"
                               >
                                 <RefreshCw className="w-3 h-3"/> Swap (70%)
                               </button>
                           )}
                           {ticket.status === 'WON' && <Trophy className="w-6 h-6 text-yellow-500"/>}
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className={`p-12 border border-dashed rounded-3xl text-center text-neutral-500 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
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
              
              <div className="text-center mb-6">
                 <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4"><Ticket className="w-8 h-8"/></div>
                 <h3 className="text-2xl font-bold font-grotesk mb-2">Buy Raffle Ticket</h3>
                 <p className="text-neutral-500 text-sm">Enter the draw for this artifact.</p>
              </div>

              <div className="bg-neutral-50 p-6 rounded-2xl mb-6 border border-neutral-200 text-center">
                 <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Ticket Cost</p>
                 <span className="text-3xl font-bold font-grotesk">{activeRaffle.price} ETH</span>
              </div>

              <button 
                 onClick={handleBuyTicket} 
                 disabled={isPending || isSuccess} 
                 className="w-full py-4 bg-black text-white rounded-full font-bold text-lg hover:bg-neutral-800 transition-all disabled:opacity-50"
              >
                 {isPending ? 'Processing...' : isSuccess ? 'Ticket Purchased!' : 'Confirm Payment'}
              </button>
           </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function NavCircle({ icon, active, onClick, isDark, mobile }: any) {
  const mobileClass = `w-full h-full flex items-center justify-center ${active ? 'text-teal-500' : 'text-neutral-400'}`;
  const desktopClass = `w-12 h-12 rounded-full flex items-center justify-center transition-all ${active ? 'bg-teal-500 text-black shadow-lg' : isDark ? 'bg-white/10 text-neutral-400 hover:bg-white/20' : 'bg-white text-neutral-400 hover:bg-neutral-100 border border-neutral-100'}`;
  return (
    <button onClick={onClick} className={mobile ? mobileClass : desktopClass}>
      {React.cloneElement(icon, { className: mobile ? "w-6 h-6" : "w-5 h-5" })}
    </button>
  )
}