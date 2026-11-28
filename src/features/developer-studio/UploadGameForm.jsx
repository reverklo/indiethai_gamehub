/**
 * UploadGameForm.jsx
 * ฟอร์มอัปโหลดเกมสำหรับสตูดิโอนักพัฒนา (สไตล์ itch.io & Steam Direct)
 * - กำหนดรูปแบบโปรเจกต์ (Kind of Project): เล่นบนเว็บ (WebGL) | ดาวน์โหลด PC | ทั้งสองแบบ
 * - ซ่อน/แสดงฟิลด์ตามประเภทที่เลือกอย่างชาญฉลาด (Dynamic Context-Aware Form)
 * - ระบุสถานะการพัฒนา (Release Status: Released / Early Access / Prototype Jam)
 * - จัดการรูปภาพและวิดีโอตัวอย่างรวมกันได้อิสระ (Media Showcase)
 * - ดีไซน์แบบ Unslopped: ผิวสัมผัสเรียบหรู ไม่เรืองแสง เส้นขอบบาง 4px กริด
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
  Play,
  Globe,
  Monitor,
  Layers,
  Sparkles,
  HardDrive,
  Cpu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { GAME_CATEGORIES } from '../../data/mockData';
import { DropzoneUploader } from '../../components/common/DropzoneUploader';
import { uploadGameBuild, uploadGameMedia } from '../../services/storageService';

export const UploadGameForm = ({ onCancel, onSuccess }) => {
  const { currentUser } = useAuth();
  const { submitNewGame } = useGame();

  // 1. รูปแบบโปรเจกต์: 'webgl' (เล่นบนเว็บ) | 'pc' (ดาวน์โหลด PC) | 'both' (มีทั้งสองแบบ)
  const [kindOfProject, setKindOfProject] = useState('webgl');

  // 2. ข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    category: 'Puzzle',
    engine: 'Unity WebGL',
    version: 'v1.0.0',
    releaseStatus: 'released', // 'released' | 'early_access' | 'prototype'
    pricingType: 'free', // 'free' | 'paid'
    price: 99,
    webglUrl: 'https://play2048.co/',
    webglResolution: '16:9 (1280x720)',
    downloadUrl: 'https://github.com/gabrielecirulli/2048/archive/refs/heads/master.zip',
    downloadSize: '45 MB',
    supportedOs: 'Windows 10 / 11 64-bit',
    minCpu: 'Intel Core i3 / AMD Ryzen 3',
    minRam: '4 GB',
    minGpu: 'GTX 1050 หรือเทียบเท่า',
    minStorage: '500 MB',
    recOs: 'Windows 11 64-bit',
    recCpu: 'Intel Core i5 / AMD Ryzen 5',
    recRam: '8 GB',
    recGpu: 'NVIDIA GTX 1060 / AMD RX 580',
    recStorage: '1 GB SSD',
    discordUrl: 'https://discord.gg/indiethai',
    twitterUrl: 'https://twitter.com',
    websiteUrl: '',
    promptPayNumber: currentUser?.promptPayNumber || '089-765-4321',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
  });

  // Media Gallery (รวมรูปภาพและวิดีโอ)
  const [mediaList, setMediaList] = useState([
    {
      id: 'm-default-1',
      type: 'video',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
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

  // สื่อใหม่ที่กำลังจะเพิ่ม
  const [newMediaType, setNewMediaType] = useState('image'); // 'image' | 'video'
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaTitle, setNewMediaTitle] = useState('');

  // Drag & drop file
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

  const handleAddMedia = () => {
    if (!newMediaUrl.trim()) return;

    const newItem = {
      id: `m-${Date.now()}`,
      type: newMediaType,
      url: newMediaUrl.trim(),
      thumbnail:
        newMediaType === 'video'
          ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
          : newMediaUrl.trim(),
      title: newMediaTitle.trim() || (newMediaType === 'video' ? 'วิดีโอตัวอย่าง' : `ภาพตัวอย่าง ${mediaList.length + 1}`)
    };

    setMediaList((prev) => [...prev, newItem]);
    setNewMediaUrl('');
    setNewMediaTitle('');
  };

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

    setIsSubmitting(true);

    const hasWebgl = kindOfProject === 'webgl' || kindOfProject === 'both';
    const hasPcDownload = kindOfProject === 'pc' || kindOfProject === 'both';
    const price = formData.pricingType === 'paid' ? (Number(formData.price) || 99) : 0;

    const result = submitNewGame({
      ...formData,
      price,
      originalPrice: price,
      discountPercent: 0,
      kindOfProject,
      hasWebgl,
      hasPcDownload,
      systemRequirements: {
        minimum: {
          os: formData.supportedOs || 'Windows 10 64-bit',
          processor: formData.minCpu || 'Intel Core i3 / AMD Ryzen 3',
          memory: `${formData.minRam} RAM`,
          graphics: formData.minGpu || 'NVIDIA GTX 750 / AMD Radeon',
          directx: 'เวอร์ชัน 11',
          storage: `${formData.minStorage} พื้นที่ว่าง`
        },
        recommended: {
          os: formData.recOs || 'Windows 11 64-bit',
          processor: formData.recCpu || 'Intel Core i5 / AMD Ryzen 5',
          memory: `${formData.recRam} RAM`,
          graphics: formData.recGpu || 'NVIDIA GTX 1060 / AMD RX 580',
          directx: 'เวอร์ชัน 12',
          storage: `${formData.recStorage}`
        }
      },
      socialLinks: {
        discord: formData.discordUrl,
        twitter: formData.twitterUrl,
        website: formData.websiteUrl || 'https://indiethai.hub'
      },
      requirements: hasPcDownload ? {
        os: formData.supportedOs,
        browser: hasWebgl ? 'Chrome, Edge, Firefox, Safari (รองรับ WebGL 2.0)' : 'ไม่ต้องใช้เบราว์เซอร์ (รันบนเครื่อง PC)',
        memory: `RAM ${formData.minRam} ขึ้นไป`,
        graphics: formData.minGpu
      } : {
        os: 'ทุกระบบปฏิบัติการ (Windows, macOS, Linux, ChromeOS)',
        browser: 'Google Chrome, Microsoft Edge, Firefox, Safari (WebGL 2.0)',
        memory: 'RAM 2 GB ขึ้นไป',
        graphics: 'Hardware Acceleration / WebGL'
      },
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
    <div className="bg-[#111827] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            ส่งเกมใหม่เข้าสู่ระบบ (Create New Game)
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            ระบุรูปแบบเกม ข้อมูลเบื้องต้น และไฟล์เกมสำหรับเข้าคิวตรวจสอบความปลอดภัย (ส่งเกมฟรี ไม่มีค่าธรรมเนียม)
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-gray-300 hover:text-white text-xs font-medium border border-white/[0.08] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ย้อนกลับ</span>
          </button>
        )}
      </div>

      {/* Error Alert */}
      {formError && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8 text-xs">
        
        {/* Section 1: 🌟 รูปแบบโปรเจกต์ (Kind of Project - เหมือน itch.io) */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-white block">
              1. รูปแบบการเล่นและการเผยแพร่ (Kind of Project) *
            </label>
            <p className="text-[11px] text-gray-400 mt-0.5">
              เลือกรูปแบบที่ตรงกับเกมของคุณ เพื่อให้ระบบเปิดเฉพาะช่องข้อมูลที่เกี่ยวข้อง ไม่เกะกะ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Option 1: WebGL Only */}
            <div
              onClick={() => setKindOfProject('webgl')}
              className={`p-4 rounded-xl border transition-colors cursor-pointer space-y-2 ${
                kindOfProject === 'webgl'
                  ? 'bg-white/[0.08] border-white/40 text-white'
                  : 'bg-[#0B0F19] border-white/[0.06] text-gray-400 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <Globe className={`w-5 h-5 ${kindOfProject === 'webgl' ? 'text-emerald-400' : 'text-gray-500'}`} />
                <span className={`w-2.5 h-2.5 rounded-full ${kindOfProject === 'webgl' ? 'bg-emerald-400 ring-4 ring-emerald-400/20' : 'border border-gray-600'}`} />
              </div>
              <div>
                <strong className="text-xs block text-white font-medium">เล่นผ่านเว็บเท่านั้น (WebGL)</strong>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                  รันบนเบราว์เซอร์ได้ทันที เหมาะกับเกม Game Jam, HTML5, Phaser หรือ Three.js
                </p>
              </div>
            </div>

            {/* Option 2: PC Download Only */}
            <div
              onClick={() => setKindOfProject('pc')}
              className={`p-4 rounded-xl border transition-colors cursor-pointer space-y-2 ${
                kindOfProject === 'pc'
                  ? 'bg-white/[0.08] border-white/40 text-white'
                  : 'bg-[#0B0F19] border-white/[0.06] text-gray-400 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <Monitor className={`w-5 h-5 ${kindOfProject === 'pc' ? 'text-sky-400' : 'text-gray-500'}`} />
                <span className={`w-2.5 h-2.5 rounded-full ${kindOfProject === 'pc' ? 'bg-sky-400 ring-4 ring-sky-400/20' : 'border border-gray-600'}`} />
              </div>
              <div>
                <strong className="text-xs block text-white font-medium">ดาวน์โหลดลงเครื่อง PC (PC Only)</strong>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                  ไฟล์เกมสำหรับติดตั้งบน PC เหมาะกับเกมกราฟิกสูง Unreal Engine หรือ Unity ตัวเต็ม
                </p>
              </div>
            </div>

            {/* Option 3: Both (Hybrid) */}
            <div
              onClick={() => setKindOfProject('both')}
              className={`p-4 rounded-xl border transition-colors cursor-pointer space-y-2 ${
                kindOfProject === 'both'
                  ? 'bg-white/[0.08] border-white/40 text-white'
                  : 'bg-[#0B0F19] border-white/[0.06] text-gray-400 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <Layers className={`w-5 h-5 ${kindOfProject === 'both' ? 'text-amber-400' : 'text-gray-500'}`} />
                <span className={`w-2.5 h-2.5 rounded-full ${kindOfProject === 'both' ? 'bg-amber-400 ring-4 ring-amber-400/20' : 'border border-gray-600'}`} />
              </div>
              <div>
                <strong className="text-xs block text-white font-medium">มีทั้ง 2 แบบ (Hybrid)</strong>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                  มีตัวทดลองเล่นบนเว็บ และมีตัวเกมเต็มให้ดาวน์โหลดลงเครื่อง PC
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: ข้อมูลพื้นฐานและสถานะเกม (Basic Info & Release Status) */}
        <div className="space-y-4 pt-6 border-t border-white/[0.06]">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            2. ข้อมูลทั่วไปของเกม (Basic Information)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1 font-medium">ชื่อเกม (Game Title) *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="เช่น Cyber Ayutthaya 2088"
                className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-white/20"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1 font-medium">เวอร์ชัน (Version) *</label>
              <input
                type="text"
                name="version"
                required
                value={formData.version}
                onChange={handleInputChange}
                placeholder="v1.0.0"
                className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3.5 py-2 text-white font-mono focus:outline-none focus:border-white/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1 font-medium">หมวดหมู่แนวเกม (Genre / Category) *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-white/20 cursor-pointer"
              >
                {GAME_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Release Status Selector (สไตล์ itch.io & Steam) */}
            <div>
              <label className="block text-gray-300 mb-1 font-medium">สถานะการพัฒนา (Release State) *</label>
              <select
                name="releaseStatus"
                value={formData.releaseStatus}
                onChange={handleInputChange}
                className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-white/20 cursor-pointer"
              >
                <option value="released">Released (เกมเวอร์ชันเต็ม)</option>
                <option value="early_access">In Development (Early Access)</option>
                <option value="prototype">Prototype / Game Jam (ตัวทดลอง)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-1 font-medium">คำโปรย 1 ประโยค (Tagline) *</label>
            <input
              type="text"
              name="tagline"
              required
              value={formData.tagline}
              onChange={handleInputChange}
              placeholder="เกมไซเบอร์พังก์พิกเซลอาร์ตรวมร่างตัวเลขสัญชาติไทย"
              className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-white/20"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1 font-medium">รายละเอียดเกมและวิธีเล่น (Description)</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="อธิบายจุดเด่นของเกม, ปุ่มการควบคุม (Controls) และความเป็นมาของโปรเจกต์..."
              className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg p-3 text-white focus:outline-none focus:border-white/20 leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Section 2.5: การตั้งราคาและการจัดจำหน่าย (Steam Pricing & Monetization) */}
        <div className="space-y-4 pt-6 border-t border-white/[0.06]">
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              3. การตั้งราคาและการจัดจำหน่าย (Steam Pricing & Monetization) *
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              เลือกว่าต้องการเปิดให้เล่นฟรี หรือจำหน่ายเป็นเหรียญ Tokens (1 Token = 1 บาท)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => setFormData((p) => ({ ...p, pricingType: 'free' }))}
              className={`p-4 rounded-xl border transition cursor-pointer space-y-1.5 ${
                formData.pricingType === 'free'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                  : 'bg-[#0B0F19] border-white/[0.06] text-gray-400 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-400">🟢 เปิดให้เล่นฟรี (Free to Play)</span>
                <span className={`w-2.5 h-2.5 rounded-full ${formData.pricingType === 'free' ? 'bg-emerald-400 ring-4 ring-emerald-400/20' : 'border border-gray-600'}`} />
              </div>
              <p className="text-[11px] text-gray-400">
                ผู้เล่นทุกคนสามารถกดเล่นผ่านเว็บ WebGL หรือดาวน์โหลด PC ได้ทันทีโดยไม่เสียค่าใช้จ่าย
              </p>
            </div>

            <div
              onClick={() => setFormData((p) => ({ ...p, pricingType: 'paid' }))}
              className={`p-4 rounded-xl border transition cursor-pointer space-y-1.5 ${
                formData.pricingType === 'paid'
                  ? 'bg-indigo-500/10 border-indigo-500/40 text-white'
                  : 'bg-[#0B0F19] border-white/[0.06] text-gray-400 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-indigo-400">🏷️ จำหน่ายแบบคิดเงิน (Paid Game)</span>
                <span className={`w-2.5 h-2.5 rounded-full ${formData.pricingType === 'paid' ? 'bg-indigo-400 ring-4 ring-indigo-400/20' : 'border border-gray-600'}`} />
              </div>
              <p className="text-[11px] text-gray-400">
                ผู้เล่นต้องชำระเหรียญ Tokens จาก Steam Wallet เพื่อปลดล็อกและเพิ่มเข้าสู่คลังเกม
              </p>
            </div>
          </div>

          {formData.pricingType === 'paid' && (
            <div className="p-4 rounded-xl bg-[#0B0F19] border border-indigo-500/30 space-y-3 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1 font-medium">ราคาเกม (Tokens / บาท) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="เช่น 99, 149, 199"
                    className="w-full bg-[#111827] border border-white/[0.08] rounded-lg px-3.5 py-2 text-white font-mono font-bold text-sm focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div className="flex flex-col justify-center text-xs space-y-1 p-2.5 rounded-lg bg-[#161F30] border border-white/[0.06]">
                  <div className="flex justify-between text-gray-300">
                    <span>ส่วนแบ่งผู้พัฒนา (85%):</span>
                    <strong className="text-emerald-400 font-mono text-sm">
                      +{Math.floor((Number(formData.price) || 0) * 0.85)} Tokens / ขาย
                    </strong>
                  </div>
                  <div className="flex justify-between text-gray-500 text-[10px]">
                    <span>ค่าธรรมเนียมแพลตฟอร์ม (15%):</span>
                    <span className="font-mono">
                      {Math.ceil((Number(formData.price) || 0) * 0.15)} Tokens
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: สื่อภาพและวิดีโอ (Media Showcase Manager) */}
        <div className="space-y-4 pt-6 border-t border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                3. ภาพหน้าปกเกมและสื่อตัวอย่าง (Media Showcase) *
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                อัปโหลดภาพหน้าปกสำหรับแสดงบนหน้าร้านค้า และเพิ่มภาพสกรีนช็อต/วิดีโอตัวอย่าง
              </p>
            </div>
          </div>

          {/* 3A: Game Poster / Thumbnail Cover Uploader */}
          <div className="space-y-2 p-4 rounded-xl bg-[#0B0F19] border border-white/[0.06]">
            <label className="block text-xs font-semibold text-gray-200">
              ภาพหน้าปกเกม (Game Poster / Store Capsule Art) *
            </label>
            <DropzoneUploader
              label="ลากไฟล์ภาพหน้าปกมาวางที่นี่ หรือคลิกเพื่ออัปโหลดขึ้น Cloud"
              sublabel="รองรับ .png, .jpg, .webp อัตราส่วน 16:9 ขนาดไม่เกิน 15 MB"
              accept="image/*"
              type="image"
              currentUrl={formData.thumbnail}
              uploadFn={uploadGameMedia}
              onUploadComplete={(res) => {
                if (res.url) {
                  setFormData((prev) => ({ ...prev, thumbnail: res.url }));
                }
              }}
            />
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-gray-500 font-mono">หรือระบุ URL รูปภาพ:</span>
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleInputChange}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 bg-[#111827] border border-white/[0.08] rounded-md px-2.5 py-1 text-white text-[11px] font-mono focus:outline-none focus:border-white/20"
              />
            </div>
          </div>

          {/* Current Media List */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-300">
              ภาพสกรีนช็อตและวิดีโอตัวอย่าง (Screenshots & Trailers):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {mediaList.map((item) => (
              <div
                key={item.id}
                className="relative aspect-video rounded-lg overflow-hidden bg-black border border-white/[0.08] group"
              >
                <img
                  src={item.thumbnail || item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                
                {item.type === 'video' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                )}

                <span className="absolute bottom-1 left-1.5 text-[9px] px-1.5 py-0.5 rounded bg-black/80 text-gray-200 truncate max-w-[85%] font-medium">
                  {item.title}
                </span>

                <button
                  type="button"
                  onClick={() => handleRemoveMedia(item.id)}
                  title="ลบรายการนี้"
                  className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/80 hover:bg-rose-500/80 text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            </div>
          </div>

          {/* Add New Media Controls */}
          <div className="p-3 rounded-xl bg-[#0B0F19] border border-white/[0.06] flex flex-col sm:flex-row items-center gap-2.5">
            <select
              value={newMediaType}
              onChange={(e) => setNewMediaType(e.target.value)}
              className="bg-[#111827] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-white text-xs cursor-pointer shrink-0"
            >
              <option value="image">รูปภาพ (Image)</option>
              <option value="video">วิดีโอ YouTube (Trailer)</option>
            </select>

            <input
              type="url"
              value={newMediaUrl}
              onChange={(e) => setNewMediaUrl(e.target.value)}
              placeholder={newMediaType === 'video' ? 'https://www.youtube.com/embed/...' : 'URL รูปภาพสกรีนช็อต...'}
              className="flex-1 bg-[#111827] border border-white/[0.08] rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-white/20"
            />

            <input
              type="text"
              value={newMediaTitle}
              onChange={(e) => setNewMediaTitle(e.target.value)}
              placeholder="ชื่อภาพ/คลิป"
              className="w-full sm:w-28 bg-[#111827] border border-white/[0.08] rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-white/20"
            />

            <button
              type="button"
              onClick={handleAddMedia}
              className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-white font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มสื่อ</span>
            </button>
          </div>
        </div>

        {/* Section 4A: ถ้าเป็น WebGL (แสดงเฉพาะเมื่อเลือก WebGL หรือ Both) */}
        {(kindOfProject === 'webgl' || kindOfProject === 'both') && (
          <div className="space-y-4 pt-6 border-t border-white/[0.06] animate-in fade-in">
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>4. การตั้งค่า WebGL / Browser Player</span>
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                ระบุ URL โฮสต์หรืออัปโหลดไฟล์ WebGL .zip เพื่อให้ผู้เล่นเปิดเล่นบนเบราว์เซอร์ได้ทันที
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-1 font-medium">URL เกม WebGL สำหรับ Sandbox *</label>
                <input
                  type="url"
                  name="webglUrl"
                  required={kindOfProject === 'webgl' || kindOfProject === 'both'}
                  value={formData.webglUrl}
                  onChange={handleInputChange}
                  placeholder="https://play2048.co/ หรือ URL ของ WebGL index.html"
                  className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3.5 py-2 text-white font-mono focus:outline-none focus:border-white/20"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">สัดส่วนหน้าจอ (Aspect Ratio)</label>
                <select
                  name="webglResolution"
                  value={formData.webglResolution}
                  onChange={handleInputChange}
                  className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-white/20 cursor-pointer"
                >
                  <option value="16:9 (1280x720)">16:9 (1280x720 Widescreen)</option>
                  <option value="16:9 (1920x1080)">16:9 (1920x1080 Full HD)</option>
                  <option value="4:3 (800x600)">4:3 (800x600 Retro)</option>
                  <option value="1:1 (Square)">1:1 (Square / Puzzle)</option>
                </select>
              </div>
            </div>

            {/* Cloud Drag & Drop WebGL Zip Zone */}
            <div className="space-y-2">
              <label className="block text-gray-300 font-medium">
                อัปโหลดไฟล์ WebGL Build (.ZIP) ขึ้น Cloud Storage *
              </label>
              <DropzoneUploader
                label="ลากและวางไฟล์ WebGL Build (.ZIP) ที่นี่เพื่ออัปโหลดขึ้น Cloud"
                sublabel="รองรับ Unity WebGL, Godot HTML5, Phaser หรือ Three.js (.zip, .rar) ขนาดสูงสุด 500 MB"
                accept=".zip,.rar,.tar"
                type="archive"
                uploadFn={uploadGameBuild}
                onUploadComplete={(res) => {
                  if (res.url) {
                    setUploadedZipFile({ name: res.fileName, size: res.formattedSize });
                    setFormData((prev) => ({
                      ...prev,
                      downloadSize: res.formattedSize,
                      webglUrl: prev.webglUrl || res.url
                    }));
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Section 4B: ถ้าเป็น PC Download (แสดงเฉพาะเมื่อเลือก PC หรือ Both) */}
        {(kindOfProject === 'pc' || kindOfProject === 'both') && (
          <div className="space-y-4 pt-6 border-t border-white/[0.06] animate-in fade-in">
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Monitor className="w-4 h-4 text-sky-400" />
                <span>{kindOfProject === 'both' ? '5. ไฟล์ดาวน์โหลด PC และสเปกคอม' : '4. ไฟล์ดาวน์โหลด PC และสเปกคอมพิวเตอร์'}</span>
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                อัปโหลดไฟล์ติดตั้ง PC (.ZIP / .EXE) ขึ้น Cloud หรือระบุลิงก์ภายนอก
              </p>
            </div>

            {/* Cloud Drag & Drop PC Game Build */}
            <div className="space-y-2">
              <label className="block text-gray-300 font-medium">
                อัปโหลดบิลด์เกม PC (.ZIP / .EXE / .RAR) *
              </label>
              <DropzoneUploader
                label="ลากไฟล์บิลด์เกม PC (.ZIP / Installer) มาวางที่นี่ หรือคลิกเพื่ออัปโหลด"
                sublabel="รองรับไฟล์ .zip, .rar, .7z, .exe ขนาดสูงสุด 500 MB ระบบจะสร้าง URL ดาวน์โหลดให้อัตโนมัติ"
                accept=".zip,.rar,.7z,.exe"
                type="archive"
                uploadFn={uploadGameBuild}
                onUploadComplete={(res) => {
                  if (res.url) {
                    setUploadedZipFile({ name: res.fileName, size: res.formattedSize });
                    setFormData((prev) => ({
                      ...prev,
                      downloadUrl: res.url,
                      downloadSize: res.formattedSize
                    }));
                  }
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-1 font-medium">ลิงก์ดาวน์โหลดไฟล์เกม PC (.ZIP / Installer) *</label>
                <input
                  type="url"
                  name="downloadUrl"
                  required={kindOfProject === 'pc' || kindOfProject === 'both'}
                  value={formData.downloadUrl}
                  onChange={handleInputChange}
                  placeholder="https://... ลิงก์ดาวน์โหลดไฟล์จาก Cloud"
                  className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3.5 py-2 text-white font-mono focus:outline-none focus:border-white/20"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">ขนาดไฟล์โดยประมาณ *</label>
                <input
                  type="text"
                  name="downloadSize"
                  required={kindOfProject === 'pc' || kindOfProject === 'both'}
                  value={formData.downloadSize}
                  onChange={handleInputChange}
                  placeholder="เช่น 85 MB, 1.2 GB"
                  className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3.5 py-2 text-white font-mono focus:outline-none focus:border-white/20"
                />
              </div>
            </div>

            {/* System Requirements Grid */}
            <div className="p-4 rounded-xl bg-[#0B0F19] border border-white/[0.06] space-y-3">
              <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-gray-400" />
                <span>สเปกคอมพิวเตอร์ขั้นต่ำ (System Requirements)</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">ระบบปฏิบัติการ (OS)</label>
                  <input
                    type="text"
                    name="supportedOs"
                    value={formData.supportedOs}
                    onChange={handleInputChange}
                    placeholder="Windows 10 / 11 64-bit"
                    className="w-full bg-[#111827] border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">หน่วยความจำ (RAM)</label>
                  <input
                    type="text"
                    name="minRam"
                    value={formData.minRam}
                    onChange={handleInputChange}
                    placeholder="4 GB"
                    className="w-full bg-[#111827] border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">การ์ดจอ (Graphics)</label>
                  <input
                    type="text"
                    name="minGpu"
                    value={formData.minGpu}
                    onChange={handleInputChange}
                    placeholder="GTX 1050 หรือเทียบเท่า"
                    className="w-full bg-[#111827] border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section: ช่องทางคอมมูนิตี้และโซเชียลมีเดีย */}
        <div className="space-y-4 pt-6 border-t border-white/[0.06]">
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              ช่องทางคอมมูนิตี้และโซเชียล (Community Links)
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              ลิงก์ให้ผู้เล่นกดติดตามข่าวสารหรือเข้าร่วม Discord สตูดิโอของคุณ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-gray-300 mb-1 font-medium">Discord Server Link</label>
              <input
                type="text"
                name="discordUrl"
                value={formData.discordUrl}
                onChange={handleInputChange}
                placeholder="https://discord.gg/your-studio"
                className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] text-gray-300 mb-1 font-medium">X (Twitter) หรือ Facebook</label>
              <input
                type="text"
                name="twitterUrl"
                value={formData.twitterUrl}
                onChange={handleInputChange}
                placeholder="https://x.com/your-studio"
                className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] text-gray-300 mb-1 font-medium">Official Website</label>
              <input
                type="text"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleInputChange}
                placeholder="https://your-studio.com"
                className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 5: การสนับสนุน (Monetization PromptPay) */}
        <div className="space-y-3 pt-6 border-t border-white/[0.06]">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            {kindOfProject === 'both' ? '6. การรับเงินสนับสนุน (PromptPay)' : '5. การรับเงินสนับสนุน (PromptPay)'}
          </h3>

          <div className="max-w-md">
            <label className="block text-gray-300 mb-1 font-medium">เบอร์พร้อมเพย์รับการสนับสนุน (PromptPay QR)</label>
            <input
              type="text"
              name="promptPayNumber"
              value={formData.promptPayNumber}
              onChange={handleInputChange}
              placeholder="089-xxx-xxxx"
              className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3.5 py-2 text-white font-mono focus:outline-none focus:border-white/20"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              ผู้เล่นสามารถสแกน QR Code โดเนทสนับสนุนค่ากาแฟให้คุณได้โดยตรง ไม่หักส่วนแบ่ง
            </p>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            ส่งเกมเข้าคิวตรวจสอบความปลอดภัยฟรี ไม่มีค่าธรรมเนียม
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-gray-300 hover:text-white font-medium cursor-pointer transition-colors"
              >
                ยกเลิก
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-white hover:bg-gray-200 text-gray-950 font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>ส่งเกมเข้าคิวตรวจ</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};
