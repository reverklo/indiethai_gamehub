import React, { useState } from 'react';
import { 
  Code2, 
  Coins, 
  PlusCircle, 
  UploadCloud, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  Play,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { GAME_CATEGORIES, GAME_ENGINES, TOKEN_COST_PER_GAME } from '../../data/mockData';

export const DeveloperView = () => {
  const { currentUser, devTokenBalance, topUpTokens } = useAuth();
  const { myDeveloperGames, submitNewGame, openGamePlayer } = useGame();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    category: 'Puzzle',
    engine: 'Unity WebGL',
    webglUrl: 'https://play2048.co/',
    promptPayNumber: currentUser.promptPayNumber || '089-765-4321',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
  });

  const [notification, setNotification] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('กรุณากรอกชื่อเกม');
      return;
    }

    const result = submitNewGame(formData);
    setNotification(result);

    if (result.success) {
      setIsSubmitModalOpen(false);
      // Reset form
      setFormData({
        title: '',
        tagline: '',
        description: '',
        category: 'Puzzle',
        engine: 'Unity WebGL',
        webglUrl: 'https://play2048.co/',
        promptPayNumber: currentUser.promptPayNumber || '089-765-4321',
        thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
      });
    }

    setTimeout(() => setNotification(null), 4000);
  };

  const handleTopUp = () => {
    const result = topUpTokens(100);
    setNotification({
      success: true,
      message: `เติมเหรียญจำลองสำเร็จ! ได้รับ +100 Tokens ยอดคงเหลือคือ ${devTokenBalance + 100} Tokens`
    });
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Dev Header & Overview Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#111827] border border-indigo-500/30 p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  VERIFIED DEVELOPER
                </span>
                <span className="text-xs text-gray-400">{currentUser.studioName}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 font-['Rajdhani',sans-serif]">
                ยินดีต้อนรับ, {currentUser.name}
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                จัดการเกม WebGL, ส่งเกมเข้าคิวตรวจสอบ และรับเงินสนับสนุนผ่านพร้อมเพย์
              </p>
            </div>
          </div>

          {/* Token Balance Card */}
          <div className="flex items-center gap-4 bg-[#161F30] border border-amber-500/40 p-4 rounded-2xl shadow-lg w-full lg:w-auto justify-between lg:justify-start">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/20 text-[#F59E0B]">
                <Coins className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <p className="text-xs text-gray-400">ยอดเหรียญสำหรับลงเกม</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-amber-400 font-['Rajdhani',sans-serif]">
                    {devTokenBalance}
                  </span>
                  <span className="text-xs text-amber-300 font-semibold">Tokens</span>
                </div>
                <p className="text-[10px] text-gray-400">
                  (ลงเกมใหม่ได้ {Math.floor(devTokenBalance / TOKEN_COST_PER_GAME)} เกม | ใช้ {TOKEN_COST_PER_GAME} Tokens/เกม)
                </p>
              </div>
            </div>

            <button
              onClick={handleTopUp}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>เติมเหรียญ</span>
            </button>
          </div>

        </div>
      </section>

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
            {notification.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Developer Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-['Rajdhani',sans-serif]">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <span>เกมในสังกัดของคุณ (My Published & Pending Games)</span>
          </h2>
          <p className="text-xs text-gray-400">
            ระบบจะหัก 50 Tokens ต่อการลงเกม 1 ครั้ง และส่งเข้าคิวรอ Admin ตรวจสอบ
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-indigo-600 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
        >
          <UploadCloud className="w-4 h-4" />
          <span>ลงเกมใหม่ (ใช้ 50 Tokens)</span>
        </button>
      </div>

      {/* Developer Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myDeveloperGames.map((game) => (
          <div
            key={game.id}
            className="flex flex-col bg-[#111827] rounded-2xl border border-gray-800 overflow-hidden hover:border-gray-700 transition"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
              <img
                src={game.thumbnail}
                alt={game.title}
                className="w-full h-full object-cover"
              />
              
              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                {game.status === 'approved' && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/90 text-gray-950 backdrop-blur-sm shadow-md">
                    <CheckCircle2 className="w-3 h-3" />
                    อนุมัติแล้ว (ออนไลน์)
                  </span>
                )}
                {game.status === 'pending' && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/90 text-gray-950 backdrop-blur-sm shadow-md animate-pulse">
                    <Clock className="w-3 h-3" />
                    รอ Admin ตรวจสอบ
                  </span>
                )}
                {game.status === 'rejected' && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/90 text-white backdrop-blur-sm shadow-md">
                    <XCircle className="w-3 h-3" />
                    ปฏิเสธ
                  </span>
                )}
              </div>

              <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/70 text-indigo-400">
                {game.engine}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-base font-bold text-white font-['Rajdhani',sans-serif]">
                  {game.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                  {game.tagline}
                </p>
                {game.rejectReason && (
                  <p className="text-[11px] text-rose-400 mt-2 bg-rose-950/40 p-2 rounded-lg border border-rose-800/40">
                    เหตุผลที่ปฏิเสธ: {game.rejectReason}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-xs">
                <span className="text-gray-400">
                  เล่นแล้ว: <strong className="text-emerald-400">{game.playCount.toLocaleString()}</strong>
                </span>

                <button
                  onClick={() => openGamePlayer(game)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-indigo-300 text-xs font-semibold transition"
                >
                  <Play className="w-3 h-3" />
                  <span>ทดสอบเล่น WebGL</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit New Game Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111827] border border-indigo-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white font-['Rajdhani',sans-serif]">
                  ลงเกมอินดี้ใหม่เข้าสู่ระบบ (Submit WebGL Game)
                </h3>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Token Fee Alert */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                <span>ค่าธรรมเนียมลงเกม: <strong>{TOKEN_COST_PER_GAME} Tokens</strong> (ยอดของคุณมี {devTokenBalance} Tokens)</span>
              </div>
              {devTokenBalance < TOKEN_COST_PER_GAME && (
                <button
                  type="button"
                  onClick={handleTopUp}
                  className="px-2 py-1 rounded bg-amber-500 text-gray-950 font-bold text-[10px]"
                >
                  + เติมเหรียญทันที
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-medium mb-1">ชื่อเกม (Game Title) *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="เช่น พระอภัยมณี Cyber 2099"
                  className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-medium mb-1">หมวดหมู่ (Category)</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    {GAME_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">Game Engine</label>
                  <select
                    name="engine"
                    value={formData.engine}
                    onChange={handleInputChange}
                    className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    {GAME_ENGINES.filter((e) => e !== 'All').map((eng) => (
                      <option key={eng} value={eng}>{eng}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">คำโปรยสั้น (Tagline)</label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  placeholder="สโลแกนเกมที่น่าดึงดูด 1 ประโยค"
                  className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">URL เกม WebGL / HTML5 ที่เล่นได้จริง *</label>
                <input
                  type="url"
                  name="webglUrl"
                  required
                  value={formData.webglUrl}
                  onChange={handleInputChange}
                  placeholder="https://play2048.co/ หรือ URL โฮสต์ WebGL ของคุณ"
                  className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">เบอร์พร้อมเพย์รับการสนับสนุน (PromptPay)</label>
                <input
                  type="text"
                  name="promptPayNumber"
                  value={formData.promptPayNumber}
                  onChange={handleInputChange}
                  placeholder="089-xxx-xxxx"
                  className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={devTokenBalance < TOKEN_COST_PER_GAME}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-indigo-600 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-indigo-500/20"
                >
                  ยืนยันส่งเกม (หัก {TOKEN_COST_PER_GAME} Tokens)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

