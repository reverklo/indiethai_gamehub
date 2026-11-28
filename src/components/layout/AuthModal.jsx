/**
 * AuthModal.jsx
 * หน้าต่างเข้าสู่ระบบ (Login) และสมัครสมาชิก (Register) สไตล์ Dark Gaming Cyberpunk
 * - รองรับการเข้าสู่ระบบด่วน 1-Click สำหรับการพรีเซนต์ (Player / Dev / Admin)
 * - สมัครสมาชิกใหม่ เลือกได้ว่าจะเป็นผู้เล่น หรือสตูดิโอผู้พัฒนา (รับฟรี 150 Tokens)
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  User, 
  Code2, 
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
    register
  } = useAuth();

  const [mode, setMode] = useState(authModalMode || 'login'); // 'login' | 'register'

  // ซิงค์แท็บ Login / Register ทุกครั้งที่เปิด Modal หรือเปลี่ยนโหมดจากภายนอก
  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode || 'login');
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isAuthModalOpen, authModalMode]);

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const res = await login(loginEmail, loginPassword);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!regEmail || !regName || !regPassword) {
      setErrorMsg('กรุณากรอกข้อมูลและรหัสผ่านให้ครบถ้วน');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({
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
      } else {
        setSuccessMsg(res.message);
      }
    } catch (err) {
      setErrorMsg('เกิดข้อผิดพลาดในการสมัครสมาชิก');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div 
        className="bg-[#111827] border border-white/[0.08] rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-6 apple-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-gray-300" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {mode === 'login' ? 'เข้าสู่ระบบ IndieThai Hub' : 'สมัครสมาชิกใหม่'}
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

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

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
              disabled={isSubmitting}
              className="apple-press w-full py-2.5 rounded-xl bg-white hover:bg-gray-200 text-gray-950 font-semibold transition-colors cursor-pointer text-xs disabled:opacity-50"
            >
              {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
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
              disabled={isSubmitting}
              className="apple-press w-full py-2.5 rounded-xl bg-white hover:bg-gray-200 text-gray-950 font-semibold transition-colors cursor-pointer text-xs disabled:opacity-50"
            >
              {isSubmitting ? 'กำลังสร้างบัญชีบนคลาวด์...' : 'ยืนยันการสมัครสมาชิก'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

