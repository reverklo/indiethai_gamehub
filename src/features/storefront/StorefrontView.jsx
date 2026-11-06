/**
 * StorefrontView.jsx
 * หน้าร้านค้าหลักและศูนย์รวมเกมอินดี้สัญชาติไทย
 * - แบนเนอร์กิจกรรม Game Jam
 * - แท็บกรอง Engine (Unity, Godot, WebGL, ฯลฯ)
 * - สวิตช์สลับดูระหว่าง "เกมอินดี้สัญชาติไทย" และ "เกมเบราว์เซอร์สดจาก FreeToGame API (useFetchBrowserGames)"
 * - การ์ดแสดงรายการเกมพร้อมป้ายบอกชัดเจน (WebGL / PC Download)
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
  Play, 
  Laptop, 
  Globe, 
  ChevronRight,
  Flame,
  Radio,
  Loader2
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
    searchQuery 
  } = useGame();

  // ดึงข้อมูลเกมเบราว์เซอร์สดจาก FreeToGame API ผ่าน Custom Hook
  const { games: apiGames, loading: apiLoading } = useFetchBrowserGames();

  // ตัวสลับหมวดหมู่แสดงผล: 'local' (เกมอินดี้ไทย) | 'api' (เกมเบราว์เซอร์จาก FreeToGame API)
  const [sourceTab, setSourceTab] = useState('local');

  // กรองเกมจาก API ตามคำค้นหา
  const filteredApiGames = apiGames.filter((game) => {
    const q = searchQuery.toLowerCase();
    return (
      game.title.toLowerCase().includes(q) ||
      game.studio.toLowerCase().includes(q) ||
      game.category.toLowerCase().includes(q)
    );
  });

  const displayedGames = sourceTab === 'local' ? filteredApprovedGames : filteredApiGames;

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* 1. Game Jam Cyberpunk Event Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#111827] via-[#161F30] to-[#0B0F19] border border-indigo-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>{GAME_JAM_DATA.badge}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wide font-['Rajdhani',sans-serif]">
              {GAME_JAM_DATA.title}
            </h1>

            <p className="text-sm sm:text-base text-indigo-200 font-medium">
              {GAME_JAM_DATA.theme}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 pt-1">
              <div className="flex items-center gap-1.5 bg-[#0B0F19]/80 px-3 py-1.5 rounded-xl border border-gray-800">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{GAME_JAM_DATA.deadline}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#0B0F19]/80 px-3 py-1.5 rounded-xl border border-gray-800 text-amber-300 font-semibold">
                <span>💰 {GAME_JAM_DATA.prizePool}</span>
              </div>
              <div className="text-gray-400">
                ส่งผลงานแล้ว <strong>{GAME_JAM_DATA.submissionsCount} เกม</strong>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button 
              onClick={() => {
                if (filteredApprovedGames.length > 0) {
                  setSelectedGameForDetail(filteredApprovedGames[0]);
                }
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-indigo-600 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>ร่วมทดสอบเกมในแยม</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Source Selector Tabs: Thai Indie vs Live FreeToGame API */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-2 rounded-2xl bg-[#111827] border border-gray-800">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Tab 1: Thai Indie */}
          <button
            onClick={() => setSourceTab('local')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              sourceTab === 'local'
                ? 'bg-gradient-to-r from-[#6366F1] to-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            <span>🇹🇭 เกมอินดี้สัญชาติไทย ({filteredApprovedGames.length})</span>
          </button>

          {/* Tab 2: FreeToGame API */}
          <button
            onClick={() => setSourceTab('api')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              sourceTab === 'api'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-950 shadow-lg shadow-emerald-500/25'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Radio className="w-4 h-4 animate-pulse text-emerald-400" />
            <span>🌐 เกมเบราว์เซอร์สดจาก FreeToGame API ({apiGames.length})</span>
          </button>
        </div>

        {sourceTab === 'api' && (
          <span className="text-[11px] text-emerald-400 flex items-center gap-1.5 px-3 py-1 bg-emerald-950/40 rounded-lg border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            ดึงข้อมูล Real-time ผ่าน useFetchBrowserGames()
          </span>
        )}
      </section>

      {/* 3. Engine Filter Tabs (ถ้าเลือกเกมไทย) */}
      {sourceTab === 'local' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white tracking-wide font-['Rajdhani',sans-serif]">
                กรองเกมตาม GAME ENGINE
              </h2>
            </div>
            {searchQuery && (
              <span className="text-xs text-indigo-400">
                ค้นหา: "{searchQuery}"
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {GAME_ENGINES.map((engine) => (
              <button
                key={engine}
                onClick={() => setSelectedEngine(engine)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedEngine === engine
                    ? 'bg-gradient-to-r from-[#6366F1] to-indigo-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/50 scale-105'
                    : 'bg-[#111827] text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
                }`}
              >
                {engine === 'All' ? '⚡ ทุก Engine' : engine}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 4. Games Grid with Clear Badges (WebGL vs PC Download) */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-['Rajdhani',sans-serif]">
            <Gamepad2 className="w-5 h-5 text-indigo-400" />
            <span>
              {sourceTab === 'local'
                ? `คลังเกมอินดี้สัญชาติไทย (${displayedGames.length} เกม)`
                : `เกมเบราว์เซอร์ออนไลน์จาก FreeToGame API (${displayedGames.length} เกม)`}
            </span>
          </h2>
          <span className="text-xs text-gray-400">
            {sourceTab === 'local' ? 'สนับสนุนนักพัฒนาไทยโดยตรง' : 'HTML5 / WebGL Online'}
          </span>
        </div>

        {/* Loading State for API */}
        {sourceTab === 'api' && apiLoading ? (
          <div className="py-20 text-center space-y-4 bg-[#111827]/40 rounded-3xl border border-gray-800">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-gray-300">
              กำลังเชื่อมต่อและดึงข้อมูลเกมจาก FreeToGame API...
            </p>
          </div>
        ) : displayedGames.length === 0 ? (
          <div className="text-center py-20 bg-[#111827]/60 rounded-3xl border border-gray-800 space-y-3">
            <Gamepad2 className="w-12 h-12 text-gray-600 mx-auto" />
            <p className="text-gray-300 font-semibold">ไม่พบเกมที่ตรงกับคำค้นหา</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedGames.map((game) => (
              <div
                key={game.id}
                className="group flex flex-col bg-[#111827] rounded-2xl border border-gray-800/90 overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
              >
                {/* Thumbnail Container */}
                <div 
                  onClick={() => setSelectedGameForDetail(game)}
                  className="relative aspect-video w-full overflow-hidden bg-gray-900 cursor-pointer"
                >
                  <img
                    src={game.coverImage || game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-80"></div>

                  {/* Engine Tag */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#0B0F19]/90 text-indigo-400 border border-indigo-500/40 backdrop-blur-sm">
                    {game.engine}
                  </span>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/75 text-amber-400 text-xs font-bold backdrop-blur-sm border border-amber-500/30">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{game.rating > 0 ? game.rating.toFixed(1) : 'New'}</span>
                  </div>

                  {/* Platform Badges (WebGL vs PC) */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 flex-wrap">
                    {(game.isWebGL || game.hasWebgl) && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/90 text-gray-950 shadow-md">
                        <Globe className="w-3 h-3" />
                        เล่นบนเว็บได้ทันที
                      </span>
                    )}
                    {game.hasPcDownload && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/90 text-gray-950 shadow-md">
                        <Laptop className="w-3 h-3" />
                        ดาวน์โหลด PC (.ZIP)
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="text-[10px] uppercase font-bold text-indigo-400">
                        {game.category}
                      </span>
                      <span>โดย <strong className="text-gray-300">{game.studio || game.developer}</strong></span>
                    </div>

                    <h3 
                      onClick={() => setSelectedGameForDetail(game)}
                      className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 font-['Rajdhani',sans-serif] cursor-pointer"
                    >
                      {game.title}
                    </h3>

                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {game.description || game.tagline}
                    </p>
                  </div>

                  {/* Stats and Action Bar */}
                  <div className="pt-3 border-t border-gray-800/80 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-emerald-400" />
                        เล่นแล้ว {(game.playsCount || game.playCount || 0).toLocaleString()} ครั้ง
                      </span>
                      {game.hasPcDownload && (
                        <span className="flex items-center gap-1">
                          <Download className="w-3 h-3 text-sky-400" />
                          {game.downloadCount ? game.downloadCount.toLocaleString() : 0} โหลด
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedGameForDetail(game)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold transition cursor-pointer"
                      >
                        <span>รายละเอียด</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => openGamePlayer(game)}
                        title="เล่น WebGL บนเบราว์เซอร์ทันที"
                        className="flex items-center justify-center gap-1 px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 text-xs font-bold transition shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-gray-950" />
                        <span>เล่น WebGL</span>
                      </button>
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
