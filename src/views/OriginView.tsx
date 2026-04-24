/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { NameInfo, UserStats } from '../types';
import { ORIGINS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Heart, Filter, ChevronDown, Search } from 'lucide-react';
import { cn } from '../lib/utils';

export default function OriginView({ allNames, stats, addLike, addSeen }: { 
  allNames: NameInfo[]; 
  stats: UserStats;
  addLike: (id: string) => void;
  addSeen: (id: string) => void;
}) {
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);
  const [startLetter, setStartLetter] = useState('');
  const [endLetter, setEndLetter] = useState('');
  const [meaningFilter, setMeaningFilter] = useState('');
  const [neutralOnly, setNeutralOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredNames = allNames.filter(n => {
    const matchOrigin = !selectedOrigin || n.origin === selectedOrigin;
    const matchStart = !startLetter || n.name.toLowerCase().startsWith(startLetter.toLowerCase());
    const matchEnd = !endLetter || n.name.toLowerCase().endsWith(endLetter.toLowerCase());
    const matchMeaning = !meaningFilter || n.meaning?.toLowerCase().includes(meaningFilter.toLowerCase());
    const matchNeutral = !neutralOnly || n.gender === 'neutral';
    const notSeen = !stats.likedIds.includes(n.id);
    return matchOrigin && matchStart && matchEnd && matchMeaning && matchNeutral && notSeen;
  });

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 min-h-full bg-[#fdfaf5]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex-1 max-w-xl">
          <span className="text-[10px] font-bold text-[#8a9a5b] tracking-[0.3em] uppercase mb-4 block">WORLD ARCHIVE</span>
          <h2 className="text-5xl font-serif font-bold italic tracking-tight text-[#5a5a40]">Explore by Origin</h2>
          <p className="text-[#998b7a] mt-4 font-serif italic text-lg opacity-80 leading-relaxed">
            Sift through curated archives of global traditions. Filter by linguistic roots, meaning, or gender neutrality.
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#998b7a]" size={18} />
            <input 
              type="text" 
              placeholder="Search meanings..." 
              value={meaningFilter}
              onChange={(e) => setMeaningFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-[#e0d6c8] rounded-full text-sm outline-none focus:ring-1 focus:ring-[#8a9a5b] shadow-sm transition-all"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "p-3 rounded-full border transition-all shadow-sm",
              showFilters ? "bg-[#8a9a5b] text-white border-[#8a9a5b]" : "bg-white text-[#998b7a] border-[#e0d6c8] hover:bg-[#f4eee6]"
            )}
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-12"
          >
            <div className="p-10 bg-[#f4eee6] rounded-[3rem] border border-[#e0d6c8] space-y-10 shadow-inner">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8a9a5b]">Cultural Roots</h3>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setSelectedOrigin(null)}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                        !selectedOrigin ? "bg-[#5a5a40] text-white" : "bg-white/50 text-[#998b7a] hover:bg-white border border-transparent"
                      )}
                    >
                      All
                    </button>
                    {ORIGINS.map(o => (
                      <button 
                        key={o}
                        onClick={() => setSelectedOrigin(o)}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                          selectedOrigin === o ? "bg-[#5a5a40] text-white" : "bg-white/50 text-[#998b7a] hover:bg-white border border-transparent"
                        )}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8a9a5b]">Linguistic Patterns</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#998b7a]/50">Starts With</label>
                      <input 
                        maxLength={1} 
                        placeholder="A" 
                        value={startLetter} 
                        onChange={e => setStartLetter(e.target.value.toUpperCase())} 
                        className="w-full bg-white border border-[#e0d6c8] rounded-xl p-3 text-center font-serif text-xl outline-none focus:ring-1 focus:ring-[#8a9a5b]" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#998b7a]/50">Ends With</label>
                      <input 
                        maxLength={1} 
                        placeholder="Z" 
                        value={endLetter} 
                        onChange={e => setEndLetter(e.target.value.toUpperCase())} 
                        className="w-full bg-white border border-[#e0d6c8] rounded-xl p-3 text-center font-serif text-xl outline-none focus:ring-1 focus:ring-[#8a9a5b]" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8a9a5b]">Refinements</h3>
                  <div className="space-y-4">
                    <button 
                      onClick={() => setNeutralOnly(!neutralOnly)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
                        neutralOnly ? "bg-[#8a9a5b] text-white border-[#8a9a5b]" : "bg-white/50 text-[#998b7a] border-[#e0d6c8] hover:bg-white"
                      )}
                    >
                      <span className="text-[11px] font-bold uppercase tracking-widest leading-none">Gender Neutral Only</span>
                      <ChevronDown size={16} className={cn("transition-transform", neutralOnly && "rotate-180")} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredNames.map((name, i) => (
            <motion.div
              layout
              key={name.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.01 }}
              className="group bg-white border border-[#e0d6c8] p-8 rounded-[3rem] hover:border-[#5a5a40] hover:shadow-2xl transition-all flex flex-col justify-between min-h-[200px]"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                   <span className="text-[10px] font-bold text-[#8a9a5b] uppercase tracking-[0.3em]">{name.origin}</span>
                   <button 
                    onClick={() => addLike(name.id)}
                    className="p-3 bg-[#fdfaf5] text-[#8a9a5b] hover:bg-[#8a9a5b] hover:text-white rounded-2xl transition-all border border-[#e0d6c8]"
                  >
                    <Heart size={16} fill={stats.likedIds.includes(name.id) ? "currentColor" : "none"} />
                  </button>
                </div>
                <h3 className="text-4xl font-serif font-bold text-[#5a5a40] italic group-hover:scale-105 origin-left transition-transform duration-500 tracking-tight">{name.name}</h3>
                <p className="text-[#998b7a] font-serif italic text-base mt-2 opacity-80 underline underline-offset-4 decoration-[#e0d6c8] decoration-1 line-clamp-2">
                  {name.meaning}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredNames.length === 0 && (
        <div className="py-24 bg-white/30 border border-[#e0d6c8] border-dashed rounded-[3rem] text-center">
          <Globe size={48} className="mx-auto text-[#e0d6c8] mb-6 opacity-30" />
          <p className="text-[#998b7a] font-serif italic text-xl">The archives are vast, but search yield no results for these criteria.</p>
        </div>
      )}
    </div>
  );
}

