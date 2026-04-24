/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { NameInfo } from '../types';
import { HISTORICAL_TOP_NAMES } from '../data';
import { motion } from 'motion/react';
import { Calendar, TrendingUp } from 'lucide-react';

export default function HistoryView({ allNames }: { allNames: NameInfo[] }) {
  const years = Object.keys(HISTORICAL_TOP_NAMES).sort((a, b) => Number(b) - Number(a));
  const [selectedYear, setSelectedYear] = useState(Number(years[0]));

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 min-h-full bg-[#fdfaf5]">
      <div className="mb-12">
        <span className="text-[10px] font-bold text-[#8a9a5b] tracking-[0.3em] uppercase mb-4 block">CHRONICLES</span>
        <h2 className="text-5xl font-serif font-bold italic tracking-tight text-[#5a5a40]">Historical Trends</h2>
        <p className="text-[#998b7a] mt-4 max-w-lg font-serif italic text-lg opacity-80 leading-relaxed text-balance">
          The curators have archived the most favored identities across the decades. Select a timeline to view the shifts.
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar -mx-6 px-6">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(Number(year))}
            className={`px-8 py-4 rounded-[2rem] font-serif font-bold text-xl shrink-0 transition-all border ${
              selectedYear === Number(year) 
                ? 'bg-[#8a9a5b] text-white border-[#8a9a5b] shadow-xl scale-105' 
                : 'bg-[#f4eee6] text-[#998b7a] border-[#e0d6c8] hover:bg-white'
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {HISTORICAL_TOP_NAMES[selectedYear].map((name, index) => (
          <motion.div
            key={`${selectedYear}-${name}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative bg-white border border-[#e0d6c8] p-8 rounded-[2.5rem] overflow-hidden hover:border-[#5a5a40] transition-all shadow-sm flex flex-col justify-end min-h-[160px]"
          >
            <span className="absolute top-4 right-6 font-serif italic text-7xl text-[#f4eee6] group-hover:text-[#8a9a5b]/10 transition-colors pointer-events-none select-none">
              {index + 1}
            </span>
            <div className="relative z-10">
              <h3 className="text-3xl font-serif font-bold text-[#5a5a40] group-hover:italic transition-all">{name}</h3>
              <div className="mt-4 flex items-center gap-2 text-[#8a9a5b]">
                <TrendingUp size={16} />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Classic Ranking</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 p-10 bg-[#5a5a40] rounded-[3rem] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <h3 className="text-3xl font-serif font-bold italic mb-6 tracking-tight relative z-10">Curator's Note</h3>
        <p className="text-[#f4eee6] leading-relaxed font-serif text-lg opacity-80 relative z-10">
          Historical data suggests that names often follow a 100-year cycle. The identities of our ancestors often bloom once again in the nurseries of today.
        </p>
      </div>
    </div>
  );
}
