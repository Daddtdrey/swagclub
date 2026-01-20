"use client";

import React, { useState, useEffect } from 'react';
import { 
  Home, Star, Wallet, Grid, Settings, Search, Bell, 
  Zap, Heart, TrendingUp, Flame, X, User, CheckCircle2,
  Clock, AlertCircle
} from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useBalance } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { SWAG_CONTRACT_ADDRESS, SWAG_CONTRACT_ABI } from '../config/contract';

/* --- MOCK DATA --- */
const VAULT_ITEMS = [
  { id: 101, title: "Blue & Pink Texture", creator: "Alex Lux", price: "1.69 ETH", tag: "Abstract", desc: "A deep dive into color theory and texture.", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" },
  { id: 102, title: "Liquid Abstract", creator: "Robert Khan", price: "2.40 ETH", tag: "Liquid", desc: "Fluid dynamics rendered in real-time 3D.", img: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80" },
  { id: 103, title: "Neon Genesis", creator: "Sarah J", price: "5.00 ETH", tag: "Cyber", desc: "The future is bright, neon, and decentralized.", img: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=800&q=80" },
];

const TRENDING_ITEMS = [
  { id: 201, title: "Dark Matter", creator: "Kaito", price: "0.45 ETH", change: "+12%", img: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&q=80" },
  { id: 202, title: "Retro Walk", creator: "Pixel Dad", price: "0.8 ETH", change: "+5%", img: "https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=800&q=80" },
  { id: 203, title: "Graffiti Soul", creator: "Street King", price: "0.3 ETH", change: "+24%", img: "https://images.unsplash.com/photo-1579783902614-a3fb39279c0f?w=800&q=80" },
];

const ALL_ITEMS = [
  { id: 1, title: "Blue & White Abstract", creator: "Josh Huang", price: "1.25 ETH", tag: "Sport", desc: "Motion captured in still life.", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80" },
  { id: 2, title: "Pink Galaxy", creator: "Charles Will", price: "2.49 ETH", tag: "Art", desc: "The universe in a grain of sand.", img: "https://images.unsplash.com/photo-1615184697985-c9bde1b07da7?w=800&q=80" },
  { id: 3, title: "Water Abstract", creator: "Bright Win", price: "0.83 ETH", tag: "Gaming", desc: "Flow state visualization.", img: "https://images.unsplash.com/photo-1579783902614-a3fb39279c0f?w=800&q=80" },
  { id: 4, title: "Cyber Skull", creator: "Kaito", price: "3.20 ETH", tag: "Skull", desc: "Memento Mori for the digital age.", img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80" },
  { id: 5, title: "Space Dust", creator: "Nova", price: "0.5 ETH", tag: "Space", desc: "Stardust we are.", img: "https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=800&q=80" },
  { id: 6, title: "Golden Hour", creator: "Lens", price: "1.1 ETH", tag: "Photo", desc: "The perfect light, captured forever.", img: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80" },
];

export default function DiscoverDashboard() {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');
  const [showSettings, setShowSettings] = useState(false);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  
  // --- WALLET STATE ---
  const { address } = useAccount();
  const { data: ethBalance } = useBalance({ address });
  const [myBids, setMyBids] = useState<any[]>([]);

  // --- 1. FETCH LATEST TOKEN ID FIRST ---
  const { data: latestTokenId } = useReadContract({
    address: SWAG_CONTRACT_ADDRESS,
    abi: SWAG_CONTRACT_ABI,
    functionName: 'tokenIds',
  });

  // --- 2. READ AUCTION DATA (Using the Dynamic ID) ---
  // If latestTokenId exists, use it. Otherwise use 1.
  const targetId = latestTokenId ? latestTokenId : BigInt(1);

  const { data: auctionData, isLoading: isAuctionLoading, refetch } = useReadContract({
    address: SWAG_CONTRACT_ADDRESS,
    abi: SWAG_CONTRACT_ABI,
    functionName: 'auctions',
    args: [targetId], 
  });

  const liveAuction = auctionData ? {
    id: Number(targetId),
    title: `Genesis Swag #${targetId}`,
    creator: "Admin",
    price: formatEther((auctionData as any)[3] || BigInt(0)) + " ETH",
    active: (auctionData as any)[6], 
    desc: "A live auction item currently on the Base Sepolia network.",
    img: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=800&q=80",
    isReal: true
  } : null;

  const showRealAuction = !isAuctionLoading && liveAuction && liveAuction.active;

  // Debugging: Log what we found to the console
  useEffect(() => {
    console.log("Latest Token ID:", latestTokenId);
    console.log("Auction Data:", auctionData);
  }, [latestTokenId, auctionData]);

  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const openBid = (item: any) => {
    setSelectedItem(item);
    setBidModalOpen(true);
  };

  const toggleSave = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBidSuccess = (item: any, amount: string) => {
    const newBid = { 
      ...item, 
      myBid: amount, 
      date: new Date().toLocaleDateString(), 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Active',
      txHash: item.isReal ? "0xRealHash..." : "0xDemoHash..." 
    };
    setMyBids([newBid, ...myBids]);
    setBidModalOpen(false);
    if(item.isReal) setTimeout(() => refetch(), 2000); 
  };

  return (
    <div className={`min-h-screen flex overflow-hidden transition-colors duration-500 font-sans selection:bg-teal-400 selection:text-black ${isDark ? 'text-white' : 'text-neutral-900'}`}>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes roll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-roll { animation: roll 30s linear infinite; }
        .pause-hover:hover { animation-play-state: paused; }
      `}</style>

      {/* BACKGROUND */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute inset-0 bg-cover bg-center transition-opacity duration-700" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1614850523011-8f49ffc73908?q=80&w=2000&auto=format&fit=crop')`, opacity: isDark ? 0.4 : 0.1 }} />
        <div className={`absolute inset-0 transition-colors duration-500 ${isDark ? 'bg-[#050505]/95' : 'bg-[#F5F5F7]/95'}`} />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      </div>

      {/* SIDEBAR */}
      <aside className={`hidden md:flex w-24 flex-col items-center py-8 gap-8 z-20 border-r backdrop-blur-md transition-colors relative ${isDark ? 'border-white/5 bg-black/20' : 'border-black/5 bg-white/40'}`}>
        <Link href="/"><div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl mb-4 shadow-lg shadow-teal-500/20" /></Link>
        <nav className="flex flex-col gap-6">
          <NavIcon icon={<Home />} label="Home" active={activeTab === 'Home'} onClick={() => setActiveTab('Home')} isDark={isDark} />
          <NavIcon icon={<Star />} label="Saved" active={activeTab === 'Saved'} onClick={() => setActiveTab('Saved')} isDark={isDark} />
          <NavIcon icon={<Wallet />} label="Wallet" active={activeTab === 'Wallet'} onClick={() => setActiveTab('Wallet')} isDark={isDark} />
          <div className="relative">
            <NavIcon icon={<Settings />} label="Settings" active={showSettings} onClick={() => setShowSettings(!showSettings)} isDark={isDark} />
            {showSettings && (
              <div className={`absolute left-14 bottom-0 w-48 p-4 rounded-2xl shadow-xl border backdrop-blur-xl animate-in fade-in slide-in-from-left-4 z-50 ${isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-black/10'}`}>
                <div className="flex items-center justify-between"><span className="text-sm">Dark Mode</span><button onClick={() => setIsDark(!isDark)} className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${isDark ? 'bg-teal-500 justify-end' : 'bg-neutral-300 justify-start'}`}><div className="w-4 h-4 bg-white rounded-full shadow-md" /></button></div>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 h-screen overflow-y-auto relative no-scrollbar">
        <header className={`sticky top-0 z-30 px-8 py-6 flex items-center justify-between border-b backdrop-blur-xl transition-colors ${isDark ? 'border-white/5 bg-[#050505]/80' : 'border-black/5 bg-[#F5F5F7]/80'}`}>
          <div className="w-full max-w-md relative group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5 group-focus-within:text-teal-400 transition-colors"/>
             <input type="text" placeholder="Search collections..." className={`w-full rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-colors ${isDark ? 'bg-white/5 text-white' : 'bg-black/5 text-black'}`} />
          </div>
          <div className="flex items-center gap-6">
            <ConnectButton showBalance={false} accountStatus="avatar" />
          </div>
        </header>

        <div className="p-8 pb-32">

          {/* === HOME TAB === */}
          {activeTab === 'Home' && (
            <>
              {/* HERO */}
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold font-syne flex items-center gap-2">The Vault <Zap className="w-5 h-5 text-yellow-400 fill-current"/></h2>
                </div>

                {showRealAuction ? (
                  <div className="relative w-full md:max-w-3xl h-[400px] rounded-3xl overflow-hidden group border border-white/10 shadow-2xl">
                      <img src={liveAuction?.img} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
                        <div className="flex justify-between items-end">
                            <div>
                              <div className="inline-block px-3 py-1 bg-red-500 text-white text-[10px] font-bold uppercase rounded-full mb-3 animate-pulse">Live on Chain</div>
                              <h3 className="text-3xl font-bold font-syne text-white mb-2">{liveAuction?.title}</h3>
                              <p className="text-neutral-300">Created by {liveAuction?.creator}</p>
                            </div>
                            <div className="text-right bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Highest Bid</p>
                              <p className="text-3xl font-bold text-teal-400 font-syne">{liveAuction?.price}</p>
                              <button onClick={() => openBid(liveAuction)} className="mt-3 w-full bg-teal-500 hover:bg-teal-400 text-black px-6 py-2 rounded-lg font-bold">Place Bid</button>
                            </div>
                        </div>
                      </div>
                  </div>
                ) : (
                  <div className="relative w-full overflow-hidden">
                      <div className={`absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r ${isDark ? 'from-[#050505]' : 'from-[#F5F5F7]'} to-transparent`} />
                      <div className={`absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l ${isDark ? 'from-[#050505]' : 'from-[#F5F5F7]'} to-transparent`} />
                      <div className="flex w-max animate-roll pause-hover">
                        {[...VAULT_ITEMS, ...VAULT_ITEMS].map((item, idx) => (
                          <div key={`${item.id}-${idx}`} className="shrink-0 w-[400px] h-[250px] mx-4 rounded-3xl relative overflow-hidden group border border-white/10 shadow-2xl">
                              <img src={item.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end">
                                <div className="flex justify-between items-end">
                                    <div><h3 className="text-xl font-bold font-syne text-white">{item.title}</h3><p className="text-xs text-neutral-300">by {item.creator}</p></div>
                                    <button onClick={() => openBid(item)} className="bg-teal-500 hover:bg-teal-400 text-black px-4 py-2 rounded-lg font-bold text-sm">Bid</button>
                                </div>
                              </div>
                          </div>
                        ))}
                      </div>
                  </div>
                )}
              </section>

              {/* TRENDING */}
              <section className="mb-12">
                <h2 className="text-xl font-bold font-syne mb-6 flex items-center gap-2">Trending Now <TrendingUp className="w-5 h-5 text-teal-400"/></h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {TRENDING_ITEMS.map((item) => (
                    <div key={item.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/5 hover:border-teal-500/30' : 'bg-white border-black/5 hover:border-teal-500/30 shadow-sm'}`}>
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0"><img src={item.img} className="w-full h-full object-cover" /></div>
                      <div className="flex-1"><h4 className="font-bold font-syne">{item.title}</h4><p className="text-xs text-neutral-500">{item.creator}</p></div>
                      <div className="text-right"><p className="font-bold text-teal-400">{item.price}</p><p className="text-xs text-green-500 font-mono">{item.change}</p></div>
                    </div>
                  ))}
                </div>
              </section>

              {/* DISCOVER GRID */}
              <section>
                <h2 className="text-xl font-bold font-syne mb-6 flex items-center gap-2">Discover Collections <Flame className="w-5 h-5 text-orange-500 fill-current"/></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {ALL_ITEMS.map((item) => (
                    <ArtCard 
                      key={item.id} 
                      item={item} 
                      isDark={isDark} 
                      isSaved={savedIds.includes(item.id)} 
                      onToggleSave={(e: React.MouseEvent) => toggleSave(e, item.id)}
                      onBid={() => openBid(item)}
                    />
                  ))}
                </div>
              </section>
            </>
          )}

          {/* === SAVED TAB === */}
          {activeTab === 'Saved' && (
            <section>
              <h2 className="text-2xl font-bold font-syne mb-8 flex items-center gap-2">Your Saved Items <Heart className="w-6 h-6 text-pink-500 fill-current"/></h2>
              {savedIds.length === 0 ? <div className="text-center py-20 text-neutral-500"><p>No saved items yet.</p></div> : 
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ALL_ITEMS.filter(i => savedIds.includes(i.id)).map(item => (
                    <ArtCard 
                      key={item.id} 
                      item={item} 
                      isDark={isDark} 
                      isSaved={true} 
                      onToggleSave={(e: React.MouseEvent) => toggleSave(e, item.id)} 
                      onBid={() => openBid(item)}
                    />
                  ))}
                </div>
              }
            </section>
          )}

          {/* === WALLET / PROFILE TAB === */}
          {activeTab === 'Wallet' && (
            <section className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4">
               <h2 className="text-2xl font-bold font-syne mb-8 flex items-center gap-2">Wallet Dashboard <User className="w-6 h-6 text-teal-400"/></h2>
               
               <div className={`p-8 rounded-3xl mb-12 border relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-neutral-900 to-black border-white/10' : 'bg-white border-black/10'}`}>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                     <div>
                        <p className="text-sm text-neutral-400 mb-2 font-mono">Connected Address</p>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-blue-500" />
                           <h3 className="text-xl md:text-2xl font-bold font-mono tracking-wide">
                              {address ? `${address.slice(0,6)}...${address.slice(-4)}` : 'Not Connected'}
                           </h3>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm text-neutral-400 mb-2">Total Balance</p>
                        <h3 className="text-4xl font-bold font-syne text-teal-400">
                           {ethBalance ? Number(ethBalance.formatted).toFixed(4) : '0.00'} <span className="text-lg text-white">ETH</span>
                        </h3>
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
               </div>

               <h3 className="text-xl font-bold font-syne mb-6 flex items-center gap-2"><Clock className="w-5 h-5"/> Recent Bids</h3>
               {myBids.length === 0 ? (
                  <div className="p-12 border border-dashed border-neutral-700 rounded-3xl text-center">
                     <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-500"><AlertCircle /></div>
                     <p className="text-neutral-400">No bid history found.</p>
                     <button onClick={() => setActiveTab('Home')} className="mt-4 text-teal-400 font-bold hover:underline">Explore Collections</button>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {myBids.map((bid, idx) => (
                        <div key={idx} className={`p-4 rounded-2xl flex items-center justify-between border transition-all hover:bg-white/5 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
                           <div className="flex items-center gap-4">
                              <img src={bid.img} className="w-14 h-14 rounded-xl object-cover border border-white/10"/>
                              <div>
                                 <h4 className="font-bold text-lg">{bid.title}</h4>
                                 <div className="flex items-center gap-3 text-xs text-neutral-500">
                                    <span>{bid.date} • {bid.time}</span>
                                    {bid.isReal && <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-[10px]">On-Chain</span>}
                                    {bid.txHash && <span className="font-mono text-[10px] opacity-50">{bid.txHash}</span>}
                                 </div>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="font-bold text-teal-400 text-lg">{bid.myBid} ETH</p>
                              <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full"><CheckCircle2 className="w-3 h-3"/> {bid.status}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </section>
          )}

        </div>
      </main>

      {/* BID MODAL */}
      {bidModalOpen && selectedItem && <BidModal item={selectedItem} onClose={() => setBidModalOpen(false)} onSuccess={(amt) => handleBidSuccess(selectedItem, amt)} />}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ArtCard({ item, isDark, isSaved, onToggleSave, onBid }: any) {
  return (
    <div className={`group rounded-2xl p-3 transition-all border hover:-translate-y-1 hover:shadow-xl ${isDark ? 'bg-white/5 border-white/5 hover:border-teal-500/30' : 'bg-white border-black/5 hover:border-teal-500/30 shadow-sm'}`}>
      <div className="relative h-64 rounded-xl overflow-hidden mb-4">
          <img src={item.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/10">{item.tag}</span>
          <button onClick={onToggleSave} className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-colors ${isSaved ? 'bg-pink-500 text-white' : 'bg-white/10 text-white hover:bg-white hover:text-pink-500'}`}><Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} /></button>
      </div>
      <div className="px-1">
        <h3 className={`font-bold font-syne text-lg mb-1 ${isDark ? 'text-white' : 'text-neutral-900'}`}>{item.title}</h3>
        <p className="text-xs text-neutral-400 mb-4">by {item.creator}</p>
        <div className={`flex items-center justify-between pt-3 border-t ${isDark ? 'border-white/10' : 'border-black/5'}`}>
            <div><p className="text-[10px] text-neutral-500 mb-0.5">Current Bid</p><p className="text-teal-400 font-bold font-syne">{item.price}</p></div>
            <button onClick={onBid} className={`px-5 py-2 rounded-lg text-xs font-bold transition-colors ${isDark ? 'bg-white text-black hover:bg-teal-400' : 'bg-black text-white hover:bg-teal-500'}`}>Bid</button>
        </div>
      </div>
    </div>
  )
}

function NavIcon({ icon, active, isDark, onClick, label }: any) {
  return (
    <button onClick={onClick} className={`group relative p-3 rounded-xl transition-all ${active ? 'bg-teal-500 text-black' : isDark ? 'text-neutral-500 hover:text-white hover:bg-white/5' : 'text-neutral-400 hover:text-black hover:bg-black/5'}`}>
      {React.cloneElement(icon, { className: "w-6 h-6" })}
      <span className="absolute left-14 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">{label}</span>
    </button>
  )
}

// ENHANCED BID MODAL (With Mock Simulation)
function BidModal({ item, onClose, onSuccess }: { item: any, onClose: () => void, onSuccess: (amt: string) => void }) {
  const [bidAmount, setBidAmount] = useState('');
  const [isSimulating, setIsSimulating] = useState(false); // For Mock Items
  
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => { if (isSuccess) setTimeout(() => onSuccess(bidAmount), 1000); }, [isSuccess]);

  const handleBid = () => {
    if (!bidAmount) return;

    if (item.isReal) {
      // Real Blockchain Transaction
      writeContract({ address: SWAG_CONTRACT_ADDRESS, abi: SWAG_CONTRACT_ABI, functionName: 'placeBid', args: [BigInt(item.id)], value: parseEther(bidAmount) });
    } else { 
      // Mock Transaction Simulation
      setIsSimulating(true);
      setTimeout(() => {
        setIsSimulating(false);
        onSuccess(bidAmount || item.price);
      }, 2000);
    }
  };

  const isLoading = isPending || isConfirming || isSimulating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg p-0 rounded-3xl shadow-2xl bg-[#111] border border-white/10 relative overflow-hidden flex flex-col">
         {/* HEADER IMAGE */}
         <div className="relative h-48 w-full">
            <img src={item.img} className="w-full h-full object-cover" />
            <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-black transition-colors"><X className="w-4 h-4"/></button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#111] to-transparent h-24" />
         </div>

         <div className="p-8 -mt-6 relative z-10">
            <h3 className="font-bold font-syne text-2xl mb-1">{item.title}</h3>
            <p className="text-neutral-400 text-sm mb-6">Created by <span className="text-white">{item.creator}</span></p>

            {/* DESCRIPTION */}
            <div className="mb-6 bg-white/5 p-4 rounded-2xl border border-white/5">
               <p className="text-sm text-neutral-300 leading-relaxed">{item.desc || "No description provided for this artwork."}</p>
            </div>

            {/* BID INPUT SECTION */}
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <label className="text-xs font-bold uppercase text-neutral-500">Place your bid</label>
                    <span className="text-xs text-teal-400">Floor: {item.price}</span>
                </div>
                <div className="relative">
                   <input type="number" step="0.001" placeholder="0.00" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} className="w-full p-4 pl-4 pr-16 rounded-xl outline-none text-2xl font-bold font-syne bg-black border border-white/10 text-white focus:border-teal-500 transition-colors" />
                   <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-neutral-600">ETH</span>
                </div>
                
                {error && <p className="text-red-400 text-xs bg-red-900/20 p-2 rounded">Error: {error.message.slice(0, 50)}...</p>}
                
                <button onClick={handleBid} disabled={isLoading} className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-black py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all flex items-center justify-center gap-2">
                  {isLoading ? <span className="animate-pulse">Processing...</span> : isSuccess ? 'Success! 🚀' : 'Confirm Bid'}
                </button>
            </div>
         </div>
      </div>
    </div>
  );
}