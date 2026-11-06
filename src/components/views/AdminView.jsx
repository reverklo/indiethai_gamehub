import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Play, 
  AlertTriangle, 
  Layers, 
  Gamepad2, 
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';

export const AdminView = () => {
  const { currentUser } = useAuth();
  const { 
    games, 
    pendingGames, 
    approvedGames, 
    approveGame, 
    rejectGame, 
    deleteGame, 
    openGamePlayer,
    resetToDefaultGames 
  } = useGame();

  const [notification, setNotification] = useState(null);
  const [rejectModalGame, setRejectModalGame] = useState(null);
  const [rejectReason, setRejectReason] = useState('เนื้อหาหรือไฟล์ WebGL ยังไม่พร้อมสำหรับการเผยแพร่');

  const handleApprove = (gameId) => {
    const res = approveGame(gameId);
    setNotification(res);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRejectSubmit = () => {
    if (rejectModalGame) {
      const res = rejectGame(rejectModalGame.id, rejectReason);
      setNotification(res);
      setRejectModalGame(null);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDelete = (gameId) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบเกมนี้ออกจากระบบ?')) {
      deleteGame(gameId);
      setNotification({ success: true, message: 'ลบเกมออกจากระบบสำเร็จ' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Admin Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/40 via-[#111827] to-[#111827] border border-rose-500/40 p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  ADMIN CONSOLE
                </span>
                <span className="text-xs text-gray-400">IndieThai Hub Security & Review</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 font-['Rajdhani',sans-serif]">
                ระบบตรวจสอบและอนุมัติเกมอินดี้
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                ตรวจสอบความถูกต้อง ปลอดภัย และทดสอบเล่น WebGL Build ก่อนอนุมัติขึ้นสู่หน้าแรก
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (confirm('คืนค่าข้อมูลเกมเริ่มต้นทั้งหมดใช่หรือไม่?')) {
                resetToDefaultGames();
                setNotification({ success: true, message: 'รีเซ็ตข้อมูลเกมกลับสู่ค่าเริ่มต้นเรียบร้อย' });
              }
            }}
            className="text-xs px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition"
          >
            รีเซ็ต Mock Data เกมทั้งหมด
          </button>
        </div>
      </section>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-gray-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">รอการตรวจสอบ (Pending)</p>
            <p className="text-3xl font-black text-amber-400 font-['Rajdhani',sans-serif] mt-1">
              {pendingGames.length}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">อนุมัติแล้ว (Approved)</p>
            <p className="text-3xl font-black text-emerald-400 font-['Rajdhani',sans-serif] mt-1">
              {approvedGames.length}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">เกมทั้งหมดในระบบ</p>
            <p className="text-3xl font-black text-indigo-400 font-['Rajdhani',sans-serif] mt-1">
              {games.length}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in duration-200 border ${
            notification.success
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
              : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Pending Games Queue (Priority) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-['Rajdhani',sans-serif]">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>คิวเกมรออนุมัติ ({pendingGames.length} รายการ)</span>
          </h2>
          <span className="text-xs text-amber-400">
            ต้องกดทดสอบเล่น WebGL ก่อนอนุมัติ
          </span>
        </div>

        {pendingGames.length === 0 ? (
          <div className="text-center py-12 bg-[#111827]/40 rounded-2xl border border-gray-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300 font-semibold">ไม่มีเกมค้างอยู่ในคิวตรวจสอบ</p>
            <p className="text-xs text-gray-500 mt-1">ทุกเกมได้รับการตรวจสอบและอนุมัติเรียบร้อยแล้ว</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingGames.map((game) => (
              <div
                key={game.id}
                className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-5 bg-[#111827] rounded-2xl border border-amber-500/30 hover:border-amber-500/50 transition-all shadow-lg shadow-amber-500/5"
              >
                {/* Game Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-24 h-16 rounded-xl object-cover ring-2 ring-gray-700 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {game.engine}
                      </span>
                      <span className="text-xs text-gray-400">หมวดหมู่: {game.category}</span>
                      <span className="text-[10px] text-gray-500 font-mono">วันที่ส่ง: {game.createdAt}</span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-1 font-['Rajdhani',sans-serif]">
                      {game.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-1">
                      {game.tagline}
                    </p>
                    <p className="text-xs text-indigo-400 mt-0.5">
                      ผู้พัฒนา: <strong>{game.developer}</strong> | พร้อมเพย์: {game.promptPayNumber}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                  {/* Test Play Button */}
                  <button
                    onClick={() => openGamePlayer(game)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-indigo-300 text-xs font-semibold transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>ทดลองเล่น WebGL</span>
                  </button>

                  {/* Reject Button */}
                  <button
                    onClick={() => setRejectModalGame(game)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 text-xs font-semibold border border-rose-500/30 transition"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>ปฏิเสธ</span>
                  </button>

                  {/* Approve Button */}
                  <button
                    onClick={() => handleApprove(game.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>อนุมัติเกม (Approve)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* All Games Management Table */}
      <section className="space-y-4 pt-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 font-['Rajdhani',sans-serif]">
          <Layers className="w-5 h-5 text-indigo-400" />
          <span>รายชื่อเกมทั้งหมดในแพลตฟอร์ม</span>
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-[#111827]">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#0B0F19] text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-800">
              <tr>
                <th className="px-4 py-3">ชื่อเกม</th>
                <th className="px-4 py-3">ผู้พัฒนา</th>
                <th className="px-4 py-3">Engine</th>
                <th className="px-4 py-3">สถานะ</th>
                <th className="px-4 py-3">ยอดเล่น</th>
                <th className="px-4 py-3 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80">
              {games.map((game) => (
                <tr key={game.id} className="hover:bg-gray-800/30 transition">
                  <td className="px-4 py-3.5 font-medium text-white flex items-center gap-2">
                    <img src={game.thumbnail} className="w-8 h-8 rounded-lg object-cover" />
                    <span>{game.title}</span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-400">{game.developer}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded bg-gray-800 text-indigo-400 font-mono">
                      {game.engine}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {game.status === 'approved' && (
                      <span className="text-emerald-400 font-semibold">● Approved</span>
                    )}
                    {game.status === 'pending' && (
                      <span className="text-amber-400 font-semibold animate-pulse">● Pending</span>
                    )}
                    {game.status === 'rejected' && (
                      <span className="text-rose-400 font-semibold">● Rejected</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 font-mono">{game.playCount.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => openGamePlayer(game)}
                      className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-indigo-300"
                    >
                      เล่น
                    </button>
                    <button
                      onClick={() => handleDelete(game.id)}
                      className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reject Modal */}
      {rejectModalGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111827] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>ระบุเหตุผลในการปฏิเสธเกม</span>
            </h3>
            <p className="text-xs text-gray-400">
              เกม: <strong>{rejectModalGame.title}</strong>
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
              placeholder="ระบุเหตุผล เช่น ลิงก์ WebGL ใช้งานไม่ได้ หรือไฟล์มีปัญหา..."
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectModalGame(null)}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleRejectSubmit}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
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

