/**
 * MysteryIndieDropModal.jsx
 * ตู้สุ่มค้นพบเกมอินดี้ไทยประจำวัน (Daily Indie Mystery Drop & Discovery Wheel)
 * - ดึงดูดผู้เล่นที่ไม่รู้จะเล่นเกมอะไร ให้กดสุ่มหาเกมอินดี้ตามโชคชะตา
 * - แอนิเมชันหมุนตู้สุ่ม Cyber Slot พร้อมการจับคู่สไตล์เกม (Match Rate 98%)
 * - เข้าเล่นเกม WebGL ได้ทันที หรือเปิดหน้ารายละเอียดเกม
 */

import React, { useState, useEffect } from 'react';
import { 
  Dices, 
  Sparkles, 
  X, 
  Play, 
  ArrowRight, 
  RefreshCw, 
  Star, 
  Gamepad2,
  Trophy,
  Zap
} from 'lucide-react';

export const MysteryIndieDropModal = ({ isOpen, onClose, games = [], onPlayGame, onOpenDetail }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [matchRate, setMatchRate] = useState(98);

  const pool = games.length > 0 ? games : [
    {
      id: 'game-1',
      title: '2048 Cyber Siam',
      category: 'Puzzle / Arcade',
      rating: 4.9,
      tagline: 'ท้าทายสมองด้วยการรวมบล็อกตัวเลขไซเบอร์พังก์สัญชาติไทย รวดเร็ว ลื่นไหล',
      hasWebgl: true,
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'game-2',
      title: 'Ayutthaya Cyber Samurai',
      category: 'Action / Roguelite',
      rating: 4.8,
      tagline: 'แอ็กชันฟันแหลกไซเบอร์อยุธยายุคอนาคต กราฟิกพิกเซลอาร์ตสุดตระการตา',
      hasWebgl: false,
      hasPcDownload: true,
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'game-3',
      title: 'Bangkok Drift 2088',
      category: 'Racing / Arcade',
      rating: 4.7,
      tagline: 'ซิ่งดริฟต์ทะลุอุโมงค์และทางด่วนกรุงเทพฯ ยุคไซเบอร์พังก์ 2088 พร้อมเพลงประกอบ Synthwave',
      hasWebgl: false,
      hasPcDownload: true,
      thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const handleSpin = () => {
    setIsSpinning(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setSelectedGame(pool[randomIndex]);
      counter++;
      if (counter > 12) {
        clearInterval(interval);
        const finalGame = pool[Math.floor(Math.random() * pool.length)];
        setSelectedGame(finalGame);
        setMatchRate(Math.floor(Math.random() * 8) + 92); // 92% - 99%
        setIsSpinning(false);
      }
    }, 120);
  };

  useEffect(() => {
    if (isOpen && !selectedGame) {
      handleSpin();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-[#0d1322] border border-white/[0.1] shadow-2xl overflow-hidden apple-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08] bg-[#11192e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Dices className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>ตู้สุ่มค้นพบเกมอินดี้ (Mystery Indie Drop)</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-mono">
                  DAILY
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                สุ่มเกมอินดี้ไทยที่ใช่สำหรับคุณตามดวงชะตาวันนี้
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {selectedGame && (
            <div className={`space-y-4 ${isSpinning ? 'opacity-60 scale-95 blur-[0.5px] transition-all' : 'animate-in zoom-in-95'}`}>
              {/* Game Card Preview */}
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] bg-[#162238] shadow-lg">
                <img 
                  src={selectedGame.thumbnail} 
                  alt={selectedGame.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1322] via-[#0d1322]/40 to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-gray-950 flex items-center gap-1 font-mono">
                    <Sparkles className="w-3 h-3" />
                    <span>MATCH {matchRate}%</span>
                  </span>
                  {selectedGame.hasWebgl && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/90 text-white">
                      เล่นบนเว็บได้ทันที
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h4 className="text-lg font-bold text-white tracking-wide">
                    {selectedGame.title}
                  </h4>
                  <p className="text-xs text-gray-300 line-clamp-1 mt-0.5 font-sans">
                    {selectedGame.tagline || selectedGame.description}
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-white/[0.06] text-gray-300 font-mono text-[11px]">
                    {selectedGame.category}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 font-mono text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{selectedGame.rating || '4.8'}</span>
                  </span>
                </div>
                <span className="text-[11px] text-indigo-300 font-mono">
                  {selectedGame.hasWebgl ? 'WebGL 60 FPS' : 'PC Download'}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <div className="flex gap-2.5">
              {selectedGame?.hasWebgl ? (
                <button
                  type="button"
                  disabled={isSpinning}
                  onClick={() => {
                    onClose();
                    if (onPlayGame) onPlayGame(selectedGame.id);
                  }}
                  className="flex-1 apple-press flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-gray-950 font-bold text-xs transition cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-gray-950" />
                  <span>ลองเล่นทันทีในเบราว์เซอร์</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSpinning}
                  onClick={() => {
                    onClose();
                    if (onOpenDetail) onOpenDetail(selectedGame.id);
                  }}
                  className="flex-1 apple-press flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs transition cursor-pointer disabled:opacity-50"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>เปิดหน้ารายละเอียดเกม</span>
                </button>
              )}

              <button
                type="button"
                disabled={isSpinning}
                onClick={handleSpin}
                className="apple-press p-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-gray-300 hover:text-white transition cursor-pointer border border-white/[0.08] disabled:opacity-50"
                title="สุ่มใหม่อีกครั้ง"
              >
                <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin text-indigo-400' : ''}`} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenDetail && selectedGame) onOpenDetail(selectedGame.id);
              }}
              className="w-full text-center text-[11px] text-gray-400 hover:text-gray-200 transition py-1 cursor-pointer"
            >
              ดูสเปกและความต้องการของระบบ &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
