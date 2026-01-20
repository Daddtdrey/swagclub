"use client";

import React, { use } from 'react'; // <--- Import 'use'
import Link from 'next/link';
import { ArrowLeft, Share2, MoreHorizontal } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Mock Data Lookup
const getArt = (id: string) => ({
  title: "Blue & Pink Abstract",
  creator: "Charles Will", 
  owner: "Lionel Lee",
  price: "2.49 ETH",
  usd: "$5803.52",
  desc: "Blue and Pink Abstract is one of the abstract objects created by Charles Will and owned by Lionel Lee. This abstract belongs to the art category.",
  img: "https://images.unsplash.com/photo-1615184697985-c9bde1b07da7?w=1200&q=80"
});

// Update Type Definition: params is now a Promise
export default function BidPage({ params }: { params: Promise<{ id: string }> }) {
  
  // Unwrap the params Promise using React.use()
  const { id } = use(params);
  
  const art = getArt(id);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex justify-center p-4 md:p-8">
      
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        
        {/* --- LEFT: The Image --- */}
        <div className="relative group">
           <Link href="/discover" className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md p-3 rounded-full hover:bg-white hover:text-black transition-colors">
              <ArrowLeft className="w-5 h-5" />
           </Link>
           <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-900/20 h-[500px] md:h-[600px] relative">
              <img src={art.img} alt={art.title} className="w-full h-full object-cover" />
              
              {/* Floating Actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-3">
                 <button className="p-3 bg-black/40 backdrop-blur-md rounded-full hover:bg-white hover:text-black transition-colors"><Share2 className="w-5 h-5"/></button>
                 <button className="p-3 bg-black/40 backdrop-blur-md rounded-full hover:bg-white hover:text-black transition-colors"><MoreHorizontal className="w-5 h-5"/></button>
              </div>
           </div>
        </div>

        {/* --- RIGHT: The Details Panel --- */}
        <div className="space-y-8">
           
           {/* Header */}
           <div>
             <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{art.title}</h1>
             
             {/* Creator / Owner Row */}
             <div className="flex items-center gap-8 mb-8">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300" />
                   <div>
                      <p className="text-xs text-neutral-500">Creator</p>
                      <p className="font-bold">{art.creator}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-300" />
                   <div>
                      <p className="text-xs text-neutral-500">Owner</p>
                      <p className="font-bold">{art.owner}</p>
                   </div>
                </div>
             </div>
           </div>

           {/* The Bid Card */}
           <div className="bg-[#1A1A1A] rounded-3xl p-6 border border-white/5">
              <div className="flex justify-between items-end mb-6">
                 <div>
                    <p className="text-neutral-400 text-sm mb-1">Current Bid</p>
                    <div className="flex items-baseline gap-2">
                       <span className="text-3xl font-bold text-blue-400">{art.price}</span>
                       <span className="text-neutral-500">{art.usd}</span>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-neutral-400 text-sm mb-1">Auction Ending In</p>
                    <div className="flex gap-2 text-xl font-mono font-bold">
                       <span>03</span><span className="text-neutral-600">:</span>
                       <span>24</span><span className="text-neutral-600">:</span>
                       <span>03</span>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                 <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all">
                    Place a Bid
                 </button>
                 <ConnectButton showBalance={false} />
              </div>
           </div>

           {/* Description */}
           <div>
              <h3 className="text-lg font-bold mb-2">Description</h3>
              <p className="text-neutral-400 leading-relaxed">
                 {art.desc}
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}