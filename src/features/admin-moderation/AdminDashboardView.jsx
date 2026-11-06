/**
 * AdminDashboardView.jsx
 * ศูนย์ควบคุมหลักของผู้ดูแลระบบ (Admin Backoffice)
 * รวม 3 ฟังก์ชันสำคัญ:
 * 1. ModerationQueue (คิวตรวจสอบและอนุมัติเกมขึ้น Storefront)
 * 2. UserManagement (จัดการผู้ใช้งาน แบน/ระงับ และแก้ไข Token)
 * 3. PlatformAnalytics (สรุปรายได้ Token และสถิติทั้งแพลตฟอร์ม)
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Users, 
  BarChart3, 
  RefreshCw,
  Layers
} from 'lucide-react';
import { ModerationQueue } from './ModerationQueue';
import { UserManagement } from './UserManagement';
import { PlatformAnalytics } from './PlatformAnalytics';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboardView = () => {
  const { pendingGames, resetToDefaultGames } = useGame();
  const { resetToDefaultUsers } = useAuth();

  // แท็บปัจจุบัน: 'queue' | 'users' | 'analytics'
  const [activeTab, setActiveTab] = useState('queue');
  const [resetNotice, setResetNotice] = useState(null);

  const handleResetAll = () => {
    if (confirm('คุณต้องการรีเซ็ตข้อมูล Mock Data (เกมและผู้ใช้) ทั้งหมดกลับสู่ค่าเริ่มต้นใช่หรือไม่?')) {
      resetToDefaultGames();
      resetToDefaultUsers();
      setResetNotice('คืนค่าข้อมูลเริ่มต้นทั้งหมดเรียบร้อยแล้ว');
      setTimeout(() => setResetNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Admin Top Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/40 via-[#111827] to-[#111827] border border-rose-500/40 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  ADMIN CONSOLE & SECURITY
                </span>
                <span className="text-xs text-gray-400">ระบบหลังบ้าน IndieThai Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 font-['Rajdhani',sans-serif]">
                ระบบควบคุมและดูแลความปลอดภัยแพลตฟอร์ม
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                ตรวจสอบความถูกต้อง ปลอดภัย และอนุมัติเกมขึ้นสู่หน้าร้านค้า Storefront
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-semibold transition cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>รีเซ็ต Mock Data เริ่มต้น</span>
          </button>
        </div>
      </section>

      {/* Reset Notification */}
      {resetNotice && (
        <div className="p-3 rounded-xl bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 text-xs font-bold text-center">
          {resetNotice}
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-3 border-b border-gray-800 pb-3 overflow-x-auto">
        
        {/* Tab 1: Moderation Queue */}
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'queue'
              ? 'bg-amber-500 text-gray-950 shadow-md shadow-amber-500/20'
              : 'bg-[#111827] text-gray-400 hover:text-white border border-gray-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>คิวตรวจสอบเกม (Moderation Queue)</span>
          {pendingGames.length > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeTab === 'queue' ? 'bg-black/30 text-inherit' : 'bg-amber-500 text-gray-950'
            }`}>
              {pendingGames.length}
            </span>
          )}
        </button>

        {/* Tab 2: User Management */}
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-[#111827] text-gray-400 hover:text-white border border-gray-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>จัดการผู้ใช้งาน (User Management)</span>
        </button>

        {/* Tab 3: Platform Analytics */}
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-emerald-500 text-gray-950 shadow-md shadow-emerald-500/20'
              : 'bg-[#111827] text-gray-400 hover:text-white border border-gray-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>วิเคราะห์ข้อมูล & รายได้ Token (Platform Analytics)</span>
        </button>

      </div>

      {/* Render Subview based on activeTab */}
      <div className="pt-2">
        {activeTab === 'queue' && <ModerationQueue />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'analytics' && <PlatformAnalytics />}
      </div>

    </div>
  );
};

