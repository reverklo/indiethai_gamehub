/**
 * GameDetailView.jsx
 * หน้ารายละเอียดเกมสไตล์ Steam Storefront (Marvel Rivals Standard)
 * - ถอดแบบโครงสร้างจาก Steam 100% ตามภาพตัวอย่างของผู้ใช้
 * - 2-Column Hero: Media Player ซ้าย (วิดีโอ/ภาพสไลด์) + สรุปข้อมูล/บทวิจารณ์/แท็ก ขวา
 * - Steam Action Bar: กล่องซื้อเกม / เล่นฟรี / ดาวน์โหลด PC / เพิ่มเข้าคลัง
 * - ระบบความต้องการของระบบ (System Requirements) ตาราง 2 คอลัมน์ ขั้นต่ำ vs แนะนำ
 * - กิจกรรมและประกาศล่าสุด (Patch Notes), เกี่ยวกับเกมนี้ (About), ลิงก์โซเชียล และบทวิจารณ์
 * - รองรับระบบ Steam Wallet & Token ซื้อเกมได้จริง
 */

import React, { useState, useMemo, useEffect } from 'react';
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
  Eye,
  Share2,
  Copy,
  History,
  Cpu,
  Monitor,
  Keyboard,
  Tag,
  Sparkles,
  ExternalLink,
  ShoppingCart,
  Coins,
  Check,
  Zap,
  HardDrive
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';

