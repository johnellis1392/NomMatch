/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserStats } from '../types';
import { motion } from 'motion/react';
import { User, Trophy, Globe, History } from 'lucide-react';

export default function HomeView({ stats }: { stats: UserStats }) {
  const navigate = useNavigate();

  const handleSelection = (count: number) => {
    navigate(`/swipe?limit=${count}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 min-h-full flex flex-col justify-center bg-[#fdfaf5]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <span className="inline-block px-3 py-1 bg-[#8a9a5b]/10 text-[#8a9a5b] text-[10px] font-bold tracking-[0.3em] uppercase rounded-full mb-6">NOMEN. THE IDENTITY CURATORS</span>
        <h2 className="text-5xl md:text-7xl font-serif font-bold italic text-[#5a5a40] mb-8 tracking-tight leading-[1.1]">The journey to the <br /> perfect name begins.</h2>
        <p className="text-[#998b7a] text-lg md:text-xl max-w-xl mx-auto leading-relaxed font-medium">
          How many names would you like to explore today? Our curators have prepared a selection for your review.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[5, 25, 50, 100].map((count, i) => (
          <motion.button
            key={count}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleSelection(count)}
            className="group relative overflow-hidden bg-white border border-[#e0d6c8] p-10 rounded-[2.5rem] hover:border-[#8a9a5b] transition-all text-center shadow-sm hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-[#f4eee6] translate-y-full group-hover:translate-y-0 transition-transform duration-500 -z-10" />
            <span className="block text-4xl font-serif font-bold text-[#5a5a40] group-hover:text-[#5a5a40] mb-2">{count}</span>
            <span className="text-[10px] font-bold text-[#998b7a] group-hover:text-[#8a9a5b] uppercase tracking-widest transition-colors">Names</span>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Globe className="text-[#8a9a5b]" />} 
          title="Origins & Meanings" 
          desc="Explore etymology from over 50 cultures across the globe."
        />
        <FeatureCard 
          icon={<History className="text-[#8a9a5b]" />} 
          title="Historical Trends" 
          desc="See what names stood the test of time through the decades."
        />
        <FeatureCard 
          icon={<Trophy className="text-[#8a9a5b]" />} 
          title="The Final Arena" 
          desc="Pit your favorites against each other in bracket-style combat."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string, desc: string }) {
  return (
    <div className="flex flex-col gap-4 p-8 bg-white/40 rounded-3xl border border-[#e0d6c8] hover:bg-white transition-colors">
      <div className="w-12 h-12 bg-[#fdfaf5] border border-[#e0d6c8] rounded-2xl flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <h3 className="font-bold text-[#5a5a40] uppercase text-xs tracking-widest">{title}</h3>
      <p className="text-sm text-[#998b7a] leading-relaxed font-serif italic text-base">{desc}</p>
    </div>
  );
}
