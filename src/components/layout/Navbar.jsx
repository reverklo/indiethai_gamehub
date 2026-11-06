/**
 * Navbar.jsx
 * แถบนำทางด้านบนสไตล์ Cyberpunk
 * - โลโก้ IndieThai Hub
 * - ช่องค้นหาเกมและตัวกรอง Engine
 * - กระดิ่งแจ้งเตือน Real-time (Notification Center 🔔) สไตล์ Steam
 * - ปุ่มคลังเกมโปรด (Wishlist ❤️)
 * - แสดงยอดเหรียญ Token สำหรับ Developer พร้อมปุ่มเติม
 * - โปรไฟล์ผู้ใช้พร้อมระบบสลับบทบาทและออกจากระบบ
 */

import React, { useState } from 'react';
import { 
  Gamepad2, 
  Search, 
  Coins, 
  PlusCircle, 
  ShieldCheck, 
  Code2, 
  User, 
  ChevronDown,
  LogOut,
  LogIn,
  Heart,
  Bell,
  Check,
  CheckCheck,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { GAME_ENGINES } from '../../data/mockData';

export const Navbar = () => {
  const { 
    currentUser, 
    currentRole, 
    switchRole, 
    devTokenBalance, 
    topUpTokens,
    openAuthModal,
    logout 
  } = useAuth();

  const { 
    searchQuery, 
    setSearchQuery, 
    selectedEngine, 
    setSelectedEngine,
    pendingGames,
    wishlist,
    isWishlistOnly,
    setIsWishlistOnly,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setSelectedGameForDetail 
  } = useGame();

  const [topUpSuccessNotice, setTopUpSuccessNotice] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // เติมเหรียญด่วน 100 Tokens
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
          <div 
            onClick={() => {
              setSelectedGameForDetail(null);
              setIsWishlistOnly(false);
            }}
            className="flex items-center gap-3 shrink-0 cursor-pointer"
          >
            <div className="relative group">
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

            {/* Wishlist Shortcut Button */}
            {currentRole === 'player' && (
              <button
                onClick={() => {
                  setSelectedGameForDetail(null);
                  setIsWishlistOnly(!isWishlistOnly);
                }}
                title="คลังเกมโปรด (Wishlist)"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  isWishlistOnly
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-lg shadow-rose-500/10'
                    : 'bg-[#111827] text-gray-300 border-gray-800 hover:border-rose-500/40 hover:text-rose-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlistOnly ? 'fill-rose-500 text-rose-500' : 'text-rose-400'}`} />
                <span className="hidden sm:inline">เกมโปรด</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-950/80 text-rose-300 font-mono">
                  {wishlist.length}
                </span>
              </button>
            )}

            {/* 🔔 Notification Center (Steam-style) */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                title="ศูนย์การแจ้งเตือน"
                className="relative p-2.5 rounded-xl bg-[#111827] border border-gray-800 text-gray-300 hover:text-white hover:border-indigo-500 transition cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-md">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Menu */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#111827] border border-gray-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-indigo-400" />
                      <h4 className="text-xs font-bold text-white">การแจ้งเตือน (Notifications)</h4>
                    </div>

                    {unreadNotificationCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCheck className="w-3 h-3" />
                        <span>อ่านทั้งหมด</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-center py-6 text-xs text-gray-500">ไม่มีการแจ้งเตือนในขณะนี้</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`p-2.5 rounded-xl text-xs transition cursor-pointer border ${
                            notif.isRead
                              ? 'bg-[#0B0F19]/60 border-transparent text-gray-400'
                              : 'bg-indigo-950/20 border-indigo-500/30 text-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-[11px]">{notif.title}</span>
                            <span className="text-[10px] text-gray-500">{notif.time}</span>
                          </div>
                          <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

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

                <button
                  onClick={handleQuickTopUp}
                  title="เติมเหรียญจำลองสำหรับ Dev (+100 Tokens)"
                  className="flex items-center gap-1 ml-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-gray-950 transition-all shadow-md active:scale-95 cursor-pointer"
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
                  รอตรวจ: <strong className="text-rose-200">{pendingGames.length} เกม</strong>
                </span>
              </div>
            )}

            {/* Login / Profile Button */}
            <div className="relative">
              {currentUser ? (
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-[#111827] border border-gray-800 hover:border-gray-700 transition cursor-pointer"
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
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-[#6366F1] text-white text-xs font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 transition cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>เข้าสู่ระบบ</span>
                </button>
              )}

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && currentUser && (
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
                      สลับบทบาท (Demo Switch)
                    </p>
                    <button
                      onClick={() => switchRole('player')}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition cursor-pointer ${
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
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition cursor-pointer ${
                        currentRole === 'developer' ? 'bg-indigo-500/20 text-indigo-300 font-bold' : 'text-gray-300 hover:bg-gray-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Developer (สตูดิโอ)</span>
                      </div>
                      {currentRole === 'developer' && <span className="text-[10px]">● กำลังใช้งาน</span>}
                    </button>

                    <button
                      onClick={() => switchRole('admin')}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition cursor-pointer ${
                        currentRole === 'admin' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-gray-300 hover:bg-gray-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                        <span>Admin (ผู้ดูแลระบบ)</span>
                      </div>
                      {currentRole === 'admin' && <span className="text-[10px]">● กำลังใช้งาน</span>}
                    </button>

                    {/* Switch / Logout */}
                    <div className="pt-2 border-t border-gray-800/80 mt-1">
                      <button
                        onClick={() => openAuthModal('login')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-gray-800/60 rounded-lg cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                        <span>เปลี่ยนบัญชี / ล็อกอินใหม่</span>
                      </button>

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>ออกจากระบบ (Logout)</span>
                      </button>
                    </div>

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
          <span>เติมเหรียญจำลองสำเร็จ! ยอดเหรียญของคุณคือ {devTokenBalance} Tokens</span>
        </div>
      )}
    </header>
  );
};
