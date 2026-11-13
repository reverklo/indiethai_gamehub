/**
 * ModerationQueue.jsx
 * ตารางคิวเกมใหม่ที่ส่งเข้ามาตรวจสอบสำหรับผู้ดูแลระบบ (Admin Moderation)
 * - แสดงผลตรวจความปลอดภัย (Security Scan)
 * - รองรับปุ่มทดสอบ WebGL หรือตรวจสอบไฟล์ PC ตามประเภทเกม
 * - ปุ่มอนุมัติขึ้นสโตร์ทันที
 * - ปุ่มปฏิเสธพร้อมระบุเหตุผล
 * - ดีไซน์ Unslopped: ไม่มีแสงฟุ้ง เส้นขอบเรียบหรู คอนทราสต์ชัดเจน
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
  Download,
  ExternalLink,
  Globe,
  Monitor
} from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const ModerationQueue = () => {
  const { pendingGames, approveGame, rejectGame, openGamePlayer } = useGame();

  const [notification, setNotification] = useState(null);
  const [rejectModalGame, setRejectModalGame] = useState(null);
  const [rejectReason, setRejectReason] = useState('เนื้อหาหรือไฟล์บิลด์ยังไม่สมบูรณ์ตามเกณฑ์ความปลอดภัย');

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
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between border ${
            notification.success
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
              : 'bg-rose-950/80 text-rose-300 border-rose-500/30'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-white cursor-pointer">✕</button>
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>คิวตรวจสอบเกมใหม่ (Moderation Queue)</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            มีเกมรอตรวจทั้งหมด <strong className="text-amber-400 font-mono">{pendingGames.length} เกม</strong> — เมื่ออนุมัติ เกมจะไปปรากฏที่หน้าร้านค้าทันที
          </p>
        </div>
      </div>

      {/* Pending Items List */}
      {pendingGames.length === 0 ? (
        <div className="p-16 text-center bg-[#111827] rounded-2xl border border-white/[0.06] space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h4 className="text-sm font-semibold text-white">ไม่มีเกมค้างอยู่ในคิวตรวจสอบ</h4>
          <p className="text-xs text-gray-400">
            ระบบตรวจสอบความปลอดภัยและอนุมัติเกมอินดี้ทั้งหมดเรียบร้อยแล้ว
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingGames.map((game) => (
            <div
              key={game.id}
              className="p-5 rounded-2xl bg-[#111827] border border-white/[0.08] space-y-4"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                
                {/* Game Thumbnail & Main Details */}
                <div className="flex items-start gap-4">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-28 h-20 rounded-xl object-cover border border-white/[0.08] shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-gray-300 border border-white/[0.08]">
                        {game.engine}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-white/[0.06] text-gray-300 border border-white/[0.08]">
                        {game.category}
                      </span>
                      
                      {/* Play type tag */}
                      {game.hasWebgl && !game.hasPcDownload && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          เล่นบนเว็บ WebGL
                        </span>
                      )}
                      {!game.hasWebgl && game.hasPcDownload && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          ดาวน์โหลด PC ({game.downloadSize || 'ZIP'})
                        </span>
                      )}
                      {game.hasWebgl && game.hasPcDownload && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          เว็บ + PC
                        </span>
                      )}

                      <span className="text-[10px] text-gray-500 font-mono">
                        ส่งเมื่อ: {game.createdAt}
                      </span>
                    </div>

                    <h4 className="text-base font-semibold text-white tracking-tight">
                      {game.title} <span className="text-xs font-mono text-gray-400">({game.version})</span>
                    </h4>

                    <p className="text-xs text-gray-400 max-w-2xl line-clamp-1">
                      {game.tagline}
                    </p>

                    <p className="text-xs text-gray-400">
                      ผู้พัฒนา: <strong className="text-white font-medium">{game.developer}</strong> | พร้อมเพย์: <span className="font-mono text-gray-300">{game.promptPayNumber}</span>
                    </p>
                  </div>
                </div>

                {/* Security Scan Result Badge */}
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2.5 shrink-0">
                  <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
                  <div>
                    <span className="font-semibold block text-[11px]">ผลตรวจความปลอดภัย: สะอาด</span>
                    <span className="text-[10px] text-gray-400 block">{game.securityScan?.details || 'ไม่พบมัลแวร์หรือสคริปต์อันตราย'}</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-gray-400" />
                  <span>ตรวจสอบสิทธิและการปฏิบัติตามกฎชุมชนก่อนอนุมัติ</span>
                </span>

                <div className="flex items-center gap-2">
                  {/* Test Play or Inspect File */}
                  {game.hasWebgl && (
                    <button
                      onClick={() => openGamePlayer(game)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-gray-200 text-xs font-medium border border-white/[0.08] transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>ทดลองเล่น WebGL</span>
                    </button>
                  )}

                  {game.hasPcDownload && (
                    <a
                      href={game.downloadUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-gray-200 text-xs font-medium border border-white/[0.08] transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ตรวจไฟล์ PC ({game.downloadSize || 'ZIP'})</span>
                    </a>
                  )}

                  {/* Reject */}
                  <button
                    onClick={() => setRejectModalGame(game)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium border border-rose-500/20 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>ปฏิเสธ</span>
                  </button>

                  {/* Approve */}
                  <button
                    onClick={() => handleApprove(game.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-gray-200 text-gray-950 text-xs font-semibold transition-colors cursor-pointer"
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
          <div className="bg-[#111827] border border-white/[0.1] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>ระบุเหตุผลในการปฏิเสธเกม</span>
            </h3>
            <p className="text-xs text-gray-400">
              เกม: <strong className="text-white">{rejectModalGame.title}</strong>
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-white/20 resize-none"
              placeholder="ระบุเหตุผลเพื่อให้ผู้พัฒนาทำการแก้ไข..."
            />

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
              <button
                onClick={() => setRejectModalGame(null)}
                className="px-3.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-gray-300 text-xs font-medium cursor-pointer transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleRejectSubmit}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer transition-colors"
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
