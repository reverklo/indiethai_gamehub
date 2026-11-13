/**
 * StorefrontView.jsx
 * หน้าร้านค้าหลัก IndieThai Hub สไตล์ Steam Storefront
 * - แบนเนอร์เกมเด่นและแนะนำ (Featured & Recommended Carousel) สไตล์ Steam Store
 * - แถบแท็บหมวดหมู่ Steam: ยอดนิยม | มาใหม่ | เล่นฟรีบนเว็บ | ดาวน์โหลด PC | ลดราคาพิเศษ | FreeToGame API
 * - การ์ดเกม Steam มาตรฐาน: แสดงป้ายราคา (ฟรี / ฿99), ส่วนลด, ป้ายในคลัง (Owned), และปุ่ม Wishlist
 * - เชื่อมต่อกับระบบ URL Routing (openGameDetail) แก้ปัญหาหน้าจอเลื่อนและปุ่ม Back
 */

import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  Trophy, 
  Calendar, 
  Eye, 
  Star, 
  Download, 
  ChevronRight, 
  ChevronLeft, 
  Radio, 
  Loader2, 
  HardDrive, 
  Heart, 
  Globe, 
  Monitor, 
  Play,
  Coins,
  ShoppingCart,
  Check,
  Tag,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { useFetchBrowserGames } from '../../hooks/useFetchBrowserGames';
import { GAME_JAM_DATA } from '../../data/mockData';

