/**
 * App.jsx
 * แอปพลิเคชันหลัก IndieThai Hub
 * เชื่อมต่อ Context Providers และจัดการสลับมุมมองตาม Role ที่เลือก
 */

import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar } from './components/layout/Navbar';
import { RoleSwitcher } from './components/layout/RoleSwitcher';
import { Footer } from './components/layout/Footer';
import { WebGLModal } from './components/views/WebGLModal';

// Features Components
import { StorefrontView } from './features/storefront/StorefrontView';
import { GameDetailView } from './features/game-player/GameDetailView';
import { DeveloperStudioView } from './features/developer-studio/DeveloperStudioView';
import { AdminDashboardView } from './features/admin-moderation/AdminDashboardView';

/**
 * Main Layout & Role View Router
 */
const AppContent = () => {
  const { currentRole } = useAuth();
  const { selectedGameForDetail } = useGame();

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-gray-100 cyber-grid-bg relative selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area based on Selected Role */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 1. Player Role */}
        {currentRole === 'player' && (
          selectedGameForDetail ? (
            <GameDetailView game={selectedGameForDetail} />
          ) : (
            <StorefrontView />
          )
        )}

        {/* 2. Developer Role */}
        {currentRole === 'developer' && <DeveloperStudioView />}

        {/* 3. Admin Role */}
        {currentRole === 'admin' && <AdminDashboardView />}
      </main>

      {/* WebGL Fullscreen / Interactive Sandbox Modal */}
      <WebGLModal />

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
