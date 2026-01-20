"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, Twitter, X, Moon, Sun, Sparkles, Loader2, FileText, ChevronRight, Monitor } from 'lucide-react';

/* --- CONFIGURATION --- */
const ART_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1615184697985-c9bde1b07da7?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579783902614-a3fb39279c0f?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618172193763-c511deb635ca?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=400&auto=format&fit=crop",
];

// Cleaned up Whitepaper Content (No asterisks)
const WHITEPAPER_CONTENT = `
SwagClub Whitepaper (v1.0)

1. The Vision
SwagClub is not just a marketplace; it is a cultural movement on the Base Network. We believe that art should be fun, accessible, and community-driven.

2. Tokenomics
Our governance token ($SWAG) allows holders to curate the front page. No algorithmic feeds—just pure community vibes.

3. Roadmap
- Q1: Platform Launch & Creator Onboarding
- Q2: Community Governance & Voting
- Q3: Mobile App & AR Integration

4. Technology
Built on Next.js, powered by Base, and secured by Ethereum.
`;

export default function SwagClubLanding() {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [applyStep, setApplyStep] = useState(1);
  const [formData, setFormData] = useState({ inspiration: '', reason: '', twitter: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWhitepaperOpen, setIsWhitepaperOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark(!isDark);

  const handleNextStep = () => {
    if (applyStep < 3) setApplyStep(applyStep + 1);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("YOU'RE IN THE CLUB! 🎨 Application Sent.");
        setIsApplyOpen(false);
        setFormData({ inspiration: '', reason: '', twitter: '' });
        setApplyStep(1);
      } else {
        alert("Simulation: Application Received! (Connect API for real data)");
        setIsApplyOpen(false);
      }
    } catch (err) {
      alert("Simulation: Application Received! (Network Error ignored for demo)");
      setIsApplyOpen(false);
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

      <main className="relative pt-32 md:pt-40 pb-12 flex flex-col items-center overflow-hidden min-h-screen">
        
        {/* REMOVED: The "Web3 Art on Base" Pill/Tagline */}

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

        <div className="relative z-20 px-6">
          <button onClick={() => setIsApplyOpen(true)} className={`group flex items-center gap-3 px-8 py-4 rounded-full text-lg font-syne font-bold transition-all hover:scale-105 hover:shadow-lg ${isDark ? 'bg-white text-black hover:bg-teal-400' : 'bg-black text-white hover:bg-neutral-800'}`}>
            Apply Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </main>

      {isApplyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className={`w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${isDark ? 'bg-[#111] border border-white/10' : 'bg-white border border-black/5'}`}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="font-syne font-bold text-xl">Join The Club</h2>
              <button onClick={() => setIsApplyOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleApplySubmit} className="p-6 md:p-8">
              {applyStep === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                  <label className="block text-sm font-bold font-syne text-neutral-400">Question 1/3</label>
                  <h3 className="text-xl md:text-2xl font-bold font-syne">What inspired your art?</h3>
                  <textarea autoFocus rows={4} value={formData.inspiration} onChange={(e) => setFormData({...formData, inspiration: e.target.value})} className={`w-full p-4 rounded-xl text-lg outline-none focus:ring-2 focus:ring-teal-500 transition-all ${isDark ? 'bg-white/5' : 'bg-neutral-100'}`} />
                  <div className="flex justify-end pt-4"><button type="button" onClick={handleNextStep} disabled={!formData.inspiration} className="flex items-center gap-2 bg-teal-500 text-black px-6 py-3 rounded-full font-bold hover:bg-teal-400 disabled:opacity-50">Next <ChevronRight className="w-4 h-4" /></button></div>
                </div>
              )}
              {applyStep === 2 && (
                <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                  <label className="block text-sm font-bold font-syne text-neutral-400">Question 2/3</label>
                  <h3 className="text-xl md:text-2xl font-bold font-syne">Why are you making this?</h3>
                  <textarea autoFocus rows={4} value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} className={`w-full p-4 rounded-xl text-lg outline-none focus:ring-2 focus:ring-teal-500 transition-all ${isDark ? 'bg-white/5' : 'bg-neutral-100'}`} />
                  <div className="flex justify-end pt-4"><button type="button" onClick={handleNextStep} disabled={!formData.reason} className="flex items-center gap-2 bg-teal-500 text-black px-6 py-3 rounded-full font-bold hover:bg-teal-400 disabled:opacity-50">Next <ChevronRight className="w-4 h-4" /></button></div>
                </div>
              )}
              {applyStep === 3 && (
                <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                   <label className="block text-sm font-bold font-syne text-neutral-400">Final Step</label>
                   <h3 className="text-xl md:text-2xl font-bold font-syne">Drop your X (Twitter) Link</h3>
                   <input type="url" autoFocus value={formData.twitter} onChange={(e) => setFormData({...formData, twitter: e.target.value})} className={`w-full p-4 rounded-xl text-lg outline-none focus:ring-2 focus:ring-teal-500 transition-all ${isDark ? 'bg-white/5' : 'bg-neutral-100'}`} />
                   <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isSubmitting || !formData.twitter} className="flex items-center gap-2 bg-gradient-to-r from-teal-400 to-emerald-500 text-black px-8 py-3 rounded-full font-bold hover:brightness-110 disabled:opacity-50">
                      {isSubmitting ? <Loader2 className="animate-spin"/> : 'SUBMIT APPLICATION'}
                    </button>
                   </div>
                </div>
              )}
            </form>
            <div className="h-2 w-full bg-white/5"><div className="h-full bg-teal-500 transition-all duration-500 ease-out" style={{ width: `${(applyStep / 3) * 100}%` }} /></div>
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