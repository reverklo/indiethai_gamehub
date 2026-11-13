/**
 * StorefrontView.jsx
 * หน้าร้านค้าหลักและศูนย์รวมเกมอินดี้สัญชาติไทย (สไตล์ Steam & itch.io)
 * - แบนเนอร์กิจกรรม Game Jam
 * - แท็บคัดกรองด่วน: [ทั้งหมด] | [เล่นบนเว็บได้ทันที] | [ดาวน์โหลด PC]
 * - ตัวกรอง Engine (Unity, Godot, Phaser, Three.js ฯลฯ)
 * - สลับดูเกมอินดี้ไทย vs เกมจาก FreeToGame API
 * - การ์ดเกมแสดงป้ายประเภทชัดเจน พร้อมปุ่ม "เล่น WebGL" (ถ้ามี) หรือ "โหลด PC"
 */

import React, { useState } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  Trophy, 
  Calendar, 
  Eye, 
  Star, 
  Download, 
  ChevronRight, 
  Flame, 
  Radio, 
  Loader2, 
  HardDrive,
  Heart,
  Globe,
  Monitor,
  Play
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useFetchBrowserGames } from '../../hooks/useFetchBrowserGames';
import { GAME_ENGINES, GAME_JAM_DATA } from '../../data/mockData';

