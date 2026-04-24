/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  History, 
  Globe, 
  User, 
  Trophy, 
  Sparkles, 
  Home as HomeIcon,
  ChevronLeft,
  Filter
} from 'lucide-react';

import SwipeView from './views/SwipeView';
import HomeView from './views/HomeView';
import LikesView from './views/LikesView';
import HistoryView from './views/HistoryView';
import OriginView from './views/OriginView';
import CompetitionView from './views/CompetitionView';
import GeneratorView from './views/GeneratorView';

import { NameInfo, UserStats } from './types';
import { INITIAL_NAMES } from './data';
import { cn } from './lib/utils';

export default function App() {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('nommatch_stats');
    return saved ? JSON.parse(saved) : { likedIds: [], seenIds: [], dislikedIds: [] };
  });

  const [allNames, setAllNames] = useState<NameInfo[]>(INITIAL_NAMES);

  useEffect(() => {
    localStorage.setItem('nommatch_stats', JSON.stringify(stats));
  }, [stats]);

  const addLike = (id: string) => {
    if (!stats.likedIds.includes(id)) {
      setStats(prev => ({
        ...prev,
        likedIds: [...prev.likedIds, id],
        seenIds: [...prev.seenIds, id]
      }));
    }
  };

  const addSeen = (id: string, disliked = false) => {
    setStats(prev => ({
      ...prev,
      seenIds: Array.from(new Set([...prev.seenIds, id])),
      dislikedIds: disliked ? Array.from(new Set([...prev.dislikedIds, id])) : prev.dislikedIds
    }));
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col md:flex-row h-screen overflow-hidden text-[#3d3d3d] bg-[#fdfaf5]">
        {/* Desktop Sidebar */}
        <nav className="hidden md:flex flex-col w-64 h-full bg-[#f4eee6] border-r border-[#e0d6c8] p-6 shrink-0">
          <div className="mb-10">
            <h1 className="text-3xl font-serif font-bold text-[#5a5a40] italic tracking-tight">nomen.</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 font-semibold">The Identity Curators</p>
          </div>
          
          <div className="flex flex-col gap-6 flex-1">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-wider text-[#8a9a5b] font-bold mb-2">Discovery</p>
              <NavLink to="/" icon={<HomeIcon size={18} />} label="Home" />
              <NavLink to="/swipe" icon={<User size={18} />} label="Swiping" />
              <NavLink to="/history" icon={<History size={18} />} label="Historical" />
              <div className="h-px bg-[#e0d6c8]/30 my-2" />
              <NavLink to="/origin" icon={<Globe size={18} />} label="Origins" />
            </div>

            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-wider text-[#8a9a5b] font-bold mb-2">Personal</p>
              <NavLink to="/likes" icon={<Heart size={18} />} label={`Saved (${stats.likedIds.length})`} />
              <NavLink to="/competition" icon={<Trophy size={18} />} label="Brackets" />
            </div>

            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-wider text-[#8a9a5b] font-bold mb-2">Tools</p>
              <NavLink to="/generate" icon={<Sparkles size={18} />} label="Generator" />
            </div>
          </div>

          <div className="mt-auto p-4 bg-[#e8e0d4] rounded-2xl border border-[#d6ccbe]">
            <p className="text-[11px] font-bold uppercase mb-1 opacity-70">Daily Inspiration</p>
            <p className="font-serif italic text-lg leading-tight text-[#5a5a40]">"Aurelius"</p>
            <p className="text-xs opacity-60 italic mt-1">Latin: Golden, the sun</p>
          </div>
        </nav>

        {/* Header (Mobile) */}
        <header className="md:hidden flex items-center justify-between p-4 bg-[#f4eee6] border-b border-[#e0d6c8] shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-serif font-bold italic tracking-tight text-[#5a5a40]">nomen.</h1>
          </div>
          <Link to="/likes" className="p-2 relative bg-white/50 rounded-full">
            <Heart className={cn("text-stone-400", stats.likedIds.length > 0 && "text-[#8a9a5b] fill-[#8a9a5b]")} size={20} />
          </Link>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto relative">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomeView stats={stats} />} />
              <Route path="/swipe" element={<SwipeView stats={stats} addLike={addLike} addSeen={addSeen} allNames={allNames} />} />
              <Route path="/likes" element={<LikesView stats={stats} allNames={allNames} />} />
              <Route path="/history" element={<HistoryView allNames={allNames} />} />
              <Route path="/origin" element={<OriginView allNames={allNames} stats={stats} addLike={addLike} addSeen={addSeen} />} />
              <Route path="/competition" element={<CompetitionView stats={stats} allNames={allNames} />} />
              <Route path="/generate" element={<GeneratorView stats={stats} allNames={allNames} setAllNames={setAllNames} />} />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden flex items-center justify-around p-3 bg-[#f4eee6] border-t border-[#e0d6c8] shrink-0">
          <MobileNavLink to="/" icon={<HomeIcon size={20} />} />
          <MobileNavLink to="/swipe" icon={<User size={20} />} />
          <MobileNavLink to="/competition" icon={<Trophy size={20} />} />
          <MobileNavLink to="/generate" icon={<Sparkles size={20} />} />
        </nav>
      </div>
    </Router>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-200 group text-sm font-medium",
        isActive ? "bg-[#8a9a5b] text-white shadow-sm" : "text-[#3d3d3d] hover:bg-white/50"
      )}
    >
      <span className={cn("transition-colors", isActive ? "text-white" : "text-[#8a9a5b]")}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function MobileNavLink({ to, icon }: { to: string; icon: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={cn(
        "flex flex-col items-center p-2 rounded-xl transition-all duration-200",
        isActive ? "text-amber-600 scale-110" : "text-stone-400"
      )}
    >
      {icon}
      <div className={cn("h-1 w-1 mt-1 rounded-full transition-all", isActive ? "bg-amber-600 scale-100" : "bg-transparent scale-0")} />
    </Link>
  );
}

