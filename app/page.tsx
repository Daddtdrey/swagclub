"use client";

import React, { useState } from 'react';
import { ArrowRight, Twitter, X, Moon, Sun, Sparkles, Loader2 } from 'lucide-react';

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

export default function SwagClubLanding() {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [xUrl, setXUrl] = useState('');
  const [isDark, setIsDark] = useState(true); // Default to dark for "dim" look
  
  // New: Loading state for API calls
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Start loading

    try {
      // 1. Send data to our internal API route
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ twitterUrl: xUrl }),
      });

      const result = await response.json();

      if (response.ok) {
        // Success
        alert("Welcome to the Club! Application Received.");
        setIsApplyOpen(false);
        setXUrl('');
      } else {
        // Handle Server Error
        console.error("Server Error:", result);
        alert("Failed to send: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      // Handle Network Error
      console.error("Network Error:", err);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  return (
    <div className={`min-h-screen relative transition-colors duration-500 font-sans selection:bg-teal-400 selection:text-black ${isDark ? 'text-white' : 'text-neutral-900'}`}>
      
      {/* --- STYLISH BACKGROUND IMAGE --- */}
      <div className="fixed inset-0 z-[-1]">
        {/* The Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1614850523011-8f49ffc73908?q=80&w=2000&auto=format&fit=crop')`,
            opacity: isDark ? 0.4 : 0.1 
          }} 
        />
        {/* The Dimmer/Color Wash */}
        <div className={`absolute inset-0 transition-colors duration-500 ${isDark ? 'bg-[#050505]/90' : 'bg-[#F5F5F7]/90'}`} />
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .pause-on-hover:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* --- FLOATING HEADER --- */}
      <nav className="fixed w-full z-30 top-6 flex justify-center px-4">
        <div className={`flex items-center justify-between w-full max-w-4xl px-6 py-3 rounded-full backdrop-blur-xl border shadow-lg transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10 shadow-black/20' : 'bg-white/60 border-black/5 shadow-neutral-200/50'}`}>
          
          {/* Logo */}
          <div className="flex items-center gap-2 font-syne font-bold text-xl tracking-tight">
             <div className="w-5 h-5 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full" />
             <span>SwagClub</span>
          </div>

          {/* Clean Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium opacity-80">
            <a href="/discover" className="hover:opacity-100 transition-opacity">Discover</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Creators</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Roadmap</a>
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-neutral-400 hover:text-white' : 'hover:bg-black/5 text-neutral-500 hover:text-black'}`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative pt-40 pb-12 flex flex-col items-center overflow-hidden min-h-screen">
        
        {/* Tagline */}
        <div className={`mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors ${isDark ? 'border-teal-500/20 bg-teal-500/10 text-teal-400' : 'border-purple-500/20 bg-purple-500/10 text-purple-600'}`}>
          <Sparkles className="w-3 h-3" />
          Curated Web3 Art
        </div>

        {/* Refined Typography */}
        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-2 mb-12 px-4">
          <h1 className="font-syne text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            Display your <br />
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-white via-neutral-200 to-neutral-500' : 'from-neutral-900 via-neutral-700 to-neutral-500'}`}>
              masterpiece.
            </span>
          </h1>
          <p className={`text-lg md:text-xl max-w-lg mx-auto mt-6 font-light ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            The premier decentralized platform for creators to showcase special arts on Base.
          </p>
        </div>

        {/* --- REFINED MARQUEE --- */}
        <div className="w-full relative py-8 mb-16">
          {/* Fading Edges */}
          <div className={`absolute left-0 top-0 bottom-0 w-24 z-20 bg-gradient-to-r ${isDark ? 'from-[#050505]' : 'from-[#F5F5F7]'} to-transparent`} />
          <div className={`absolute right-0 top-0 bottom-0 w-24 z-20 bg-gradient-to-l ${isDark ? 'from-[#050505]' : 'from-[#F5F5F7]'} to-transparent`} />

          <div className="flex w-max animate-scroll pause-on-hover hover:cursor-grab active:cursor-grabbing">
            {[...ART_IMAGES, ...ART_IMAGES].map((img, idx) => (
              <div 
                key={idx} 
                className="relative w-48 h-64 md:w-56 md:h-72 mx-3 rounded-xl overflow-hidden group transition-all duration-500 hover:scale-105 hover:shadow-2xl grayscale hover:grayscale-0"
              >
                <img 
                  src={img} 
                  alt="Art" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* --- APPLY INTERACTION (Backend Connected) --- */}
        <div className="relative z-20 w-full max-w-md mx-auto flex justify-center items-start px-6">
            {!isApplyOpen ? (
              <button 
                onClick={() => setIsApplyOpen(true)}
                className={`group flex items-center gap-3 px-8 py-4 rounded-full text-lg font-syne font-semibold transition-all hover:scale-105 hover:shadow-lg ${
                  isDark 
                    ? 'bg-white text-black hover:bg-teal-400' 
                    : 'bg-black text-white hover:bg-neutral-800'
                }`}
              >
                Apply as Creator
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <form onSubmit={handleApplySubmit} className="w-full relative animate-in fade-in zoom-in duration-300">
                <div className={`relative group p-1 rounded-full border backdrop-blur-md ${isDark ? 'bg-neutral-900/80 border-white/10' : 'bg-white/80 border-black/5'}`}>
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400">
                    <Twitter className="w-5 h-5" />
                  </div>
                  
                  <input 
                    type="url" 
                    required
                    autoFocus
                    placeholder="x.com/your_handle"
                    value={xUrl}
                    onChange={(e) => setXUrl(e.target.value)}
                    disabled={isSubmitting} // Disable while sending
                    className="w-full bg-transparent border-none text-base rounded-full py-3 pl-12 pr-32 focus:ring-0 outline-none placeholder:text-neutral-500 disabled:opacity-50"
                  />
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`absolute right-1.5 top-1.5 bottom-1.5 px-6 rounded-full text-sm font-bold transition-transform active:scale-95 disabled:pointer-events-none disabled:opacity-80 flex items-center gap-2 ${
                      isDark 
                        ? 'bg-white text-black hover:bg-teal-400' 
                        : 'bg-black text-white hover:bg-neutral-800'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        SENDING
                      </>
                    ) : (
                      "SEND"
                    )}
                  </button>
                </div>
                
                {/* Close Button */}
                {!isSubmitting && (
                  <button 
                      type="button" 
                      onClick={() => setIsApplyOpen(false)} 
                      className="absolute -right-10 top-1/2 -translate-y-1/2 p-2 text-neutral-500 hover:text-current"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </form>
            )}
        </div>

      </main>
    </div>
  );
}