export const StorefrontView = () => {
  const { 
    filteredApprovedGames, 
    selectedEngine, 
    setSelectedEngine, 
    setSelectedGameForDetail, 
    openGamePlayer,
    downloadPcGame,
    searchQuery,
    wishlist,
    toggleWishlist,
    isWishlistOnly,
    setIsWishlistOnly 
  } = useGame();

  // ดึงข้อมูลเกมเบราว์เซอร์สดจาก FreeToGame API
  const { games: apiGames, loading: apiLoading } = useFetchBrowserGames();

  // แหล่งที่มา: 'local' (เกมอินดี้ไทย) | 'api' (FreeToGame API)
  const [sourceTab, setSourceTab] = useState('local');

  // แท็บคัดกรองประเภทการเล่น (สไตล์ itch.io & Steam): 'all' | 'webgl' | 'pc'
  const [playTypeFilter, setPlayTypeFilter] = useState('all');

  // แจ้งเตือนดาวน์โหลด
  const [downloadToast, setDownloadToast] = useState(null);

  // กรองเกมจาก API ตามคำค้นหา
  const filteredApiGames = apiGames.filter((game) => {
    const q = searchQuery.toLowerCase();
    return (
      game.title.toLowerCase().includes(q) ||
      game.studio.toLowerCase().includes(q) ||
      game.category.toLowerCase().includes(q)
    );
  });

  const baseGames = sourceTab === 'local' ? filteredApprovedGames : filteredApiGames;

  // กรองตามประเภทการเล่น (WebGL vs PC)
  const displayedGames = baseGames.filter((g) => {
    if (playTypeFilter === 'webgl' && !g.hasWebgl) return false;
    if (playTypeFilter === 'pc' && !g.hasPcDownload) return false;
    return true;
  });

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

      {/* 1. Game Jam Banner - Quiet Chrome */}
      <section className="relative overflow-hidden rounded-2xl bg-[#111827] border border-white/[0.08] p-6 sm:p-8">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-amber-300 text-xs font-medium">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{GAME_JAM_DATA.badge}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              {GAME_JAM_DATA.title}
            </h1>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              {GAME_JAM_DATA.theme}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 pt-1">
              <div className="flex items-center gap-1.5 bg-[#0B0F19] px-3 py-1.5 rounded-lg border border-white/[0.06]">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-mono text-gray-300">{GAME_JAM_DATA.deadline}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#0B0F19] px-3 py-1.5 rounded-lg border border-white/[0.06] text-amber-300 font-medium">
                <span>รางวัล: {GAME_JAM_DATA.prizePool}</span>
              </div>
              <div className="text-gray-400 font-mono">
                ส่งแล้ว <strong className="text-gray-200">{GAME_JAM_DATA.submissionsCount}</strong> เกม
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <button 
              onClick={() => {
                if (filteredApprovedGames.length > 0) {
                  setSelectedGameForDetail(filteredApprovedGames[0]);
                }
              }}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-gray-200 text-gray-950 font-semibold text-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-gray-700" />
              <span>ร่วมทดสอบเกมในแยม</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Source Selector Tabs: Thai Indie vs Live FreeToGame API */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-1.5 rounded-xl bg-[#111827] border border-white/[0.08]">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setSourceTab('local')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              sourceTab === 'local'
                ? 'bg-white/[0.1] text-white border border-white/[0.1]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            <span>เกมอินดี้ไทย ({filteredApprovedGames.length})</span>
          </button>

          <button
            onClick={() => setSourceTab('api')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              sourceTab === 'api'
                ? 'bg-white/[0.1] text-white border border-white/[0.1]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4 text-sky-400" />
            <span>FreeToGame API ({apiGames.length})</span>
          </button>
        </div>

        {sourceTab === 'api' && (
          <span className="text-[11px] text-gray-400 font-mono flex items-center gap-1.5 px-3 py-1 bg-[#0B0F19] rounded-md border border-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Real-time feed
          </span>
        )}
      </section>

      {/* 3. Quick Play Type Filter Tabs (สไตล์ itch.io & Steam) */}
      <section className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#111827] border border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">รูปแบบการเล่น:</span>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPlayTypeFilter('all')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                playTypeFilter === 'all'
                  ? 'bg-white text-gray-950 font-semibold'
                  : 'bg-white/[0.04] text-gray-400 hover:text-white'
              }`}
            >
              ทั้งหมด ({baseGames.length})
            </button>

            <button
              onClick={() => setPlayTypeFilter('webgl')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                playTypeFilter === 'webgl'
                  ? 'bg-white text-gray-950 font-semibold'
                  : 'bg-white/[0.04] text-gray-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>เล่นบนเว็บ ({baseGames.filter((g) => g.hasWebgl).length})</span>
            </button>

            <button
              onClick={() => setPlayTypeFilter('pc')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                playTypeFilter === 'pc'
                  ? 'bg-white text-gray-950 font-semibold'
                  : 'bg-white/[0.04] text-gray-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-sky-400" />
              <span>ดาวน์โหลด PC ({baseGames.filter((g) => g.hasPcDownload).length})</span>
            </button>
          </div>
        </div>

        {/* Engine Dropdown or Tags if local */}
        {sourceTab === 'local' && (
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[11px] text-gray-500 font-mono">Engine:</span>
            {GAME_ENGINES.map((engine) => (
              <button
                key={engine}
                onClick={() => setSelectedEngine(engine)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer whitespace-nowrap ${
                  selectedEngine === engine
                    ? 'bg-white/[0.15] text-white font-medium border border-white/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {engine === 'All' ? 'All' : engine.replace(' WebGL', '').replace(' HTML5', '')}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 4. Games Grid */}
      <section className="space-y-4">
        
        {/* Wishlist Only Active Banner */}
        {isWishlistOnly && (
          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/20 flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-2 text-rose-300 font-medium">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>แสดงเฉพาะคลังเกมโปรด ({displayedGames.length} เกม)</span>
            </div>
            <button
              onClick={() => setIsWishlistOnly(false)}
              className="px-2.5 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.1] text-gray-200 text-xs transition-colors cursor-pointer"
            >
              แสดงทั้งหมด
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-gray-400" />
            <span>
              {sourceTab === 'local'
                ? `เกมอินดี้สัญชาติไทย (${displayedGames.length})`
                : `เกมเบราว์เซอร์จาก FreeToGame API (${displayedGames.length})`}
            </span>
          </h2>
          <span className="text-xs text-gray-500">
            {sourceTab === 'local' ? 'สนับสนุนนักพัฒนาไทยโดยตรง' : 'HTML5 / WebGL'}
          </span>
        </div>

        {/* Loading State for API */}
        {sourceTab === 'api' && apiLoading ? (
          <div className="py-20 text-center space-y-3 bg-[#111827]/40 rounded-2xl border border-white/[0.06]">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto" />
            <p className="text-xs font-medium text-gray-400">
              กำลังเชื่อมต่อและดึงข้อมูลจาก FreeToGame API...
            </p>
          </div>
        ) : displayedGames.length === 0 ? (
          <div className="text-center py-16 bg-[#111827]/60 rounded-2xl border border-white/[0.06] space-y-3">
            {isWishlistOnly ? (
              <>
                <Heart className="w-10 h-10 text-rose-500/40 mx-auto" />
                <p className="text-white font-medium text-sm">ยังไม่มีเกมในคลังเกมโปรด</p>
                <p className="text-gray-400 text-xs max-w-sm mx-auto">
                  คลิกไอคอนหัวใจที่มุมขวาบนของการ์ดเกมเพื่อบันทึกเกมที่คุณชอบ
                </p>
                <button
                  onClick={() => setIsWishlistOnly(false)}
                  className="px-4 py-1.5 rounded-lg bg-white hover:bg-gray-200 text-gray-950 text-xs font-medium transition-colors cursor-pointer"
                >
                  สำรวจเกมทั้งหมด
                </button>
              </>
            ) : (
              <>
                <Gamepad2 className="w-10 h-10 text-gray-600 mx-auto" />
                <p className="text-gray-400 text-xs">ไม่พบเกมที่ตรงกับหมวดหมู่นี้</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedGames.map((game) => (
              <div
                key={game.id}
                onClick={() => setSelectedGameForDetail(game)}
                className="group flex flex-col bg-[#111827] rounded-xl border border-white/[0.08] overflow-hidden hover:border-white/20 transition-colors cursor-pointer"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-950">
                  <img
                    src={game.coverImage || game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-70"></div>

                  {/* Top-Left: Engine & Play-Type Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-black/80 text-gray-300 border border-white/[0.08] backdrop-blur-sm">
                      {game.engine}
                    </span>

                    {/* Clear Play Type Badge */}
                    {game.hasWebgl && !game.hasPcDownload && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>เล่นบนเว็บ</span>
                      </span>
                    )}
                    {!game.hasWebgl && game.hasPcDownload && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-sky-950/80 text-sky-300 border border-sky-500/30 backdrop-blur-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        <span>ดาวน์โหลด PC</span>
                      </span>
                    )}
                    {game.hasWebgl && game.hasPcDownload && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
                        เว็บ + PC
                      </span>
                    )}
                  </div>

                  {/* Wishlist Quick Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(game.id);
                    }}
                    title={wishlist?.includes(game.id) ? 'ลบออกจากเกมโปรด' : 'เพิ่มในเกมโปรด'}
                    className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-sm transition-colors cursor-pointer z-10 ${
                      wishlist?.includes(game.id)
                        ? 'bg-black/80 text-rose-400 border border-rose-500/30'
                        : 'bg-black/60 text-gray-400 hover:text-rose-400 border border-white/[0.08]'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${wishlist?.includes(game.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  {/* Rating */}
                  <div className="absolute top-2.5 right-10 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-amber-300 backdrop-blur-sm border border-white/[0.08]">
                    <Star className="w-3 h-3 fill-amber-300" />
                    <span>{game.rating > 0 ? game.rating.toFixed(1) : 'New'}</span>
                  </div>

                  {/* File Size Badge if PC Downloadable */}
                  {game.hasPcDownload && (
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-[10px] font-mono text-gray-300 bg-black/80 px-2 py-0.5 rounded border border-white/[0.08] backdrop-blur-sm">
                      <HardDrive className="w-3 h-3 text-gray-400" />
                      <span>{game.downloadSize || 'PC .ZIP'}</span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span className="font-mono text-gray-400">
                        {game.category}
                      </span>
                      <span>โดย <strong className="text-gray-300 font-normal">{game.studio || game.developer}</strong></span>
                    </div>

                    <h3 className="text-base font-semibold text-white group-hover:text-gray-200 transition-colors line-clamp-1">
                      {game.title}
                    </h3>

                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {game.description || game.tagline}
                    </p>
                  </div>

                  {/* Stats and Action Bar */}
                  <div className="pt-2.5 border-t border-white/[0.06] space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-gray-500" />
                        {(game.playsCount || game.playCount || 0).toLocaleString()} เล่น
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3 text-gray-500" />
                        {game.downloadCount ? game.downloadCount.toLocaleString() : 0} โหลด
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGameForDetail(game);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-gray-200 text-xs font-medium border border-white/[0.06] transition-colors cursor-pointer"
                      >
                        <span>รายละเอียด</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Primary Play Action: WebGL or Download PC */}
                      {game.hasWebgl ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openGamePlayer(game);
                          }}
                          title="เล่นเกมบนเบราว์เซอร์ทันที"
                          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-gray-950 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>เล่น WebGL</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleDownloadClick(e, game)}
                          title="ดาวน์โหลดไฟล์เกม PC (.ZIP)"
                          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-gray-200 text-gray-950 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>โหลด PC</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
