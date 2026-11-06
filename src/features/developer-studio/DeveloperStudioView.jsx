/**
 * DeveloperStudioView.jsx
 * แดชบอร์ดสตูดิโอนักพัฒนาเกมอินดี้
 * - สรุปยอดคนเล่น, ยอดโหลด, กล่องกระเป๋าเงิน "🪙 เหรียญสตูดิโอของคุณ" พร้อมปุ่มเติม Token
 * - ตารางรายการเกมของตัวเอง พร้อมปุ่มอัปเดตเวอร์ชัน และลิงก์ทดสอบ WebGL
 * - ปุ่มสลับเปิดแบบฟอร์ม UploadGameForm
 */

import React, { useState } from 'react';
import { 
  Code2, 
  Coins, 
  PlusCircle, 
  UploadCloud, 
  Eye, 
  Download, 
  Star, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Play, 
  Edit3, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { UploadGameForm } from './UploadGameForm';
import { TOKEN_COST_PER_GAME } from '../../data/mockData';

export const DeveloperStudioView = () => {
  const { currentUser, devTokenBalance, topUpTokens } = useAuth();
  const { myDeveloperGames, updateGameVersion, openGamePlayer } = useGame();

  // ตัวควบคุมการแสดงหน้าฟอร์มอัปโหลดเกม
  const [isUploading, setIsUploading] = useState(false);

  // แจ้งเตือน Toast
  const [toastMessage, setToastMessage] = useState(null);

  // โมดอลอัปเดตเวอร์ชันเกม
  const [updateVersionGame, setUpdateVersionGame] = useState(null);
  const [newVersionInput, setNewVersionInput] = useState('');

  // คำนวณสถิติภาพรวมสตูดิโอ
  const totalPlays = myDeveloperGames.reduce((acc, g) => acc + (g.playCount || 0), 0);
  const totalDownloads = myDeveloperGames.reduce((acc, g) => acc + (g.downloadCount || 0), 0);
  const totalApproved = myDeveloperGames.filter((g) => g.status === 'approved').length;
  const totalPending = myDeveloperGames.filter((g) => g.status === 'pending').length;

  // ฟังก์ชันเติมเหรียญจำลอง
  const handleTopUp = () => {
    topUpTokens(100);
    setToastMessage(`เติมเหรียญสำเร็จ! ได้รับ +100 Tokens ยอดคงเหลือคือ ${devTokenBalance + 100} Tokens`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ฟังก์ชันส่งอัปเดตเวอร์ชัน
  const handleVersionSubmit = (e) => {
    e.preventDefault();
    if (!newVersionInput.trim() || !updateVersionGame) return;

    const res = updateGameVersion(updateVersionGame.id, newVersionInput);
    setToastMessage(res.message);
    setUpdateVersionGame(null);
    setNewVersionInput('');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // เมื่ออัปโหลดสำเร็จ
  const handleUploadSuccess = (msg) => {
    setIsUploading(false);
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-2xl animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {/* View Switch: Show Upload Form or Studio Dashboard */}
      {isUploading ? (
        <UploadGameForm
          onCancel={() => setIsUploading(false)}
          onSuccess={handleUploadSuccess}
        />
      ) : (
        <>
          {/* Studio Profile & Overview Header */}
          <section className="relative overflow-hidden rounded-3xl bg-[#111827] border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      OFFICIAL STUDIO
                    </span>
                    <span className="text-xs text-gray-400">{currentUser.studioName}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 font-['Rajdhani',sans-serif]">
                    {currentUser.name} (สตูดิโอนักพัฒนาเกม)
                  </h1>
                  <p className="text-xs text-gray-400 mt-0.5">
                    พร้อมเพย์รับการสนับสนุน: <strong className="text-gray-200 font-mono">{currentUser.promptPayNumber}</strong>
                  </p>
                </div>
              </div>

              {/* Action: Open Upload Form */}
              <button
                onClick={() => setIsUploading(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-indigo-600 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/30 transition hover:scale-105 active:scale-95 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>+ ลงเกมใหม่ (ใช้ {TOKEN_COST_PER_GAME} Tokens)</span>
              </button>

            </div>
          </section>

          {/* Metric Cards & Token Wallet Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Wallet Box: เหรียญสตูดิโอของคุณ */}
            <div className="p-5 rounded-2xl bg-[#161F30] border border-amber-500/40 flex flex-col justify-between shadow-lg shadow-amber-500/5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300 font-medium">🪙 เหรียญสตูดิโอของคุณ</span>
                <Coins className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>

              <div className="my-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-amber-400 font-['Rajdhani',sans-serif]">
                    {devTokenBalance}
                  </span>
                  <span className="text-xs text-amber-300 font-semibold">Tokens</span>
                </div>
                <p className="text-[10px] text-gray-400">
                  (ลงเกมได้อีก {Math.floor(devTokenBalance / TOKEN_COST_PER_GAME)} เกม)
                </p>
              </div>

              <button
                onClick={handleTopUp}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>เติม Token จำลอง (+100)</span>
              </button>
            </div>

            {/* 2. Total Plays */}
            <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">ยอดคนเล่นรวมทั้งหมด</span>
                <Eye className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="my-2">
                <span className="text-3xl font-black text-white font-['Rajdhani',sans-serif]">
                  {totalPlays.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-400 ml-1.5 font-semibold">ครั้ง</span>
              </div>
              <p className="text-[10px] text-gray-500">ผ่าน WebGL 60FPS Sandbox</p>
            </div>

            {/* 3. Total Downloads */}
            <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">ยอดดาวน์โหลด PC (.ZIP)</span>
                <Download className="w-5 h-5 text-sky-400" />
              </div>
              <div className="my-2">
                <span className="text-3xl font-black text-white font-['Rajdhani',sans-serif]">
                  {totalDownloads.toLocaleString()}
                </span>
                <span className="text-xs text-sky-400 ml-1.5 font-semibold">ครั้ง</span>
              </div>
              <p className="text-[10px] text-gray-500">เวอร์ชันสำหรับ PC ออฟไลน์</p>
            </div>

            {/* 4. Games Status Overview */}
            <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">สถานะเกมทั้งหมด</span>
                <Code2 className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="my-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold">ออนไลน์:</span>
                  <span className="text-white font-bold">{totalApproved} เกม</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-semibold">รออนุมัติ:</span>
                  <span className="text-white font-bold">{totalPending} เกม</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-500">รวมในสังกัด {myDeveloperGames.length} เกม</p>
            </div>

          </div>

          {/* Table of Developer's Own Games */}
          <section className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 font-['Rajdhani',sans-serif]">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>ตารางรายการเกมของสตูดิโอ (My Games Portfolio)</span>
              </h2>
              <span className="text-xs text-gray-400">
                คลิกปุ่มอัปเดตเวอร์ชันเพื่อปรับปรุงแพตช์เกม
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-[#111827]">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#0B0F19] text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-800">
                  <tr>
                    <th className="px-5 py-3.5">เกม</th>
                    <th className="px-4 py-3.5">Engine</th>
                    <th className="px-4 py-3.5">เวอร์ชันปัจจุบัน</th>
                    <th className="px-4 py-3.5">สถานะ</th>
                    <th className="px-4 py-3.5">ยอดคนเล่น</th>
                    <th className="px-4 py-3.5">ยอดโหลด PC</th>
                    <th className="px-5 py-3.5 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/80">
                  {myDeveloperGames.map((game) => (
                    <tr key={game.id} className="hover:bg-gray-800/40 transition">
                      
                      {/* Title & Thumbnail */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={game.thumbnail}
                            alt={game.title}
                            className="w-12 h-9 rounded-lg object-cover ring-1 ring-gray-700"
                          />
                          <div>
                            <p className="font-bold text-white line-clamp-1">{game.title}</p>
                            <span className="text-[10px] text-gray-400">{game.category}</span>
                          </div>
                        </div>
                      </td>

                      {/* Engine */}
                      <td className="px-4 py-4">
                        <span className="px-2 py-0.5 rounded-md bg-gray-800 text-indigo-400 font-mono text-[11px]">
                          {game.engine}
                        </span>
                      </td>

                      {/* Current Version */}
                      <td className="px-4 py-4">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-300 font-mono text-[11px] border border-indigo-700/40">
                          {game.version}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        {game.status === 'approved' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            อนุมัติแล้ว
                          </span>
                        )}
                        {game.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                            <Clock className="w-3 h-3" />
                            รอตรวจ
                          </span>
                        )}
                        {game.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            <XCircle className="w-3 h-3" />
                            ปฏิเสธ
                          </span>
                        )}
                      </td>

                      {/* Plays */}
                      <td className="px-4 py-4 font-mono">
                        {game.playCount.toLocaleString()}
                      </td>

                      {/* Downloads */}
                      <td className="px-4 py-4 font-mono text-sky-400">
                        {game.downloadCount.toLocaleString()}
                      </td>

                      {/* Action Buttons: Update Version & Test Play */}
                      <td className="px-5 py-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setUpdateVersionGame(game);
                            setNewVersionInput(game.version);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-indigo-600 hover:text-white text-gray-300 text-xs font-semibold transition cursor-pointer"
                        >
                          อัปเดตเวอร์ชัน
                        </button>

                        <button
                          onClick={() => openGamePlayer(game)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-gray-950 text-xs font-bold transition cursor-pointer"
                        >
                          ทดสอบ WebGL
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Update Version Modal */}
          {updateVersionGame && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
              <div className="bg-[#111827] border border-indigo-500/40 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
                <h3 className="text-base font-bold text-white flex items-center gap-2 font-['Rajdhani',sans-serif]">
                  <Edit3 className="w-4 h-4 text-indigo-400" />
                  <span>อัปเดตเวอร์ชันเกม</span>
                </h3>

                <p className="text-xs text-gray-400">
                  เกม: <strong className="text-white">{updateVersionGame.title}</strong>
                </p>

                <form onSubmit={handleVersionSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">เลขเวอร์ชันใหม่ (เช่น v1.1.0, v2.0-beta):</label>
                    <input
                      type="text"
                      required
                      value={newVersionInput}
                      onChange={(e) => setNewVersionInput(e.target.value)}
                      placeholder="v1.1.0"
                      className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => setUpdateVersionGame(null)}
                      className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
                    >
                      บันทึกเวอร์ชัน
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};

