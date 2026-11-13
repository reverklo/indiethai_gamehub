/**
 * LibraryView.jsx
 * หน้าคลังเกมของผู้ใช้ (Steam My Library)
 * แสดงรายการเกมที่เล่นแล้ว และเกมที่บันทึกไว้ในคลัง
 */

import React, { useState } from 'react';
import { 
  Play, 
  Download, 
  Heart, 
  Gamepad2, 
  Clock, 
  Award, 
  Search, 
  Star, 
  Trash2,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const LibraryView = () => {
  const { 
    games, 
    wishlist, 
    toggleWishlist, 
    playedGames, 
    openGamePlayer, 
    downloadPcGame,
    setSelectedGameForDetail 
  } = useGame();

  const [filterType, setFilterType] = useState('all'); // 'all' | 'played' | 'wishlist'
  const [search, setSearch] = useState('');

  // รวมรายการเกมทั้งหมดที่เกี่ยวข้องกับผู้ใช้
  const userGamesList = games.map((game) => {
    const playRecord = playedGames.find((p) => p.gameId === game.id);
    const isWishlisted = wishlist.includes(game.id);
    return {
      ...game,
      playRecord,
      isWishlisted,
      isPlayed: Boolean(playRecord)
    };
  }).filter((g) => g.isPlayed || g.isWishlisted);

  const filteredList = userGamesList.filter((g) => {
    if (filterType === 'played' && !g.isPlayed) return false;
    if (filterType === 'wishlist' && !g.isWishlisted) return false;
    if (search.trim()) {
      return g.title.toLowerCase().includes(search.toLowerCase()) ||
             g.developer.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#111827] border border-white/[0.08]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-gray-400" />
            <span>คลังเกมของฉัน (My Library)</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            รวมเกมที่คุณเคยทดลองเล่น และเกมที่คุณกดบันทึกไว้ในรายการโปรด ({userGamesList.length} เกม)
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-white text-gray-950 font-semibold'
                : 'bg-white/[0.06] text-gray-300 hover:text-white'
            }`}
          >
            ทั้งหมด ({userGamesList.length})
          </button>

          <button
            onClick={() => setFilterType('played')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filterType === 'played'
                ? 'bg-white text-gray-950 font-semibold'
                : 'bg-white/[0.06] text-gray-300 hover:text-white'
            }`}
          >
            เคยเล่นแล้ว ({userGamesList.filter((g) => g.isPlayed).length})
          </button>

          <button
            onClick={() => setFilterType('wishlist')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              filterType === 'wishlist'
                ? 'bg-white text-gray-950 font-semibold'
                : 'bg-white/[0.06] text-gray-300 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>เกมโปรด ({userGamesList.filter((g) => g.isWishlisted).length})</span>
          </button>
        </div>
      </div>

      {/* Library Grid */}
      {filteredList.length === 0 ? (
        <div className="p-16 text-center rounded-xl bg-[#111827]/60 border border-white/[0.06] space-y-3">
          <Gamepad2 className="w-12 h-12 text-gray-600 mx-auto" />
          <p className="text-gray-300 font-medium text-sm">ไม่พบเกมในหมวดหมู่นี้</p>
          <p className="text-gray-500 text-xs max-w-sm mx-auto">
            คุณสามารถสำรวจเกมใหม่ๆ ในหน้าร้านค้า และกดเล่นหรือกด ❤️ เพื่อเพิ่มเข้าคลังได้ทันที
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map((game) => (
            <div
              key={game.id}
              className="group flex flex-col bg-[#111827] rounded-xl border border-white/[0.08] overflow-hidden hover:border-white/20 transition-colors"
            >
              {/* Thumbnail */}
              <div 
                onClick={() => setSelectedGameForDetail(game)}
                className="relative aspect-video w-full overflow-hidden bg-gray-950 cursor-pointer"
              >
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                
                {/* Category Badge */}
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-black/80 text-gray-300 border border-white/[0.08]">
                  {game.category}
                </span>

                {/* Wishlist Indicator */}
                {game.isWishlisted && (
                  <span className="absolute top-2.5 right-2.5 p-1 rounded-md bg-black/80 text-rose-400 border border-rose-500/30">
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  </span>
                )}
              </div>

              {/* Info & Stats */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 
                    onClick={() => setSelectedGameForDetail(game)}
                    className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    {game.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                    {game.tagline}
                  </p>

                  {/* Play record stats */}
                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-gray-400 bg-[#0B0F19] p-2 rounded-lg border border-white/[0.04]">
                    <span>{game.isPlayed ? `เล่นไป ${game.playRecord?.hoursPlayed} ชม.` : 'ยังไม่เคยเล่น'}</span>
                    <span className="text-gray-500">{game.isPlayed ? `ล่าสุด ${game.playRecord?.lastPlayed}` : 'ในรายการโปรด'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2">
                  {game.hasWebgl && (
                    <button
                      onClick={() => openGamePlayer(game)}
                      className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>เล่น WebGL</span>
                    </button>
                  )}

                  {game.hasPcDownload && (
                    <button
                      onClick={() => downloadPcGame(game.id)}
                      title="ดาวน์โหลดไฟล์ PC (.ZIP)"
                      className="px-3 py-2 rounded-lg bg-white hover:bg-gray-200 text-gray-950 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