export const StorefrontView = () => {
  const { 
    filteredApprovedGames, 
    openGameDetail, 
    openGamePlayer, 
    downloadPcGame, 
    searchQuery, 
    wishlist, 
    toggleWishlist, 
    isWishlistOnly, 
    setIsWishlistOnly 
  } = useGame();

  const { isGameOwned, openTopUpModal, walletBalance } = useAuth();

  // ดึงข้อมูลเกมเบราว์เซอร์สดจาก FreeToGame API
  const { games: apiGames, loading: apiLoading } = useFetchBrowserGames();

  // แหล่งที่มาและแท็บคัดกรองสไตล์ Steam: 
  // 'featured' | 'top_sellers' | 'new_releases' | 'webgl' | 'pc' | 'discounted' | 'api'
  const [activeSteamTab, setActiveSteamTab] = useState('all');

  // แจ้งเตือนดาวน์โหลด
  const [downloadToast, setDownloadToast] = useState(null);

  // สไลด์ของ Featured & Recommended Carousel
  const featuredGames = filteredApprovedGames.filter((g) => g.featured || g.rating >= 4.8);
  const carouselGames = featuredGames.length > 0 ? featuredGames : filteredApprovedGames;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  // สไลด์เปลี่ยนอัตโนมัติทุก 5 วินาที
  useEffect(() => {
    if (carouselGames.length <= 1 || isCarouselHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselGames.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselGames.length, isCarouselHovered]);

  const activeFeaturedGame = carouselGames[currentSlide] || carouselGames[0];

  // กรองเกมจาก API ตามคำค้นหา
  const filteredApiGames = apiGames.filter((game) => {
    const q = searchQuery.toLowerCase();
    return (
      game.title.toLowerCase().includes(q) ||
      game.studio.toLowerCase().includes(q) ||
      game.category.toLowerCase().includes(q)
    );
  });

  // กรองเกมตามแท็บสไตล์ Steam
  const getDisplayedGames = () => {
    if (activeSteamTab === 'api') {
      return filteredApiGames;
    }

    let list = [...filteredApprovedGames];

    // คัดกรองตามหมวดหมู่ Steam
    switch (activeSteamTab) {
      case 'top_sellers':
        list.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
        break;
      case 'new_releases':
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'webgl':
        list = list.filter((g) => g.hasWebgl);
        break;
      case 'pc':
        list = list.filter((g) => g.hasPcDownload);
        break;
      case 'discounted':
        list = list.filter((g) => (g.discountPercent || 0) > 0 || g.price === 0);
        break;
      case 'all':
      default:
        break;
    }

    return list;
  };

  const displayedGames = getDisplayedGames();

  const handleDownloadClick = (e, game) => {
    e.stopPropagation();
    downloadPcGame(game.id);

    if (game.downloadUrl && game.downloadUrl !== '#') {
      window.open(game.downloadUrl, '_blank');
      setDownloadToast(`กำลังเริ่มดาวน์โหลด ${game.title} (.ZIP) ขนาด ${game.downloadSize || '100 MB'}`);
    } else {
      setDownloadToast(`กำลังเตรียมแพ็กเกจดาวน์โหลดของ ${game.title}`);
    }

    setTimeout(() => setDownloadToast(null), 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {downloadToast && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-xl bg-sky-950/90 border border-sky-500/40 text-sky-200 text-xs font-semibold shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <Download className="w-4 h-4 text-sky-400 shrink-0 animate-bounce" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* ========================================================
          1. STEAM HERO: Featured & Recommended Carousel (เกมเด่นและแนะนำ)
         ======================================================== */}
      {activeFeaturedGame && activeSteamTab !== 'api' && !searchQuery && (
        <section 
          className="relative rounded-2xl bg-[#0f172a] border border-white/[0.1] overflow-hidden shadow-2xl"
          onMouseEnter={() => setIsCarouselHovered(true)}
          onMouseLeave={() => setIsCarouselHovered(false)}
        >
          {/* Section Heading */}
          <div className="px-5 py-3 border-b border-white/[0.06] bg-[#111827]/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                เกมเด่นและแนะนำ (Featured & Recommended)
              </h2>
            </div>

            {/* Slide Indicators & Controls */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-gray-400">
                {currentSlide + 1} / {carouselGames.length}
              </span>
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + carouselGames.length) % carouselGames.length)}
                className="p-1 rounded-md bg-white/[0.06] hover:bg-white/[0.12] text-gray-300 hover:text-white transition cursor-pointer"
                title="เกมก่อนหน้า"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselGames.length)}
                className="p-1 rounded-md bg-white/[0.06] hover:bg-white/[0.12] text-gray-300 hover:text-white transition cursor-pointer"
                title="เกมถัดไป"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Carousel Body (Steam 2-Column Split) */}
          <div 
            onClick={() => openGameDetail(activeFeaturedGame)}
            className="grid grid-cols-1 lg:grid-cols-12 cursor-pointer group"
          >
            {/* Left Col (65%): Big High-Res Game Preview */}
            <div className="lg:col-span-8 relative aspect-[16/10] sm:aspect-[16/9] bg-black overflow-hidden">
              <img
                src={activeFeaturedGame.headerImage || activeFeaturedGame.thumbnail}
                alt={activeFeaturedGame.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80 lg:hidden" />
              
              {/* Floating badges on image */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-black/80 text-amber-300 border border-amber-500/30 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  <span>{activeFeaturedGame.rating} ({activeFeaturedGame.ratingCount})</span>
                </span>
                
                {activeFeaturedGame.hasWebgl && (
                  <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-xs font-medium backdrop-blur-md">
                    🌐 เล่นบนเว็บ WebGL
                  </span>
                )}
                {activeFeaturedGame.hasPcDownload && (
                  <span className="px-2.5 py-1 rounded-md bg-sky-950/80 text-sky-300 border border-sky-500/30 text-xs font-medium backdrop-blur-md">
                    💻 ดาวน์โหลด PC
                  </span>
                )}
              </div>
            </div>

            {/* Right Col (35%): Game Details & Meta & Pricing */}
            <div className="lg:col-span-4 p-5 sm:p-6 flex flex-col justify-between space-y-4 bg-[#111827]/90 backdrop-blur-md">
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors tracking-tight">
                  {activeFeaturedGame.title}
                </h3>

                {/* 4 Mini Thumbnails Grid (Steam Style) */}
                <div className="grid grid-cols-2 gap-2">
                  {(activeFeaturedGame.mediaGallery || []).slice(0, 4).map((item, idx) => (
                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden bg-black/60 border border-white/[0.08]">
                      <img
                        src={item.thumbnail}
                        alt="preview"
                        className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                  {activeFeaturedGame.description || activeFeaturedGame.tagline}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(activeFeaturedGame.tags || []).slice(0, 4).map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-white/[0.06] text-gray-300 border border-white/[0.08]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400">ราคาจัดจำหน่าย</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {activeFeaturedGame.price === 0 ? (
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-xs font-mono border border-emerald-500/30">
                        เล่นฟรี (Free)
                      </span>
                    ) : (
                      <>
                        {activeFeaturedGame.discountPercent > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-gray-950 font-bold text-xs font-mono">
                            -{activeFeaturedGame.discountPercent}%
                          </span>
                        )}
                        <span className="text-sm font-bold text-white font-mono">
                          ฿ {activeFeaturedGame.price}
                        </span>
                        {activeFeaturedGame.originalPrice > activeFeaturedGame.price && (
                          <span className="text-xs text-gray-500 line-through font-mono">
                            ฿ {activeFeaturedGame.originalPrice}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(activeFeaturedGame.id);
                    }}
                    title={wishlist?.includes(activeFeaturedGame.id) ? 'ลบออกจากสิ่งที่อยากได้' : 'เพิ่มในสิ่งที่อยากได้'}
                    className={`p-2 rounded-lg border transition cursor-pointer ${
                      wishlist?.includes(activeFeaturedGame.id)
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        : 'bg-white/[0.06] text-gray-400 hover:text-rose-400 border-white/[0.08]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${wishlist?.includes(activeFeaturedGame.id) ? 'fill-rose-500' : ''}`} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openGameDetail(activeFeaturedGame);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition cursor-pointer shadow-lg shadow-indigo-600/20"
                  >
                    <span>ดูรายละเอียด</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Indicator dots */}
          <div className="py-2 bg-[#0B0F19] flex items-center justify-center gap-1.5 border-t border-white/[0.06]">
            {carouselGames.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentSlide === i ? 'w-6 bg-indigo-400' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* ========================================================
          2. GAME JAM EVENT BANNER (Quiet Chrome)
         ======================================================== */}
      <section className="relative overflow-hidden rounded-2xl bg-[#111827] border border-white/[0.08] p-5 sm:p-6">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-medium">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{GAME_JAM_DATA.badge}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {GAME_JAM_DATA.title}
            </h2>

            <p className="text-xs text-gray-400 leading-relaxed">
              {GAME_JAM_DATA.theme}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 pt-1">
              <div className="flex items-center gap-1.5 bg-[#0B0F19] px-2.5 py-1 rounded-lg border border-white/[0.06]">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-mono text-gray-300">{GAME_JAM_DATA.deadline}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#0B0F19] px-2.5 py-1 rounded-lg border border-white/[0.06] text-amber-300 font-medium">
                <span>เงินรางวัล: {GAME_JAM_DATA.prizePool}</span>
              </div>
              <div className="text-gray-400 font-mono text-[11px]">
                ส่งผลงานแล้ว <strong className="text-gray-200">{GAME_JAM_DATA.submissionsCount}</strong> เกม
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <button 
              onClick={() => {
                if (filteredApprovedGames.length > 0) {
                  openGameDetail(filteredApprovedGames[0]);
                }
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-gray-200 text-gray-950 font-semibold text-xs transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-gray-700" />
              <span>ร่วมทดสอบเกมในแยม</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. STEAM CATEGORY TABS & FILTER BAR
         ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 overflow-x-auto scrollbar-none gap-2">
          
          {/* Main Steam Category Tabs */}
          <div className="flex items-center gap-1 shrink-0">
            {[
              { id: 'all', label: `เกมทั้งหมด (${filteredApprovedGames.length})`, icon: Gamepad2 },
              { id: 'top_sellers', label: 'ยอดนิยม (Top Sellers)', icon: Zap },
              { id: 'new_releases', label: 'มาใหม่ล่าสุด', icon: Sparkles },
              { id: 'webgl', label: 'เล่นบนเว็บ WebGL', icon: Globe },
              { id: 'pc', label: 'เกม PC ดาวน์โหลด', icon: Monitor },
              { id: 'discounted', label: 'ลดราคาพิเศษ', icon: Tag }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSteamTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSteamTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white text-gray-950 shadow'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <div className="h-4 w-px bg-white/[0.1] mx-1 hidden sm:block" />

            {/* FreeToGame External API Tab */}
            <button
              onClick={() => setActiveSteamTab('api')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeSteamTab === 'api'
                  ? 'bg-white text-gray-950 shadow'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-sky-400" />
              <span>FreeToGame API</span>
            </button>
          </div>

          {/* User Wallet Shortcut */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-gray-400">วอลเล็ตของคุณ:</span>
            <button
              onClick={openTopUpModal}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold hover:bg-amber-500/25 transition cursor-pointer"
            >
              <Coins className="w-3 h-3 text-amber-400" />
              <span>{walletBalance} T</span>
              <span className="text-[10px] font-sans font-normal text-amber-400">+เติม</span>
            </button>
          </div>
        </div>

        {/* Wishlist-only banner indicator */}
        {isWishlistOnly && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>กำลังแสดงเฉพาะเกมในคลังเกมโปรด (Wishlist) ของคุณ</span>
            </div>
            <button
              onClick={() => setIsWishlistOnly(false)}
              className="text-xs font-semibold underline hover:text-white"
            >
              แสดงทั้งหมด
            </button>
          </div>
        )}

        {/* ========================================================
            4. STEAM GAME GRID CARDS
           ======================================================== */}
        {activeSteamTab === 'api' && apiLoading ? (
          <div className="py-20 text-center space-y-3 bg-[#111827]/40 rounded-2xl border border-white/[0.06]">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto" />
            <p className="text-xs font-medium text-gray-400">
              กำลังเชื่อมต่อและดึงข้อมูลเกมสดจาก FreeToGame API...
            </p>
          </div>
        ) : displayedGames.length === 0 ? (
          <div className="text-center py-16 bg-[#111827]/60 rounded-2xl border border-white/[0.06] space-y-3">
            <Gamepad2 className="w-10 h-10 text-gray-600 mx-auto" />
            <p className="text-white font-medium text-sm">ไม่พบเกมในหมวดหมู่นี้</p>
            <p className="text-gray-400 text-xs max-w-sm mx-auto">
              ลองเลือกหมวดหมู่อื่น หรือพิมพ์คำค้นหาชื่อเกมใหม่
            </p>
            <button
              onClick={() => { setActiveSteamTab('all'); setIsWishlistOnly(false); }}
              className="px-4 py-1.5 rounded-lg bg-white hover:bg-gray-200 text-gray-950 text-xs font-medium transition cursor-pointer"
            >
              ดูเกมอินดี้ทั้งหมด
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedGames.map((game) => {
              const owned = isGameOwned(game.id);
              const isWish = wishlist?.includes(game.id);

              return (
                <div
                  key={game.id}
                  onClick={() => openGameDetail(game)}
                  className="apple-card group flex flex-col bg-[#111827] rounded-xl border border-white/[0.08] overflow-hidden hover:border-white/20 cursor-pointer shadow-lg shadow-black/40"
                >
                  {/* Thumbnail Banner */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <img
                      src={game.coverImage || game.thumbnail}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-80" />

                    {/* Top-Left: Category & Play Type Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-black/80 text-gray-300 border border-white/[0.08] backdrop-blur-sm">
                        {game.category}
                      </span>

                      {game.hasWebgl && !game.hasPcDownload && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>เล่นบนเว็บ</span>
                        </span>
                      )}
                      {!game.hasWebgl && game.hasPcDownload && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-sky-950/80 text-sky-300 border border-sky-500/30 backdrop-blur-sm flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                          <span>PC .ZIP</span>
                        </span>
                      )}
                      {game.hasWebgl && game.hasPcDownload && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
                          เว็บ + PC
                        </span>
                      )}
                    </div>

                    {/* Top-Right: Owned Badge or Wishlist Button */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                      {owned && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500 text-gray-950 shadow flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>ในคลัง</span>
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(game.id);
                        }}
                        title={isWish ? 'ลบออกจากสิ่งที่อยากได้' : 'เพิ่มในสิ่งที่อยากได้'}
                        className={`p-1.5 rounded-lg backdrop-blur-sm transition cursor-pointer ${
                          isWish
                            ? 'bg-black/80 text-rose-400 border border-rose-500/30'
                            : 'bg-black/60 text-gray-400 hover:text-rose-400 border border-white/[0.08]'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>

                    {/* Rating on bottom left of thumbnail */}
                    <div className="absolute bottom-2 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-amber-300 backdrop-blur-sm border border-white/[0.08]">
                      <Star className="w-3 h-3 fill-amber-300" />
                      <span>{game.rating > 0 ? game.rating.toFixed(1) : 'New'}</span>
                    </div>

                    {/* Download Size if PC */}
                    {game.hasPcDownload && (
                      <div className="absolute bottom-2 right-2.5 flex items-center gap-1 text-[10px] font-mono text-gray-300 bg-black/80 px-2 py-0.5 rounded border border-white/[0.08] backdrop-blur-sm">
                        <HardDrive className="w-3 h-3 text-gray-400" />
                        <span>{game.downloadSize || 'PC .ZIP'}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span className="text-gray-400">{game.category}</span>
                        <span>โดย <strong className="text-gray-300 font-normal">{game.studio || game.developer}</strong></span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 tracking-tight">
                        {game.title}
                      </h3>

                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {game.tagline || game.description}
                      </p>
                    </div>

                    {/* Steam Price Tag & Action Row */}
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      
                      {/* Price Display */}
                      <div className="flex items-center gap-1.5">
                        {owned ? (
                          <span className="text-xs font-semibold text-emerald-400">
                            เป็นเจ้าของแล้ว
                          </span>
                        ) : game.price === 0 ? (
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            เล่นฟรี
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            {game.discountPercent > 0 && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-gray-950 font-bold text-[10px] font-mono">
                                -{game.discountPercent}%
                              </span>
                            )}
                            <span className="text-xs font-bold text-white font-mono">
                              ฿ {game.price}
                            </span>
                            {game.originalPrice > game.price && (
                              <span className="text-[10px] text-gray-500 line-through font-mono">
                                ฿ {game.originalPrice}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openGameDetail(game);
                          }}
                          className="apple-press px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-gray-200 text-xs font-medium border border-white/[0.08] transition flex items-center gap-1 cursor-pointer"
                        >
                          <span>ดูเกม</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>

                        {/* Quick Play if WebGL */}
                        {game.hasWebgl && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openGamePlayer(game);
                            }}
                            title="เล่นบนเว็บทันที"
                            className="apple-press p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-gray-950 transition cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};