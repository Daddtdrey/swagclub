"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'; 
import { ArrowRight, X, Moon, Sun, Loader2, FileText, Monitor, CheckCircle2 } from 'lucide-react';

/* --- SUPABASE CONFIG --- */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* --- CONFIGURATION --- */
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

1. The Problem: Failure of Current Models Existing Web3 creative models are insufficient:

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
  // --- STATE ---
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [twitterHandle, setTwitterHandle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [isWhitepaperOpen, setIsWhitepaperOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark(!isDark);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('creator_applications')
        .insert([{ 
            inspiration: "", // Sending empty string since we removed the question
            reason: "",      // Sending empty string 
            twitter_handle: twitterHandle,
            status: 'pending'
        }]);

      if (error) throw error;

      setIsSuccess(true);
      setTimeout(() => {
        setIsApplyOpen(false);
        setIsSuccess(false);
        setTwitterHandle('');
      }, 2000);

    } catch (err: any) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen relative transition-colors duration-500 font-sans selection:bg-teal-400 selection:text-black ${isDark ? 'text-white' : 'text-neutral-900'}`}>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-scroll { animation: scroll 40s linear infinite; }
        .pause-on-hover:hover { animation-play-state: paused; }
      `}</style>
      
      <MobileWarning />

      {/* BACKGROUND */}
      <div className="fixed inset-0 z-[-1]">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1614850523011-8f49ffc73908?q=80&w=2000&auto=format&fit=crop')`,
            opacity: isDark ? 0.4 : 0.1 
          }} 
        />
        <div className={`absolute inset-0 transition-colors duration-500 ${isDark ? 'bg-[#050505]/90' : 'bg-[#F5F5F7]/90'}`} />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      </div>

      {/* NAV */}
      <nav className="fixed w-full z-30 top-4 md:top-6 flex justify-center px-4">
        <div className={`flex items-center justify-between w-full max-w-4xl px-4 md:px-6 py-3 rounded-full backdrop-blur-xl border shadow-lg transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10 shadow-black/20' : 'bg-white/60 border-black/5 shadow-neutral-200/50'}`}>
          <div className="flex items-center gap-2 font-syne font-bold text-xl md:text-2xl tracking-tighter">
             <div className="w-5 h-5 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full" />
             <span>SwagClub</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium opacity-80 font-syne">
            <a href="/discover" className="hover:opacity-100 transition-opacity">Discover</a>
            <button onClick={() => setIsWhitepaperOpen(true)} className="hover:opacity-100 transition-opacity">Whitepaper</button>
          </div>

          <div className="flex items-center gap-3">
            <a href="/discover" className={`md:hidden text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
              DISCOVER
            </a>
            <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-neutral-400 hover:text-white' : 'hover:bg-black/5 text-neutral-500 hover:text-black'}`}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <main className="relative pt-32 md:pt-40 pb-12 flex flex-col items-center overflow-hidden min-h-screen">
        
        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-4 mb-12 px-4">
          <h1 className="font-syne text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
            Display your <br />
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-teal-200 via-teal-400 to-emerald-400' : 'from-purple-600 via-pink-500 to-orange-400'}`}>
              masterpiece.
            </span>
          </h1>
          <p className={`text-lg md:text-xl max-w-lg mx-auto mt-6 font-light ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            The premier decentralized platform for creators to showcase special arts on Base.
          </p>
        </div>

        {/* SCROLLING ART */}
        <div className="w-full relative py-6 md:py-8 mb-12 md:mb-16">
          <div className={`absolute left-0 top-0 bottom-0 w-12 md:w-24 z-20 bg-gradient-to-r ${isDark ? 'from-[#050505]' : 'from-[#F5F5F7]'} to-transparent`} />
          <div className={`absolute right-0 top-0 bottom-0 w-12 md:w-24 z-20 bg-gradient-to-l ${isDark ? 'from-[#050505]' : 'from-[#F5F5F7]'} to-transparent`} />

          <div className="flex w-max animate-scroll pause-on-hover">
            {[...ART_IMAGES, ...ART_IMAGES].map((img, idx) => (
              <div key={idx} className="relative w-32 h-48 md:w-56 md:h-72 mx-2 md:mx-3 rounded-xl overflow-hidden group transition-transform duration-300 hover:scale-105 border border-white/10">
                <img src={img} alt="Art" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA BUTTON */}
        <div className="relative z-20 px-6">
          <button onClick={() => setIsApplyOpen(true)} className={`group flex items-center gap-3 px-8 py-4 rounded-full text-lg font-syne font-bold transition-all hover:scale-105 hover:shadow-lg ${isDark ? 'bg-white text-black hover:bg-teal-400' : 'bg-black text-white hover:bg-neutral-800'}`}>
            Apply Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </main>

      {/* --- SINGLE STEP APPLICATION FORM --- */}
      {isApplyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className={`w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${isDark ? 'bg-[#111] border border-white/10' : 'bg-white border border-black/5'}`}>
            
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="font-syne font-bold text-xl">Join the Club</h2>
              <button onClick={() => setIsApplyOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5"/></button>
            </div>
            
            {isSuccess ? (
              <div className="p-12 text-center animate-in zoom-in">
                 <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4"/>
                 <h3 className="text-2xl font-bold font-syne mb-2">Received!</h3>
                 <p className="text-neutral-500">We'll check out your profile shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="p-8">
                  <div className="space-y-4">
                     <label className="block text-sm font-bold font-syne text-neutral-400">Where can we see your work?</label>
                     <h3 className="text-xl md:text-2xl font-bold font-syne">Drop your X (Twitter) Link</h3>
                     
                     <input 
                      type="url" 
                      autoFocus 
                      value={twitterHandle} 
                      onChange={(e) => setTwitterHandle(e.target.value)} 
                      className={`w-full p-4 rounded-xl text-lg outline-none focus:ring-2 focus:ring-teal-500 transition-all ${isDark ? 'bg-white/5' : 'bg-neutral-100'}`} 
                      placeholder="https://x.com/yourname"
                     />

                     <div className="pt-4">
                      <button 
                          type="submit" 
                          disabled={isSubmitting || !twitterHandle} 
                          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-400 to-emerald-500 text-black px-8 py-4 rounded-full font-bold hover:brightness-110 disabled:opacity-50 transition-all"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin"/> : 'SUBMIT APPLICATION'}
                      </button>
                     </div>
                  </div>
              </form>
            )}
          </div>
        </div>
      )}

      {isWhitepaperOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className={`w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col ${isDark ? 'bg-[#111] text-white' : 'bg-white text-black'}`}>
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-2 font-syne font-bold text-xl text-teal-400"><FileText className="w-5 h-5"/> Whitepaper</div>
                <button onClick={() => setIsWhitepaperOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-8 overflow-y-auto font-syne leading-relaxed whitespace-pre-line">{WHITEPAPER_CONTENT}</div>
              <div className="p-6 border-t border-white/10 bg-white/5">
                <button onClick={() => setIsWhitepaperOpen(false)} className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold transition-colors">Close Document</button>
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