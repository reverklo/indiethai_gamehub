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
      activeClass: 'bg-white text-gray-950 font-semibold border-white',
      badge: 'เล่นฟรี',
      targetTab: 'store'
    },
    {
      id: 'developer',
      label: 'Developer View',
      sublabel: 'สตูดิโอ & จัดการเกม',
      icon: Code2,
      activeClass: 'bg-white text-gray-950 font-semibold border-white',
      badge: `${devTokenBalance} โควตา`,
      targetTab: 'studio'
    },
    {
      id: 'admin',
      label: 'Admin View',
      sublabel: 'ระบบตรวจสอบเกม',
      icon: ShieldAlert,
      activeClass: 'bg-white text-gray-950 font-semibold border-white',
      badge: pendingGames.length > 0 ? `รอตรวจ ${pendingGames.length}` : 'เรียบร้อย',
      targetTab: 'admin'
    }
  ];

  return (
    <aside 
      aria-label="Demo Presentation Role Switcher"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 p-1.5 rounded-xl bg-[#111827]/95 border border-white/[0.1] shadow-xl backdrop-blur-md transition-colors"
    >
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 border-r border-white/[0.08] text-gray-400">
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
                switchRole(role.id);
                if (navigateToTab) {
                  navigateToTab(role.targetTab);
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer border ${
                isActive
                  ? role.activeClass
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/[0.06] border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <div className="text-left flex flex-col">
                <span className="font-medium leading-tight">{role.label}</span>
                <span className={`text-[10px] hidden md:inline leading-none mt-0.5 ${isActive ? 'text-gray-700' : 'text-gray-500'}`}>
                  {role.sublabel}
                </span>
              </div>

              {/* Mini badge */}
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium ${
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
  );
};
