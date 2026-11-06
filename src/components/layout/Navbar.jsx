import React, { useState } from 'react';
import { 
  Gamepad2, 
  Search, 
  Coins, 
  PlusCircle, 
  ShieldCheck, 
  Code2, 
  User, 
  Sparkles,
  ChevronDown,
  RefreshCw,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { GAME_ENGINES } from '../../data/mockData';

export const Navbar = () => {
  const { currentUser, currentRole, switchRole, devTokenBalance, topUpTokens } = useAuth();
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedEngine, 
    setSelectedEngine,
    pendingGames 
  } = useGame();

  const [topUpSuccessNotice, setTopUpSuccessNotice] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // กดเติมเหรียญด่วน 100 Tokens
  const handleQuickTopUp = () => {
    topUpTokens(100);
    setTopUpSuccessNotice(true);
    setTimeout(() => setTopUpSuccessNotice(false), 2500);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin (ผู้ดูแลระบบ)',
          bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          icon: ShieldCheck
        };
      case 'developer':
        return {
          label: 'Developer (ผู้สร้างเกม)',
          bg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
          icon: Code2
        };
      case 'player':
      default:
        return {
          label: 'Player (ผู้เล่นทั่วไป)',
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          icon: User
        };
    }
  };

  const roleBadgeInfo = getRoleBadge(currentRole);
  const RoleIcon = roleBadgeInfo.icon;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800/80 bg-[#0B0F19]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative group cursor-pointer">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#6366F1] via-indigo-500 to-[#10B981] p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
                <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-indigo-400 group-hover:scale-110 group-hover:text-emerald-400 transition-transform duration-300" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-wider bg-gradient-to-r from-white via-indigo-100 to-indigo-400 bg-clip-text text-transparent font-['Rajdhani',sans-serif]">
                  INDIETHAI<span className="text-[#6366F1]">.HUB</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-400 border border-indigo-700/40 hidden sm:inline-block">
                  WebGL 60FPS
                </span>
              </div>
              <p className="text-xs text-gray-400 hidden sm:block">
                แพลตฟอร์มศูนย์รวมเกมอินดี้สัญชาติไทย
              </p>
            </div>
          </div>

          {/* Search & Engine Filter Bar */}
          <div className="flex-1 max-w-xl hidden md:flex items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อเกม, แท็ก, ครีเอเตอร์ไทย..."
                className="w-full bg-[#111827] border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Engine Dropdown */}
            <div className="relative shrink-0">
              <select
                value={selectedEngine}
                onChange={(e) => setSelectedEngine(e.target.value)}
                className="bg-[#111827] border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-indigo-500 cursor-pointer hover:border-gray-700 transition"
              >
                {GAME_ENGINES.map((engine) => (
                  <option key={engine} value={engine} className="bg-[#111827]">
                    {engine === 'All' ? '⚡ ทุก Engine' : engine}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions & Role Controls */}
          <div className="flex items-center gap-3">

            {/* Developer Token Balance Widget (แสดงถ้า Role เป็น Developer) */}
            {currentRole === 'developer' && (
              <div className="flex items-center gap-2 bg-[#161F30] border border-amber-500/30 px-3 py-1.5 rounded-xl shadow-lg shadow-amber-500/5">
                <div className="flex items-center gap-1.5">
                  <div className="p-1 rounded-lg bg-amber-500/10 text-[#F59E0B]">
                    <Coins className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-medium">เหรียญสำหรับลงเกม</span>
                    <span className="text-sm font-bold text-amber-400 font-['Rajdhani',sans-serif] tracking-wide">
                      {devTokenBalance} <span className="text-[11px] font-normal text-amber-300">Tokens</span>
                    </span>
                  </div>
                </div>

                {/* Top-up Button */}
                <button
                  onClick={handleQuickTopUp}
                  title="เติมเหรียญจำลองสำหรับ Dev (+100 Tokens)"
                  className="flex items-center gap-1 ml-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-gray-950 transition-all shadow-md active:scale-95"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>เติม</span>
                </button>
              </div>
            )}

            {/* Admin Badge with Pending Count */}
            {currentRole === 'admin' && (
              <div className="flex items-center gap-2 bg-rose-950/40 border border-rose-500/40 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-semibold text-rose-300">
                  รอตรวจสอบ: <strong className="text-rose-200">{pendingGames.length} เกม</strong>
                </span>
              </div>
            )}

            {/* User Profile & Role Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-[#111827] border border-gray-800 hover:border-gray-700 transition"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/40"
                />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-medium text-gray-200 line-clamp-1">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-indigo-400 capitalize font-mono">
                    {currentRole}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#111827] border border-gray-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <div className="p-3 border-b border-gray-800/80 mb-2">
                    <p className="text-xs text-gray-400">เข้าสู่ระบบในชื่อ</p>
                    <p className="text-sm font-bold text-white mt-0.5">{currentUser.name}</p>
                    <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                    
                    <div className={`mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${roleBadgeInfo.bg}`}>
                      <RoleIcon className="w-3 h-3" />
                      {roleBadgeInfo.label}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                      สลับบทบาท (Quick Switch)
                    </p>
                    <button
                      onClick={() => switchRole('player')}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition ${
                        currentRole === 'player' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-gray-300 hover:bg-gray-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Player (ผู้เล่น)</span>
                      </div>
                      {currentRole === 'player' && <span className="text-[10px]">● กำลังใช้งาน</span>}
                    </button>

                    <button
                      onClick={() => switchRole('developer')}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition ${
                        currentRole === 'developer' ? 'bg-indigo-500/20 text-indigo-300 font-bold' : 'text-gray-300 hover:bg-gray-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Developer (150 Tokens)</span>
                      </div>
                      {currentRole === 'developer' && <span className="text-[10px]">● กำลังใช้งาน</span>}
                    </button>

                    <button
                      onClick={() => switchRole('admin')}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition ${
                        currentRole === 'admin' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-gray-300 hover:bg-gray-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                        <span>Admin (อนุมัติเกม)</span>
                      </div>
                      {currentRole === 'admin' && <span className="text-[10px]">● กำลังใช้งาน</span>}
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อเกม, แท็ก, ครีเอเตอร์ไทย..."
              className="w-full bg-[#111827] border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

      </div>

      {/* Quick Toast Notice for Top-Up */}
      {topUpSuccessNotice && (
        <div className="bg-amber-500 text-gray-950 text-xs font-bold py-1 px-4 text-center transition-all animate-in slide-in-from-top flex items-center justify-center gap-2">
          <Coins className="w-3.5 h-3.5" />
          <span>เติมเหรียญจำลองสำเร็จ! ยอดเหรียญของคุณคือ {devTokenBalance} Tokens (ใช้ลงเกมได้ {Math.floor(devTokenBalance / 50)} เกม)</span>
        </div>
      )}
    </header>
  );
};

