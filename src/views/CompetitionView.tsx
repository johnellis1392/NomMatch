/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { NameInfo, UserStats } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Swords, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';

interface BracketNode {
  name: string;
  id: string;
}

export default function CompetitionView({ stats, allNames }: { stats: UserStats; allNames: NameInfo[] }) {
  const likedNames = allNames.filter(n => stats.likedIds.includes(n.id));
  const [sessionLikes, setSessionLikes] = useState<NameInfo[]>([]);
  const [bracket, setBracket] = useState<NameInfo[]>([]);
  const [currentMatch, setCurrentMatch] = useState<[NameInfo, NameInfo] | null>(null);
  const [winners, setWinners] = useState<NameInfo[]>([]);
  const [finalWinner, setFinalWinner] = useState<NameInfo | null>(null);

  useEffect(() => {
    if (likedNames.length >= 2) {
      // Initialize with a power of 2 or just shuffle a subset
      const shuffled = [...likedNames].sort(() => 0.5 - Math.random()).slice(0, 8);
      setSessionLikes(shuffled);
      setBracket(shuffled);
    }
  }, [stats.likedIds.length]);

  const startCompetition = () => {
    if (bracket.length < 2) return;
    setCurrentMatch([bracket[0], bracket[1]]);
  };

  const handleWinner = (winner: NameInfo) => {
    const newWinners = [...winners, winner];
    setWinners(newWinners);

    // If we've finished the current round
    if (bracket.length <= 2) {
      if (newWinners.length === 1) {
        setFinalWinner(newWinners[0]);
        setCurrentMatch(null);
      } else {
        // Start next round
        setBracket(newWinners);
        setWinners([]);
        setCurrentMatch([newWinners[0], newWinners[1]]);
      }
    } else {
      // Continue next match in current round
      const nextBracket = bracket.slice(2);
      setBracket(nextBracket);
      if (nextBracket.length >= 2) {
        setCurrentMatch([nextBracket[0], nextBracket[1]]);
      } else if (nextBracket.length === 1) {
        // Handle odd number (bye)
        setWinners([...newWinners, nextBracket[0]]);
        setBracket([]);
        // Re-evaluate round end logic in next tick or update state appropriately
      } else {
        // This case should be handled by the round-end check above
      }
    }
  };

  const reset = () => {
    setFinalWinner(null);
    setWinners([]);
    const shuffled = [...likedNames].sort(() => 0.5 - Math.random()).slice(0, 8);
    setSessionLikes(shuffled);
    setBracket(shuffled);
    setCurrentMatch(null);
  };

  if (likedNames.length < 2) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-12 h-full flex flex-col items-center justify-center text-center bg-[#fdfaf5]">
        <div className="w-20 h-20 bg-[#f4eee6] rounded-full flex items-center justify-center mb-6 border border-[#e0d6c8]">
          <Trophy className="text-[#8a9a5b]" size={32} />
        </div>
        <h2 className="text-3xl font-serif font-bold italic mb-2 tracking-tight text-[#5a5a40]">The Arena is Quiet</h2>
        <p className="text-[#998b7a] max-w-sm mb-8 font-serif italic text-lg leading-relaxed">The curators await your shortlist. Select at least two favorites to begin the evaluation.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 min-h-full bg-[#fdfaf5]">
      <div className="mb-12">
        <span className="text-[10px] font-bold text-[#8a9a5b] tracking-[0.3em] uppercase mb-4 block">THE ARENA</span>
        <h2 className="text-5xl font-serif font-bold italic tracking-tight text-[#5a5a40]">Name Tournament</h2>
        <p className="text-[#998b7a] mt-4 max-w-lg font-serif italic text-lg opacity-80 leading-relaxed">
          Let your heart decide. Pit your favorite names against each other in the moss-green arena until a winner remains.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!currentMatch && !finalWinner && (
          <motion.div 
            key="start"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-[#e0d6c8] rounded-[3rem] p-16 text-center shadow-sm"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-[40px] bg-[#f4eee6] text-[#5a5a40] mb-8 border border-[#e0d6c8] rotate-3 shadow-md">
              <Swords size={48} className="stroke-[1.5px]" />
            </div>
            <h3 className="text-4xl font-serif font-bold text-[#5a5a40] mb-6 italic grow-0 tracking-tight">Ready for Battle?</h3>
            <p className="text-[#998b7a] mb-10 font-serif text-lg leading-relaxed max-w-md mx-auto">We've selected {sessionLikes.length} names from your collection for this bracket.</p>
            <button 
              onClick={startCompetition}
              className="px-12 py-4 bg-[#8a9a5b] text-white rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:-translate-y-1 shadow-lg"
            >
              Begin Tournament
            </button>
          </motion.div>
        )}

        {currentMatch && (
          <motion.div 
            key="match"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="bg-[#5a5a40] p-10 md:p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden"
          >
            {/* Decorative Bloom */}
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white opacity-5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-center mb-16 relative z-10">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#f4eee6] opacity-60">Match Progress: Round 1</span>
              <span className="px-4 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 backdrop-blur-sm shadow-inner">Arena Active</span>
            </div>

            <div className="flex flex-col md:flex-row items-center w-full gap-12 relative z-10">
              <NameCompetitor name={currentMatch[0]} onChoose={() => handleWinner(currentMatch[0])} />
              <div className="flex flex-col items-center">
                <div className="text-[#8a9a5b] font-serif italic text-3xl tracking-tighter opacity-80 underline underline-offset-8 decoration-white/10">vs</div>
              </div>
              <NameCompetitor name={currentMatch[1]} onChoose={() => handleWinner(currentMatch[1])} />
            </div>
            
            <p className="text-[10px] text-center mt-16 uppercase tracking-[0.4em] font-bold text-[#fdfaf5] opacity-20">The choice is final</p>
          </motion.div>
        )}

        {finalWinner && (
          <motion.div 
            key="winner"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white border border-[#e0d6c8] rounded-[3.5rem] relative overflow-hidden shadow-xl"
          >
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-[#8a9a5b]/10 rounded-full flex items-center justify-center mb-8 border border-[#8a9a5b]/20">
                <Trophy className="text-[#8a9a5b]" size={40} />
              </div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4 text-[#8a9a5b]">THE CROWNING CHOICE</span>
              <h3 className="text-7xl font-serif font-bold italic mb-12 tracking-tight text-[#5a5a40] leading-none grow-0">{finalWinner.name}</h3>
              <button 
                onClick={reset}
                className="flex items-center gap-3 px-12 py-4 bg-[#5a5a40] text-white rounded-full font-bold transition-all hover:shadow-2xl shadow-lg border border-white/5 active:scale-95"
              >
                <RotateCcw size={20} />
                <span className="uppercase text-xs tracking-widest">New Tournament</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NameCompetitor({ name, onChoose }: { name: NameInfo; onChoose: () => void }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onChoose}
      className="flex-1 w-full md:w-auto bg-white/5 border border-white/5 py-12 px-8 rounded-[3rem] text-center transition-all hover:bg-white/10 hover:border-white/20 group"
    >
      <span className="text-[10px] font-bold text-[#f4eee6]/40 tracking-widest uppercase mb-4 block group-hover:text-[#8a9a5b] transition-colors">{name.origin}</span>
      <h4 className="text-5xl md:text-6xl font-serif font-bold text-white mb-2 tracking-tight transition-transform duration-500">{name.name}</h4>
      <div className="mt-8 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 text-[#8a9a5b] font-bold text-[10px] uppercase tracking-widest">
        Declare Victor
      </div>
    </motion.button>
  );
}
