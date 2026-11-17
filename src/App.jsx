/**
 * App.jsx
 * แอปพลิเคชันหลัก IndieThai Hub
 * เชื่อมต่อ Context Providers และจัดการสลับมุมมองสไตล์ Steam Client:
 * - ร้านค้า (StorefrontView)
 * - คลังเกม (LibraryView)
 * - ชุมชน (CommunityView)
 * - โปรไฟล์ผู้ใช้ (UserProfileView - Steam Profile Tsukiko_83)
 * - สตูดิโอผู้พัฒนา (DeveloperStudioView)
 * - แผงผู้ดูแลระบบ (AdminDashboardView)
 * - หน้ารายละเอียดเกม (GameDetailView)
 */

import React, { useEffect } from 'react';
import { Code2, ShieldAlert } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WebGLModal } from './components/views/WebGLModal';
import { AuthModal } from './components/layout/AuthModal';
import { TopUpWalletModal } from './components/layout/TopUpWalletModal';

// Features Components
import { StorefrontView } from './features/storefront/StorefrontView';
import { GameDetailView } from './features/game-player/GameDetailView';
import { DeveloperStudioView } from './features/developer-studio/DeveloperStudioView';
import { AdminDashboardView } from './features/admin-moderation/AdminDashboardView';
import { UserProfileView } from './features/user-profile/UserProfileView';
import { LibraryView } from './features/library/LibraryView';
import { CommunityView } from './features/community/CommunityView';

/**
 * Main Layout & Steam-style Router
 */
const AppContent = () => {
  const { currentRole } = useAuth();
  const { selectedGameForDetail, activeNavTab } = useGame();

  // ป้องกันปัญหาหน้าจอเลื่อนค้างหรือตำแหน่งไม่ตรง: เลื่อนขึ้นบนสุดทันทีเมื่อสลับหน้าหรือเปิดดูเกม
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [selectedGameForDetail, activeNavTab]);

  // จัดการการแสดงผลหน้าต่างๆ ตามแท็บที่เลือกหรือเกมที่เปิดดูอยู่
  const renderCurrentView = () => {
    // 1. หากกำลังเปิดดูรายละเอียดเกม ให้แสดง GameDetailView
    if (selectedGameForDetail) {
      return <GameDetailView game={selectedGameForDetail} />;
    }

    // 2. นำทางตามแท็บหลักสไตล์ Steam
    switch (activeNavTab) {
      case 'library':
        return <LibraryView />;
      
      case 'community':
        return <CommunityView />;
      
      case 'profile':
        return <UserProfileView />;
      
      case 'studio':
        if (currentRole !== 'developer') {
          return (
            <div className="py-24 text-center max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mx-auto text-gray-300">
                <Code2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">พื้นที่สำหรับสตูดิโอผู้พัฒนาเกม</h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                คุณจำเป็นต้องเข้าสู่ระบบด้วยบัญชีนักพัฒนา (Developer) เพื่อเข้าถึงศูนย์ควบคุมสตูดิโอและอัปโหลดเกม
              </p>
            </div>
          );
        }
        return <DeveloperStudioView />;
      
      case 'admin':
        if (currentRole !== 'admin') {
          return (
            <div className="py-24 text-center max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">พื้นที่สำหรับผู้ดูแลระบบเท่านั้น</h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                หน้านี้สงวนสิทธิ์เฉพาะผู้ดูแลระบบ (Admin) สำหรับตรวจสอบและอนุมัติผลงานเกม
              </p>
            </div>
          );
        }
        return <AdminDashboardView />;
      
      case 'store':
      default:
        // ในกรณีที่เป็น Developer หรือ Admin และเข้าหน้าร้านค้า ก็สามารถดูร้านค้าได้ปกติ
        return <StorefrontView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-gray-100 relative selection:bg-white/[0.15] selection:text-white">
      {/* Top Steam Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>

      {/* WebGL Fullscreen / Interactive Sandbox Modal */}
      <WebGLModal />

      {/* Authentication Modal (Login / Register) */}
      <AuthModal />

      {/* Steam Wallet Top-Up Modal */}
      <TopUpWalletModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

/**
 * Root App wrapped with Context Providers
 */
export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </AuthProvider>
  );
}
