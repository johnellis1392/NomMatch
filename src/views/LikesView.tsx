/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { NameInfo, UserStats } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Trash2, Share2, Info } from 'lucide-react';

export default function LikesView({ stats, allNames }: { stats: UserStats; allNames: NameInfo[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const likedNames = allNames.filter(n => stats.likedIds.includes(n.id))
    .filter(n => n.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const shareLikes = () => {
    const list = likedNames.map(n => n.name).join(', ');
    if (navigator.share) {
      navigator.share({
        title: 'NomMatch Favorites',
        text: `My curated collection of identities: ${list}`,
        url: window.location.href
      });
    } else {
      console.log(`My Favorites: ${list}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 min-h-full bg-[#fdfaf5]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-[10px] font-bold text-[#8a9a5b] tracking-[0.3em] uppercase mb-4 block">YOUR REPOSITORY</span>
          <h2 className="text-5xl font-serif font-bold italic tracking-tight text-[#5a5a40]">The Shortlist</h2>
          <p className="text-[#998b7a] mt-4 font-serif italic text-lg opacity-80 leading-relaxed">
            The curators have compiled your most favored identities here for final verification.
          </p>
        </div>
        <button 
          onClick={shareLikes}
          disabled={likedNames.length === 0}
          className="flex items-center gap-3 px-8 py-4 bg-[#8a9a5b] text-white rounded-full hover:shadow-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          <Share2 size={20} />
          <span className="text-xs font-bold uppercase tracking-widest">Share Collection</span>
        </button>
      </div>

      <div className="relative mb-12">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#998b7a]" size={20} />
        <input 
          type="text"
          placeholder="Filter your collection..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-[#e0d6c8] rounded-[2rem] py-5 pl-16 pr-8 outline-none focus:ring-1 focus:ring-[#8a9a5b] transition-all shadow-sm font-serif italic text-lg"
        />
      </div>

      {likedNames.length === 0 ? (
        <div className="py-24 text-center bg-white/40 rounded-[3rem] border border-dashed border-[#e0d6c8]">
          <p className="text-[#998b7a] italic font-serif text-xl">The archives are empty.</p>
          <p className="text-[#c0b5a6] text-sm mt-3 uppercase tracking-widest font-bold">Initiate discovery to begin your collection</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {likedNames.map((name, i) => (
              <motion.div 
                key={name.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.02 }}
                className="group bg-white border border-[#e0d6c8] p-8 rounded-[3rem] flex items-center justify-between hover:border-[#5a5a40] hover:shadow-2xl transition-all shadow-sm"
              >
                <div>
                  <h3 className="text-3xl font-serif font-bold text-[#5a5a40] italic grow-0 group-hover:scale-105 origin-left transition-transform duration-500 tracking-tight">{name.name}</h3>
                  <p className="text-[10px] text-[#998b7a] font-bold uppercase tracking-[0.2em] mt-2">{name.origin} • {name.gender}</p>
                </div>
                <div className="flex gap-2">
                  <div className="p-4 bg-[#fdfaf5] border border-[#e0d6c8] rounded-2xl text-[#8a9a5b]">
                    <Info size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
