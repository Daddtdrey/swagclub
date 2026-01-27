"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'; 
import { ArrowRight, X, Moon, Sun, Loader2, FileText, Monitor, CheckCircle2, Globe, TrendingUp, User, Store, Package } from 'lucide-react';
import Link from 'next/link';

/* --- SUPABASE CONFIG --- */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ART_IMAGES = [
  "https://res.cloudinary.com/dmsq7n9k6/image/upload/v1769279991/img1_front_ppzo7f.jpg",
  "https://res.cloudinary.com/dmsq7n9k6/image/upload/v1769279985/img_2_a748wg.jpg",
  "https://res.cloudinary.com/dmsq7n9k6/image/upload/v1769282278/img3_xrrgti.jpg",
  "https://res.cloudinary.com/dmsq7n9k6/image/upload/v1769282311/imgg4_ifmulp.jpg",
  "https://images.unsplash.com/photo-1615184697985-c9bde1b07da7?q=80&w=400&auto=format&fit=crop",
  "https://res.cloudinary.com/dmsq7n9k6/image/upload/v1769282338/img7_ury7am.jpg",
  "https://res.cloudinary.com/dmsq7n9k6/image/upload/v1769282312/img_5_enfw1d.jpg",
  "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=400&auto=format&fit=crop",
  "https://res.cloudinary.com/dmsq7n9k6/image/upload/v1769282338/img_6_gicosk.jpg",
  "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=400&auto=format&fit=crop",
];

const WHITEPAPER_CONTENT = `
SWAG CLUB: Cultural Commerce Protocol & Marketplace
Abstract & Vision SWAG CLUB is a protocol designed to correct a structural imbalance in the creative economy: while communities produce culture, value is often captured elsewhere. SWAG CLUB bridges onchain coordination with real-world cultural products (physical art, design, and experiences). It moves beyond short-term speculation to create sustainable economic rails for funding, manufacturing, and distributing creativity.

1. The Problem: 
 Failure of Current Models Existing Web3 creative models are insufficient:

Onchain Art (e.g., Zora): Solves permissionless minting but fails "post-mint." Art becomes idle in wallets, lacking real-world distribution or experiential value.

Creator Coins: Financialize attention before productizing culture. This creates misaligned incentives where fans speculate rather than participate, and creators face sell pressure disconnected from their actual output.

2. The SWAG CLUB Thesis Culture should be funded collectively, experienced physically, and monetized sustainably. Instead of selling promises or purely digital assets, SWAG CLUB focuses on tangible outcomes such as:

  Decor art and collectibles.

  Toys and design objects.

  Limited fashion/merchandise.

  In-person experiences (raves, pop-ups).

3. Core Architecture SWAG CLUB functions as a gamified marketplace powered by a decentralized community, consisting of three main pillars:

The Marketplace: A platform where users fund products, trade access rights, and participate in curation. Unlike traditional NFT markets, value here is anchored to real-world fulfillment.

The Onchain Vault: Represents pooled ownership of physical assets. It handles asset custody, tracking, and transparency regarding production and inventory.

Decentralized Crowdfunding (DAO): The governance layer that selects projects and oversees manufacturing, logistics, and IP usage. Funding is raised specifically via "product vault ticket bids."

4. Gamification To transform support from passive consumption into active engagement, the protocol introduces game mechanics, including curation challenges, vault performance dynamics, and arbitrage opportunities between physical value and onchain representation.

5. Incentive Structure

For Creatives: They gain access to funding without surrendering autonomy. The protocol provides infrastructure for real-world distribution, manufacturing, and shared IP upside, focusing on exposure and revenue rather than ownership extraction.

For the Community: Participants are not just speculators; they fund creators through DAO raises, gain shared upside from successful products, and hold governance rights over vaults and IP.
`;

