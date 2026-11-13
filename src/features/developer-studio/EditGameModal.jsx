/**
 * EditGameModal.jsx
 * หน้าต่างสำหรับผู้พัฒนา: แก้ไขข้อมูลเกมแบบครบวงจรและปล่อยแพตช์อัปเดตเวอร์ชันใหม่
 * - Unslop & Quiet Chrome: เรียบหรู ไม่รกสายตา จัดสรรพื้นที่อย่างแม่นยำบน 4px grid
 * - Fixed Header & Fixed Footer: ปุ่มบันทึกและปุ่มยกเลิกอยู่ติดด้านล่างเสมอ ไม่โดนอะไรบัง
 * - Controlled Scroll: เฉพาะส่วนเนื้อหาฟอร์มเท่านั้นที่เลื่อนได้ และล็อก Scroll พื้นหลัง
 * - z-[100]: อยู่เหนือทุกเลเยอร์ รวมถึง Demo Switcher
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  History, 
  FileEdit, 
  Cpu, 
  Coins, 
  Globe, 
  Monitor, 
  Tag,
  Save,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { GAME_CATEGORIES } from '../../data/mockData';

export const EditGameModal = ({ game, onClose, onSaveSuccess }) => {
  const { editGameDetails } = useGame();

  const [activeTab, setActiveTab] = useState('patch'); // 'patch' | 'store' | 'specs'

  // ล็อก scroll ของ body ขณะที่ modal เปิดอยู่
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

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
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl rounded-2xl bg-[#111827] border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col h-[85vh] max-h-[720px] apple-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0f172a] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0">
              <FileEdit className="w-4 h-4 text-gray-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">แก้ไขข้อมูลและอัปเดตเกม</h3>
                <span className="px-2 py-0.5 rounded text-[10px] bg-white/[0.08] text-gray-300 font-mono">
                  {game.version}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {game.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fixed Navigation Tabs (3 หมวดหลัก กระชับ ไม่ตกบรรทัด) */}
        <div className="flex items-center border-b border-white/[0.08] bg-[#0B0F19] px-6 gap-2 text-xs font-medium shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('patch')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'patch'
                ? 'border-white text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>1. บิลด์ & แพตช์โน้ต</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('store')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'store'
                ? 'border-white text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>2. ข้อมูลร้านค้า & ราคา</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'specs'
                ? 'border-white text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>3. สเปกเครื่อง & โซเชียล</span>
          </button>
        </div>

        {/* Form Container with Separated Scrollable Body and Fixed Footer */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
            
            {/* TAB 1: Patch Notes & Game Builds */}
            {activeTab === 'patch' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-300 space-y-1">
                  <span className="font-medium text-white flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-gray-400" />
                    <span>บันทึกประวัติการอัปเดต (Patch Notes / Changelog)</span>
                  </span>
                  <p className="text-[11px] text-gray-400">
                    เมื่อคุณระบุเลขเวอร์ชันใหม่หรือ Changelog ระบบจะบันทึกลงในหน้า Steam Store และแจ้งเตือนผู้เล่นโดยอัตโนมัติ
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1.5 font-medium">เลขเวอร์ชัน (Version) *</label>
                    <input
                      type="text"
                      name="version"
                      required
                      value={formData.version}
                      onChange={handleInputChange}
                      placeholder="เช่น v1.5.0"
                      className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1.5 font-medium">หัวข้อแพตช์ (Patch Title)</label>
                    <input
                      type="text"
                      name="newPatchTitle"
                      value={formData.newPatchTitle}
                      onChange={handleInputChange}
                      placeholder="เช่น เพิ่มแผนที่ใหม่และปรับสมดุลเกม"
                      className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1.5 font-medium">รายละเอียดสิ่งที่อัปเดต (Changelog)</label>
                  <textarea
                    name="newPatchDetails"
                    rows={3}
                    value={formData.newPatchDetails}
                    onChange={handleInputChange}
                    placeholder="เช่น - แก้ไขปัญหาเสียงกระตุกในโหมด WebGL&#10;- ปรับปรุงความเร็วในการดาวน์โหลดไฟล์ PC&#10;- เพิ่มซาวด์แทร็กใหม่ 2 เพลง"
                    className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg p-3 text-white focus:outline-none focus:border-white/20 leading-relaxed resize-none transition-colors"
                  />
                </div>

                {/* Build URLs */}
                <div className="pt-3 border-t border-white/[0.06] space-y-3">
                  <span className="font-semibold text-white block">ลิงก์บิลด์เกมสำหรับผู้เล่น (Game Build URLs)</span>
                  
                  {formData.hasWebgl && (
                    <div>
                      <label className="block text-gray-300 mb-1.5 font-medium flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-gray-400" />
                        <span>URL บิลด์เกม WebGL</span>
                      </label>
                      <input
                        type="url"
                        name="webglUrl"
                        value={formData.webglUrl}
                        onChange={handleInputChange}
                        placeholder="https://..."
                        className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-white/20 transition-colors"
                      />
                    </div>
                  )}

                  {formData.hasPcDownload && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-gray-300 mb-1.5 font-medium flex items-center gap-1.5">
                          <Monitor className="w-3.5 h-3.5 text-gray-400" />
                          <span>URL ดาวน์โหลดไฟล์เกม PC (.ZIP / Installer)</span>
                        </label>
                        <input
                          type="url"
                          name="downloadUrl"
                          value={formData.downloadUrl}
                          onChange={handleInputChange}
                          placeholder="https://..."
                          className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-white/20 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1.5 font-medium">ขนาดไฟล์โดยประมาณ</label>
                        <input
                          type="text"
                          name="downloadSize"
                          value={formData.downloadSize}
                          onChange={handleInputChange}
                          placeholder="เช่น 150 MB"
                          className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-white/20 transition-colors"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Storefront Details & Pricing */}
            {activeTab === 'store' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1.5 font-medium">ชื่อเกม (Game Title) *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1.5 font-medium">หมวดหมู่แนวเกม (Category) *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors"
                    >
                      {GAME_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1.5 font-medium">คำโปรยสั้น (Tagline) *</label>
                  <input
                    type="text"
                    name="tagline"
                    required
                    value={formData.tagline}
                    onChange={handleInputChange}
                    className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1.5 font-medium">รายละเอียดเกมแบบยาว (Description)</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg p-3 text-white focus:outline-none focus:border-white/20 leading-relaxed resize-none transition-colors"
                  />
                </div>

                {/* Pricing Selector */}
                <div className="pt-3 border-t border-white/[0.06] space-y-3">
                  <span className="font-semibold text-white block">การตั้งราคาและการจัดจำหน่าย (Monetization)</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      onClick={() => setFormData((p) => ({ ...p, pricingType: 'free' }))}
                      className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                        formData.pricingType === 'free'
                          ? 'bg-white/[0.08] border-white/40 text-white font-medium'
                          : 'bg-[#0B0F19] border-white/[0.06] text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-semibold">เล่นฟรี (Free to Play)</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">ทุกคนสามารถกดเล่นและดาวน์โหลดได้ทันที</div>
                    </div>

                    <div
                      onClick={() => setFormData((p) => ({ ...p, pricingType: 'paid' }))}
                      className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                        formData.pricingType === 'paid'
                          ? 'bg-white/[0.08] border-white/40 text-white font-medium'
                          : 'bg-[#0B0F19] border-white/[0.06] text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-semibold">จำหน่ายผ่าน Steam Wallet</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">ผู้เล่นสั่งซื้อด้วยยอดเงินในวอลเล็ต</div>
                    </div>
                  </div>

                  {formData.pricingType === 'paid' && (
                    <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-white/[0.08] space-y-2">
                      <label className="block text-gray-300 font-medium">กำหนดราคาเกม (บาท / Tokens)</label>
                      <div className="flex items-center gap-2">
                        <span className="text-base text-gray-400 font-mono">฿</span>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-36 bg-[#111827] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono text-base focus:outline-none focus:border-white/20 transition-colors"
                        />
                        <span className="text-xs text-gray-500">(1 Token = 1 บาท)</span>
                      </div>
                    </div>
                  )}

                  {/* PromptPay Donate setting */}
                  <div className="pt-2">
                    <label className="block text-gray-300 mb-1.5 font-medium">เบอร์พร้อมเพย์รับการสนับสนุน (PromptPay Donation)</label>
                    <input
                      type="text"
                      name="promptPayNumber"
                      value={formData.promptPayNumber}
                      onChange={handleInputChange}
                      placeholder="เช่น 089-765-4321"
                      className="w-full max-w-xs bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: System Requirements & Social Links */}
            {activeTab === 'specs' && (
              <div className="space-y-4">
                <span className="font-semibold text-white block">ความต้องการของระบบ (System Requirements)</span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Minimum */}
                  <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-white/[0.08] space-y-2.5">
                    <span className="font-semibold text-white block border-b border-white/[0.06] pb-1">
                      สเปกขั้นต่ำ (Minimum)
                    </span>
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-0.5">ระบบปฏิบัติการ (OS)</label>
                      <input
                        type="text"
                        name="minOs"
                        value={formData.minOs}
                        onChange={handleInputChange}
                        className="w-full bg-[#111827] border border-white/[0.08] rounded px-2.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-white/20"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-gray-400 mb-0.5">โปรเซสเซอร์ (CPU)</label>
                        <input
                          type="text"
                          name="minCpu"
                          value={formData.minCpu}
                          onChange={handleInputChange}
                          className="w-full bg-[#111827] border border-white/[0.08] rounded px-2.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-white/20"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 mb-0.5">หน่วยความจำ (RAM)</label>
                        <input
                          type="text"
                          name="minRam"
                          value={formData.minRam}
                          onChange={handleInputChange}
                          className="w-full bg-[#111827] border border-white/[0.08] rounded px-2.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-white/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-0.5">การ์ดจอ (GPU)</label>
                      <input
                        type="text"
                        name="minGpu"
                        value={formData.minGpu}
                        onChange={handleInputChange}
                        className="w-full bg-[#111827] border border-white/[0.08] rounded px-2.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-white/20"
                      />
                    </div>
                  </div>

                  {/* Recommended */}
                  <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-white/[0.08] space-y-2.5">
                    <span className="font-semibold text-white block border-b border-white/[0.06] pb-1">
                      สเปกแนะนำ (Recommended)
                    </span>
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-0.5">ระบบปฏิบัติการ (OS)</label>
                      <input
                        type="text"
                        name="recOs"
                        value={formData.recOs}
                        onChange={handleInputChange}
                        className="w-full bg-[#111827] border border-white/[0.08] rounded px-2.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-white/20"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-gray-400 mb-0.5">โปรเซสเซอร์ (CPU)</label>
                        <input
                          type="text"
                          name="recCpu"
                          value={formData.recCpu}
                          onChange={handleInputChange}
                          className="w-full bg-[#111827] border border-white/[0.08] rounded px-2.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-white/20"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 mb-0.5">หน่วยความจำ (RAM)</label>
                        <input
                          type="text"
                          name="recRam"
                          value={formData.recRam}
                          onChange={handleInputChange}
                          className="w-full bg-[#111827] border border-white/[0.08] rounded px-2.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-white/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-0.5">การ์ดจอ (GPU)</label>
                      <input
                        type="text"
                        name="recGpu"
                        value={formData.recGpu}
                        onChange={handleInputChange}
                        className="w-full bg-[#111827] border border-white/[0.08] rounded px-2.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-white/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-3 border-t border-white/[0.06] space-y-3">
                  <span className="font-semibold text-white block">ช่องทางคอมมูนิตี้ (Community Links)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1">Discord Invite</label>
                      <input
                        type="text"
                        name="discordUrl"
                        value={formData.discordUrl}
                        onChange={handleInputChange}
                        placeholder="https://discord.gg/..."
                        className="w-full bg-[#0B0F19] border border-white/[0.08] rounded px-2.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-white/20"
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
                        className="w-full bg-[#0B0F19] border border-white/[0.08] rounded px-2.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-white/20"
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
                        className="w-full bg-[#0B0F19] border border-white/[0.08] rounded px-2.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-white/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Fixed Modal Footer Actions (Always visible at the bottom of the modal, never blocked) */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-[#0f172a] shrink-0">
            <p className="text-[11px] text-gray-400 hidden sm:block">
              การเปลี่ยนแปลงจะมีผลต่อหน้า Steam Store ทันที
            </p>

            <div className="flex items-center gap-2.5 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="apple-press px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-gray-300 hover:text-white transition-colors cursor-pointer font-medium text-xs"
              >
                ยกเลิก
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="apple-press flex items-center gap-1.5 px-5 py-2 rounded-lg bg-white hover:bg-gray-200 text-gray-950 font-semibold transition-colors cursor-pointer text-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
