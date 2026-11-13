import React from 'react';
import { User, Code2, ShieldAlert, Sparkles, Coins, ArrowRightLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';

export const RoleSwitcher = () => {
  const { currentRole, switchRole, devTokenBalance } = useAuth();
  const { pendingGames, navigateToTab } = useGame();

  const roles = [
    {
      id: 'player',
      label: 'Player View',
      sublabel: 'ทดลองเล่นเกมอินดี้',
      icon: User,
      activeClass: 'bg-emerald-500 text-gray-950 font-bold shadow-lg shadow-emerald-500/30 scale-105',
      badge: 'เล่น WebGL ฟรี',
      targetTab: 'store'
    },
    {
      id: 'developer',
      label: 'Developer View',
      sublabel: 'ลงเกมใหม่ & เหรียญ',
      icon: Code2,
      activeClass: 'bg-[#6366F1] text-white font-bold shadow-lg shadow-indigo-500/30 scale-105',
      badge: `${devTokenBalance} Tokens`,
      targetTab: 'studio'
    },
    {
      id: 'admin',
      label: 'Admin View',
      sublabel: 'ระบบตรวจสอบเกม',
      icon: ShieldAlert,
      activeClass: 'bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/30 scale-105',
      badge: pendingGames.length > 0 ? `รอตรวจ ${pendingGames.length}` : 'เรียบร้อย',
      targetTab: 'admin'
    }
  ];

  return (
    <aside 
      aria-label="Demo Presentation Role Switcher"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 rounded-2xl bg-[#111827]/95 border border-white/[0.1] shadow-2xl backdrop-blur-xl transition-all hover:border-white/20"
    >
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 border-r border-white/[0.08] text-gray-400">
        <ArrowRightLeft className="w-4 h-4 text-indigo-400 animate-pulse" />
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-300 font-mono">
          Demo Switcher
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {roles.map((role) => {
          const Icon = role.icon;
          const isActive = currentRole === role.id;

          return (
            <button
              key={role.id}
              onClick={() => {
                switchRole(role.id);
                if (navigateToTab) {
                  navigateToTab(role.targetTab);
                }
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all duration-200 cursor-pointer ${
                isActive
                  ? role.activeClass
                  : 'bg-[#0B0F19]/80 text-gray-400 hover:text-gray-200 hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <div className="text-left flex flex-col">
                <span className="font-semibold leading-tight">{role.label}</span>
                <span className={`text-[10px] hidden md:inline leading-none mt-0.5 ${isActive ? 'opacity-90' : 'text-gray-500'}`}>
                  {role.sublabel}
                </span>
              </div>

              {/* Mini badge */}
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                  isActive
                    ? 'bg-black/25 text-inherit'
                    : 'bg-white/[0.06] text-gray-300 border border-white/[0.08]'
                }`}
              >
                {role.badge}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
