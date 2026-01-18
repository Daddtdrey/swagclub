"use client";

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  Zap, 
  MoreHorizontal,
  ArrowUpRight,
  Home,
  User,
  X,
  Monitor
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
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-teal-400 selection:text-black pb-24 md:pb-0">
      
      {/* --- INJECT FONTS --- */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        
        /* Hide scrollbar for top filters on mobile */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- MOBILE WARNING BANNER --- */}
      <MobileWarning />

      {/* --- DESKTOP SIDEBAR (Hidden on Mobile) --- */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 border-r border-white/5 bg-[#050505] flex-col z-20">
        <div className="h-24 flex items-center px-8">
           <a href="/" className="flex items-center gap-3 font-syne font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
             <div className="w-6 h-6 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full" />
             <span>SwagClub</span>
           </a>
        </div>
        <div className="flex-1 py-8 px-4 space-y-2">
          <NavItem icon={<TrendingUp />} label="Trending" active={activeFilter === 'Trending'} onClick={() => setActiveFilter('Trending')} />
          <NavItem icon={<Clock />} label="New Arrivals" active={activeFilter === 'New'} onClick={() => setActiveFilter('New')} />
          <NavItem icon={<Zap />} label="Curated" active={activeFilter === 'Curated'} onClick={() => setActiveFilter('Curated')} />
        </div>
        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500" />
            <div>
              <p className="text-sm font-bold">@Intern</p>
              <p className="text-xs text-neutral-500">0x84...92a</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      {/* On mobile: padding-left is 0. On Desktop: padding-left is 64 (width of sidebar) */}
      <main className="pl-0 md:pl-64 min-h-screen">
        
        {/* HEADER: Search & Mobile Filters */}
        <header className="sticky top-0 z-10 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-4 md:h-24 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Mobile Logo Row */}
          <div className="md:hidden flex items-center justify-between mb-2">
             <a href="/" className="flex items-center gap-2 font-syne font-bold text-lg">
                <div className="w-5 h-5 bg-teal-400 rounded-full" /> SwagClub
             </a>
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500" />
          </div>

          {/* Search Bar */}
          <div className="w-full md:max-w-md relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-teal-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-white/5 border border-white/5 rounded-full py-3 pl-12 pr-4 text-sm focus:bg-white/10 focus:border-teal-400/50 outline-none transition-all"
            />
          </div>

          {/* Mobile Horizontal Filters (Scrollable) */}
          <div className="md:hidden flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
             <MobileFilterPill label="Trending" active={activeFilter === 'Trending'} onClick={() => setActiveFilter('Trending')} />
             <MobileFilterPill label="New" active={activeFilter === 'New'} onClick={() => setActiveFilter('New')} />
             <MobileFilterPill label="Curated" active={activeFilter === 'Curated'} onClick={() => setActiveFilter('Curated')} />
             <MobileFilterPill label="Blue Chips" active={false} onClick={() => {}} />
          </div>

          <button className="hidden md:block p-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </header>

        {/* --- ART GRID --- */}
        <div className="p-4 md:p-8">
          {/* Mobile: 1 Column. Tablet: 2. Desktop: 3 */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {MOCK_ARTS.map((art) => (
              <ArtCard key={art.id} art={art} />
            ))}
          </div>
        </div>
      </main>

      {/* --- MOBILE BOTTOM NAVIGATION (Fixed) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#050505]/90 backdrop-blur-lg border-t border-white/10 flex items-center justify-around z-50 px-2 pb-2">
        <MobileNavLink icon={<Home />} label="Home" href="/" />
        <MobileNavLink icon={<Search />} label="Discover" active href="/discover" />
        <div className="relative -top-6">
            <button className="w-14 h-14 rounded-full bg-teal-400 text-black flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.4)]">
                <ArrowUpRight className="w-6 h-6" />
            </button>
        </div>
        <MobileNavLink icon={<Heart />} label="Likes" href="#" />
        <MobileNavLink icon={<User />} label="Profile" href="#" />
      </div>

    </div>
  );
}

/* --- COMPONENTS --- */

// The Warning Banner
function MobileWarning() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show on screens smaller than 768px (Mobile)
    if (window.innerWidth < 768) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-blue-900 to-purple-900 text-white px-4 py-3 shadow-xl animate-in slide-in-from-top duration-500">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-full">
                <Monitor className="w-4 h-4 text-teal-300" />
            </div>
            <div>
                <p className="text-xs font-bold text-teal-300 uppercase tracking-wider">Pro Tip</p>
                <p className="text-sm font-medium leading-tight">For the best SwagClub experience, switch to Desktop.</p>
            </div>
        </div>
        <button onClick={() => setVisible(false)} className="text-white/50 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${active ? 'bg-teal-400/10 text-teal-400' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
    >
      {React.cloneElement(icon, { className: "w-5 h-5" })}
      <span className="font-medium">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />}
    </button>
  );
}

function MobileFilterPill({ label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold border transition-all ${
        active 
          ? 'bg-white text-black border-white' 
          : 'bg-transparent text-neutral-400 border-white/10 hover:border-white/30'
      }`}
    >
      {label}
    </button>
  )
}

function MobileNavLink({ icon, label, active, href }: any) {
    return (
        <a href={href} className={`flex flex-col items-center gap-1 p-2 ${active ? 'text-teal-400' : 'text-neutral-500'}`}>
            {React.cloneElement(icon, { className: "w-6 h-6" })}
            <span className="text-[10px] font-medium">{label}</span>
        </a>
    )
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
      <div className={`w-full ${art.height} relative`}>
        <img src={art.img} alt={art.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
           <button className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-colors">
             <MoreHorizontal className="w-4 h-4" />
           </button>
        </div>
      </div>
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
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <button 
            onClick={toggleLike}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${liked ? 'text-pink-500' : 'text-neutral-400 hover:text-white'}`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </button>
          <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-teal-400 transition-colors">
            Place Bid
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}