export default function SwagClubLanding() {
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);
  const [twitterHandle, setTwitterHandle] = useState('');
  const [partnerType, setPartnerType] = useState(''); // NEW: 3 Choices
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [isWhitepaperOpen, setIsWhitepaperOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark(!isDark);

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('creator_applications')
        .insert([{ 
            twitter_handle: twitterHandle,
            reason: partnerType, // Storing "Individual/Brand/Product" here
            status: 'pending'
        }]);

      if (error) throw error;

      setIsSuccess(true);
      setTimeout(() => {
        setIsPartnerOpen(false);
        setIsSuccess(false);
        setTwitterHandle('');
        setPartnerType('');
      }, 2000);

    } catch (err: any) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen relative transition-colors duration-500 font-sans selection:bg-teal-400 selection:text-black ${isDark ? 'bg-[#050505] text-white' : 'bg-[#FAFAFA] text-neutral-900'}`}>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        
        /* iOS-Optimized Infinite Scroll */
        @keyframes scroll { 
          0% { transform: translate3d(0, 0, 0); } 
          100% { transform: translate3d(-50%, 0, 0); } 
        }
        .animate-scroll { 
          animation: scroll 40s linear infinite; 
          will-change: transform; 
        }
        .pause-on-hover:hover { animation-play-state: paused; }
      `}</style>
      
      <MobileWarning />

      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1614850523011-8f49ffc73908?q=80&w=2000&auto=format&fit=crop')`,
            opacity: isDark ? 0.3 : 0.1 
          }} 
        />
        <div className={`absolute inset-0 transition-colors duration-500 ${isDark ? 'bg-[#050505]/90' : 'bg-[#F5F5F7]/90'}`} />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none"></div>
      </div>

      {/* NAV */}
      <nav className="fixed w-full z-30 top-4 md:top-6 flex justify-center px-4">
        <div className={`flex items-center justify-between w-full max-w-4xl px-6 py-4 rounded-full backdrop-blur-xl border shadow-lg transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10 shadow-black/20' : 'bg-white/60 border-black/5 shadow-neutral-200/50'}`}>
          <div className="flex items-center gap-3 font-syne font-bold text-xl md:text-2xl tracking-tighter">
             <img src="/logo.png" alt="SwagClub" className="w-10 h-10 object-contain rounded-full" />
             <span>SwagClub</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium opacity-80 font-syne">
            <Link href="/discover" className="hover:opacity-100 transition-opacity">Discover</Link>
            <button onClick={() => setIsWhitepaperOpen(true)} className="hover:opacity-100 transition-opacity">Whitepaper</button>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/discover" className={`md:hidden text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
              DISCOVER
            </Link>
            <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-neutral-400 hover:text-white' : 'hover:bg-black/5 text-neutral-500 hover:text-black'}`}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <main className="relative pt-32 md:pt-40 pb-12 flex flex-col items-center overflow-hidden min-h-screen z-10">
        
        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-4 mb-12 px-4">
          <h1 className="font-syne text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
            Display your <br />
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-teal-200 via-teal-400 to-emerald-400' : 'from-purple-600 via-pink-500 to-orange-400'}`}>
              masterpiece.
            </span>
          </h1>
          <p className={`text-lg md:text-xl max-w-lg mx-auto mt-6 font-light ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            The premier decentralized protocol for creators to showcase special arts on Base.
          </p>
        </div>

        {/* SCROLLING ART (iOS Optimized) */}
        <div className="w-full relative py-6 md:py-8 mb-16 md:mb-24 overflow-hidden">
          <div className={`absolute left-0 top-0 bottom-0 w-12 md:w-24 z-20 bg-gradient-to-r ${isDark ? 'from-[#050505]' : 'from-[#F5F5F7]'} to-transparent`} />
          <div className={`absolute right-0 top-0 bottom-0 w-12 md:w-24 z-20 bg-gradient-to-l ${isDark ? 'from-[#050505]' : 'from-[#F5F5F7]'} to-transparent`} />

          <div className="flex w-max animate-scroll pause-on-hover transform-gpu">
            {[...ART_IMAGES, ...ART_IMAGES].map((img, idx) => (
              <div key={idx} className="relative w-32 h-48 md:w-56 md:h-72 mx-2 md:mx-3 rounded-xl overflow-hidden group transition-transform duration-300 hover:scale-105 border border-white/10 shadow-2xl">
                <img src={img} alt="Art" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* --- FEATURES BENTO GRID --- */}
        <section className="relative z-20 w-full max-w-5xl px-6 mb-24">
           <div className="text-center mb-10">
              <h2 className="font-syne text-2xl md:text-3xl font-bold">The SwagClub Advantage</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Distribution */}
              <div className={`group p-8 md:p-10 rounded-[2.5rem] border transition-all duration-300 hover:scale-[1.01] overflow-hidden relative ${isDark ? 'bg-white/5 border-white/10 hover:border-teal-500/30' : 'bg-white border-neutral-200 shadow-xl'}`}>
                 <div className="absolute top-0 right-0 p-24 bg-teal-500/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none group-hover:bg-teal-500/20 transition-colors"></div>
                 <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-xl shadow-lg ${isDark ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-100 text-teal-600'}`}>
                       <Globe className="w-7 h-7" />
                    </div>
                    <h3 className="text-3xl font-syne font-bold mb-3 leading-tight">Art pop up for <br/> distribution</h3>
                    <p className={`text-base leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                       Instant global reach. Distribute your cultural artifacts to a network of verified collectors on Base without the middleman.
                    </p>
                 </div>
              </div>

              {/* Card 2: Funding */}
              <div className={`group p-8 md:p-10 rounded-[2.5rem] border transition-all duration-300 hover:scale-[1.01] overflow-hidden relative ${isDark ? 'bg-white/5 border-white/10 hover:border-purple-500/30' : 'bg-white border-neutral-200 shadow-xl'}`}>
                 <div className="absolute top-0 right-0 p-24 bg-purple-500/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none group-hover:bg-purple-500/20 transition-colors"></div>
                 <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-xl shadow-lg ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                       <TrendingUp className="w-7 h-7" />
                    </div>
                    <h3 className="text-3xl font-syne font-bold mb-3 leading-tight">Funding for <br/> upcoming creators</h3>
                    <p className={`text-base leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                       Direct monetization. Launch your drop and secure immediate liquidity to fuel your next masterpiece.
                    </p>
                 </div>
              </div>

           </div>
        </section>

        {/* PARTNER CTA BUTTON */}
        <div className="relative z-20 px-6 pb-12">
          <button onClick={() => setIsPartnerOpen(true)} className={`group flex items-center gap-3 px-10 py-5 rounded-full text-xl font-syne font-bold transition-all hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/20 ${isDark ? 'bg-white text-black hover:bg-teal-400' : 'bg-black text-white hover:bg-neutral-800'}`}>
            Partner With Us
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </main>

      {/* --- MODAL: PARTNER FORM --- */}
      {isPartnerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className={`w-full max-w-lg rounded-3xl shadow-2xl p-8 relative overflow-hidden animate-in zoom-in-95 ${isDark ? 'bg-[#111] border border-white/10' : 'bg-white'}`}>
             <button onClick={() => setIsPartnerOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5"/></button>
             
             {isSuccess ? (
               <div className="text-center py-10">
                 <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4"/>
                 <h3 className="text-2xl font-bold font-syne">Received!</h3>
                 <p className="text-neutral-500 mt-2">We'll review your {partnerType} profile.</p>
               </div>
             ) : (
               <form onSubmit={handlePartnerSubmit}>
                  <h3 className="text-2xl font-bold font-syne mb-6">Become a Partner</h3>
                  
                  {/* STEP 1: PARTNER TYPE */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold font-syne text-neutral-400 mb-3">1. What type of partner are you?</label>
                    <div className="grid grid-cols-1 gap-3">
                        {['Individual Artist', 'Art Brand', 'Physical Product'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setPartnerType(type)}
                            className={`p-4 rounded-xl text-left border transition-all flex items-center gap-3 font-bold
                              ${partnerType === type 
                                ? 'bg-teal-500/20 border-teal-500 text-teal-400' 
                                : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'}
                            `}
                          >
                             {type === 'Individual Artist' && <User className="w-5 h-5"/>}
                             {type === 'Art Brand' && <Store className="w-5 h-5"/>}
                             {type === 'Physical Product' && <Package className="w-5 h-5"/>}
                             {type}
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* STEP 2: TWITTER */}
                  <div className="mb-8">
                    <label className="block text-sm font-bold font-syne text-neutral-400 mb-3">2. Submit X (Twitter) Profile</label>
                    <input 
                      type="url" 
                      value={twitterHandle} 
                      onChange={(e) => setTwitterHandle(e.target.value)} 
                      className={`w-full p-4 rounded-xl text-lg outline-none focus:ring-2 focus:ring-teal-500 transition-all ${isDark ? 'bg-white/5' : 'bg-neutral-100'}`} 
                      placeholder="https://x.com/yourname"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting || !twitterHandle || !partnerType} 
                    className="w-full py-4 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin mx-auto"/> : 'SUBMIT APPLICATION'}
                  </button>
               </form>
             )}
          </div>
        </div>
      )}

      {/* --- WHITEPAPER MODAL --- */}
      {isWhitepaperOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
           <div className={`w-full max-w-2xl max-h-[85vh] rounded-[30px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 ${isDark ? 'bg-[#0a0a0a] border border-white/10 text-white' : 'bg-white text-black'}`}>
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2 font-syne font-bold text-xl text-teal-400">
                    <FileText className="w-5 h-5"/> Whitepaper <span className="text-xs bg-white/10 text-white px-2 py-0.5 rounded">v4.0</span>
                </div>
                <button onClick={() => setIsWhitepaperOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-8 overflow-y-auto font-syne leading-relaxed whitespace-pre-line text-lg opacity-90">
                  {WHITEPAPER_CONTENT}
              </div>
              <div className="p-6 border-t border-white/10 bg-white/5 flex gap-4">
                <button onClick={() => setIsWhitepaperOpen(false)} className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition-colors">Close Document</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function MobileWarning() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { if (window.innerWidth < 768) setVisible(true); }, []);
  if (!visible) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-blue-900 to-purple-900 text-white px-4 py-3 shadow-xl animate-in slide-in-from-top duration-500">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-full"><Monitor className="w-4 h-4 text-teal-300" /></div>
            <div><p className="text-xs font-bold text-teal-300 uppercase tracking-wider">Pro Tip</p><p className="text-sm font-medium leading-tight">Switch to Desktop for the best experience.</p></div>
        </div>
        <button onClick={() => setVisible(false)} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
      </div>
    </div>
  );
}