import React from 'react';
import { 
  Play, 
  Flame, 
  Sparkles, 
  Star, 
  Gamepad2, 
  Download, 
  Heart,
  Eye,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { GAME_CATEGORIES } from '../../data/mockData';

export const PlayerView = () => {
  const { 
    filteredApprovedGames, 
    selectedCategory, 
    setSelectedCategory,
    openGamePlayer,
    searchQuery 
  } = useGame();

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111827] via-[#161F30] to-[#0B0F19] border border-gray-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WebGL 3D & HTML5 Thai Indie Games Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            ศูนย์รวมและทดลองเล่น<br />
            <span className="bg-gradient-to-r from-indigo-400 via-emerald-400 to-amber-300 bg-clip-text text-transparent">
              เกมอินดี้สัญชาติไทย
            </span> บนเบราว์เซอร์
          </h1>

          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            ทดลองเล่นเกมที่พัฒนาโดยนักพัฒนาเกมชาวไทยได้ทันทีผ่าน WebGL โดยไม่ต้องดาวน์โหลด 
            ร่วมเป็นส่วนหนึ่งในการทดสอบเกม สนับสนุนเงินทุนผ่านพร้อมเพย์ และผลักดันเกมไทยสู่ระดับโลก
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => {
                if (filteredApprovedGames.length > 0) {
                  openGamePlayer(filteredApprovedGames[0]);
                }
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-indigo-600 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>ทดลองเล่นเกมแนะนำทันที</span>
            </button>

            <span className="text-xs text-gray-500 flex items-center gap-1.5 px-3 py-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {filteredApprovedGames.length} เกมพร้อมให้เล่นออนไลน์
            </span>
          </div>
        </div>
      </section>

      {/* Category Pills Navigation */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-wide font-['Rajdhani',sans-serif]">
              หมวดหมู่เกมยอดนิยม
            </h2>
          </div>
          {searchQuery && (
            <span className="text-xs text-indigo-400">
              ผลการค้นหาคำว่า "{searchQuery}"
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {GAME_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20 font-semibold'
                  : 'bg-[#111827] text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
              }`}
            >
              {cat === 'All' ? '⚡ ทุกหมวดหมู่' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Games Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-indigo-400" />
            <span>เกมอินดี้ที่เปิดให้เล่น (Approved WebGL Games)</span>
          </h2>
          <span className="text-xs text-gray-400">
            แสดง {filteredApprovedGames.length} รายการ
          </span>
        </div>

        {filteredApprovedGames.length === 0 ? (
          <div className="text-center py-16 bg-[#111827]/50 rounded-2xl border border-gray-800">
            <Gamepad2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-300 font-semibold">ไม่พบเกมที่ตรงกับเงื่อนไขการค้นหา</p>
            <p className="text-xs text-gray-500 mt-1">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่นดูสิ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApprovedGames.map((game) => (
              <div
                key={game.id}
                className="group flex flex-col bg-[#111827] rounded-2xl border border-gray-800 overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
              >
                {/* Thumbnail & Badges */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
                  <img
                    src={game.thumbnail}
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

                  {/* Playcount */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] text-gray-300 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    <Eye className="w-3 h-3 text-emerald-400" />
                    <span>{game.playCount.toLocaleString()} ครั้ง</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400">
                        {game.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        โดย <strong className="text-gray-300">{game.developer}</strong>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 font-['Rajdhani',sans-serif]">
                      {game.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {game.tagline}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {game.tags?.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-gray-800/80 text-gray-400 border border-gray-700/50"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-gray-800/80 flex items-center gap-2">
                    <button
                      onClick={() => openGamePlayer(game)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-gray-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-gray-950" />
                      <span>เล่น WebGL เลย</span>
                    </button>

                    {game.promptPayNumber && (
                      <div
                        title={`สนับสนุนผู้พัฒนาผ่านพร้อมเพย์: ${game.promptPayNumber}`}
                        className="px-2.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-amber-400 text-xs border border-gray-700 cursor-pointer transition flex items-center justify-center"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      </div>
                    )}
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

