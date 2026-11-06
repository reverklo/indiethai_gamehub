/**
 * PlatformAnalytics.jsx
 * สรุปภาพรวมรายได้ Token และสถิติเกมทั้งหมดในระบบ IndieThai Hub
 * - ยอดการหมุนเวียนและรายได้ Token จากค่าธรรมเนียมลงเกม (50 Tokens / Game)
 * - สัดส่วน Game Engine ยอดนิยม (Unity, Godot, Phaser, Three.js)
 * - สถิติยอดเล่นและการดาวน์โหลดภาพรวมทั้งแพลตฟอร์ม
 */

import React from 'react';
import { 
  BarChart3, 
  Coins, 
  TrendingUp, 
  Eye, 
  Download, 
  Gamepad2, 
  Cpu, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  PieChart
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { TOKEN_COST_PER_GAME, GAME_ENGINES } from '../../data/mockData';

export const PlatformAnalytics = () => {
  const { games, approvedGames, pendingGames } = useGame();
  const { usersList } = useAuth();

  // คำนวณสถิติ
  const totalPlays = games.reduce((acc, g) => acc + (g.playCount || 0), 0);
  const totalDownloads = games.reduce((acc, g) => acc + (g.downloadCount || 0), 0);

  // รายได้ Token จากค่าธรรมเนียมส่งเกม
  const totalTokensCollected = games.length * TOKEN_COST_PER_GAME;
  const totalTokensInWallets = usersList.reduce((acc, u) => acc + (u.tokenBalance || 0), 0);

  // คำนวณสัดส่วน Engine
  const engineCounts = games.reduce((acc, g) => {
    acc[g.engine] = (acc[g.engine] || 0) + 1;
    return acc;
  }, {});

  const engineColors = {
    'Unity WebGL': 'bg-indigo-500',
    'Godot HTML5': 'bg-sky-500',
    'Phaser.js': 'bg-emerald-500',
    'Three.js / WebGL': 'bg-amber-500',
    'Unreal Web': 'bg-purple-500'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Analytics Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Token Revenue */}
        <div className="p-5 rounded-2xl bg-[#161F30] border border-amber-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">รายได้ค่าธรรมเนียม Token รวม</span>
            <Coins className="w-5 h-5 text-amber-400" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-amber-400 font-['Rajdhani',sans-serif]">
              {totalTokensCollected.toLocaleString()}
            </span>
            <span className="text-xs text-amber-300 ml-1.5 font-bold">Tokens</span>
          </div>
          <p className="text-[10px] text-gray-400">
            จาก {games.length} เกมที่ส่งเข้าระบบ ({TOKEN_COST_PER_GAME} Tokens/เกม)
          </p>
        </div>

        {/* Token in Circulation */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">เหรียญ Token ที่หมุนเวียนในระบบ</span>
            <TrendingUp className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-indigo-400 font-['Rajdhani',sans-serif]">
              {totalTokensInWallets.toLocaleString()}
            </span>
            <span className="text-xs text-indigo-300 ml-1.5 font-bold">Tokens</span>
          </div>
          <p className="text-[10px] text-gray-500">ในกระเป๋าของ Dev & ผู้ใช้ {usersList.length} ราย</p>
        </div>

        {/* Total WebGL Plays */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">ยอดการเล่นออนไลน์รวม (WebGL)</span>
            <Eye className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-emerald-400 font-['Rajdhani',sans-serif]">
              {totalPlays.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-300 ml-1.5 font-bold">เซสชัน</span>
          </div>
          <p className="text-[10px] text-gray-500">รันผ่าน 60FPS WebGL Sandbox</p>
        </div>

        {/* Total PC Downloads */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">ยอดดาวน์โหลดไฟล์ PC (.ZIP)</span>
            <Download className="w-5 h-5 text-sky-400" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-sky-400 font-['Rajdhani',sans-serif]">
              {totalDownloads.toLocaleString()}
            </span>
            <span className="text-xs text-sky-300 ml-1.5 font-bold">ครั้ง</span>
          </div>
          <p className="text-[10px] text-gray-500">ดาวน์โหลดเพื่อเล่นแบบออฟไลน์</p>
        </div>

      </div>

      {/* Middle Grid: Engine Market Share & Moderation Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Engine Distribution Card */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 font-['Rajdhani',sans-serif]">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>สัดส่วน Game Engine ยอดนิยม</span>
            </h4>
            <span className="text-xs text-gray-400 font-mono">100% Thai Dev</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(engineCounts).map(([engine, count]) => {
              const percentage = Math.round((count / games.length) * 100) || 0;
              const colorClass = engineColors[engine] || 'bg-gray-500';

              return (
                <div key={engine} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300 font-semibold">{engine}</span>
                    <span className="text-gray-400 font-mono">{count} เกม ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colorClass}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform Moderation Health & Pipeline */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 font-['Rajdhani',sans-serif]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ประสิทธิภาพการตรวจสอบความปลอดภัย</span>
            </h4>
            <span className="text-xs text-emerald-400 font-semibold">100% Pass</span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">เกมที่ได้รับการอนุมัติขึ้นสโตร์</span>
              </div>
              <span className="font-bold text-emerald-400 font-mono">{approvedGames.length} เกม</span>
            </div>

            <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-gray-300">เกมที่รอการตรวจสอบความปลอดภัย</span>
              </div>
              <span className="font-bold text-amber-400 font-mono">{pendingGames.length} เกม</span>
            </div>

            <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span className="text-gray-300">อัตราเฉลี่ยเวลาตรวจสอบเกม</span>
              </div>
              <span className="font-bold text-indigo-300 font-mono">&lt; 24 ชั่วโมง</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

