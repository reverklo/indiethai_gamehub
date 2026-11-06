/**
 * UploadGameForm.jsx
 * ฟอร์มอัปโหลดเกมหน้าเดียวสำหรับสตูดิโอนักพัฒนา
 * - ระบุชื่อ, หมวดหมู่, Engine, เบอร์พร้อมเพย์
 * - Drag & Drop โซนอัปโหลดไฟล์ WebGL .zip
 * - **ใหม่**: Media Showcase Manager ให้ Dev อัปโหลด/จัดการทั้งรูปภาพและวิดีโอตัวอย่างรวมกันได้เองอย่างอิสระ
 * - หัก 50 Tokens เมื่อกดส่ง และส่งเกมไปเข้าคิวแอดมินทันที
 */

import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileArchive, 
  Coins, 
  AlertCircle, 
  ArrowLeft, 
  PlusCircle,
  FileCheck,
  Video,
  Image as ImageIcon,
  Trash2,
  Plus,
  Play
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { GAME_CATEGORIES, GAME_ENGINES, TOKEN_COST_PER_GAME } from '../../data/mockData';

export const UploadGameForm = ({ onCancel, onSuccess }) => {
  const { currentUser, devTokenBalance, topUpTokens } = useAuth();
  const { submitNewGame } = useGame();

  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    category: 'Puzzle',
    engine: 'Unity WebGL',
    version: 'v1.0.0',
    webglUrl: 'https://play2048.co/',
    downloadUrl: 'https://github.com/gabrielecirulli/2048/archive/refs/heads/master.zip',
    downloadSize: '85 MB',
    hasWebgl: true,
    hasPcDownload: true,
    promptPayNumber: currentUser?.promptPayNumber || '089-765-4321',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
  });

  // Media Gallery ที่ Dev จัดการเอง (รวมทั้งรูปภาพและวิดีโอ)
  const [mediaList, setMediaList] = useState([
    {
      id: 'm-default-1',
      type: 'video',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80',
      title: 'วิดีโอตัวอย่างเกม (Trailer)'
    },
    {
      id: 'm-default-2',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80',
      title: 'ภาพสกรีนช็อตเกมเพลย์'
    }
  ]);

  // ช่องสำหรับเพิ่มสื่อใหม่
  const [newMediaType, setNewMediaType] = useState('image'); // 'image' | 'video'
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaTitle, setNewMediaTitle] = useState('');

  // Drag & drop file simulation
  const [uploadedZipFile, setUploadedZipFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // เพิ่มสื่อใหม่เข้ารายการ
  const handleAddMedia = () => {
    if (!newMediaUrl.trim()) return;

    const newItem = {
      id: `m-${Date.now()}`,
      type: newMediaType,
      url: newMediaUrl.trim(),
      thumbnail:
        newMediaType === 'video'
          ? 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=80'
          : newMediaUrl.trim(),
      title: newMediaTitle.trim() || (newMediaType === 'video' ? 'วิดีโอตัวอย่าง' : `ภาพตัวอย่าง ${mediaList.length + 1}`)
    };

    setMediaList((prev) => [...prev, newItem]);
    setNewMediaUrl('');
    setNewMediaTitle('');
  };

  // ลบสื่อ
  const handleRemoveMedia = (id) => {
    setMediaList((prev) => prev.filter((m) => m.id !== id));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setUploadedZipFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
      setFormData((prev) => ({
        ...prev,
        downloadSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      }));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedZipFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
      setFormData((prev) => ({
        ...prev,
        downloadSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title.trim()) {
      setFormError('กรุณาระบุชื่อเกม');
      return;
    }

    if (devTokenBalance < TOKEN_COST_PER_GAME) {
      setFormError(`ยอดเหรียญสตูดิโอของคุณไม่พอ (ต้องการ ${TOKEN_COST_PER_GAME} Tokens แต่คุณมี ${devTokenBalance} Tokens) กรุณากดเติม Token ก่อนส่งเกม`);
      return;
    }

    setIsSubmitting(true);

    const result = submitNewGame({
      ...formData,
      mediaGallery: mediaList,
      uploadedZipName: uploadedZipFile?.name
    });

    setIsSubmitting(false);

    if (result.success) {
      if (onSuccess) onSuccess(result.message);
    } else {
      setFormError(result.message);
    }
  };

  return (
    <div className="bg-[#111827] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-['Rajdhani',sans-serif]">
              ส่งเกมใหม่เข้าสู่ระบบ (Upload Game Submission)
            </h2>
            <p className="text-xs text-gray-400">
              ค่าธรรมเนียมส่งเกมเข้าคิวตรวจสอบ: <strong className="text-amber-400">{TOKEN_COST_PER_GAME} Tokens</strong>
            </p>
          </div>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ย้อนกลับ</span>
          </button>
        )}
      </div>

      {/* Wallet Token Info Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#161F30] border border-amber-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Coins className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-gray-300">
              กระเป๋าเหรียญสตูดิโอของคุณ: <strong className="text-amber-400 text-sm font-bold font-mono">{devTokenBalance} Tokens</strong>
            </p>
            <p className="text-[11px] text-gray-400">
              เมื่อกดยืนยัน ระบบจะหัก 50 Tokens และส่งเกมเข้าคิวตรวจสอบความปลอดภัยของแอดมินทันที
            </p>
          </div>
        </div>

        {devTokenBalance < TOKEN_COST_PER_GAME && (
          <button
            type="button"
            onClick={() => topUpTokens(100)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs shadow-md transition active:scale-95 cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>เติม 100 Tokens ด่วน</span>
          </button>
        )}
      </div>

      {/* Error Alert */}
      {formError && (
        <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider font-mono">
            1. ข้อมูลพื้นฐานของเกม (Basic Information)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1 font-semibold">ชื่อเกม (Game Title) *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="เช่น Cyber Ayutthaya Samurai 2099"
                className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1 font-semibold">เวอร์ชัน (Version) *</label>
              <input
                type="text"
                name="version"
                required
                value={formData.version}
                onChange={handleInputChange}
                placeholder="v1.0.0"
                className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1 font-semibold">หมวดหมู่ (Category)</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {GAME_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-1 font-semibold">Game Engine *</label>
              <select
                name="engine"
                value={formData.engine}
                onChange={handleInputChange}
                className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {GAME_ENGINES.filter((e) => e !== 'All').map((eng) => (
                  <option key={eng} value={eng}>{eng}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-1 font-semibold">คำโปรยดึงดูดใจ 1 ประโยค (Tagline) *</label>
            <input
              type="text"
              name="tagline"
              required
              value={formData.tagline}
              onChange={handleInputChange}
              placeholder="สัมผัสประสบการณ์เกมพิกเซลอาร์ตสุดตื่นเต้นสัญชาติไทย"
              className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1 font-semibold">คำอธิบายเกมอย่างละเอียด (Description)</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="อธิบายจุดเด่นของเกม, ปุ่มการควบคุม และความเป็นมาของโปรเจกต์..."
              className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: 🌟 Media Showcase Manager (รูปภาพและวิดีโอรวมกัน ให้ Dev จัดการเอง) */}
        <div className="space-y-4 pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider font-mono">
                2. จัดการรูปภาพและวิดีโอตัวอย่างเกม (Media Showcase)
              </h3>
              <p className="text-[11px] text-gray-400">
                เพิ่มทั้งรูปสกรีนช็อตและลิงก์ YouTube Trailer ไว้ด้วยกัน ระบบจะรวมเป็น Carousel ให้ผู้เล่นกดดูได้อย่างลื่นไหล
              </p>
            </div>
          </div>

          {/* Current Media List */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {mediaList.map((item, idx) => (
              <div
                key={item.id}
                className="relative aspect-video rounded-xl overflow-hidden bg-black border border-gray-700 group"
              >
                <img
                  src={item.thumbnail || item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                
                {item.type === 'video' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                    <Play className="w-5 h-5 text-rose-500 fill-rose-500" />
                  </div>
                )}

                <span className="absolute bottom-1 left-1.5 text-[9px] px-1.5 py-0.5 rounded bg-black/80 text-gray-200 truncate max-w-[85%] font-medium">
                  {item.title}
                </span>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(item.id)}
                  title="ลบรายการนี้"
                  className="absolute top-1.5 right-1.5 p-1 rounded-md bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Media Controls */}
          <div className="p-3.5 rounded-2xl bg-[#0B0F19] border border-gray-800 flex flex-col sm:flex-row items-center gap-3">
            <select
              value={newMediaType}
              onChange={(e) => setNewMediaType(e.target.value)}
              className="bg-[#111827] border border-gray-700 rounded-xl px-3 py-2 text-white font-semibold text-xs cursor-pointer shrink-0"
            >
              <option value="image">🖼️ รูปสกรีนช็อต (Image)</option>
              <option value="video">🎬 วิดีโอตัวอย่าง (YouTube Embed)</option>
            </select>

            <input
              type="url"
              value={newMediaUrl}
              onChange={(e) => setNewMediaUrl(e.target.value)}
              placeholder={newMediaType === 'video' ? 'https://www.youtube.com/embed/...' : 'https://images.unsplash.com/... หรือ URL รูปภาพ'}
              className="flex-1 bg-[#111827] border border-gray-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
            />

            <input
              type="text"
              value={newMediaTitle}
              onChange={(e) => setNewMediaTitle(e.target.value)}
              placeholder="ชื่อภาพ/วิดีโอ เช่น ฉากบอส"
              className="w-32 bg-[#111827] border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />

            <button
              type="button"
              onClick={handleAddMedia}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มสื่อ</span>
            </button>
          </div>
        </div>

        {/* Section 3: Drag & Drop WebGL Zip Upload Zone */}
        <div className="space-y-3 pt-4 border-t border-gray-800">
          <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider font-mono">
            3. ไฟล์เกม WebGL Build (.ZIP Archive)
          </h3>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              isDragging
                ? 'border-emerald-400 bg-emerald-500/10 scale-102'
                : 'border-gray-700 bg-[#0B0F19]/60 hover:border-indigo-500/60'
            }`}
          >
            {uploadedZipFile ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400">
                  <FileCheck className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-white">{uploadedZipFile.name}</p>
                <p className="text-xs text-emerald-400">ขนาดไฟล์: {uploadedZipFile.size} (พร้อมส่งตรวจสอบ)</p>
                <button
                  type="button"
                  onClick={() => setUploadedZipFile(null)}
                  className="text-xs text-rose-400 hover:underline pt-1 cursor-pointer"
                >
                  ลบและเลือกไฟล์ใหม่
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400">
                  <FileArchive className="w-8 h-8 animate-bounce" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    ลากและวางไฟล์ WebGL Build (.ZIP) ที่นี่
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    รองรับไฟล์ Unity WebGL, Godot HTML5, Phaser, หรือ Three.js Bundle (สูงสุด 500 MB)
                  </p>
                </div>
                <label className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold cursor-pointer border border-gray-700 transition">
                  <span>เลือกไฟล์จากเครื่อง</span>
                  <input
                    type="file"
                    accept=".zip,.rar,.tar"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Section 4: WebGL & PC URLs & PromptPay */}
        <div className="space-y-4 pt-4 border-t border-gray-800">
          <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider font-mono">
            4. ลิงก์เล่นเกม และช่องทางสนับสนุน (Links & Monetization)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1 font-semibold">URL เกม WebGL สำหรับ Sandbox Preview *</label>
              <input
                type="url"
                name="webglUrl"
                required
                value={formData.webglUrl}
                onChange={handleInputChange}
                placeholder="https://play2048.co/ หรือ URL โฮสต์ WebGL"
                className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1 font-semibold">เบอร์พร้อมเพย์รับการสนับสนุน (PromptPay)</label>
              <input
                type="text"
                name="promptPayNumber"
                value={formData.promptPayNumber}
                onChange={handleInputChange}
                placeholder="089-xxx-xxxx"
                className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="hasWebgl"
                checked={formData.hasWebgl}
                onChange={handleInputChange}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-gray-300">เปิดให้เล่นบนเบราว์เซอร์ทันที (WebGL 60FPS)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="hasPcDownload"
                checked={formData.hasPcDownload}
                onChange={handleInputChange}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-gray-300">เปิดให้ดาวน์โหลดไฟล์ติดตั้ง PC (.ZIP)</span>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            ระบบจะหัก <strong className="text-amber-400">{TOKEN_COST_PER_GAME} Tokens</strong> และนำเกมเข้าสู่คิวรอตรวจสอบความปลอดภัยโดยแอดมิน
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold cursor-pointer"
              >
                ยกเลิก
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting || devTokenBalance < TOKEN_COST_PER_GAME}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-indigo-600 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-indigo-500/25 transition active:scale-95 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>ส่งเกมเข้าคิวตรวจ (หัก {TOKEN_COST_PER_GAME} Tokens)</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};
