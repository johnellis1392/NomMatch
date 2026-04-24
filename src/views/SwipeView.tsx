/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { Heart, X, Info, RotateCcw } from 'lucide-react';
import { NameInfo, UserStats } from '../types';
import { fetchNameDetails } from '../services/geminiService';
import { cn } from '../lib/utils';

import { useSearchParams } from 'react-router-dom';

interface SwipeViewProps {
  stats: UserStats;
  addLike: (id: string) => void;
  addSeen: (id: string, disliked?: boolean) => void;
  allNames: NameInfo[];
}

export default function SwipeView({ stats, addLike, addSeen, allNames }: SwipeViewProps) {
  const [searchParams] = useSearchParams();
  const limit = parseInt(searchParams.get('limit') || '100');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState<{ meaning: string; etymology: string; history: string; recommendations: string[] } | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Filter out already seen names and apply limit
  const queue = allNames.filter(n => !stats.seenIds.includes(n.id)).slice(0, limit);
  const activeName = queue[currentIndex];

  useEffect(() => {
    setDetails(null);
    setShowDetails(false);
  }, [currentIndex]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!activeName) return;

    if (direction === 'right') {
      addLike(activeName.id);
    } else {
      addSeen(activeName.id, true);
    }
    setCurrentIndex(prev => prev + 1);
  };

  const handleInfo = async () => {
    if (!activeName) return;
    setShowDetails(true);
    if (!details) {
      setLoadingDetails(true);
      const res = await fetchNameDetails(activeName.name, activeName.origin);
      setDetails(res);
      setLoadingDetails(false);
    }
  };

  if (!activeName) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6">
          <RotateCcw className="text-stone-400" />
        </div>
        <h2 className="text-2xl font-serif font-bold italic mb-2">Out of names!</h2>
        <p className="text-stone-500 max-w-xs">You've seen everything in our initial collection. Try the AI Generator to discover more!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-[#fdfaf5] text-[#3d3d3d]">
      {/* Header / Queue Selector */}
      <header className="h-20 w-full flex items-center justify-between px-8 border-b border-[#e0d6c8] shrink-0">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium opacity-60">Queue Size:</span>
          <div className="flex bg-[#f4eee6] p-1 rounded-full">
            {[5, 25, 50, 100].map(q => (
              <button 
                key={q}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set('limit', q.toString());
                  window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
                }}
                className={cn(
                  "px-4 py-1 text-xs rounded-full transition-all",
                  limit === q ? "bg-white shadow-sm font-bold scale-105" : "hover:bg-white/30"
                )}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleInfo} className="px-4 py-2 bg-white border border-[#e0d6c8] rounded-full text-xs font-bold hover:bg-gray-50 flex items-center gap-2">
            <Info size={14} className="text-[#8a9a5b]" />
            Etymology
          </button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-8 overflow-hidden relative">
        <div className="relative w-full max-w-[420px] h-[580px]">
          {/* Stack Effect */}
          <div className="absolute inset-0 bg-[#e8e0d4] rounded-[48px] rotate-2 translate-y-2 opacity-60"></div>
          <div className="absolute inset-0 bg-[#f4eee6] rounded-[48px] -rotate-1 translate-y-1 opacity-80"></div>
          
          <AnimatePresence>
            <NameCard 
              key={activeName.id}
              nameInfo={activeName}
              onSwipe={handleSwipe}
              onInfo={handleInfo}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-8 pb-12 shrink-0">
        <button 
          onClick={() => handleSwipe('left')}
          className="w-20 h-20 rounded-full bg-[#fdfaf5] border-2 border-[#d27d59] flex items-center justify-center text-[#d27d59] hover:bg-[#d27d59] hover:text-white transition-all shadow-md group"
        >
          <X size={32} className="stroke-[1.5px]" />
        </button>
        <button 
          onClick={handleInfo}
          className="w-16 h-16 rounded-full bg-white border border-[#e0d6c8] flex items-center justify-center text-[#998b7a] hover:bg-stone-50 transition-all shadow-sm"
        >
          <Info size={24} />
        </button>
        <button 
          onClick={() => handleSwipe('right')}
          className="w-20 h-20 rounded-full bg-[#fdfaf5] border-2 border-[#8a9a5b] flex items-center justify-center text-[#8a9a5b] hover:bg-[#8a9a5b] hover:text-white transition-all shadow-md group"
        >
          <Heart size={32} className="stroke-[1.5px]" />
        </button>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div 
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="absolute top-0 right-0 h-full w-[400px] max-w-full bg-white/95 backdrop-blur-md z-50 p-8 overflow-auto border-l border-[#e0d6c8] shadow-2xl"
          >
            <button 
              onClick={() => setShowDetails(false)}
              className="absolute top-6 right-6 p-2 text-stone-400 hover:text-[#5a5a40] transition-colors"
            >
              <X size={24} />
            </button>

            <div className="py-4">
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#8a9a5b] uppercase mb-4 block">NAME STUDY</span>
              <h2 className="text-5xl font-serif font-bold text-[#5a5a40] mb-2 italic grow-0">{activeName.name}</h2>
              <p className="text-[#998b7a] mb-10 italic">{activeName.origin} • {activeName.gender}</p>

              {loadingDetails ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-[#f4eee6] rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : details ? (
                <div className="space-y-10">
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#8a9a5b] mb-4 flex items-center gap-2">
                       Analysis
                    </h3>
                    
                    <div className="p-4 bg-[#fdfaf5] rounded-2xl border border-[#e8e0d4]">
                      <p className="text-[11px] font-bold uppercase opacity-50 mb-2">Meaning</p>
                      <p className="text-sm leading-relaxed text-[#3d3d3d] font-serif italic text-lg opacity-80 decoration-[#e0d6c8] underline-offset-4 underline underline-thickness-1">
                        {details.meaning}
                      </p>
                    </div>

                    <div className="p-4 bg-[#fdfaf5] rounded-2xl border border-[#e8e0d4]">
                      <p className="text-[11px] font-bold uppercase opacity-50 mb-2">Etymology</p>
                      <p className="text-sm leading-relaxed text-[#3d3d3d]">
                        {details.etymology}
                      </p>
                    </div>

                    <div className="p-4 bg-[#fdfaf5] rounded-2xl border border-[#e8e0d4]">
                      <p className="text-[11px] font-bold uppercase opacity-50 mb-2">History & Context</p>
                      <p className="text-sm leading-relaxed text-[#3d3d3d]">
                        {details.history}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#e0d6c8]">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#8a9a5b] mb-4">Recommendations</h3>
                    <div className="flex flex-wrap gap-2">
                      {details.recommendations.map(rec => (
                        <span key={rec} className="px-3 py-1.5 bg-[#f4eee6] rounded-full text-xs font-semibold border border-[#e0d6c8] text-[#3d3d3d]">
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-stone-400 italic">Could not load details at this time.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">{title}</h3>
      <p className="text-stone-600 leading-relaxed font-serif text-lg">{content}</p>
    </div>
  );
}

interface CardProps {
  key?: string;
  nameInfo: NameInfo;
  onSwipe: (dir: 'left' | 'right') => void;
  onInfo: () => void;
}

function NameCard({ nameInfo, onSwipe, onInfo }: CardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const heartScale = useTransform(x, [0, 100], [0, 1.5]);
  const xScale = useTransform(x, [0, -100], [0, 1.5]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) onSwipe('right');
    else if (info.offset.x < -100) onSwipe('left');
  };

  return (
    <motion.div 
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity }}
      className="absolute inset-0 bg-white rounded-[40px] shadow-xl border border-[#e8e0d4] p-10 flex flex-col items-center justify-between cursor-grab active:cursor-grabbing select-none touch-none"
      whileTap={{ scale: 0.98 }}
    >
      <div className="absolute top-6 left-6 opacity-20 pointer-events-none">
        <motion.div style={{ scale: xScale }} className="text-[#d27d59]"><X size={48} /></motion.div>
      </div>
      <div className="absolute top-6 right-6 opacity-20 pointer-events-none">
        <motion.div style={{ scale: heartScale }} className="text-[#8a9a5b]"><Heart size={48} /></motion.div>
      </div>

      <div className="text-center">
        <p className="text-[12px] uppercase tracking-[0.3em] text-[#8a9a5b] font-bold mb-4">CURRENT SUGGESTION</p>
        <h3 className="text-7xl font-serif text-[#5a5a40] mb-2 italic grow-0">{nameInfo.name}</h3>
        <p className="text-lg italic text-[#998b7a]">{nameInfo.meaning ? `"${nameInfo.meaning}"` : "Tap info for details"}</p>
      </div>

      <div className="w-full space-y-4">
        <div className="h-[1px] bg-[#f4eee6] w-full"></div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#998b7a]">
          <span>Origin: {nameInfo.origin}</span>
          <span>Genre: {nameInfo.gender}</span>
        </div>
        <div className="h-[1px] bg-[#f4eee6] w-full"></div>
      </div>

      <button onClick={onInfo} className="text-[10px] uppercase tracking-widest font-bold opacity-30 hover:opacity-100 transition-opacity">
        View Full History & Etymology
      </button>
    </motion.div>
  );
}
