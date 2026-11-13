/**
 * Navbar.jsx
 * แถบนำทางด้านบนสไตล์ Steam Client
 * - โลโก้ IndieThai Hub พร้อมแท็บหลักสไตล์ Steam: ร้านค้า | คลังเกม | ชุมชน | โปรไฟล์
 * - รองรับแท็บพิเศษสำหรับ Developer (สตูดิโอ) และ Admin (ผู้ดูแลระบบ)
 * - ช่องค้นหาเกมและตัวกรอง Engine
 * - กระดิ่งแจ้งเตือน Real-time (Notification Center 🔔) สไตล์ Steam
 * - ปุ่มลัดคลังเกมโปรด (Wishlist ❤️)
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
  ExternalLink,
  BookOpen,
  Users,
  Layers
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
    setSelectedGameForDetail,
    activeNavTab,
    navigateToTab 
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

  // รายการแท็บนำทางหลักตามแบบ Steam
  const navTabs = [
    { id: 'store', label: 'ร้านค้า' },
    { id: 'library', label: 'คลังเกม' },
    { id: 'community', label: 'ชุมชน' },
    { id: 'profile', label: currentUser?.name ? currentUser.name.toUpperCase() : 'โปรไฟล์' }
  ];

  if (currentRole === 'developer') {
    navTabs.push({ id: 'studio', label: 'สตูดิโอ' });
  }
  if (currentRole === 'admin') {
    navTabs.push({ id: 'admin', label: 'ผู้ดูแลระบบ' });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0B0F19]/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Left: Logo & Steam Top Tabs */}
          <div className="flex items-center gap-6 shrink-0">
            {/* Logo & Brand */}
            <div 
              onClick={() => navigateToTab('store')}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                <Gamepad2 className="w-4 h-4 text-gray-200" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-white tracking-tight">
                    IndieThai<span className="text-indigo-400">Hub</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Steam Client Navigation Tabs (Desktop) */}
            <nav className="hidden md:flex items-center gap-1 text-xs uppercase tracking-wider font-semibold">
              {navTabs.map((tab) => {
                const isActive = activeNavTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigateToTab(tab.id)}
                    className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer relative ${
                      isActive
                        ? 'text-white bg-white/[0.08] font-bold'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-indigo-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Search & Engine Filter Bar (Compact Center) */}
          <div className="flex-1 max-w-sm hidden lg:flex items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อเกม, ผู้พัฒนา..."
                className="w-full bg-[#111827] border border-white/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-white/20 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
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
                className="bg-[#111827] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-white/20 cursor-pointer transition-colors"
              >
                {GAME_ENGINES.map((engine) => (
                  <option key={engine} value={engine} className="bg-[#111827]">
                    {engine === 'All' ? 'Engine' : engine}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right: Actions, Notifications & Profile Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">

            {/* Wishlist Shortcut Button */}
            <button
              onClick={() => navigateToTab('profile')}
              title="ดูรายการสิ่งที่อยากได้ในโปรไฟล์"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                activeNavTab === 'profile'
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  : 'bg-[#111827] text-gray-300 border-white/[0.08] hover:border-white/20 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span className="hidden sm:inline">สิ่งที่อยากได้</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/60 text-gray-300 font-mono">
                {wishlist.length}
              </span>
            </button>

            {/* 🔔 Notification Center */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                title="ศูนย์การแจ้งเตือน"
                className="relative p-2 rounded-lg bg-[#111827] border border-white/[0.08] text-gray-300 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Menu */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#111827] border border-white/[0.08] shadow-2xl p-3 z-50 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-2">
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

            {/* Developer Token Balance Widget */}
            {currentRole === 'developer' && (
              <div className="flex items-center gap-2 bg-[#161F30] border border-amber-500/30 px-2.5 py-1 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    {devTokenBalance} <span className="text-[10px] font-normal text-amber-300">T</span>
                  </span>
                </div>

                <button
                  onClick={handleQuickTopUp}
                  title="เติมเหรียญจำลองสำหรับ Dev (+100 Tokens)"
                  className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-500 hover:bg-amber-400 text-gray-950 transition-colors cursor-pointer"
                >
                  +เติม
                </button>
              </div>
            )}

            {/* Admin Badge */}
            {currentRole === 'admin' && (
              <div className="flex items-center gap-1.5 bg-rose-950/40 border border-rose-500/40 px-2.5 py-1 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-[11px] font-semibold text-rose-300 font-mono">
                  รอ {pendingGames.length}
                </span>
              </div>
            )}

            {/* User Profile Button with Steam Border */}
            <div className="relative">
              {currentUser ? (
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 pr-2 rounded-lg bg-[#111827] border border-white/[0.08] hover:border-white/20 transition-colors cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-md object-cover ring-1 ring-white/20"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-sky-400 ring-1 ring-black" />
                  </div>
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-xs font-medium text-gray-200 line-clamp-1">
                      {currentUser.name}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-200 text-gray-950 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>เข้าสู่ระบบ</span>
                </button>
              )}

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && currentUser && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-[#111827] border border-white/[0.08] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <div className="p-3 border-b border-white/[0.06] mb-2">
                    <p className="text-[11px] text-gray-400">เข้าสู่ระบบในชื่อ</p>
                    <p className="text-sm font-bold text-white mt-0.5">{currentUser.name}</p>
                    <p className="text-xs text-gray-400 truncate font-mono">@{currentUser.username || 'tsukiko_83'}</p>
                    
                    <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium border ${roleBadgeInfo.bg}`}>
                      <RoleIcon className="w-3 h-3" />
                      {roleBadgeInfo.label}
                    </div>
                  </div>

                  {/* Steam Quick Page Links */}
                  <div className="space-y-0.5 border-b border-white/[0.06] pb-2 mb-2">
                    <button
                      onClick={() => navigateToTab('profile')}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-200 hover:bg-white/[0.06] rounded-md transition-colors cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span>หน้าโปรไฟล์ของฉัน (Steam Profile)</span>
                    </button>

                    <button
                      onClick={() => navigateToTab('library')}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-200 hover:bg-white/[0.06] rounded-md transition-colors cursor-pointer"
                    >
                      <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>คลังเกมของฉัน (My Library)</span>
                    </button>

                    <button
                      onClick={() => navigateToTab('community')}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-200 hover:bg-white/[0.06] rounded-md transition-colors cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-sky-400" />
                      <span>ชุมชนเกมอินดี้ (Community)</span>
                    </button>
                  </div>

                  {/* Switch Role Section */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 py-1">
                      สลับบทบาท (Demo Switch)
                    </p>
                    <button
                      onClick={() => {
                        switchRole('player');
                        navigateToTab('profile');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-md transition cursor-pointer ${
                        currentRole === 'player' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-gray-300 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Player (ผู้เล่น)</span>
                      </div>
                      {currentRole === 'player' && <span className="text-[10px]">● กำลังใช้</span>}
                    </button>

                    <button
                      onClick={() => {
                        switchRole('developer');
                        navigateToTab('studio');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-md transition cursor-pointer ${
                        currentRole === 'developer' ? 'bg-indigo-500/20 text-indigo-300 font-semibold' : 'text-gray-300 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Developer (สตูดิโอ)</span>
                      </div>
                      {currentRole === 'developer' && <span className="text-[10px]">● กำลังใช้</span>}
                    </button>

                    <button
                      onClick={() => {
                        switchRole('admin');
                        navigateToTab('admin');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-md transition cursor-pointer ${
                        currentRole === 'admin' ? 'bg-rose-500/20 text-rose-300 font-semibold' : 'text-gray-300 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                        <span>Admin (ผู้ดูแลระบบ)</span>
                      </div>
                      {currentRole === 'admin' && <span className="text-[10px]">● กำลังใช้</span>}
                    </button>

                    {/* Switch / Logout */}
                    <div className="pt-2 border-t border-white/[0.06] mt-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-md cursor-pointer transition-colors"
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

        {/* Mobile Steam Navigation Bar (Under header on mobile/tablet) */}
        <div className="flex md:hidden items-center gap-1 overflow-x-auto py-2 border-t border-white/[0.06] scrollbar-none text-xs uppercase tracking-wider font-semibold">
          {navTabs.map((tab) => {
            const isActive = activeNavTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigateToTab(tab.id)}
                className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'text-white bg-white/[0.1] font-bold border border-white/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* Quick Toast Notice for Top-Up */}
      {topUpSuccessNotice && (
        <div className="bg-amber-500 text-gray-950 text-xs font-semibold py-1 px-4 text-center transition-all animate-in slide-in-from-top flex items-center justify-center gap-2">
          <Coins className="w-3.5 h-3.5" />
          <span>เติมเหรียญจำลองสำเร็จ! ยอดเหรียญของคุณคือ {devTokenBalance} Tokens</span>
        </div>
      )}
    </header>
  );
};
