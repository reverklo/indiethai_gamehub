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

import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar } from './components/layout/Navbar';
import { RoleSwitcher } from './components/layout/RoleSwitcher';
import { Footer } from './components/layout/Footer';
import { WebGLModal } from './components/views/WebGLModal';
import { AuthModal } from './components/layout/AuthModal';

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
        return <DeveloperStudioView />;
      
      case 'admin':
        return <AdminDashboardView />;
      
      case 'store':
      default:
        // ในกรณีที่เป็น Developer หรือ Admin และเข้าหน้าร้านค้า ก็สามารถดูร้านค้าได้ปกติ
        return <StorefrontView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-gray-100 cyber-grid-bg relative selection:bg-indigo-500 selection:text-white">
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

      {/* Floating Presentation Role Switcher (Player / Developer / Admin) */}
      <RoleSwitcher />

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
