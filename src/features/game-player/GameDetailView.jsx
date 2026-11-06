/**
 * GameDetailView.jsx
 * หน้ารายละเอียดเกมและ Media Player สไตล์ Steam
 * - ปรับปรุงใหม่ตามคำขอ: เอา WebGL ออกจากกรอบบน เพราะมีปุ่ม "เล่นบนเว็บทันที (WebGL)" ด้านล่างแล้ว
 * - รวมรูปภาพและวิดีโอตัวอย่างไว้ใน Media Gallery เดียวกัน สลับดูผ่าน Thumbnail Slider ได้ทันที
 * - แถบ Action Bar ชัดเจน: ปุ่มสีเขียว "เล่นบนเว็บทันที (WebGL)" และปุ่มสีฟ้า "ดาวน์โหลดไฟล์ PC (.ZIP)"
 * - ระบบรีวิวให้คะแนนดาว พร้อมแท็บแจ้งบั๊กถึง Dev และโมดอลโดเนท PromptPay
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Download, 
  Heart, 
  Star, 
  Video, 
  Gamepad2, 
  ShieldCheck, 
  Bug, 
  MessageSquare, 
  CheckCircle2, 
  QrCode, 
  Coffee, 
  X, 
  Laptop, 
  Globe, 
  Send,
  Layers,
  ChevronRight,
  Eye
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';

export const GameDetailView = ({ game }) => {
  const { 
    setSelectedGameForDetail, 
    openGamePlayer, 
    downloadPcGame, 
    addReview, 
    addBugReport 
  } = useGame();
  const { currentUser } = useAuth();

  // รวบรวม Media Gallery (วิดีโอและรูปภาพรวมกัน ไม่แยกให้รกตา)
  const mediaItems = React.useMemo(() => {
    if (game.mediaGallery && game.mediaGallery.length > 0) {
      return game.mediaGallery;
    }
    // Fallback ถ้าไม่มี mediaGallery ในข้อมูลเดิม
    const list = [];
    if (game.trailerUrl) {
      list.push({
        id: 'fallback-vid',
        type: 'video',
        url: game.trailerUrl,
        thumbnail: game.thumbnail,
        title: 'วิดีโอตัวอย่างเกม (Trailer)'
      });
    }
    (game.screenshots || [game.thumbnail]).forEach((imgUrl, i) => {
      list.push({
        id: `fallback-img-${i}`,
        type: 'image',
        url: imgUrl,
        thumbnail: imgUrl,
        title: `ภาพตัวอย่าง ${i + 1}`
      });
    });
    return list;
  }, [game]);

  // สื่อปัจจุบันที่กำลังแสดงผลในจอหลัก
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const activeMedia = mediaItems[selectedMediaIndex] || mediaItems[0];

  // ตัวสลับแท็บคอมเมนต์: 'reviews' | 'bugs'
  const [activeCommunityTab, setActiveCommunityTab] = useState('reviews');

  // จัดการการรีวิว
  const [newRating, setNewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewNotice, setReviewNotice] = useState(null);

  // จัดการรายงานบั๊ก
  const [bugTitle, setBugTitle] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [bugNotice, setBugNotice] = useState(null);

  // โมดอล PromptPay QR โดเนทค่ากาแฟ
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [donateAmount, setDonateAmount] = useState(50);
  const [donateSuccess, setDonateSuccess] = useState(false);

  // ดาวน์โหลดไฟล์ PC แจ้งเตือน
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState(false);

  // ส่งรีวิว
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const res = addReview(game.id, {
      rating: newRating,
      comment: reviewComment,
      user: currentUser?.name || 'Anonymous'
    });

    setReviewNotice(res.message);
    setReviewComment('');
    setTimeout(() => setReviewNotice(null), 3500);
  };

  // ส่งรายงานบั๊ก
  const handleBugSubmit = (e) => {
    e.preventDefault();
    if (!bugTitle.trim() || !bugDescription.trim()) return;

    const res = addBugReport(game.id, {
      title: bugTitle,
      description: bugDescription,
      user: currentUser?.name || 'Anonymous'
    });

    setBugNotice(res.message);
    setBugTitle('');
    setBugDescription('');
    setTimeout(() => setBugNotice(null), 3500);
  };

  // ดาวน์โหลดไฟล์ PC
  const handleDownloadPc = () => {
    downloadPcGame(game.id);
    if (game.downloadUrl && game.downloadUrl !== '#') {
      window.open(game.downloadUrl, '_blank');
    }
    setDownloadSuccessNotice(true);
    setTimeout(() => setDownloadSuccessNotice(false), 3500);
  };

  // กดยืนยันโดเนท PromptPay
  const handleConfirmDonate = () => {
    setDonateSuccess(true);
    setTimeout(() => {
      setDonateSuccess(false);
      setIsDonateModalOpen(false);
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSelectedGameForDetail(null)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111827] hover:bg-gray-800 text-gray-300 hover:text-white text-xs font-semibold border border-gray-800 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับสู่หน้าร้านค้า (Storefront)</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-700/40 font-mono">
            {game.engine}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-gray-800 text-gray-300">
            {game.category}
          </span>
          <span className="text-gray-500 font-mono">{game.version}</span>
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-wide font-['Rajdhani',sans-serif]">
          {game.title}
        </h1>
        <p className="text-sm text-gray-400 max-w-3xl leading-relaxed">
          {game.tagline}
        </p>
      </div>

      {/* Main Steam-style Media & Sidebar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Media Showcase (วิดีโอและรูปภาพรวมกัน สไตล์ Steam แท้ๆ) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Main Display Viewer (16:9) */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-indigo-500/30 shadow-2xl">
            {activeMedia?.type === 'video' ? (
              <iframe
                src={activeMedia.url}
                title={activeMedia.title || `${game.title} Trailer`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              />
            ) : (
              <img
                src={activeMedia?.url || game.thumbnail}
                alt={activeMedia?.title || game.title}
                className="w-full h-full object-cover animate-in fade-in duration-300"
              />
            )}

            {/* Media Title Label overlay */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[11px] font-semibold text-gray-200 border border-white/10 flex items-center gap-1.5">
              {activeMedia?.type === 'video' ? (
                <>
                  <Video className="w-3.5 h-3.5 text-rose-400" />
                  <span>{activeMedia.title || 'วิดีโอตัวอย่าง'}</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{activeMedia?.title || 'ภาพสกรีนช็อต'}</span>
                </>
              )}
            </div>
          </div>

          {/* Unified Thumbnail Carousel (รวมรูปและวิดีโอไว้ที่เดียวกัน) */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {mediaItems.map((item, idx) => (
              <button
                key={item.id || idx}
                onClick={() => setSelectedMediaIndex(idx)}
                className={`relative aspect-video w-28 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedMediaIndex === idx
                    ? 'border-indigo-500 ring-2 ring-indigo-500/40 scale-105'
                    : 'border-gray-800 opacity-60 hover:opacity-100 hover:border-gray-600'
                }`}
              >
                <img
                  src={item.thumbnail || item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.type === 'video' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="p-1 rounded-full bg-rose-600 text-white">
                      <Play className="w-3.5 h-3.5 fill-white" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Dedicated Action Bar (เด็ดขาด: ปุ่มสีเขียว WebGL และปุ่มสีฟ้า PC) */}
          <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
              เลือกวิธีการเล่นเกม (Launch Options)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Green Action: เล่นบนเว็บทันที (WebGL) */}
              <button
                disabled={!game.hasWebgl}
                onClick={() => openGamePlayer(game)}
                className={`flex items-center justify-between p-4 rounded-xl font-bold transition-all shadow-lg cursor-pointer ${
                  game.hasWebgl
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-gray-950 shadow-emerald-500/20 active:scale-95'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2 rounded-lg bg-black/20 text-inherit">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-extrabold block">เล่นบนเว็บทันที (WebGL)</span>
                    <span className="text-[11px] opacity-80 block font-normal">ไม่ต้องโหลด รันได้ใน 1 วินาที 60FPS</span>
                  </div>
                </div>
                <Play className="w-5 h-5 fill-current" />
              </button>

              {/* Blue Action: ดาวน์โหลดไฟล์ PC (.ZIP) */}
              <button
                disabled={!game.hasPcDownload}
                onClick={handleDownloadPc}
                className={`flex items-center justify-between p-4 rounded-xl font-bold transition-all shadow-lg cursor-pointer ${
                  game.hasPcDownload
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-gray-950 shadow-sky-500/20 active:scale-95'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2 rounded-lg bg-black/20 text-inherit">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-extrabold block">ดาวน์โหลดไฟล์ PC (.ZIP)</span>
                    <span className="text-[11px] opacity-80 block font-normal">
                      ขนาด {game.downloadSize || '120 MB'} (Windows 64-bit)
                    </span>
                  </div>
                </div>
                <Download className="w-5 h-5" />
              </button>

            </div>

            {/* Download Toast Notification */}
            {downloadSuccessNotice && (
              <div className="p-3 rounded-xl bg-sky-950/60 border border-sky-500/40 text-sky-300 text-xs flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  <span>เริ่มการดาวน์โหลดไฟล์ {game.title} .zip สำเร็จ!</span>
                </div>
                <span className="font-mono text-[11px] text-sky-400">100% Ready</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Col: Game Info Sidebar & PromptPay Coffee Box */}
        <div className="space-y-6">
          
          {/* Main Info Card */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800 space-y-5">
            <img
              src={game.thumbnail}
              alt={game.title}
              className="w-full aspect-video rounded-xl object-cover ring-1 ring-gray-700"
            />

            <div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {game.description}
              </p>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-gray-800 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">ผู้พัฒนา:</span>
                <span className="text-indigo-400 font-bold">{game.developer}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">วันที่เผยแพร่:</span>
                <span className="text-gray-300 font-mono">{game.createdAt}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">เวอร์ชัน:</span>
                <span className="text-emerald-400 font-mono font-bold">{game.version}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">คะแนนรีวิว:</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {game.rating > 0 ? `${game.rating} (${game.ratingCount || 0} รีวิว)` : 'ยังไม่มีรีวิว'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">ยอดการเล่นออนไลน์:</span>
                <span className="text-gray-200 font-mono">{(game.playCount || 0).toLocaleString()} ครั้ง</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">ยอดดาวน์โหลด PC:</span>
                <span className="text-sky-300 font-mono">{(game.downloadCount || 0).toLocaleString()} ครั้ง</span>
              </div>
            </div>

            {/* Security Scan Result */}
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold">ระบบความปลอดภัย: ผ่านการรับรอง</p>
                <p className="text-[10px] text-gray-400">{game.securityScan?.details}</p>
              </div>
            </div>

            {/* PromptPay Donate Coffee Button */}
            <button
              onClick={() => setIsDonateModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition active:scale-95 cursor-pointer"
            >
              <Coffee className="w-4 h-4" />
              <span>☕ โดเนทสนับสนุนค่ากาแฟนักพัฒนา</span>
            </button>
          </div>

        </div>

      </div>

      {/* Community Section: Reviews & Bug Reports */}
      <section className="space-y-6 pt-6 border-t border-gray-800">
        
        {/* Tab Headers */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveCommunityTab('reviews')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeCommunityTab === 'reviews'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-[#111827] text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>รีวิวและคะแนนจากผู้เล่น ({game.reviews?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveCommunityTab('bugs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeCommunityTab === 'bugs'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                : 'bg-[#111827] text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            <Bug className="w-4 h-4" />
            <span>แจ้งบั๊ก (Bug Report) ถึงผู้พัฒนา ({game.bugReports?.length || 0})</span>
          </button>
        </div>

        {/* Tab 1: Reviews */}
        {activeCommunityTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Add Review Form */}
            <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>เขียนรีวิวให้คะแนนเกมนี้</span>
              </h3>

              {reviewNotice && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs">
                  {reviewNotice}
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1.5 font-medium">คะแนนความพึงพอใจ:</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 text-gray-600 hover:text-amber-400 transition cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-gray-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-amber-400 font-bold ml-1">{newRating} ดาว</span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-medium">ความคิดเห็นของคุณ:</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="ความรู้สึกหลังได้ทดลองเล่น แนะนำสิ่งที่ชอบหรืออยากให้เพิ่มเติม..."
                    className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-md shadow-indigo-500/20 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ส่งรีวิว</span>
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-3">
              {(!game.reviews || game.reviews.length === 0) ? (
                <div className="p-8 text-center bg-[#111827]/40 rounded-2xl border border-gray-800 text-gray-400 text-xs">
                  ยังไม่มีรีวิวสำหรับเกมนี้ มาร่วมเป็นคนแรกที่รีวิวกันเถอะ!
                </div>
              ) : (
                game.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-[#111827] border border-gray-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <strong className="text-white">{rev.user}</strong>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-gray-500 font-mono text-[10px]">{rev.date}</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Bug Reports */}
        {activeCommunityTab === 'bugs' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Bug Report Form */}
            <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bug className="w-4 h-4 text-rose-400" />
                <span>แจ้งปัญหาหรือบั๊กที่พบในเกม</span>
              </h3>

              {bugNotice && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs">
                  {bugNotice}
                </div>
              )}

              <form onSubmit={handleBugSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">หัวข้อบั๊ก (Bug Summary) *</label>
                  <input
                    type="text"
                    required
                    value={bugTitle}
                    onChange={(e) => setBugTitle(e.target.value)}
                    placeholder="เช่น เฟรมเรตตกในด่าน 2, เสียงค้าง..."
                    className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-medium">รายละเอียดขั้นตอนที่เกิดบั๊ก *</label>
                  <textarea
                    rows={3}
                    required
                    value={bugDescription}
                    onChange={(e) => setBugDescription(e.target.value)}
                    placeholder="อธิบายว่าทำอะไรอยู่ แล้วเกิดอะไรขึ้น เบราว์เซอร์ที่ใช้..."
                    className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition shadow-md shadow-rose-500/20 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ส่งรายงานบั๊กถึง Dev</span>
                </button>
              </form>
            </div>

            {/* Bug Reports List */}
            <div className="lg:col-span-2 space-y-3">
              {(!game.bugReports || game.bugReports.length === 0) ? (
                <div className="p-8 text-center bg-[#111827]/40 rounded-2xl border border-gray-800 text-gray-400 text-xs">
                  ไม่พบการแจ้งบั๊กสำหรับเวอร์ชันนี้ ระบบทำงานได้อย่างเสถียร
                </div>
              ) : (
                game.bugReports.map((bug) => (
                  <div key={bug.id} className="p-4 rounded-xl bg-[#111827] border border-gray-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <strong className="text-white">{bug.title}</strong>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          bug.status === 'fixed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : bug.status === 'investigating'
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {bug.status === 'fixed'
                            ? '✅ แก้ไขแล้ว'
                            : bug.status === 'investigating'
                            ? '🔍 กำลังตรวจสอบ'
                            : '⏳ รอตรวจสอบ'}
                        </span>
                      </div>
                      <span className="text-gray-500 font-mono text-[10px]">{bug.date}</span>
                    </div>
                    {bug.description && (
                      <p className="text-xs text-gray-400 leading-relaxed">{bug.description}</p>
                    )}
                    <span className="text-[10px] text-gray-500">รายงานโดย: {bug.user}</span>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </section>

      {/* PromptPay Coffee Donation Modal (20, 50, 100 THB) */}
      {isDonateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111827] border border-amber-500/40 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white font-['Rajdhani',sans-serif]">
                  สนับสนุนค่ากาแฟนักพัฒนาไทย
                </h3>
              </div>
              <button
                onClick={() => setIsDonateModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">เลือกจำนวนเงินสนับสนุน:</label>
              <div className="grid grid-cols-3 gap-2">
                {[20, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setDonateAmount(amt)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                      donateAmount === amt
                        ? 'bg-amber-500 text-gray-950 shadow-md shadow-amber-500/20'
                        : 'bg-[#0B0F19] text-gray-300 hover:bg-gray-800 border border-gray-800'
                    }`}
                  >
                    ฿{amt} บาท
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated PromptPay QR Box */}
            <div className="p-4 rounded-2xl bg-white text-gray-900 flex flex-col items-center justify-center space-y-2 text-center shadow-inner">
              <div className="w-10 h-6 bg-[#003B64] text-white text-[9px] font-bold rounded flex items-center justify-center">
                PromptPay
              </div>
              <QrCode className="w-40 h-40 text-gray-900" />
              <p className="text-[11px] font-mono font-bold text-gray-700">
                พร้อมเพย์: {game.promptPayNumber || '089-765-4321'}
              </p>
              <p className="text-[10px] text-gray-500">
                ผู้รับ: {game.developer}
              </p>
            </div>

            {/* Feedback / Confirm */}
            {donateSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>จำลองส่งกำลังใจสำเร็จ ฿{donateAmount} บาท! ขอบคุณครับ</span>
              </div>
            ) : (
              <button
                onClick={handleConfirmDonate}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
              >
                จำลองการสแกนจ่ายสำเร็จ (฿{donateAmount} บาท)
              </button>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
