/**
 * AuthModal.jsx
 * หน้าต่างเข้าสู่ระบบ (Login) และสมัครสมาชิก (Register) สไตล์ Dark Gaming Cyberpunk
 * - รองรับการเข้าสู่ระบบด่วน 1-Click สำหรับการพรีเซนต์ (Player / Dev / Admin)
 * - สมัครสมาชิกใหม่ เลือกได้ว่าจะเป็นผู้เล่น หรือสตูดิโอผู้พัฒนา (รับฟรี 150 Tokens)
 */

import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  User, 
  Code2, 
  ShieldCheck, 
  Coins, 
  CheckCircle2, 
  AlertCircle,
  Gamepad2,
  Lock,
  Mail,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    authModalMode, 
    closeAuthModal, 
    openAuthModal, 
    login, 
    register, 
    switchRole 
  } = useAuth();

  const [mode, setMode] = useState(authModalMode || 'login'); // 'login' | 'register'

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register states
  const [regRole, setRegRole] = useState('player'); // 'player' | 'developer'
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regStudioName, setRegStudioName] = useState('');
  const [regPromptPay, setRegPromptPay] = useState('');

  // Notifications
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = login(loginEmail, loginPassword);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!regEmail || !regName) {
      setErrorMsg('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const res = register({
      name: regName,
      username: regUsername,
      email: regEmail,
      password: regPassword,
      role: regRole,
      studioName: regStudioName,
      promptPayNumber: regPromptPay
    });

    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  // Quick Demo Login
  const handleQuickLogin = (role) => {
    switchRole(role);
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-indigo-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#10B981] p-0.5">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-['Rajdhani',sans-serif]">
                {mode === 'login' ? 'เข้าสู่ระบบ INDIETHAI.HUB' : 'สมัครสมาชิกใหม่'}
              </h3>
              <p className="text-xs text-gray-400">
                {mode === 'login' ? 'ยินดีต้อนรับกลับสู่คอมมูนิตี้เกมไทย' : 'ร่วมสร้างและทดลองเล่นเกมอินดี้'}
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-[#0B0F19] border border-gray-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`py-2 rounded-lg transition cursor-pointer ${
              mode === 'login'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            เข้าสู่ระบบ (Sign In)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`py-2 rounded-lg transition cursor-pointer ${
              mode === 'register'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            สมัครสมาชิก (Sign Up)
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Login Form */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 mb-1.5 font-medium">อีเมล (Email Address)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="player@indiethai.hub หรือ dev@indiethai.hub"
                  className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-1.5 font-medium">รหัสผ่าน (Password)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-indigo-600 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold transition shadow-lg shadow-indigo-500/25 active:scale-95 cursor-pointer"
            >
              เข้าสู่ระบบ
            </button>

            {/* Quick Demo Logins for Presentations */}
            <div className="pt-3 border-t border-gray-800 space-y-2">
              <p className="text-[11px] text-gray-400 text-center font-medium">
                ⚡ หรือคลิกเข้าสู่ระบบด่วนเพื่อการนำเสนอ (Quick Demo):
              </p>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('player')}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#0B0F19] hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-400 border border-gray-800 hover:border-emerald-500/40 transition cursor-pointer"
                >
                  <User className="w-4 h-4 mb-1 text-emerald-400" />
                  <span className="text-[11px] font-bold">Player</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('developer')}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#0B0F19] hover:bg-indigo-500/20 text-gray-300 hover:text-indigo-400 border border-gray-800 hover:border-indigo-500/40 transition cursor-pointer"
                >
                  <Code2 className="w-4 h-4 mb-1 text-indigo-400" />
                  <span className="text-[11px] font-bold">Developer</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#0B0F19] hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 border border-gray-800 hover:border-rose-500/40 transition cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 mb-1 text-rose-400" />
                  <span className="text-[11px] font-bold">Admin</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* 2. Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            {/* Role Selection */}
            <div>
              <label className="block text-gray-300 mb-1.5 font-medium">เลือกประเภทบัญชีของคุณ:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegRole('player')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    regRole === 'player'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                      : 'bg-[#0B0F19] border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4 mb-1 text-emerald-400" />
                  <p className="font-bold">ผู้เล่นทั่วไป (Player)</p>
                  <p className="text-[10px] text-gray-400">ทดลองเล่น WebGL ฟรี</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRegRole('developer')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    regRole === 'developer'
                      ? 'bg-indigo-500/15 border-indigo-500 text-indigo-300'
                      : 'bg-[#0B0F19] border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-4 h-4 mb-1 text-indigo-400" />
                  <p className="font-bold">สตูดิโอเกม (Developer)</p>
                  <p className="text-[10px] text-amber-400">รับฟรี 150 Tokens</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-1 font-medium">ชื่อ-นามสกุล หรือชื่อเรียก *</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="สมหมาย ใจดี"
                className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-300 mb-1 font-medium">Username *</label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="sommai_dev"
                  className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">อีเมล (Email) *</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="sommai@mail.com"
                  className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-1 font-medium">รหัสผ่าน (Password) *</label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="อย่างน้อย 6 ตัวอักษร"
                className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Developer Specific Fields */}
            {regRole === 'developer' && (
              <div className="space-y-3 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 animate-in fade-in">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                  ข้อมูลสตูดิโอนักพัฒนาเกม
                </span>

                <div>
                  <label className="block text-gray-300 mb-1 font-medium">ชื่อสตูดิโอของคุณ</label>
                  <input
                    type="text"
                    value={regStudioName}
                    onChange={(e) => setRegStudioName(e.target.value)}
                    placeholder="เช่น Siam Cyber Studio"
                    className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-medium">เบอร์พร้อมเพย์รับการสนับสนุน</label>
                  <input
                    type="text"
                    value={regPromptPay}
                    onChange={(e) => setRegPromptPay(e.target.value)}
                    placeholder="089-xxx-xxxx"
                    className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-gray-950 font-bold transition shadow-lg shadow-emerald-500/25 active:scale-95 cursor-pointer"
            >
              ยืนยันการสมัครสมาชิก
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

