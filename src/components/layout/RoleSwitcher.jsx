import React, { useState } from 'react';
import { User, Code2, ShieldAlert, Users, ArrowRightLeft, Lock, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';

export const RoleSwitcher = () => {
  const { currentRole, switchRole, devTokenBalance, isAdminDemoUnlocked, verifyAdminDemoPin } = useAuth();
  const { pendingGames, navigateToTab } = useGame();
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const roles = [
    {
      id: 'guest',
      label: 'Guest View',
      sublabel: 'ผู้เยี่ยมชมทั่วไป',
      icon: Users,
      activeClass: 'bg-white text-gray-950 font-semibold border-white shadow-sm',
      badge: 'Guest',
      targetTab: 'store'
    },
    {
      id: 'player',
      label: 'Player View',
      sublabel: 'ทดลองเล่นเกมอินดี้',
      icon: User,
      activeClass: 'bg-white text-gray-950 font-semibold border-white shadow-sm',
      badge: 'เล่นฟรี',
      targetTab: 'store'
    },
    {
      id: 'developer',
      label: 'Developer View',
      sublabel: 'สตูดิโอ & จัดการเกม',
      icon: Code2,
      activeClass: 'bg-white text-gray-950 font-semibold border-white shadow-sm',
      badge: `${devTokenBalance} โควตา`,
      targetTab: 'studio'
    },
    {
      id: 'admin',
      label: 'Admin View',
      sublabel: 'ระบบตรวจสอบเกม',
      icon: ShieldAlert,
      activeClass: 'bg-white text-gray-950 font-semibold border-white shadow-sm',
      badge: pendingGames.length > 0 ? `รอตรวจ ${pendingGames.length}` : 'เรียบร้อย',
      targetTab: 'admin'
    }
  ];

  return (
    <>
    <aside 
      aria-label="Demo Presentation Role Switcher"
      className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-xl bg-[#111827]/95 border border-white/[0.1] shadow-xl backdrop-blur-md max-w-[96vw] overflow-x-auto scrollbar-none transition-colors"
    >
      <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 border-r border-white/[0.08] text-gray-400">
        <ArrowRightLeft className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[11px] font-medium text-gray-400 font-mono">
          โหมดสาธิต
        </span>
      </div>

      <div className="flex items-center gap-1">
        {roles.map((role) => {
          const Icon = role.icon;
          const isActive = currentRole === role.id;

          return (
            <button
              key={role.id}
              onClick={() => {
                if (role.id === 'admin' && !isAdminDemoUnlocked) {
                  setPinInput('');
                  setPinError('');
                  setIsPinModalOpen(true);
                  return;
                }
                switchRole(role.id);
                if (navigateToTab) {
                  navigateToTab(role.targetTab);
                }
              }}
              className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors cursor-pointer border ${
                isActive
                  ? role.activeClass
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/[0.06] border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <div className="text-left flex flex-col">
                <span className="font-medium leading-tight text-[11px] sm:text-xs">{role.label}</span>
                <span className={`text-[10px] hidden md:inline leading-none mt-0.5 ${isActive ? 'text-gray-700' : 'text-gray-500'}`}>
                  {role.sublabel}
                </span>
              </div>

              {/* Mini badge */}
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-medium hidden sm:inline-block ${
                  isActive
                    ? 'bg-black/10 text-gray-900'
                    : 'bg-white/[0.06] text-gray-400 border border-white/[0.06]'
                }`}
              >
                {role.badge}
              </span>
            </button>
          );
        })}
      </div>
    </aside>

    {isPinModalOpen && (
      <div
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
        onClick={() => setIsPinModalOpen(false)}
      >
        <div
          className="bg-[#111827] border border-rose-500/40 rounded-2xl max-w-xs w-full p-5 shadow-2xl space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400">
              <Lock className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white">ยืนยันรหัสเข้าโหมด Admin</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsPinModalOpen(false)}
              className="text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-400">
            กรุณากรอกรหัสผ่านผู้ดูแลระบบเพื่อเข้าใช้งานแผงควบคุม Admin
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (verifyAdminDemoPin(pinInput)) {
                setIsPinModalOpen(false);
                switchRole('admin');
                if (navigateToTab) navigateToTab('admin');
              } else {
                setPinError('รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่');
              }
            }}
            className="space-y-3"
          >
            <input
              type="password"
              autoFocus
              required
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError('');
              }}
              placeholder="กรอกรหัสผ่าน Admin..."
              className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
            />
            {pinError && <p className="text-[11px] text-rose-400">{pinError}</p>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPinModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white cursor-pointer"
              >
                ปลดล็อก Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};
