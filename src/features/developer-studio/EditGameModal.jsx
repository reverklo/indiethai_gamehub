/**
 * EditGameModal.jsx
 * หน้าต่างสำหรับผู้พัฒนา: แก้ไขข้อมูลเกมแบบครบวงจรและปล่อยแพตช์อัปเดตเวอร์ชันใหม่
 * - ปรับปรุงข้อมูลหน้าร้าน: ชื่อเกม, คำโปรย, รายละเอียด, แนวเกม, ราคา Tokens/ฟรี
 * - ปล่อยแพตช์ใหม่: อัปเดตเลขเวอร์ชัน, ใส่ Changelog, เปลี่ยน URL ไฟล์ WebGL หรือไฟล์ PC .ZIP
 * - อัปเดตสเปกความต้องการระบบ (System Requirements) และลิงก์โซเชียล
 */

import React, { useState } from 'react';
import { 
  X, 
  History, 
  FileEdit, 
  Cpu, 
  Coins, 
  Globe, 
  Monitor, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Tag,
  Save,
  Layers
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { GAME_CATEGORIES } from '../../data/mockData';

export const EditGameModal = ({ game, onClose, onSaveSuccess }) => {
  const { editGameDetails } = useGame();

  const [activeTab, setActiveTab] = useState('patch'); // 'patch' | 'store' | 'specs'

  // ข้อมูลที่แก้ไขได้
  const [formData, setFormData] = useState({
    title: game.title || '',
    tagline: game.tagline || '',
    description: game.description || '',
    category: game.category || 'Puzzle',
    releaseStatus: game.releaseStatus || 'released',
    pricingType: game.price > 0 ? 'paid' : 'free',
    price: game.price || 0,
    webglUrl: game.webglUrl || '',
    downloadUrl: game.downloadUrl || '',
    downloadSize: game.downloadSize || '50 MB',
    hasWebgl: Boolean(game.hasWebgl),
    hasPcDownload: Boolean(game.hasPcDownload),
    version: game.version || 'v1.0.0',
    newPatchTitle: '',
    newPatchDetails: '',
    promptPayNumber: game.promptPayNumber || '089-765-4321',
    // System specs
    minOs: game.systemRequirements?.minimum?.os || 'Windows 10 64-bit',
    minCpu: game.systemRequirements?.minimum?.processor || 'Intel Core i3 / AMD Ryzen 3',
    minRam: game.systemRequirements?.minimum?.memory || '4 GB RAM',
    minGpu: game.systemRequirements?.minimum?.graphics || 'NVIDIA GTX 750 / AMD Radeon',
    minStorage: game.systemRequirements?.minimum?.storage || '500 MB พื้นที่ว่าง',
    recOs: game.systemRequirements?.recommended?.os || 'Windows 11 64-bit',
    recCpu: game.systemRequirements?.recommended?.processor || 'Intel Core i5 / AMD Ryzen 5',
    recRam: game.systemRequirements?.recommended?.memory || '8 GB RAM',
    recGpu: game.systemRequirements?.recommended?.graphics || 'NVIDIA GTX 1060 / AMD RX 580',
    recStorage: game.systemRequirements?.recommended?.storage || '1 GB SSD',
    // Social
    discordUrl: game.socialLinks?.discord || '',
    twitterUrl: game.socialLinks?.twitter || '',
    websiteUrl: game.socialLinks?.website || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedPrice = formData.pricingType === 'paid' ? (Number(formData.price) || 0) : 0;

    const updatedPayload = {
      title: formData.title,
      tagline: formData.tagline,
      description: formData.description,
      category: formData.category,
      releaseStatus: formData.releaseStatus,
      price: updatedPrice,
      originalPrice: updatedPrice,
      webglUrl: formData.webglUrl,
      downloadUrl: formData.downloadUrl,
      downloadSize: formData.downloadSize,
      hasWebgl: formData.hasWebgl,
      hasPcDownload: formData.hasPcDownload,
      version: formData.version,
      oldVersion: game.version,
      newPatchTitle: formData.newPatchTitle,
      newPatchDetails: formData.newPatchDetails,
      promptPayNumber: formData.promptPayNumber,
      systemRequirements: {
        minimum: {
          os: formData.minOs,
          processor: formData.minCpu,
          memory: formData.minRam,
          graphics: formData.minGpu,
          directx: 'เวอร์ชัน 11',
          storage: formData.minStorage
        },
        recommended: {
          os: formData.recOs,
          processor: formData.recCpu,
          memory: formData.recRam,
          graphics: formData.recGpu,
          directx: 'เวอร์ชัน 12',
          storage: formData.recStorage
        }
      },
      socialLinks: {
        discord: formData.discordUrl,
        twitter: formData.twitterUrl,
        website: formData.websiteUrl
      }
    };

    const res = editGameDetails(game.id, updatedPayload);
    setIsSubmitting(false);

    if (res.success) {
      if (onSaveSuccess) onSaveSuccess(res.message);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-[#0f172a] border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/[0.08] bg-[#111827]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <FileEdit className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>แก้ไขข้อมูลและอัปเดตเกม</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-mono">
                  {game.version}
                </span>
              </h3>
              <p className="text-xs text-gray-400 truncate max-w-sm">
                เกม: <strong className="text-gray-200">{game.title}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (3 หมวดหลัก) */}
        <div className="flex items-center border-b border-white/[0.06] bg-[#0B0F19] px-4 pt-2 gap-2 text-xs font-semibold overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('patch')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'patch'
                ? 'border-indigo-400 text-white bg-white/[0.04]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span>1. ปล่อยแพตช์ & ไฟล์เกม (Build & Patch)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('store')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'store'
                ? 'border-indigo-400 text-white bg-white/[0.04]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-emerald-400" />
            <span>2. ข้อมูลหน้าร้าน & ราคา (Store & Price)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'specs'
                ? 'border-indigo-400 text-white bg-white/[0.04]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>3. สเปกเครื่อง & โซเชียล (Specs & Links)</span>
          </button>
        </div>

        {/* Modal Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
          
          {/* TAB 1: Patch Notes & Game Builds */}
          {activeTab === 'patch' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-xs text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>บันทึกประวัติการอัปเดต (Patch Notes / Changelog)</span>
                </span>
                <p className="text-[11px] text-gray-400">
                  เมื่อคุณระบุเลขเวอร์ชันใหม่หรือ Changelog ระบบจะบันทึกลงในหน้า Steam Store และแจ้งเตือนผู้เล่นโดยอัตโนมัติ
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1 font-medium">เลขเวอร์ชัน (Version) *</label>
                  <input
                    type="text"
                    name="version"
                    required
                    value={formData.version}
                    onChange={handleInputChange}
                    placeholder="เช่น v1.5.0"
                    className="w-full bg-[#111827] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-medium">หัวข้อแพตช์ (Patch Title)</label>
                  <input
                    type="text"
                    name="newPatchTitle"
                    value={formData.newPatchTitle}
                    onChange={handleInputChange}
                    placeholder="เช่น เพิ่มแผนที่ใหม่และปรับสมดุลเกม"
                    className="w-full bg-[#111827] border border-white/[0.08] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">รายละเอียดสิ่งที่อัปเดต (Changelog)</label>
                <textarea
                  name="newPatchDetails"
                  rows={3}
                  value={formData.newPatchDetails}
                  onChange={handleInputChange}
                  placeholder="เช่น - แก้ไขปัญหาเสียงกระตุกในโหมด WebGL&#10;- ปรับปรุงความเร็วในการดาวน์โหลดไฟล์ PC&#10;- เพิ่มซาวด์แทร็กใหม่ 2 เพลง"
                  className="w-full bg-[#111827] border border-white/[0.08] rounded-lg p-3 text-white focus:outline-none focus:border-indigo-400 leading-relaxed resize-none"
                />
              </div>

              {/* Build URLs */}
              <div className="pt-3 border-t border-white/[0.06] space-y-3">
                <span className="font-bold text-white block">ลิงก์บิลด์เกมสำหรับผู้เล่น (Game Build URLs)</span>
                
                {formData.hasWebgl && (
                  <div>
                    <label className="block text-gray-300 mb-1 font-medium flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      <span>URL บิลด์เกม WebGL</span>
                    </label>
                    <input
                      type="url"
                      name="webglUrl"
                      value={formData.webglUrl}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="w-full bg-[#111827] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                )}

                {formData.hasPcDownload && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-gray-300 mb-1 font-medium flex items-center gap-1.5">
                        <Monitor className="w-3.5 h-3.5 text-sky-400" />
                        <span>URL ดาวน์โหลดไฟล์เกม PC (.ZIP / Installer)</span>
                      </label>
                      <input
                        type="url"
                        name="downloadUrl"
                        value={formData.downloadUrl}
                        onChange={handleInputChange}
                        placeholder="https://..."
                        className="w-full bg-[#111827] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-1 font-medium">ขนาดไฟล์โดยประมาณ</label>
                      <input
                        type="text"
                        name="downloadSize"
                        value={formData.downloadSize}
                        onChange={handleInputChange}
                        placeholder="เช่น 150 MB"
                        className="w-full bg-[#111827] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Storefront Details & Pricing */}
          {activeTab === 'store' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1 font-medium">ชื่อเกม (Game Title) *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-[#111827] border border-white/[0.08] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-medium">หมวดหมู่แนวเกม (Category) *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-[#111827] border border-white/[0.08] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-400"
                  >
                    {GAME_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">คำโปรยสั้น (Tagline) *</label>
                <input
                  type="text"
                  name="tagline"
                  required
                  value={formData.tagline}
                  onChange={handleInputChange}
                  className="w-full bg-[#111827] border border-white/[0.08] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">รายละเอียดเกมแบบยาว (Description)</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-[#111827] border border-white/[0.08] rounded-lg p-3 text-white focus:outline-none focus:border-indigo-400 leading-relaxed resize-none"
                />
              </div>

              {/* Pricing Selector */}
              <div className="pt-3 border-t border-white/[0.06] space-y-3">
                <span className="font-bold text-white block">การตั้งราคาและการจัดจำหน่าย (Monetization)</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setFormData((p) => ({ ...p, pricingType: 'free' }))}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      formData.pricingType === 'free'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                        : 'bg-[#111827] border-white/[0.06] text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs">🟢 เล่นฟรี (Free)</div>
                    <div className="text-[10px] text-gray-400 font-normal">ทุกคนกดเล่นได้ทันที</div>
                  </div>

                  <div
                    onClick={() => setFormData((p) => ({ ...p, pricingType: 'paid' }))}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      formData.pricingType === 'paid'
                        ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300 font-bold'
                        : 'bg-[#111827] border-white/[0.06] text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs">🏷️ จำหน่าย (Tokens)</div>
                    <div className="text-[10px] text-gray-400 font-normal">ซื้อผ่าน Steam Wallet</div>
                  </div>
                </div>

                {formData.pricingType === 'paid' && (
                  <div className="p-3 rounded-xl bg-[#0B0F19] border border-indigo-500/30 flex items-center justify-between">
                    <div>
                      <label className="block text-gray-300 text-xs mb-0.5">ราคาเกม (Tokens / ฿):</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="bg-[#111827] border border-white/[0.08] rounded-lg px-3 py-1.5 text-white font-mono font-bold text-sm w-32 focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                    <div className="text-right text-[11px] text-gray-400">
                      <span>ส่วนแบ่งของคุณ (85%):</span>
                      <strong className="text-emerald-400 font-mono text-xs block">
                        +{Math.floor((Number(formData.price) || 0) * 0.85)} Tokens / การซื้อ
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              {/* PromptPay */}
              <div className="pt-2">
                <label className="block text-gray-300 mb-1 font-medium">เบอร์พร้อมเพย์รับการสนับสนุน (PromptPay)</label>
                <input
                  type="text"
                  name="promptPayNumber"
                  value={formData.promptPayNumber}
                  onChange={handleInputChange}
                  placeholder="089-xxx-xxxx"
                  className="w-full bg-[#111827] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 3: System Requirements & Social Links */}
          {activeTab === 'specs' && (
            <div className="space-y-4 animate-in fade-in">
              <span className="font-bold text-white block">ความต้องการของระบบ (System Requirements)</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Minimum */}
                <div className="p-3.5 rounded-xl bg-[#111827] border border-white/[0.06] space-y-2">
                  <span className="font-bold text-gray-200 block border-b border-white/[0.06] pb-1">
                    ขั้นต่ำ (Minimum)
                  </span>
                  <div>
                    <label className="block text-[10px] text-gray-400">ระบบปฏิบัติการ (OS)</label>
                    <input
                      type="text"
                      name="minOs"
                      value={formData.minOs}
                      onChange={handleInputChange}
                      className="w-full bg-[#0B0F19] border border-white/[0.08] rounded px-2 py-1 text-white text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400">โปรเซสเซอร์ (CPU)</label>
                    <input
                      type="text"
                      name="minCpu"
                      value={formData.minCpu}
                      onChange={handleInputChange}
                      className="w-full bg-[#0B0F19] border border-white/[0.08] rounded px-2 py-1 text-white text-[11px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-gray-400">แรม (RAM)</label>
                      <input
                        type="text"
                        name="minRam"
                        value={formData.minRam}
                        onChange={handleInputChange}
                        className="w-full bg-[#0B0F19] border border-white/[0.08] rounded px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400">พื้นที่ว่าง (Storage)</label>
                      <input
                        type="text"
                        name="minStorage"
                        value={formData.minStorage}
                        onChange={handleInputChange}
                        className="w-full bg-[#0B0F19] border border-white/[0.08] rounded px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400">การ์ดจอ (GPU)</label>
                    <input
                      type="text"
                      name="minGpu"
                      value={formData.minGpu}
                      onChange={handleInputChange}
                      className="w-full bg-[#0B0F19] border border-white/[0.08] rounded px-2 py-1 text-white text-[11px]"
                    />
                  </div>
                </div>

                {/* Recommended */}
                <div className="p-3.5 rounded-xl bg-[#111827] border border-white/[0.06] space-y-2">
                  <span className="font-bold text-gray-200 block border-b border-white/[0.06] pb-1">
                    แนะนำ (Recommended)
                  </span>
                  <div>
                    <label className="block text-[10px] text-gray-400">ระบบปฏิบัติการ (OS)</label>
                    <input
                      type="text"
                      name="recOs"
                      value={formData.recOs}
                      onChange={handleInputChange}
                      className="w-full bg-[#0B0F19] border border-white/[0.08] rounded px-2 py-1 text-white text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400">โปรเซสเซอร์ (CPU)</label>
                    <input
                      type="text"
                      name="recCpu"
                      value={formData.recCpu}
                      onChange={handleInputChange}
                      className="w-full bg-[#0B0F19] border border-white/[0.08] rounded px-2 py-1 text-white text-[11px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-gray-400">แรม (RAM)</label>
                      <input
                        type="text"
                        name="recRam"
                        value={formData.recRam}
                        onChange={handleInputChange}
                        className="w-full bg-[#0B0F19] border border-white/[0.08] rounded px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400">พื้นที่ว่าง (Storage)</label>
                      <input
                        type="text"
                        name="recStorage"
                        value={formData.recStorage}
                        onChange={handleInputChange}
                        className="w-full bg-[#0B0F19] border border-white/[0.08] rounded px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400">การ์ดจอ (GPU)</label>
                    <input
                      type="text"
                      name="recGpu"
                      value={formData.recGpu}
                      onChange={handleInputChange}
                      className="w-full bg-[#0B0F19] border border-white/[0.08] rounded px-2 py-1 text-white text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-3 border-t border-white/[0.06] space-y-3">
                <span className="font-bold text-white block">ช่องทางคอมมูนิตี้ (Community Links)</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Discord Invite</label>
                    <input
                      type="text"
                      name="discordUrl"
                      value={formData.discordUrl}
                      onChange={handleInputChange}
                      placeholder="https://discord.gg/..."
                      className="w-full bg-[#111827] border border-white/[0.08] rounded px-2.5 py-1.5 text-white text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">X (Twitter) / เพจ</label>
                    <input
                      type="text"
                      name="twitterUrl"
                      value={formData.twitterUrl}
                      onChange={handleInputChange}
                      placeholder="https://x.com/..."
                      className="w-full bg-[#111827] border border-white/[0.08] rounded px-2.5 py-1.5 text-white text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Official Website</label>
                    <input
                      type="text"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="w-full bg-[#111827] border border-white/[0.08] rounded px-2.5 py-1.5 text-white text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
            <p className="text-[11px] text-gray-400">
              การเปลี่ยนแปลงจะมีผลต่อหน้า Steam Store ทันที
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-gray-300 hover:text-white transition cursor-pointer"
              >
                ยกเลิก
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};