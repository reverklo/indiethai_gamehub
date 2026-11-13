/**
 * EditProfileModal.jsx
 * โมดอลแก้ไขโปรไฟล์ผู้ใช้งาน (Steam Edit Profile style)
 * ให้ผู้ใช้สามารถแก้ไขชื่อที่แสดง, ชื่อผู้ใช้, คำอธิบายตัวตน (Bio), และเลือก Avatar
 */

import React, { useState } from 'react';
import { X, Check, User, Image, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AVATAR_PRESETS = [
  {
    label: 'Cyber Anime (Tsukiko Style)',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80'
  },
  {
    label: 'Retro Gamer',
    url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&auto=format&fit=crop&q=80'
  },
  {
    label: 'Synthwave Pilot',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'
  },
  {
    label: 'Arcade Bot',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80'
  }
];

export const EditProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile } = useAuth();

  const [name, setName] = useState(currentUser?.name || 'Tsukiko_83');
  const [username, setUsername] = useState(currentUser?.username || 'tsukiko_83');
  const [bio, setBio] = useState(
    currentUser?.bio || 'คุณสามารถนำเสนอหนึ่งในเหรียญตราของคุณได้ที่นี่ เลือกเหรียญตราได้จากหน้าแก้ไขโปรไฟล์ของคุณ'
  );
  const [avatarUrl, setAvatarUrl] = useState(
    currentUser?.avatar || AVATAR_PRESETS[0].url
  );
  const [feedbackNotice, setFeedbackNotice] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = updateUserProfile({
      name,
      username,
      bio,
      avatar: avatarUrl
    });

    setFeedbackNotice(res.message);
    setTimeout(() => {
      setFeedbackNotice(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#111827] border border-white/[0.08] rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-white">
              แก้ไขโปรไฟล์ส่วนตัว (Edit Profile)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {feedbackNotice && (
          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{feedbackNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Avatar Preview & Presets */}
          <div>
            <label className="block text-gray-400 mb-2 font-medium">รูปภาพโปรไฟล์ (Avatar):</label>
            <div className="flex items-center gap-4">
              <img
                src={avatarUrl}
                alt="Avatar Preview"
                className="w-16 h-16 rounded-xl object-cover border-2 border-white/20 ring-2 ring-black"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="URL รูปภาพ..."
                  className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
                />
                <div className="flex items-center gap-2">
                  {AVATAR_PRESETS.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatarUrl(preset.url)}
                      className="px-2 py-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-gray-300 text-[10px] border border-white/[0.06] transition-colors"
                    >
                      {preset.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-gray-400 mb-1 font-medium">ชื่อที่แสดง (Display Name):</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-400 mb-1 font-medium">ชื่อผู้ใช้ (Steam Handle / Username):</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-white/20"
            />
          </div>

          {/* Bio / Status */}
          <div>
            <label className="block text-gray-400 mb-1 font-medium">ข้อความสถานะ / ชีวประวัติ (Bio):</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="แนะนำตัวสั้นๆ สไตล์ Steam..."
              className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/20 leading-relaxed"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-gray-300 text-xs transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-white hover:bg-gray-200 text-gray-950 font-semibold text-xs transition-colors cursor-pointer"
            >
              บันทึกการเปลี่ยนแปลง
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

