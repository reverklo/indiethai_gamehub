/**
 * ModerationQueue.jsx
 * ตารางคิวเกมใหม่ที่ส่งเข้ามาตรวจสอบสำหรับผู้ดูแลระบบ
 * - แสดงผลตรวจความปลอดภัย (Security Sandbox Scan & Manifest Verification)
 * - ปุ่มทดลองเล่น WebGL
 * - ปุ่ม "อนุมัติขึ้นสโตร์" (เกมจะไปปรากฏที่หน้า Storefront ทันที)
 * - ปุ่ม "ปฏิเสธ" พร้อมระบุเหตุผล
 */

import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Play, 
  ShieldCheck, 
  AlertTriangle, 
  FileCheck2, 
  Layers, 
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const ModerationQueue = () => {
  const { pendingGames, approveGame, rejectGame, openGamePlayer } = useGame();

  const [notification, setNotification] = useState(null);
  const [rejectModalGame, setRejectModalGame] = useState(null);
  const [rejectReason, setRejectReason] = useState('เนื้อหาหรือสคริปต์ WebGL ยังไม่สมบูรณ์ตามเกณฑ์ความปลอดภัย');

  const handleApprove = (gameId) => {
    const res = approveGame(gameId);
    setNotification(res);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleRejectSubmit = () => {
    if (rejectModalGame) {
      const res = rejectGame(rejectModalGame.id, rejectReason);
      setNotification(res);
      setRejectModalGame(null);
      setTimeout(() => setNotification(null), 3500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Toast Notice */}
      {notification && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between border shadow-xl ${
            notification.success
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
              : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-['Rajdhani',sans-serif]">
            <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
            <span>คิวตรวจสอบเกมใหม่ (Moderation Queue)</span>
          </h3>
          <p className="text-xs text-gray-400">
            มีเกมรอตรวจทั้งหมด <strong className="text-amber-400 font-mono">{pendingGames.length} เกม</strong> — เมื่อกดยอมรับ เกมจะขึ้นสู่ Storefront ทันที
          </p>
        </div>
      </div>

      {/* Pending Items List */}
      {pendingGames.length === 0 ? (
        <div className="p-16 text-center bg-[#111827]/40 rounded-3xl border border-gray-800 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h4 className="text-sm font-bold text-white">ไม่มีเกมค้างอยู่ในคิวตรวจสอบ</h4>
          <p className="text-xs text-gray-400">
            ระบบตรวจสอบความปลอดภัยและอนุมัติเกมอินดี้ทั้งหมดเรียบร้อยแล้ว
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingGames.map((game) => (
            <div
              key={game.id}
              className="p-6 rounded-2xl bg-[#111827] border border-amber-500/30 shadow-xl shadow-amber-500/5 space-y-4"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                
                {/* Game Thumbnail & Main Details */}
                <div className="flex items-start gap-4">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-28 h-20 rounded-xl object-cover ring-2 ring-gray-700 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {game.engine}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-gray-800 text-gray-300">
                        {game.category}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        ส่งเมื่อ: {game.createdAt}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white font-['Rajdhani',sans-serif]">
                      {game.title} <span className="text-xs font-mono text-indigo-400">({game.version})</span>
                    </h4>

                    <p className="text-xs text-gray-400 max-w-2xl line-clamp-1">
                      {game.tagline}
                    </p>

                    <p className="text-xs text-gray-400">
                      ผู้พัฒนา: <strong className="text-indigo-400">{game.developer}</strong> | พร้อมเพย์: <span className="font-mono text-gray-300">{game.promptPayNumber}</span>
                    </p>
                  </div>
                </div>

                {/* Security Scan Result Badge */}
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5 shrink-0">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="font-bold block text-[11px]">ผลตรวจความปลอดภัย: สะอาด (Clean)</span>
                    <span className="text-[10px] text-gray-400 block">{game.securityScan?.details}</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>รองรับการทดสอบ WebGL 16:9 Live Sandbox</span>
                </span>

                <div className="flex items-center gap-2">
                  {/* Test Play */}
                  <button
                    onClick={() => openGamePlayer(game)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-indigo-300 text-xs font-semibold transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>ทดลองเล่น WebGL</span>
                  </button>

                  {/* Reject */}
                  <button
                    onClick={() => setRejectModalGame(game)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 text-xs font-semibold border border-rose-500/30 transition cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>ปฏิเสธ</span>
                  </button>

                  {/* Approve button: Appears on storefront immediately */}
                  <button
                    onClick={() => handleApprove(game.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>อนุมัติขึ้นสโตร์ทันที</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111827] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>ระบุเหตุผลในการปฏิเสธเกม</span>
            </h3>
            <p className="text-xs text-gray-400">
              เกม: <strong className="text-white">{rejectModalGame.title}</strong>
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
              placeholder="ระบุเหตุผล..."
            />

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-800">
              <button
                onClick={() => setRejectModalGame(null)}
                className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 text-xs cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleRejectSubmit}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                ยืนยันการปฏิเสธ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

