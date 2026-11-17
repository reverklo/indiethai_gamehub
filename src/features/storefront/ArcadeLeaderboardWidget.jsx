/**
 * ArcadeLeaderboardWidget.jsx
 * หอเกียรติยศและตารางคะแนนสูงสุด (Live Arcade Hall of Fame & Leaderboard)
 * - ดึงดูดให้ผู้เล่นแข่งขันทำคะแนนในเกม WebGL (เช่น 2048 Cyber Siam)
 * - แสดง Top 5 ผู้เล่นยอดเยี่ยม พร้อมเหรียญรางวัลและระดับผู้เล่น
 * - มีปุ่ม "ท้าชิงสถิติ (เล่นทันที)" และ "แชร์อันดับไป Social"
 */

import React, { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Play, 
  Share2, 
  Check, 
  Flame, 
  Users, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const ArcadeLeaderboardWidget = ({ onPlayGame, gameTitle = '2048 Cyber Siam' }) => {
  const [copied, setCopied] = useState(false);

  const leaderboardData = [
    { rank: 1, user: 'Tsukiko_83', score: '32,768', badge: '👑 Cyber Legend', time: '12 นาทีที่แล้ว', isMe: false },
    { rank: 2, user: 'SiamPixel_Dev', score: '16,384', badge: '⚡ Dev Grandmaster', time: '1 ชม. ที่แล้ว', isMe: false },
    { rank: 3, user: 'NeonKrit_TH', score: '8,192', badge: '🎯 Arcade Pro', time: '3 ชม. ที่แล้ว', isMe: false },
    { rank: 4, user: 'AyutthayaNinja', score: '4,096', badge: '🎮 Challenger', time: 'วันนี้', isMe: false },
    { rank: 5, user: 'RetroPlayer01', score: '2,048', badge: '🕹️ Novice', time: 'วันนี้', isMe: false }
  ];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0c1222] border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/[0.06] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>หอเกียรติยศนักเล่นเกมไทย (Hall of Fame)</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold">
                WEEKLY TOP
              </span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              การจัดอันดับคะแนนสูงสุดประจำสัปดาห์ในเกม <strong className="text-gray-200">{gameTitle}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="apple-press flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-gray-300 hover:text-white transition cursor-pointer border border-white/[0.08]"
            title="คัดลอกลิงก์เพื่อชวนเพื่อนมาแข่ง"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'คัดลอกลิงก์แล้ว!' : 'แชร์กระดานคะแนน'}</span>
          </button>

          <button
            type="button"
            onClick={() => onPlayGame && onPlayGame('game-1')}
            className="apple-press flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-xs transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-gray-950" />
            <span>ท้าชิงสถิติ (เล่นเลย)</span>
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="mt-4 divide-y divide-white/[0.04]">
        {leaderboardData.map((row) => (
          <div
            key={row.rank}
            className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-white/[0.03] transition-colors"
          >
            <div className="flex items-center gap-3.5">
              {/* Rank Icon */}
              <div className="w-7 text-center">
                {row.rank === 1 && (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/40">
                    1
                  </span>
                )}
                {row.rank === 2 && (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-400/20 text-slate-300 font-bold text-xs border border-slate-400/40">
                    2
                  </span>
                )}
                {row.rank === 3 && (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-500 font-bold text-xs border border-amber-700/40">
                    3
                  </span>
                )}
                {row.rank > 3 && (
                  <span className="text-xs font-mono font-bold text-gray-500">
                    #{row.rank}
                  </span>
                )}
              </div>

              {/* Player Info */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white hover:text-amber-300 cursor-pointer transition">
                    {row.user}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {row.badge}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">{row.time}</p>
              </div>
            </div>

            {/* Score */}
            <div className="text-right">
              <div className="text-sm font-bold font-mono text-amber-400">
                {row.score} <span className="text-[10px] text-gray-400 font-sans">PTS</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-mono">Verified WebGL</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-gray-400">
        <div className="flex items-center gap-2">
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>คะแนนจะรีเซ็ตทุกวันจันทร์ เวลา 00:00 น. ผู้ชนะอันดับ 1 รับเหรียญ Hall of Fame Badge</span>
        </div>
        <span className="font-mono text-gray-500">Real-time Leaderboard</span>
      </div>
    </div>
  );
};
