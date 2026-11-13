/**
 * GameDetailView.jsx
 * หน้ารายละเอียดเกมและ Media Player สไตล์ Steam & itch.io
 * - ไม่แสดง WebGL ค้างด้านบนเพื่อความสะอาดตา ให้ผู้ใช้ดู Media Showcase (ภาพ/วิดีโอ) และกดปุ่ม Launch ด้านล่าง
 * - Media Gallery รวมรูปภาพและคลิปวิดีโอตัวอย่างไว้ที่เดียวกัน
 * - Action Bar: ปุ่มสีเขียว "เล่นบนเว็บทันที (WebGL)" และปุ่มสีฟ้า "ดาวน์โหลดไฟล์ PC (.ZIP)"
 * - itch.io / CrazyGames: คู่มือการควบคุมเกม (Controls Guide) แสดงปุ่มคีย์บอร์ดเสมือน
 * - Steam: ความต้องการของระบบ (System Requirements) สเปกขั้นต่ำและที่แนะนำ
 * - itch.io / Steam DevLog: ประวัติการอัปเดตแพตช์ (Patch Notes & Changelog)
 * - Wishlist (❤️ คลังเกมโปรด) และปุ่มแชร์ลิงก์เกม (Share / Copy Link)
 * - ระบบรีวิวให้คะแนนดาว, แจ้งบั๊กถึงนักพัฒนา, และโดเนทพร้อมเพย์ (PromptPay QR)
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
  Eye,
  Share2,
  Copy,
  History,
  Cpu,
  Monitor,
  Keyboard,
  Tag,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';

export const GameDetailView = ({ game }) => {
  const { 
    setSelectedGameForDetail, 
    openGamePlayer, 
    downloadPcGame, 
    addReview, 
    addBugReport,
    wishlist,
    toggleWishlist,
    setSelectedEngine
  } = useGame();
  const { currentUser } = useAuth();

  const isWishlisted = wishlist?.includes(game.id);

  // รวบรวม Media Gallery (วิดีโอและรูปภาพรวมกัน ไม่แยกให้รกตา)
  const mediaItems = React.useMemo(() => {
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

  // สื่อปัจจุบันที่กำลังแสดงผลในจอหลัก
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const activeMedia = mediaItems[selectedMediaIndex] || mediaItems[0];

  // ตัวสลับแท็บคอมเมนต์: 'reviews' | 'bugs' | 'patchNotes'
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

  // แจ้งเตือนคัดลอกลิงก์สำเร็จ
  const [copyLinkNotice, setCopyLinkNotice] = useState(false);

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

  // คัดลอกลิงก์เกม
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url);
    setCopyLinkNotice(true);
    setTimeout(() => setCopyLinkNotice(false), 3000);
  };

  // รายการปุ่มกด (Controls)
  const defaultControls = [
    { key: '[ W ][ A ][ S ][ D ] หรือ [ ลูกศร ]', action: 'ควบคุมทิศทาง / การเคลื่อนที่' },
    { key: '[ Spacebar ]', action: 'กระโดด / แอ็กชันพิเศษ' },
    { key: '[ คลิกซ้ายเมาส์ ]', action: 'เลือก / โจมตี / ตอบสนอง' }
  ];
  const controlsList = (game.controls && game.controls.length > 0) ? game.controls : defaultControls;

  // ความต้องการของระบบ (Requirements)
  const defaultRequirements = {
    os: 'Windows 10 / 11, macOS, Linux',
    browser: 'Google Chrome, Microsoft Edge, Firefox, Safari (รองรับ WebGL 2.0)',
    memory: 'RAM 2 GB ขึ้นไป (แนะนำ 4 GB สำหรับ 3D)',
    graphics: 'รองรับการเรนเดอร์ WebGL / Hardware Acceleration'
  };
  const requirements = game.requirements || defaultRequirements;

  // ประวัติแพตช์ (Patch Notes)
  const defaultPatchNotes = [
    {
      version: game.version || 'v1.0.0',
      date: game.createdAt || '2026-10-15',
      title: 'เปิดตัวเวอร์ชันแรกอย่างเป็นทางการ (Official Release)',
      details: 'เปิดให้ผู้เล่นทดสอบและเล่นฟรีผ่านเบราว์เซอร์ WebGL และดาวน์โหลดไฟล์ PC'
    }
  ];
  const patchNotesList = (game.patchNotes && game.patchNotes.length > 0) ? game.patchNotes : defaultPatchNotes;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => setSelectedGameForDetail(null)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111827] hover:bg-gray-800 text-gray-300 hover:text-white text-xs font-semibold border border-gray-800 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับสู่หน้าร้านค้า (Storefront)</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(game.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              isWishlisted
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-lg shadow-rose-500/10'
                : 'bg-[#111827] text-gray-300 border-gray-800 hover:border-rose-500/40 hover:text-rose-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
            <span>{isWishlisted ? 'อยู่ในคลังเกมโปรด' : 'เพิ่มในเกมโปรด (Wishlist)'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111827] hover:bg-gray-800 text-gray-300 hover:text-white text-xs font-semibold border border-gray-800 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-indigo-400" />
            <span>แชร์เกม</span>
          </button>

          {/* Play Type Badge */}
          {game.hasWebgl && !game.hasPcDownload && (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
              เล่นบนเว็บ WebGL
            </span>
          )}
          {!game.hasWebgl && game.hasPcDownload && (
            <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-medium">
              ดาวน์โหลด PC ({game.downloadSize || 'ZIP'})
            </span>
          )}
          {game.hasWebgl && game.hasPcDownload && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-medium">
              เว็บ + ดาวน์โหลด PC
            </span>
          )}

          {/* Category & Version Badges */}
          <span className="px-2.5 py-1 rounded-lg bg-white/[0.06] text-gray-300 border border-white/[0.08] text-xs">
            {game.category}
          </span>
          <span className="text-gray-500 font-mono text-xs">{game.version}</span>
        </div>
      </div>

      {/* Copy Link Notice */}
      {copyLinkNotice && (
        <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          <span>คัดลอกลิงก์เกมเรียบร้อยแล้ว! สามารถแชร์ให้เพื่อนเล่นได้ทันที</span>
        </div>
      )}

      {/* Header Info */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          {game.title}
        </h1>
        <p className="text-sm text-gray-400 max-w-3xl leading-relaxed">
          {game.tagline}
        </p>

        {/* Tags list */}
        {game.tags && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {game.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-white/[0.06] text-gray-300 text-[11px] font-mono border border-white/[0.06]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Steam-style Media & Sidebar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Media Showcase & Launch Options */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Main Display Viewer (16:9) */}
          <div className="space-y-2.5">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/[0.08]">
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
                  className="w-full h-full object-cover animate-in fade-in duration-200"
                />
              )}

              {/* Media Title Label overlay */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-sm text-[11px] font-medium text-gray-300 border border-white/[0.08] flex items-center gap-1.5">
                {activeMedia?.type === 'video' ? (
                  <>
                    <Video className="w-3.5 h-3.5 text-gray-400" />
                    <span>{activeMedia.title || 'วิดีโอตัวอย่าง'}</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-3.5 h-3.5 text-gray-400" />
                    <span>{activeMedia?.title || 'ภาพตัวอย่าง'}</span>
                  </>
                )}
              </div>
            </div>

            {/* Unified Thumbnail Carousel */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {mediaItems.map((item, idx) => (
                <button
                  key={item.id || idx}
                  onClick={() => setSelectedMediaIndex(idx)}
                  className={`relative aspect-video w-24 shrink-0 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                    selectedMediaIndex === idx
                      ? 'border-white/80 ring-1 ring-white/30'
                      : 'border-white/[0.08] opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="p-1 rounded-full bg-white/20 text-white">
                        <Play className="w-3 h-3 fill-white" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Dedicated Action Bar */}
          <div className="p-4 rounded-xl bg-[#111827] border border-white/[0.08] space-y-3">
            <h3 className="text-xs font-semibold text-gray-400">
              ตัวเลือกการเล่นเกม
            </h3>

            <div className={`grid gap-3 ${game.hasWebgl && game.hasPcDownload ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
              
              {/* Green Action: เล่นบนเว็บทันที (WebGL) */}
              {game.hasWebgl && (
                <button
                  onClick={() => openGamePlayer(game)}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="p-1.5 rounded bg-black/15 text-inherit">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">เล่นบนเว็บทันที (WebGL)</span>
                      <span className="text-[10px] opacity-80 block font-normal">ไม่ต้องติดตั้ง รันบนเบราว์เซอร์ 60FPS</span>
                    </div>
                  </div>
                  <Play className="w-4 h-4 fill-current" />
                </button>
              )}

              {/* White Action: ดาวน์โหลดไฟล์ PC (.ZIP) */}
              {game.hasPcDownload && (
                <button
                  onClick={handleDownloadPc}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-white hover:bg-gray-200 text-gray-950 font-semibold transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="p-1.5 rounded bg-black/10 text-inherit">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">ดาวน์โหลดไฟล์ PC (.ZIP)</span>
                      <span className="text-[10px] opacity-75 block font-normal">
                        ขนาด {game.downloadSize || '120 MB'} (Windows / PC)
                      </span>
                    </div>
                  </div>
                  <Download className="w-4 h-4" />
                </button>
              )}

            </div>

            {/* Download Toast Notification */}
            {downloadSuccessNotice && (
              <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-white/[0.08] text-gray-300 text-xs flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>เริ่มการดาวน์โหลดไฟล์ {game.title} .zip สำเร็จ</span>
                </div>
                <span className="font-mono text-[10px] text-gray-500">Ready</span>
              </div>
            )}
          </div>

          {/* Controls Guide */}
          <div className="p-4 rounded-xl bg-[#111827] border border-white/[0.08] space-y-2.5">
            <div className="flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-gray-400" />
              <h3 className="text-xs font-semibold text-gray-200">
                คู่มือการควบคุมเกม (Keybindings)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
              {controlsList.map((ctrl, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#0B0F19] border border-white/[0.06] text-xs"
                >
                  <span className="font-mono text-gray-200 bg-white/[0.08] px-2 py-0.5 rounded border border-white/[0.1] text-[11px]">
                    {ctrl.key}
                  </span>
                  <span className="text-gray-400 text-right">{ctrl.action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Requirements */}
          <div className="p-4 rounded-xl bg-[#111827] border border-white/[0.08] space-y-2.5">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-gray-400" />
              <h3 className="text-xs font-semibold text-gray-200">
                ความต้องการของระบบ (System Requirements)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-0.5">
              <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-white/[0.06] space-y-0.5">
                <span className="text-gray-500 block text-[11px]">ระบบปฏิบัติการ (OS):</span>
                <span className="text-gray-300 font-medium">{requirements.os}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-white/[0.06] space-y-0.5">
                <span className="text-gray-500 block text-[11px]">เบราว์เซอร์:</span>
                <span className="text-gray-300 font-medium">{requirements.browser}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-white/[0.06] space-y-0.5">
                <span className="text-gray-500 block text-[11px]">หน่วยความจำ (RAM):</span>
                <span className="text-gray-300 font-medium">{requirements.memory}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-white/[0.06] space-y-0.5">
                <span className="text-gray-500 block text-[11px]">การ์ดจอ:</span>
                <span className="text-gray-300 font-medium">{requirements.graphics}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: Game Info Sidebar & PromptPay Coffee Box */}
        <div className="space-y-4">
          
          {/* Main Info Card */}
          <div className="p-5 rounded-xl bg-[#111827] border border-white/[0.08] space-y-4">
            <img
              src={game.thumbnail}
              alt={game.title}
              className="w-full aspect-video rounded-lg object-cover border border-white/[0.08]"
            />

            <div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {game.description}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-white/[0.06] text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">ผู้พัฒนา:</span>
                <span className="text-gray-200 font-medium">{game.developer}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">วันที่เผยแพร่:</span>
                <span className="text-gray-400 font-mono">{game.createdAt}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">เวอร์ชัน:</span>
                <span className="text-emerald-400 font-mono">{game.version}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">คะแนนรีวิว:</span>
                <span className="text-amber-300 font-medium flex items-center gap-1 font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  {game.rating > 0 ? `${game.rating} (${game.ratingCount || 0} รีวิว)` : 'ยังไม่มีรีวิว'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">ยอดเล่นออนไลน์:</span>
                <span className="text-gray-300 font-mono">{(game.playCount || 0).toLocaleString()} ครั้ง</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">ยอดดาวน์โหลด PC:</span>
                <span className="text-gray-300 font-mono">{(game.downloadCount || 0).toLocaleString()} ครั้ง</span>
              </div>
            </div>

            {/* Security Scan Result */}
            <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <div>
                <p className="font-medium text-[11px]">ผ่านการรับรองความปลอดภัย WebGL</p>
                <p className="text-[10px] text-gray-500">{game.securityScan?.details}</p>
              </div>
            </div>

            {/* PromptPay Donate Button */}
            <button
              onClick={() => setIsDonateModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors cursor-pointer"
            >
              <Coffee className="w-4 h-4" />
              <span>สนับสนุนนักพัฒนาผ่านพร้อมเพย์</span>
            </button>
          </div>

        </div>

      </div>

      {/* Community & DevLog Section */}
      <section className="space-y-4 pt-4 border-t border-white/[0.08]">
        
        {/* Tab Headers */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveCommunityTab('reviews')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeCommunityTab === 'reviews'
                ? 'bg-white/[0.1] text-white border border-white/20'
                : 'bg-[#111827] text-gray-400 hover:text-white border border-white/[0.08]'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-300" />
            <span>รีวิว ({game.reviews?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveCommunityTab('bugs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeCommunityTab === 'bugs'
                ? 'bg-white/[0.1] text-white border border-white/20'
                : 'bg-[#111827] text-gray-400 hover:text-white border border-white/[0.08]'
            }`}
          >
            <Bug className="w-3.5 h-3.5 text-gray-400" />
            <span>รายงานบั๊ก ({game.bugReports?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveCommunityTab('patchNotes')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeCommunityTab === 'patchNotes'
                ? 'bg-white/[0.1] text-white border border-white/20'
                : 'bg-[#111827] text-gray-400 hover:text-white border border-white/[0.08]'
            }`}
          >
            <History className="w-3.5 h-3.5 text-gray-400" />
            <span>บันทึกการอัปเดต ({patchNotesList.length})</span>
          </button>
        </div>

        {/* Tab 1: Reviews */}
        {activeCommunityTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Add Review Form */}
            <div className="p-4 rounded-xl bg-[#111827] border border-white/[0.08] space-y-3.5">
              <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <span>เขียนรีวิวให้คะแนน</span>
              </h3>

              {reviewNotice && (
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
                  {reviewNotice}
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">คะแนนความพึงพอใจ:</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 text-gray-600 hover:text-amber-400 transition cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-gray-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-amber-400 font-medium ml-1 font-mono">{newRating} ดาว</span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-medium">ความคิดเห็น:</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="ความรู้สึกหลังทดลองเล่น..."
                    className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white hover:bg-gray-200 text-gray-950 font-semibold transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ส่งรีวิว</span>
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-2.5">
              {(!game.reviews || game.reviews.length === 0) ? (
                <div className="p-8 text-center bg-[#111827]/40 rounded-xl border border-white/[0.06] text-gray-500 text-xs">
                  ยังไม่มีรีวิวสำหรับเกมนี้ มาร่วมเป็นคนแรกที่รีวิว
                </div>
              ) : (
                game.reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-lg bg-[#111827] border border-white/[0.06] space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <strong className="text-white font-medium">{rev.user}</strong>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Bug Report Form */}
            <div className="p-4 rounded-xl bg-[#111827] border border-white/[0.08] space-y-3.5">
              <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                <Bug className="w-4 h-4 text-gray-400" />
                <span>แจ้งปัญหาที่พบในเกม</span>
              </h3>

              {bugNotice && (
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
                  {bugNotice}
                </div>
              )}

              <form onSubmit={handleBugSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">หัวข้อปัญหา *</label>
                  <input
                    type="text"
                    required
                    value={bugTitle}
                    onChange={(e) => setBugTitle(e.target.value)}
                    placeholder="เช่น เฟรมเรตตกในด่าน 2"
                    className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-medium">รายละเอียด *</label>
                  <textarea
                    rows={3}
                    required
                    value={bugDescription}
                    onChange={(e) => setBugDescription(e.target.value)}
                    placeholder="อธิบายขั้นตอนที่เกิดปัญหา เบราว์เซอร์ที่ใช้..."
                    className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white hover:bg-gray-200 text-gray-950 font-semibold transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ส่งรายงาน</span>
                </button>
              </form>
            </div>

            {/* Bug Reports List */}
            <div className="lg:col-span-2 space-y-2.5">
              {(!game.bugReports || game.bugReports.length === 0) ? (
                <div className="p-8 text-center bg-[#111827]/40 rounded-xl border border-white/[0.06] text-gray-500 text-xs">
                  ไม่พบการแจ้งปัญหาสำหรับเวอร์ชันนี้
                </div>
              ) : (
                game.bugReports.map((bug) => (
                  <div key={bug.id} className="p-3.5 rounded-lg bg-[#111827] border border-white/[0.06] space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <strong className="text-white font-medium">{bug.title}</strong>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          bug.status === 'fixed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : bug.status === 'investigating'
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {bug.status === 'fixed'
                            ? 'แก้ไขแล้ว'
                            : bug.status === 'investigating'
                            ? 'กำลังตรวจสอบ'
                            : 'รอดำเนินการ'}
                        </span>
                      </div>
                      <span className="text-gray-500 font-mono text-[10px]">{bug.date}</span>
                    </div>
                    {bug.description && (
                      <p className="text-xs text-gray-400 leading-relaxed">{bug.description}</p>
                    )}
                    <span className="text-[10px] text-gray-500">แจ้งโดย: {bug.user}</span>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* Tab 3: Patch Notes Timeline */}
        {activeCommunityTab === 'patchNotes' && (
          <div className="space-y-3.5">
            <div className="p-3.5 rounded-xl bg-[#111827] border border-white/[0.08] flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-gray-400" />
                  <span>ประวัติแพตช์และบันทึกการเปลี่ยนแปลง</span>
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  ติดตามการอัปเดตและการแก้ปัญหาในเกม {game.title}
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-white/[0.06] text-gray-300 border border-white/[0.08] text-xs font-mono">
                {game.version}
              </span>
            </div>

            <div className="relative border-l border-white/[0.08] ml-3.5 space-y-4 pt-1">
              {patchNotesList.map((patch, idx) => (
                <div key={idx} className="relative pl-5">
                  <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border border-black ${
                    idx === 0 ? 'bg-emerald-400' : 'bg-gray-600'
                  }`} />

                  <div className="p-3.5 rounded-xl bg-[#111827] border border-white/[0.06] space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-gray-300 font-mono text-[11px]">
                          {patch.version}
                        </span>
                        <h5 className="text-xs font-semibold text-white">{patch.title}</h5>
                      </div>
                      <span className="text-gray-500 text-[10px] font-mono">{patch.date}</span>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">
                      {patch.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>

      {/* PromptPay Coffee Donation Modal */}
      {isDonateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111827] border border-white/[0.08] rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-amber-300" />
                <h3 className="text-sm font-semibold text-white">
                  สนับสนุนนักพัฒนาไทย
                </h3>
              </div>
              <button
                onClick={() => setIsDonateModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
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
                    className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      donateAmount === amt
                        ? 'bg-white text-gray-950 font-semibold'
                        : 'bg-[#0B0F19] text-gray-300 hover:bg-gray-800 border border-white/[0.08]'
                    }`}
                  >
                    ฿{amt} บาท
                  </button>
                ))}
              </div>
            </div>

            {/* PromptPay QR Box */}
            <div className="p-4 rounded-xl bg-white text-gray-900 flex flex-col items-center justify-center space-y-2 text-center">
              <div className="w-10 h-6 bg-[#003B64] text-white text-[9px] font-bold rounded flex items-center justify-center">
                PromptPay
              </div>
              <QrCode className="w-36 h-36 text-gray-900" />
              <p className="text-[11px] font-mono font-medium text-gray-700">
                พร้อมเพย์: {game.promptPayNumber || '089-765-4321'}
              </p>
              <p className="text-[10px] text-gray-500">
                ผู้รับ: {game.developer}
              </p>
            </div>

            {/* Feedback / Confirm */}
            {donateSuccess ? (
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>จำลองส่งกำลังใจสำเร็จ ฿{donateAmount} บาท</span>
              </div>
            ) : (
              <button
                onClick={handleConfirmDonate}
                className="w-full py-2 rounded-lg bg-white hover:bg-gray-200 text-gray-950 font-semibold text-xs transition-colors cursor-pointer"
              >
                จำลองการสแกนจ่าย (฿{donateAmount} บาท)
              </button>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
