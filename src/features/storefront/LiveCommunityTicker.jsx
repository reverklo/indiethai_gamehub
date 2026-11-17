/**
 * LiveCommunityTicker.jsx
 * แถบแสดงความเคลื่อนไหวสดของคอมมูนิตี้แบบเรียลไทม์ (Live Activity Pulse & Marquee)
 * - ดึงดูดสายตาผู้เยี่ยมชมด้วยกิจกรรมสด: ผู้เล่นทำคะแนนสูงสุด, โดเนททิปให้นักพัฒนา, เกมใหม่เข้าสโตร์
 * - อัปเดตและสลับข้อความอัตโนมัติอย่างนุ่มนวลตามมาตรฐาน Apple Motion
 */

import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Trophy, 
  Coffee, 
  Sparkles, 
  Gamepad2, 
  Radio, 
  ChevronRight,
  Zap,
  TrendingUp
} from 'lucide-react';

export const LiveCommunityTicker = ({ onPlayGame, onOpenLeaderboard }) => {
  const activities = [
    {
      id: 1,
      icon: Trophy,
      color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
      tag: 'NEW RECORD',
      text: 'Tsukiko_83 เพิ่งทำสถิติ High Score 32,768 ใน 2048 Cyber Siam!',
      actionLabel: 'ท้าชิงสถิติ',
      gameId: 'game-1'
    },
    {
      id: 2,
      icon: Coffee,
      color: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
      tag: 'COMMUNITY SUPPORT',
      text: 'ผู้เล่น @NEONPLAYER_T โดเนท 100฿ ซัพพอร์ตทีมงาน SiamPixel Studio',
      actionLabel: 'ดูผู้พัฒนา',
      gameId: null
    },
    {
      id: 3,
      icon: Flame,
      color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
      tag: 'TRENDING NOW',
      text: 'เกม Ayutthaya Cyber Samurai มียอดเข้าชมพุ่งทะลุ 1,200 ครั้งในสัปดาห์นี้',
      actionLabel: 'ดูเกมนี้',
      gameId: 'game-2'
    },
    {
      id: 4,
      icon: Sparkles,
      color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
      tag: 'GAME JAM 2026',
      text: 'เปิดรับผลงาน Thai Cyber Indie Game Jam 2026 ชิงเงินรางวัลรวม 50,000฿',
      actionLabel: 'ดูรายละเอียดแยม',
      gameId: null
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activities.length]);

  const current = activities[currentIndex];
  const IconComponent = current.icon;

  return (
    <div className="w-full rounded-2xl bg-[#0c1322] border border-white/[0.08] px-4 py-2.5 overflow-hidden shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between gap-4">
        {/* Left Live Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-emerald-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LIVE COMMUNITY PULSE</span>
            <span className="sm:hidden">LIVE</span>
          </span>
          <span className="h-3.5 w-[1px] bg-white/[0.1] hidden sm:block"></span>
        </div>

        {/* Center Animated Activity */}
        <div className="flex-1 min-w-0 flex items-center gap-2.5 transition-all duration-300">
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border shrink-0 ${current.color}`}>
            {current.tag}
          </span>
          <p className="text-xs text-gray-200 truncate font-sans">
            {current.text}
          </p>
        </div>

        {/* Right CTA button */}
        {current.actionLabel && (
          <button
            type="button"
            onClick={() => {
              if (current.gameId && onPlayGame) {
                onPlayGame(current.gameId);
              } else if (onOpenLeaderboard) {
                onOpenLeaderboard();
              }
            }}
            className="hidden md:flex items-center gap-1 px-3 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-white transition cursor-pointer shrink-0 border border-white/[0.08]"
          >
            <span>{current.actionLabel}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
};
