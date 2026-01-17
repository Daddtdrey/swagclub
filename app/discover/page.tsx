"use client";

import React, { useState } from 'react';
import { 
  Heart, 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  Zap, 
  MoreHorizontal,
  ArrowUpRight 
} from 'lucide-react';

/* --- MOCK DATA --- */
const MOCK_ARTS = [
  { id: 1, title: "Neon Genesis", artist: "@kaito", price: "0.45 ETH", likes: 120, img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80", height: "h-64" },
  { id: 2, title: "Cyber Skull", artist: "@skull_boy", price: "1.2 ETH", likes: 850, img: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80", height: "h-96" },
  { id: 3, title: "Fluid Thoughts", artist: "@mirage", price: "0.1 ETH", likes: 45, img: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=800&q=80", height: "h-80" },
  { id: 4, title: "Retro Walk", artist: "@pixel_dad", price: "0.8 ETH", likes: 210, img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80", height: "h-64" },
  { id: 5, title: "Abstract One", artist: "@abstracto", price: "2.5 ETH", likes: 1200, img: "https://images.unsplash.com/photo-1615184697985-c9bde1b07da7?w=800&q=80", height: "h-96" },
  { id: 6, title: "Graffiti Soul", artist: "@street_king", price: "0.3 ETH", likes: 89, img: "https://images.unsplash.com/photo-1579783902614-a3fb39279c0f?w=800&q=80", height: "h-72" },
];

export default function DiscoverPage() {
  const [activeFilter, setActiveFilter] = useState('Trending');

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-teal-400 selection:text-black">
      
      {/* --- INJECT FONTS (Copying from Landing to ensure consistency) --- */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
      `}</style>

      {/* --- SIDEBAR (Fixed) --- */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 md:w-64 border-r border-white/5 bg-[#050505] flex flex-col z-20">
        
        {/* Logo Area */}
        <div className="h-24 flex items-center px-6 md:px-8">
           <a href="/" className="flex items-center gap-3 font-syne font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
             <div className="w-6 h-6 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full" />
             <span className="hidden md:block">SwagClub</span>
           </a>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-8 px-4 space-y-2">
          <NavItem icon={<TrendingUp />} label="Trending" active={activeFilter === 'Trending'} onClick={() => setActiveFilter('Trending')} />
          <NavItem icon={<Clock />} label="New Arrivals" active={activeFilter === 'New'} onClick={() => setActiveFilter('New')} />
          <NavItem icon={<Zap />} label="Curated" active={activeFilter === 'Curated'} onClick={() => setActiveFilter('Curated')} />
        </div>

        {/* User Mini Profile */}
        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500" />
            <div className="hidden md:block">
              <p className="text-sm font-bold">@Intern</p>
              <p className="text-xs text-neutral-500">0x84...92a</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="pl-20 md:pl-64 min-h-screen">
        
        {/* Header / Search Bar */}
        <header className="sticky top-0 z-10 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-syne font-bold hidden md:block">{activeFilter}</h1>
          </div>

          <div className="flex-1 max-w-md mx-6 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-teal-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search artists or collection..." 
              className="w-full bg-white/5 border border-white/5 rounded-full py-3 pl-12 pr-4 text-sm focus:bg-white/10 focus:border-teal-400/50 outline-none transition-all"
            />
          </div>

          <button className="p-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </header>

        {/* --- ART GRID (Masonry Vibe) --- */}
        <div className="p-8">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            
            {MOCK_ARTS.map((art) => (
              <ArtCard key={art.id} art={art} />
            ))}

          </div>
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${active ? 'bg-teal-400/10 text-teal-400' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
    >
      {React.cloneElement(icon, { className: "w-5 h-5" })}
      <span className="hidden md:block font-medium">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400 hidden md:block" />}
    </button>
  );
}

function ArtCard({ art }: any) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(art.likes);

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <div className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-900/10">
      
      {/* Image */}
      <div className={`w-full ${art.height} relative`}>
        <img src={art.img} alt={art.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        
        {/* Overlay Buttons (Show on Hover) */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
           <button className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-colors">
             <MoreHorizontal className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-syne font-bold text-lg leading-tight">{art.title}</h3>
            <p className="text-xs text-neutral-400 mt-1">{art.artist}</p>
          </div>
          <div className="text-right">
            <span className="block text-xs text-neutral-500">Current Bid</span>
            <span className="block font-bold text-teal-400">{art.price}</span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          
          {/* Upvote Button */}
          <button 
            onClick={toggleLike}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${liked ? 'text-pink-500' : 'text-neutral-400 hover:text-white'}`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </button>

          {/* Bid Button */}
          <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-teal-400 transition-colors">
            Place Bid
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}