export const GameDetailView = ({ game }) => {
  const { 
    closeGameDetail, 
    openGamePlayer, 
    downloadPcGame, 
    addReview, 
    addBugReport,
    wishlist,
    toggleWishlist
  } = useGame();

  const { 
    currentUser, 
    walletBalance, 
    isGameOwned, 
    purchaseGame, 
    openTopUpModal 
  } = useAuth();

  const isWishlisted = wishlist?.includes(game.id);
  const isOwned = isGameOwned(game.id);

  // เลื่อนหน้าจอขึ้นบนสุดทันทีเมื่อเข้าสู่หน้ารายละเอียดเกม ป้องกันปัญหาหน้าจอเลื่อนค้างหรือตำแหน่งไม่ตรง
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const raf = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
    return () => cancelAnimationFrame(raf);
  }, [game?.id]);

  // รวบรวม Media Gallery สำหรับ Media Player ซ้ายบน
  const mediaItems = useMemo(() => {
    if (game.mediaGallery && game.mediaGallery.length > 0) {
      return game.mediaGallery;
    }
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

  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const activeMedia = mediaItems[selectedMediaIndex] || mediaItems[0];

  // แจ้งเตือนการสั่งซื้อ / ดาวน์โหลด / รีวิว
  const [purchaseNotice, setPurchaseNotice] = useState(null);
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState(false);
  const [copyLinkNotice, setCopyLinkNotice] = useState(false);

  // รีวิว
  const [newRating, setNewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewNotice, setReviewNotice] = useState(null);

  // บั๊ก
  const [isBugFormOpen, setIsBugFormOpen] = useState(false);
  const [bugTitle, setBugTitle] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [bugNotice, setBugNotice] = useState(null);

  // โดเนท PromptPay
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [donateSuccess, setDonateSuccess] = useState(false);

  // ฟังก์ชันกดสั่งซื้อเกม
  const handlePurchase = () => {
    const res = purchaseGame(game);
    setPurchaseNotice(res);
    setTimeout(() => setPurchaseNotice(null), 4000);
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

  // คัดลอกลิงก์เกม
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url);
    setCopyLinkNotice(true);
    setTimeout(() => setCopyLinkNotice(false), 3000);
  };

  // ส่งรีวิว
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const res = addReview(game.id, {
      rating: newRating,
      comment: reviewComment,
      user: currentUser?.name || 'Tsukiko_83'
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
      user: currentUser?.name || 'Tsukiko_83'
    });

    setBugNotice(res.message);
    setBugTitle('');
    setBugDescription('');
    setIsBugFormOpen(false);
    setTimeout(() => setBugNotice(null), 3500);
  };

  // ค่า System Requirements (สเปกขั้นต่ำและสเปกแนะนำ)
  const sysReq = game.systemRequirements || {
    minimum: {
      os: 'Windows 10 64-bit หรือ macOS 11+',
      processor: 'Intel Core i3-4160 / AMD FX-6300',
      memory: '4 GB RAM',
      graphics: 'NVIDIA GeForce GTX 660 / AMD Radeon HD 7870',
      directx: 'เวอร์ชัน 11',
      storage: '1 GB พื้นที่ว่างบนฮาร์ดไดรฟ์'
    },
    recommended: {
      os: 'Windows 10/11 64-bit',
      processor: 'Intel Core i5-8400 / AMD Ryzen 5 2600',
      memory: '8 GB RAM',
      graphics: 'NVIDIA GeForce GTX 1060 / AMD Radeon RX 580',
      directx: 'เวอร์ชัน 12',
      storage: '2 GB SSD'
    }
  };

  const defaultFeatures = [
    'เล่นบนเว็บทันที (WebGL Instant Play)',
    'ผู้เล่นคนเดียว (Single-player)',
    'รองรับจอยคอนโทรลเลอร์ (Controller Support)',
    'ความสำเร็จบนแพลตฟอร์ม (Achievements)',
    'บันทึกคะแนนออนไลน์ (Online Leaderboard)'
  ];
  const featuresList = game.featuresList || defaultFeatures;

  const defaultPatchNotes = [
    {
      version: game.version || 'v1.0.0',
      date: game.createdAt || '2026-10-15',
      title: 'อัปเดตเวอร์ชันทางการ (Official Release)',
      details: 'เปิดให้ทดลองเล่นและดาวน์โหลดเวอร์ชันสมบูรณ์ พร้อมปรับปรุงความเสถียรของ WebGL 60FPS'
    }
  ];
  const patchNotesList = (game.patchNotes && game.patchNotes.length > 0) ? game.patchNotes : defaultPatchNotes;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* ========================================================
          1. TOP BREADCRUMB & QUICK ACTIONS
         ======================================================== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <button
            onClick={closeGameDetail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-gray-200 hover:text-white transition cursor-pointer font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับหน้าร้านค้า</span>
          </button>
          <span>/</span>
          <span>เกมทั้งหมด</span>
          <span>/</span>
          <span className="text-gray-300">{game.category}</span>
          <span>/</span>
          <span className="text-white font-medium truncate max-w-[150px] sm:max-w-none">{game.title}</span>
        </div>

        {/* Right Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(game.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
              isWishlisted
                ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                : 'bg-[#111827] text-gray-300 border-white/[0.08] hover:border-rose-500/30 hover:text-rose-300'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
            <span>{isWishlisted ? 'อยู่ในสิ่งที่อยากได้' : 'สิ่งที่อยากได้'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-white/[0.06] text-gray-300 hover:text-white text-xs font-medium border border-white/[0.08] transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{copyLinkNotice ? 'คัดลอกลิงก์แล้ว!' : 'แชร์เกม'}</span>
          </button>
        </div>
      </div>

      {/* Toast Notice for Purchase / Download */}
      {purchaseNotice && (
        <div className={`p-4 rounded-xl border text-xs font-semibold shadow-2xl flex items-center justify-between animate-in slide-in-from-top-2 ${
          purchaseNotice.success 
            ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200' 
            : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
        }`}>
          <div className="flex items-center gap-2.5">
            {purchaseNotice.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <Coins className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <span>{purchaseNotice.message}</span>
          </div>

          {!purchaseNotice.success && purchaseNotice.reason === 'insufficient_funds' && (
            <button
              onClick={openTopUpModal}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs transition cursor-pointer shrink-0 ml-3"
            >
              เติมเงินเข้าวอลเล็ต
            </button>
          )}
        </div>
      )}

      {downloadSuccessNotice && (
        <div className="p-3 rounded-xl bg-sky-950/80 border border-sky-500/30 text-sky-200 text-xs font-semibold flex items-center gap-2">
          <Download className="w-4 h-4 text-sky-400 animate-bounce" />
          <span>กำลังเริ่มดาวน์โหลดไฟล์ติดตั้งเกม {game.title} สำหรับ PC (.ZIP)</span>
        </div>
      )}

      {/* ========================================================
          2. STEAM HERO SHOWCASE (ถอดแบบภาพที่ 1 เป๊ะๆ: Media ซ้าย + Info ขวา)
         ======================================================== */}
      <section className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {game.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 rounded-2xl bg-[#0f172a] border border-white/[0.08] p-4 sm:p-5 shadow-2xl">
          
          {/* Left Column (65%): Big Video / Screenshot Player & Thumbnail Carousel */}
          <div className="lg:col-span-8 space-y-3">
            {/* Active Display Screen */}
            <div className="relative aspect-video w-full rounded-xl bg-black overflow-hidden border border-white/[0.08] shadow-inner">
              {activeMedia?.type === 'video' ? (
                <iframe
                  src={activeMedia.url}
                  title={activeMedia.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={activeMedia?.url || game.thumbnail}
                  alt={activeMedia?.title || game.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Thumbnail Carousel Row (สลับดูรูป/วิดีโอแบบ Steam) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {mediaItems.map((item, idx) => {
                const isSelected = selectedMediaIndex === idx;
                return (
                  <button
                    key={item.id || idx}
                    onClick={() => setSelectedMediaIndex(idx)}
                    className={`relative w-24 sm:w-28 aspect-video rounded-lg overflow-hidden shrink-0 transition-all cursor-pointer border ${
                      isSelected
                        ? 'border-indigo-400 ring-2 ring-indigo-400/40 opacity-100 scale-102'
                        : 'border-white/[0.08] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {item.type === 'video' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Video className="w-4 h-4 text-white drop-shadow" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column (35%): Game Meta Card (ถอดแบบกล่องขวาของ Steam) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Header Image / Logo */}
              <div className="aspect-[21/9] w-full rounded-xl overflow-hidden bg-black/60 border border-white/[0.08]">
                <img
                  src={game.headerImage || game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Short Tagline / Synopsis */}
              <p className="text-xs text-gray-300 leading-relaxed">
                {game.description || game.tagline}
              </p>

              {/* Steam Review Metrics (เหมือนในภาพที่ 1) */}
              <div className="space-y-1.5 pt-2 border-t border-white/[0.06] text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">บทวิจารณ์ล่าสุด:</span>
                  <span className="font-bold text-sky-400">
                    เชิงบวกอย่างมาก ({game.ratingCount || 328})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">บทวิจารณ์ภาษาไทย:</span>
                  <span className="font-bold text-emerald-400">
                    เชิงบวก ({game.ratingCount ? Math.floor(game.ratingCount * 0.75) : 180})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">วันที่วางจำหน่าย:</span>
                  <span className="font-mono text-gray-300">{game.createdAt || '6 ธ.ค. 2026'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">ผู้พัฒนา:</span>
                  <span className="font-medium text-white">{game.developer}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">ผู้จัดจำหน่าย:</span>
                  <span className="font-medium text-white">{game.developer}</span>
                </div>
              </div>

              {/* User Popular Tags */}
              <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                <p className="text-[11px] text-gray-400">แท็กยอดนิยมจากผู้ใช้สำหรับผลิตภัณฑ์นี้:</p>
                <div className="flex flex-wrap gap-1.5">
                  {(game.tags || ['เล่นฟรี', 'อินดี้ไทย', 'WebGL', 'แอ็กชัน']).map((tag, i) => (
                    <span 
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] bg-white/[0.06] text-indigo-300 hover:text-white hover:bg-white/[0.1] border border-white/[0.08] transition cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Platform Status Badge */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-gray-400">ความปลอดภัย:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ผ่านการสแกนความปลอดภัย 100%</span>
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          3. STEAM ACTION BAR: Play / Purchase Box (ถอดแบบภาพที่ 2)
         ======================================================== */}
      <section className="rounded-2xl bg-gradient-to-r from-[#111827] via-[#161F30] to-[#111827] border border-white/[0.1] p-5 sm:p-6 shadow-xl space-y-4">
        
        {/* Box Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {isOwned ? `เล่น ${game.title}` : (game.price === 0 ? `เล่น ${game.title} (ฟรี)` : `ซื้อ ${game.title}`)}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isOwned 
                ? 'เกมนี้ได้เปิดใช้งานและผูกกับบัญชี IndieThai Hub ของคุณแล้ว'
                : (game.price === 0 ? 'เปิดให้ทดลองเล่นและดาวน์โหลดฟรีบนแพลตฟอร์ม' : 'สั่งซื้อเพื่อรับสิทธิ์เข้าเล่นและอัปเดตแพตช์ตลอดชีพ')}
            </p>
          </div>

          {/* Pricing indicator */}
          {!isOwned && (
            <div className="flex items-center gap-2">
              {game.price === 0 ? (
                <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-sm font-bold">
                  เล่นฟรี
                </span>
              ) : (
                <div className="flex items-center gap-2 bg-[#0B0F19] px-3.5 py-1.5 rounded-xl border border-white/[0.08]">
                  {game.discountPercent > 0 && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-gray-950 font-bold text-xs font-mono">
                      -{game.discountPercent}%
                    </span>
                  )}
                  <span className="text-base font-bold text-white font-mono">
                    ฿ {game.price}
                  </span>
                  {game.originalPrice > game.price && (
                    <span className="text-xs text-gray-500 line-through font-mono">
                      ฿ {game.originalPrice}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buttons Row */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
          
          {/* If Owned or Free WebGL: Play WebGL Button */}
          {(isOwned || game.price === 0) && game.hasWebgl && (
            <button
              onClick={() => openGamePlayer(game)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>เล่นเกมบนเว็บทันที (WebGL 60FPS)</span>
            </button>
          )}

          {/* If Owned or Free PC: Download PC Button */}
          {(isOwned || game.price === 0) && game.hasPcDownload && (
            <button
              onClick={handleDownloadPc}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-gray-200 text-gray-950 font-bold text-xs transition-all shadow-lg cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลดเกมสำหรับ PC (.ZIP)</span>
              <span className="text-[10px] font-mono text-gray-600">({game.downloadSize || '150 MB'})</span>
            </button>
          )}

          {/* If Not Owned and Free: Add to Library */}
          {!isOwned && game.price === 0 && (
            <button
              onClick={handlePurchase}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              <Check className="w-4 h-4" />
              <span>เพิ่มไปยังคลังเกม</span>
            </button>
          )}

          {/* If Not Owned and Paid: Buy Button */}
          {!isOwned && game.price > 0 && (
            <button
              onClick={handlePurchase}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-500/30 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>ซื้อ {game.title} — ฿ {game.price}</span>
            </button>
          )}

          {/* Developer Coffee Donation */}
          <button
            onClick={() => setIsDonateModalOpen(true)}
            className="p-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-amber-300 border border-white/[0.08] transition cursor-pointer"
            title="โดเนทค่ากาแฟให้ผู้พัฒนาผ่าน PromptPay"
          >
            <Coffee className="w-4 h-4" />
          </button>
        </div>

      </section>

      {/* ========================================================
          4. MAIN BODY: 2-Column Split (Left 70% Content + Right 30% Sidebar)
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ── Left Column (70%): Patch Notes, About Game, System Requirements, Reviews ── */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section 4.1: กิจกรรมและประกาศล่าสุด (Patch Notes & Dev Vision สไตล์ภาพที่ 2) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-400" />
                <span>กิจกรรมและประกาศล่าสุด (Events & Announcements)</span>
              </h3>
              <span className="text-xs text-gray-400 font-mono">เวอร์ชัน {game.version || 'v1.0.0'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {patchNotesList.map((patch, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl bg-[#111827] border border-white/[0.08] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300">
                      PATCH {patch.version}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">{patch.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{patch.title}</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-3">{patch.details}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4.2: เกี่ยวกับเกมนี้ (About This Game สไตล์ภาพที่ 3) */}
          <section className="space-y-4">
            <div className="border-b border-white/[0.08] pb-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                เกี่ยวกับเกมนี้ (About This Game)
              </h3>
            </div>

            {/* Rich Narrative Content */}
            <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
              <div className="aspect-[21/9] w-full rounded-xl overflow-hidden bg-black/60 border border-white/[0.08]">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <h4 className="text-sm font-bold text-white pt-2">
                สัมผัสประสบการณ์เกมอินดี้ฝีมือคนไทย
              </h4>
              <p>
                {game.description}
              </p>

              {/* Controls Guide */}
              <div className="p-4 rounded-xl bg-[#111827] border border-white/[0.08] space-y-3">
                <h5 className="text-xs font-bold text-white flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-emerald-400" />
                  <span>คู่มือการควบคุมเกม (Controls Guide)</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(game.controls || [
                    { key: '[ W ] [ A ] [ S ] [ D ]', action: 'ควบคุมทิศทาง / เคลื่อนที่' },
                    { key: '[ Spacebar ]', action: 'แอ็กชันพิเศษ / กระโดด' },
                    { key: '[ เมาส์คลิกซ้าย ]', action: 'โจมตี / โต้ตอบกับวัตถุ' }
                  ]).map((ctrl, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#0B0F19] text-[11px]">
                      <span className="font-mono text-indigo-300 font-semibold">{ctrl.key}</span>
                      <span className="text-gray-400">{ctrl.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 4.3: ความต้องการของระบบ (System Requirements ตาราง 2 คอลัมน์สไตล์ภาพที่ 4) */}
          <section className="space-y-4">
            <div className="border-b border-white/[0.08] pb-2">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sky-400" />
                <span>ความต้องการของระบบ (System Requirements)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-xl bg-[#111827] border border-white/[0.08]">
              
              {/* Minimum Specs (ขั้นต่ำ) */}
              <div className="space-y-2.5 text-xs">
                <h4 className="font-bold text-white pb-1 border-b border-white/[0.06]">
                  ขั้นต่ำ (Minimum):
                </h4>
                <div className="space-y-1.5 text-[11px] text-gray-300">
                  <p><strong className="text-gray-400">ระบบปฏิบัติการ:</strong> {sysReq.minimum?.os || 'Windows 10 64-bit'}</p>
                  <p><strong className="text-gray-400">โปรเซสเซอร์:</strong> {sysReq.minimum?.processor || 'Intel Core i3 / AMD Ryzen 3'}</p>
                  <p><strong className="text-gray-400">หน่วยความจำ:</strong> {sysReq.minimum?.memory || '4 GB RAM'}</p>
                  <p><strong className="text-gray-400">กราฟิก:</strong> {sysReq.minimum?.graphics || 'รองรับ WebGL 2.0 / GTX 660'}</p>
                  <p><strong className="text-gray-400">DirectX:</strong> {sysReq.minimum?.directx || 'เวอร์ชัน 11'}</p>
                  <p><strong className="text-gray-400">พื้นที่จัดเก็บข้อมูล:</strong> {sysReq.minimum?.storage || '500 MB พื้นที่ว่าง'}</p>
                </div>
              </div>

              {/* Recommended Specs (แนะนำ) */}
              <div className="space-y-2.5 text-xs">
                <h4 className="font-bold text-white pb-1 border-b border-white/[0.06]">
                  แนะนำ (Recommended):
                </h4>
                <div className="space-y-1.5 text-[11px] text-gray-300">
                  <p><strong className="text-gray-400">ระบบปฏิบัติการ:</strong> {sysReq.recommended?.os || 'Windows 11 64-bit'}</p>
                  <p><strong className="text-gray-400">โปรเซสเซอร์:</strong> {sysReq.recommended?.processor || 'Intel Core i5 / AMD Ryzen 5'}</p>
                  <p><strong className="text-gray-400">หน่วยความจำ:</strong> {sysReq.recommended?.memory || '8 GB RAM'}</p>
                  <p><strong className="text-gray-400">กราฟิก:</strong> {sysReq.recommended?.graphics || 'NVIDIA GTX 1060 / AMD RX 580'}</p>
                  <p><strong className="text-gray-400">DirectX:</strong> {sysReq.recommended?.directx || 'เวอร์ชัน 12'}</p>
                  <p><strong className="text-gray-400">พื้นที่จัดเก็บข้อมูล:</strong> {sysReq.recommended?.storage || '1 GB SSD'}</p>
                </div>
              </div>

            </div>
          </section>

          {/* Section 4.4: บทวิจารณ์จากผู้เล่น (User Reviews) */}
          <section className="space-y-4">
            <div className="border-b border-white/[0.08] pb-2 flex items-center justify-between">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>บทวิจารณ์จากผู้เล่น ({game.reviews ? game.reviews.length : 0})</span>
              </h3>
            </div>

            {/* Write Review Form */}
            <form onSubmit={handleReviewSubmit} className="p-4 rounded-xl bg-[#111827] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">เขียนบทวิจารณ์ของคุณ:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="cursor-pointer"
                    >
                      <Star className={`w-4 h-4 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="บอกเล่าความประทับใจของคุณต่อเกมนี้เพื่อสนับสนุนผู้พัฒนาไทย..."
                className="w-full h-20 p-3 rounded-lg bg-[#0B0F19] border border-white/[0.08] text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-400"
              />

              <div className="flex items-center justify-between">
                {reviewNotice ? (
                  <span className="text-xs text-emerald-400 font-medium">{reviewNotice}</span>
                ) : <span />}

                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>โพสต์บทวิจารณ์</span>
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-3">
              {(game.reviews || []).map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl bg-[#111827]/80 border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center">
                        {rev.user.slice(0, 1)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{rev.user}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* ── Right Column (30% Sidebar): Relevance, Features, Social Links ── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Widget 1: เกมนี้มีความเกี่ยวข้องกับคุณหรือไม่? (สไตล์ภาพที่ 2) */}
          <div className="p-5 rounded-2xl bg-[#111827] border border-white/[0.08] space-y-3 shadow-lg">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              เกมนี้มีความเกี่ยวข้องกับคุณหรือไม่?
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              เข้าสู่ระบบเพื่อดูเหตุผลที่คุณอาจชอบหรือไม่ชอบผลิตภัณฑ์นี้ตามเกมที่คุณเล่นและคำวิจารณ์ที่คุณติดตาม
            </p>

            <div className="pt-2 border-t border-white/[0.06] space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="w-4 h-4 shrink-0" />
                <span>คล้ายกับเกมในคลังของคุณ</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="w-4 h-4 shrink-0" />
                <span>ผู้เล่นทั่วไปให้คะแนนเชิงบวก</span>
              </div>
            </div>
          </div>

          {/* Widget 2: Steam Features Checklist */}
          <div className="p-5 rounded-2xl bg-[#111827] border border-white/[0.08] space-y-3 shadow-lg">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              ฟีเจอร์และคุณสมบัติ (Features)
            </h4>
            <div className="space-y-2">
              {featuresList.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                  <Gamepad2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 3: Social & Community Links (สไตล์ภาพที่ 3) */}
          <div className="p-5 rounded-2xl bg-[#111827] border border-white/[0.08] space-y-3 shadow-lg">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              ช่องทางคอมมูนิตี้ (Community Links)
            </h4>
            <div className="space-y-1.5 text-xs">
              {game.socialLinks?.discord && (
                <a 
                  href={game.socialLinks.discord} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-[#0B0F19] hover:bg-white/[0.06] text-gray-300 hover:text-white transition"
                >
                  <span>เข้าร่วม Discord ผู้พัฒนา</span>
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                </a>
              )}
              {game.socialLinks?.twitter && (
                <a 
                  href={game.socialLinks.twitter} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-[#0B0F19] hover:bg-white/[0.06] text-gray-300 hover:text-white transition"
                >
                  <span>ติดตามผ่าน X (Twitter)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                </a>
              )}
              <a 
                href={game.socialLinks?.website || 'https://indiethai.hub'} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-2 rounded-lg bg-[#0B0F19] hover:bg-white/[0.06] text-gray-300 hover:text-white transition"
              >
                <span>เยี่ยมชมเว็บไซต์ทางการ</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              </a>
            </div>
          </div>

          {/* Widget 4: Report Bug Button */}
          <div className="p-5 rounded-2xl bg-[#111827] border border-white/[0.08] space-y-3 shadow-lg">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              สนับสนุนและรายงานปัญหา
            </h4>
            <p className="text-[11px] text-gray-400">
              พบปัญหาหรือข้อบกพร่องในเกม? แจ้งทีมพัฒนาได้โดยตรง
            </p>
            
            {isBugFormOpen ? (
              <form onSubmit={handleBugSubmit} className="space-y-2 pt-2 border-t border-white/[0.06]">
                <input
                  type="text"
                  placeholder="หัวข้อปัญหา..."
                  value={bugTitle}
                  onChange={(e) => setBugTitle(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#0B0F19] border border-white/[0.08] text-xs text-white"
                />
                <textarea
                  placeholder="อธิบายขั้นตอนที่เกิดบั๊ก..."
                  value={bugDescription}
                  onChange={(e) => setBugDescription(e.target.value)}
                  className="w-full h-16 p-2 rounded-lg bg-[#0B0F19] border border-white/[0.08] text-xs text-white"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition"
                  >
                    ส่งรายงาน
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsBugFormOpen(false)}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-gray-400 text-xs"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsBugFormOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-gray-300 hover:text-white text-xs font-semibold transition"
              >
                <Bug className="w-3.5 h-3.5 text-rose-400" />
                <span>รายงานบั๊ก / ข้อบกพร่อง</span>
              </button>
            )}

            {bugNotice && (
              <p className="text-[11px] text-emerald-400 text-center font-medium">{bugNotice}</p>
            )}
          </div>

        </div>

      </div>

      {/* Donate Coffee Modal */}
      {isDonateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-2xl bg-[#0f172a] border border-white/[0.1] shadow-2xl p-6 text-center space-y-4">
            <button
              onClick={() => setIsDonateModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
              <Coffee className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white">โดเนทค่ากาแฟให้ผู้พัฒนา</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              สนับสนุนสตูดิโอ <strong>{game.developer}</strong> เพื่อเป็นกำลังใจในการพัฒนาแพตช์และเกมใหม่
            </p>

            <div className="p-3 bg-white rounded-xl inline-block shadow">
              <QrCode className="w-36 h-36 text-gray-900" />
              <p className="text-[10px] font-mono text-gray-700 mt-1 font-bold">
                {game.promptPayNumber || '089-765-4321'}
              </p>
            </div>

            <button
              onClick={() => {
                setDonateSuccess(true);
                setTimeout(() => {
                  setDonateSuccess(false);
                  setIsDonateModalOpen(false);
                }, 1500);
              }}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs transition cursor-pointer"
            >
              {donateSuccess ? 'ขอบคุณสำหรับการสนับสนุน!' : 'จำลองโอนเงินสำเร็จ'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};