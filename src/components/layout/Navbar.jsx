/**
 * Navbar.jsx
 * แถบนำทางด้านบนสไตล์ Steam Client
 * - ปรับปรุงโครงสร้างให้เรียบง่ายและเป็นระเบียบ (Unslop & Quiet Chrome)
 * - 4 แท็บหลักกระชับไม่รกสายตา: ร้านค้า | คลังเกม | ชุมชน | (สตูดิโอ / ผู้ดูแลระบบ / TSUKIKO_83)
 * - แก้ไขปัญหาชื่อผู้ใช้ขนาดยาว (40 ตัวอักษร) แสดงทับซ้อนในแท็บ
 * - แก้ไขปัญหาปุ่ม Wishlist ตัดบรรทัดแนวตั้ง (สิ่งที่/อยาก/ได้) ด้วยไอคอน + ตัวเลข badge (whitespace-nowrap)
 * - แถบค้นหา Responsive แบบยืดหยุ่นบน Desktop พร้อมปุ่มค้นหาแบบขยายบน Mobile
 * - เมนูโปรไฟล์ผู้ใช้พร้อมตัวสลับบทบาท และสถานะออนไลน์
 * - เมนูนำทางด้านล่างแบบเลื่อนได้ (Horizontal Scroll Strip) สำหรับอุปกรณ์หน้าจอเล็ก/มือถือ/แท็บเล็ต
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Gamepad2, 
  Search, 
  Coins, 
  ShieldCheck, 
  Code2, 
  User, 
  ChevronDown, 
  LogOut, 
  LogIn, 
  Heart, 
  Bell, 
  CheckCheck, 
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';

export const Navbar = () => {
  const { 
    currentUser, 
    currentRole, 
    switchRole, 
    walletBalance,
    openTopUpModal,
    devTokenBalance, 
    topUpTokens,
    openAuthModal,
    logout 
  } = useAuth();

  const { 
    searchQuery, 
    setSearchQuery, 
    approvedGames,
    openGameDetail,
    pendingGames,
    wishlist,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    activeNavTab,
    navigateToTab,
    setProfileTab
  } = useGame();

  const [topUpSuccessNotice, setTopUpSuccessNotice] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const desktopSearchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const liveSearchResults = trimmedQuery
    ? (approvedGames || [])
        .filter(
          (g) =>
            g.title.toLowerCase().includes(trimmedQuery) ||
            (g.developer || '').toLowerCase().includes(trimmedQuery) ||
            (g.category || '').toLowerCase().includes(trimmedQuery)
        )
        .slice(0, 6)
    : [];

  const renderSearchDropdown = () => {
    if (!trimmedQuery) return null;
    return (
      <div className="absolute top-full left-0 w-full min-w-[280px] sm:min-w-[340px] mt-2 rounded-xl bg-[#1b2230] border border-white/[0.12] shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
        <div className="px-3 py-2 border-b border-white/[0.06] bg-[#141a24] flex items-center justify-between">
          <span className="text-[11px] font-medium text-gray-400">ผลลัพธ์การค้นหา</span>
          {liveSearchResults.length > 0 && (
            <span className="text-[10px] font-mono text-gray-500">{liveSearchResults.length} เกม</span>
          )}
        </div>

        {liveSearchResults.length === 0 ? (
          <div className="px-4 py-5 text-center text-xs text-gray-400">
            ไม่พบเกมที่ตรงกับ "{searchQuery.trim()}"
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05] max-h-80 overflow-y-auto">
            {liveSearchResults.map((game) => (
              <button
                key={game.id}
                type="button"
                onClick={() => {
                  openGameDetail(game);
                  setIsSearchFocused(false);
                  setIsMobileSearchOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 hover:bg-white/[0.08] transition-colors text-left cursor-pointer group"
              >
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-24 aspect-video rounded object-cover bg-black shrink-0 border border-white/[0.08]"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-xs font-semibold text-gray-100 group-hover:text-white truncate">
                    {game.title}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    {game.price === 0 ? (
                      <span className="text-gray-300 font-sans">ฟรี</span>
                    ) : game.discountPercent > 0 ? (
                      <>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold leading-none">
                          -{game.discountPercent}%
                        </span>
                        <span className="text-gray-500 line-through text-[10px]">
                          ฿{game.originalPrice}
                        </span>
                        <span className="text-emerald-300 font-semibold">
                          ฿{game.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-200 font-semibold">฿{game.price}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // เติมเหรียญด่วน 100 Tokens สำหรับ Developer
  const handleQuickTopUp = (e) => {
    e.stopPropagation();
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
          label: 'Developer (สตูดิโอ)',
          bg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
          icon: Code2
        };
      case 'player':
      default:
        return {
          label: 'Player (ผู้เล่น)',
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          icon: User
        };
    }
  };

  const roleBadgeInfo = getRoleBadge(currentRole);
  const RoleIcon = roleBadgeInfo.icon;

  // รายการแท็บนำทางหลัก (สไตล์ Steam: ร้านค้า, คลังเกม, ชุมชน และแท็บโปรไฟล์/สตูดิโอเมื่อล็อกอินเท่านั้น)
  const navTabs = [
    { id: 'store', label: 'ร้านค้า' },
    { id: 'library', label: 'คลังเกม' },
    { id: 'community', label: 'ชุมชน' },
  ];

  if (currentUser) {
    if (currentRole === 'developer') {
      navTabs.push({ id: 'studio', label: 'สตูดิโอ' });
    } else if (currentRole === 'admin') {
      navTabs.push({ id: 'admin', label: 'ผู้ดูแลระบบ' });
    } else {
      navTabs.push({ id: 'profile', label: 'โปรไฟล์' });
    }
  }

  const handleWishlistClick = () => {
    if (!currentUser) {
      openAuthModal('login');
      return;
    }
    navigateToTab('profile', 'wishlist');
    if (setProfileTab) {
      setProfileTab('wishlist');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0B0F19]/95 backdrop-blur-md transition-all">
      {/* Click outside backdrop for open dropdowns */}
      {(isProfileMenuOpen || isNotifOpen) && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => {
            setIsProfileMenuOpen(false);
            setIsNotifOpen(false);
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Left: Logo & Primary Steam Navigation Tabs */}
          <div className="flex items-center gap-3 lg:gap-6 shrink-0">
            {/* Logo & Brand */}
            <button 
              onClick={() => {
                navigateToTab('store');
                setIsMobileSearchOpen(false);
              }}
              className="flex items-center gap-2 cursor-pointer select-none group text-left"
              title="IndieThai Hub หน้าแรก"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center group-hover:border-indigo-400/50 group-hover:bg-indigo-500/10 transition-colors">
                <Gamepad2 className="w-4 h-4 text-gray-200 group-hover:text-indigo-400 transition-colors" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                IndieThai<span className="text-indigo-400">Hub</span>
              </span>
            </button>

            {/* Desktop Steam Client Navigation Tabs (md and up) */}
            <nav className="hidden md:flex items-center gap-1 text-xs uppercase tracking-wider font-semibold">
              {navTabs.map((tab) => {
                const isActive = activeNavTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigateToTab(tab.id)}
                    className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer relative whitespace-nowrap ${
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

          {/* Center: Steam-style Live Search Bar (Desktop / Tablet md+) */}
          <div ref={desktopSearchRef} className="hidden md:flex items-center flex-1 min-w-[180px] max-w-xs lg:max-w-sm ml-2 mr-auto relative z-50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigateToTab('store');
                setIsSearchFocused(false);
              }}
              className={`flex items-center w-full bg-[#111827] border rounded-lg overflow-hidden transition-colors ${
                isSearchFocused ? 'border-sky-400/70 ring-1 ring-sky-400/30' : 'border-white/[0.1]'
              }`}
            >
              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setIsSearchFocused(false);
                  }}
                  placeholder="ค้นหาเกม, สตูดิโอ..."
                  className="w-full bg-transparent pl-3 pr-7 py-1.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    title="ล้างคำค้นหา"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="submit"
                title="ค้นหา"
                className="px-2.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-white transition-colors cursor-pointer shrink-0 flex items-center justify-center"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {isSearchFocused && renderSearchDropdown()}
          </div>

          {/* Right: Actions, Notifications & Profile Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

            {/* Mobile Search Toggle Icon (< md) */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              title="ค้นหาเกม"
              className={`md:hidden p-2 rounded-lg border text-gray-300 transition-colors cursor-pointer shrink-0 ${
                isMobileSearchOpen
                  ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                  : 'bg-[#111827] border-white/[0.08] hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Shortcut Button */}
            <button
              onClick={handleWishlistClick}
              title={`สิ่งที่อยากได้ (${currentUser ? wishlist.length : 0})`}
              className={`flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                activeNavTab === 'profile' && currentUser
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  : 'bg-[#111827] text-gray-300 border-white/[0.08] hover:border-white/20 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500/30 text-rose-400 shrink-0" />
              <span className="hidden xl:inline">สิ่งที่อยากได้</span>
              {currentUser && wishlist.length > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-500/20 text-rose-300 font-mono font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* 🔔 Notification Center (Only when logged in) */}
            {currentUser && (
              <div className="relative shrink-0 z-50">
                <button
                  onClick={() => {
                    setIsNotifOpen(!isNotifOpen);
                    setIsProfileMenuOpen(false);
                  }}
                  title="ศูนย์การแจ้งเตือน"
                  className="relative p-2 rounded-lg bg-[#111827] border border-white/[0.08] text-gray-300 hover:text-white hover:border-white/20 transition-colors cursor-pointer shrink-0"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white font-mono">
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
                              <span className="text-[10px] text-gray-500 font-mono">{notif.time}</span>
                            </div>
                            <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Steam Wallet Balance Pill (Only when logged in) */}
            {currentUser && (
              <div 
                onClick={openTopUpModal}
                title="วอลเล็ตสำหรับซื้อเกม (คลิกเพื่อเติมเงิน)"
                className="flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 px-2.5 py-1.5 rounded-lg shrink-0 cursor-pointer transition-colors"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-xs font-medium text-white font-mono">
                  ฿{walletBalance}
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-white/[0.08] text-gray-300 hover:text-white transition-colors">
                  + เติมเงิน
                </span>
              </div>
            )}

            {/* User Profile Avatar with Steam-style Border */}
            <div className="relative shrink-0 z-50">
              {currentUser ? (
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(!isProfileMenuOpen);
                    setIsNotifOpen(false);
                  }}
                  className={`flex items-center gap-2 p-1 pr-1.5 sm:pr-2 rounded-lg bg-[#111827] border transition-colors cursor-pointer shrink-0 ${
                    activeNavTab === 'profile'
                      ? 'border-indigo-400/60 ring-1 ring-indigo-400/30'
                      : 'border-white/[0.08] hover:border-white/20'
                  }`}
                  title={`${currentUser.name} (@${currentUser.username || 'user'})`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-md object-cover ring-1 ring-white/20"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-sky-400 ring-1 ring-black" />
                  </div>
                  <div className="hidden xl:flex flex-col text-left max-w-[100px]">
                    <span className="text-xs font-medium text-gray-200 truncate whitespace-nowrap">
                      {currentUser.name}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400 shrink-0" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold sm:font-medium text-white sm:text-gray-300 hover:text-white bg-white/[0.08] sm:bg-transparent sm:hover:bg-white/[0.06] border border-white/[0.12] sm:border-transparent transition-colors cursor-pointer whitespace-nowrap"
                  >
                    เข้าสู่ระบบ
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="hidden sm:inline-flex apple-press px-3.5 py-1.5 rounded-lg bg-white hover:bg-gray-200 text-gray-950 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                  >
                    สมัครสมาชิก
                  </button>
                </div>
              )}

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && currentUser && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-[#111827] border border-white/[0.08] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <div className="p-3 border-b border-white/[0.06] mb-2">
                    <p className="text-[10px] text-gray-400">เข้าสู่ระบบในชื่อ</p>
                    <p className="text-sm font-bold text-white mt-0.5 truncate">{currentUser.name}</p>
                    <p className="text-xs text-gray-400 truncate font-mono">@{currentUser.username || 'tsukiko_83'}</p>
                    
                    {/* Quick Wallet Summary in Dropdown */}
                    <div className="mt-2.5 flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/[0.06]">
                      <div className="flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[11px] text-gray-300">วอลเล็ต:</span>
                        <span className="text-xs font-bold text-amber-300 font-mono">{walletBalance} T</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsProfileMenuOpen(false);
                          openTopUpModal();
                        }}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500 hover:bg-amber-400 text-gray-950 transition cursor-pointer"
                      >
                        เติมเงิน
                      </button>
                    </div>

                    <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium border ${roleBadgeInfo.bg}`}>
                      <RoleIcon className="w-3 h-3" />
                      {roleBadgeInfo.label}
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-0.5 border-b border-white/[0.06] pb-2 mb-2">
                    <button
                      onClick={() => navigateToTab('profile', 'recent')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                        activeNavTab === 'profile' ? 'bg-indigo-500/15 text-indigo-300 font-semibold' : 'text-gray-200 hover:bg-white/[0.06]'
                      }`}
                    >
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span>หน้าโปรไฟล์ของฉัน (Steam Profile)</span>
                    </button>

                    <button
                      onClick={() => navigateToTab('library')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                        activeNavTab === 'library' ? 'bg-indigo-500/15 text-indigo-300 font-semibold' : 'text-gray-200 hover:bg-white/[0.06]'
                      }`}
                    >
                      <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>คลังเกมของฉัน (My Library)</span>
                    </button>

                    <button
                      onClick={() => navigateToTab('community')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                        activeNavTab === 'community' ? 'bg-indigo-500/15 text-indigo-300 font-semibold' : 'text-gray-200 hover:bg-white/[0.06]'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-sky-400" />
                      <span>ชุมชนเกมอินดี้ (Community)</span>
                    </button>

                    {currentRole === 'developer' && (
                      <button
                        onClick={() => navigateToTab('studio')}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                          activeNavTab === 'studio' ? 'bg-indigo-500/15 text-indigo-300 font-semibold' : 'text-gray-200 hover:bg-white/[0.06]'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>ศูนย์ควบคุมสตูดิโอ (Developer Studio)</span>
                      </button>
                    )}

                    {currentRole === 'admin' && (
                      <button
                        onClick={() => navigateToTab('admin')}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                          activeNavTab === 'admin' ? 'bg-rose-500/15 text-rose-300 font-semibold' : 'text-gray-200 hover:bg-white/[0.06]'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                        <span>ระบบผู้ดูแล (Admin Console)</span>
                      </button>
                    )}
                  </div>

                  {/* Logout */}
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
              )}
            </div>

          </div>

        </div>

        {/* Mobile Search Input Drawer (Slidedown when search is toggled on mobile) */}
        {isMobileSearchOpen && (
          <div className="md:hidden py-2 px-1 border-t border-white/[0.08] animate-in fade-in slide-in-from-top-1 relative z-50">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อเกม, สตูดิโอผู้พัฒนา..."
                className="w-full bg-[#111827] border border-white/[0.12] rounded-lg pl-9 pr-8 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-sky-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white p-0.5"
                >
                  ✕
                </button>
              )}
            </div>
            {renderSearchDropdown()}
          </div>
        )}

        {/* Mobile Steam Navigation Bar (Horizontal Scroll Strip under header on mobile/tablet) */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto py-2 border-t border-white/[0.06] scrollbar-none text-xs font-semibold">
          {navTabs.map((tab) => {
            const isActive = activeNavTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  navigateToTab(tab.id);
                  setIsMobileSearchOpen(false);
                }}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'text-white bg-white/[0.1] font-bold border border-white/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
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