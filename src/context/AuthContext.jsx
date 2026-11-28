/**
 * AuthContext.jsx
 * จัดการข้อมูลผู้ใช้, ระบบเข้าสู่ระบบ (Login), สมัครสมาชิก (Register),
 * สลับ Role, ยอดเหรียญ Token และฟังก์ชันสำหรับ Admin
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS, MOCK_USERS_LIST } from '../data/mockData';
import { supabase } from '../lib/supabase';
import { 
  registerWithSupabase, 
  loginWithSupabase, 
  logoutFromSupabase, 
  fetchProfileFromSupabase,
  setUserRoleInSupabase,
  toggleBanUserInSupabase
} from '../services/authService';

const ADMIN_DEMO_PIN = import.meta.env.VITE_ADMIN_DEMO_PIN || '208826';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // รายชื่อผู้ใช้ทั้งหมดในระบบ (รวมบัญชีหลักจาก MOCK_USERS_LIST เสมอ ป้องกันแคชเก่าใน localStorage ขาดบัญชี)
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('indiethai_users_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const existingEmails = new Set(parsed.map((u) => (u.email || '').toLowerCase()));
          const missingDefaults = MOCK_USERS_LIST.filter(
            (u) => !existingEmails.has((u.email || '').toLowerCase())
          );
          return [...parsed, ...missingDefaults];
        }
      } catch (e) {
        console.error('Failed to parse saved users list', e);
      }
    }
    return MOCK_USERS_LIST;
  });

  // ข้อมูลผู้ใช้ปัจจุบันที่ล็อกอินอยู่ (ค่าเริ่มต้นเป็น null สำหรับ Guest ผู้เยี่ยมชมทั่วไป)
  const [currentUser, setCurrentUser] = useState(() => {
    // ล้างแคชเก่าที่เคยจำ Tsukiko demo ไว้ เพื่อให้เริ่มต้นเป็น Guest เสมอ (ตามรูปที่ 3)
    try {
      localStorage.removeItem('indiethai_current_user');
      localStorage.removeItem('indiethai_current_role');
    } catch (e) {}

    const saved = sessionStorage.getItem('indiethai_session_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      } catch (e) {
        console.error('Failed to parse session user', e);
      }
    }
    return null;
  });

  // Role ปัจจุบัน (guest | player | developer | admin)
  const currentRole = currentUser?.role || 'guest';

  // สถานะล็อกอิน
  const isAuthenticated = Boolean(currentUser);

  // ควบคุมการเปิดปิด Auth Modal (Login / Register)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  // ควบคุมการเปิดปิด Steam Wallet Top-Up Modal
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

  // สถานะปลดล็อกโหมดสาธิต Admin ด้วยรหัส PIN (จำเฉพาะในแท็บปัจจุบัน)
  const [isAdminDemoUnlocked, setIsAdminDemoUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem('indiethai_admin_unlocked') === '1';
    } catch {
      return false;
    }
  });

  const verifyAdminDemoPin = (pin) => {
    if (String(pin || '').trim() === ADMIN_DEMO_PIN) {
      setIsAdminDemoUnlocked(true);
      try {
        sessionStorage.setItem('indiethai_admin_unlocked', '1');
      } catch {}
      return true;
    }
    return false;
  };

  // บันทึกลง LocalStorage สำหรับ User List
  useEffect(() => {
    localStorage.setItem('indiethai_users_list', JSON.stringify(usersList));
  }, [usersList]);

  // ซิงค์ Session User ใน SessionStorage (คงอยู่เฉพาะในแท็บปัจจุบัน ไม่ติดค้างถาวร)
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('indiethai_session_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('indiethai_session_user');
    }
  }, [currentUser]);

  // ซิงค์โปรไฟล์ผู้ใช้จริงจาก Supabase Database (เฉพาะเมื่อมีการล็อกอินจริงในเซสชันนี้)
  const syncProfileFromSupabase = async (authUser) => {
    try {
      const res = await fetchProfileFromSupabase(authUser.id);
      if (res.success && res.profile) {
        const p = res.profile;
        const profileUser = {
          id: p.id,
          username: p.username || authUser.email?.split('@')[0],
          name: p.display_name || p.username || 'ผู้เล่น',
          email: authUser.email,
          role: p.role || 'player',
          avatar: p.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          walletBalance: Number(p.wallet_balance) || 350,
          tokenBalance: Number(p.dev_quota) || 100,
          studioName: p.studio_name,
          promptPayNumber: p.promptpay_number,
          bio: p.bio,
          level: p.level || 1,
          badge: p.badge || 'Beta Tester',
          isVerifiedDev: p.is_verified_dev,
          isBanned: p.is_banned,
          isRealAuth: true
        };
        setCurrentUser(profileUser);
      }
    } catch (e) {
      console.warn('Sync profile error:', e);
    }
  };

  // ดักฟังสถานะ Auth จาก Supabase คลาวด์ (เฉพาะเมื่อเซสชันในแท็บนี้ถูกสร้างขึ้น)
  useEffect(() => {
    const activeSessionUser = sessionStorage.getItem('indiethai_session_user');
    if (activeSessionUser) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          syncProfileFromSupabase(session.user);
        }
      });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        syncProfileFromSupabase(session.user);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        sessionStorage.removeItem('indiethai_session_user');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  /**
   * ฟังก์ชันเข้าสู่ระบบ (Login)
   * รองรับทั้งระบบ Supabase Auth จริง และบัญชี Demo
   */
  const login = async (email, password) => {
    // 1. ลองล็อกอินผ่าน Supabase Auth ก่อน
    try {
      const sbRes = await loginWithSupabase(email, password);
      if (sbRes.success && sbRes.data?.user) {
        await syncProfileFromSupabase(sbRes.data.user);
        setIsAuthModalOpen(false);
        return { success: true, message: `ยินดีต้อนรับสู่ IndieThai Hub!` };
      }
    } catch (e) {
      console.warn('Supabase auth attempt failed, checking mock accounts:', e);
    }

    // 2. ถ้าไม่พบหรือเป็นบัญชีเดโม
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const user =
      usersList.find((u) => (u.email || '').toLowerCase() === normalizedEmail) ||
      Object.values(MOCK_USERS).find((u) => (u.email || '').toLowerCase() === normalizedEmail);

    if (!user) {
      return { success: false, message: 'ไม่พบบัญชีอีเมลนี้ในระบบ หรือรหัสผ่านไม่ถูกต้อง' };
    }

    if (user.isBanned) {
      return { success: false, message: 'บัญชีนี้ถูกระงับการใช้งาน กรุณาติดต่อแอดมิน' };
    }

    const demoPasswords = {
      'tsukiko@indiethai.hub': 'player1234',
      'player@indiethai.hub': 'player1234',
      'dev@indiethai.hub': 'dev1234',
      'admin@indiethai.hub': ADMIN_DEMO_PIN
    };
    const expectedPassword = user.password || demoPasswords[user.email.toLowerCase()];

    if (expectedPassword && String(password || '').trim() !== expectedPassword) {
      return { success: false, message: 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' };
    }

    if (user.role === 'admin') {
      setIsAdminDemoUnlocked(true);
      try {
        sessionStorage.setItem('indiethai_admin_unlocked', '1');
      } catch {}
    }

    setCurrentUser(user);
    setIsAuthModalOpen(false);
    return { success: true, message: `ยินดีต้อนรับกลับมา, ${user.name}!`, user };
  };

  /**
   * ฟังก์ชันสมัครสมาชิกใหม่ (Register) บน Supabase คลาวด์
   */
  const register = async ({ name, username, email, password, role = 'player', studioName, promptPayNumber }) => {
    // สมัครผ่าน Supabase Auth
    const sbRes = await registerWithSupabase({
      email,
      password,
      username,
      displayName: name,
      role,
      studioName,
      promptPayNumber
    });

    if (sbRes.success && sbRes.data?.user) {
      await syncProfileFromSupabase(sbRes.data.user);
      setIsAuthModalOpen(false);
      return {
        success: true,
        message: `สมัครสมาชิกบนคลาวด์สำเร็จ! ยินดีต้อนรับสู่ IndieThai Hub ${role === 'developer' ? '(ได้รับ 100 เครดิตสำหรับลงเกม)' : ''}`,
        user: sbRes.data.user
      };
    }

    if (sbRes.error) {
      return { success: false, message: `การสมัครสมาชิกล้มเหลว: ${sbRes.error}` };
    }

    // Fallback จำลองถ้าไม่มีเน็ต
    const newUser = {
      id: `usr-${Date.now()}`,
      username: username || email.split('@')[0],
      name,
      email,
      role,
      avatar:
        role === 'developer'
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
      tokenBalance: role === 'developer' ? 100 : 0,
      studioName: studioName || (role === 'developer' ? `${name} Studio` : ''),
      promptPayNumber: promptPayNumber || '089-000-0000',
      bio: role === 'developer' ? 'นักพัฒนาเกมอินดี้หน้าใหม่ไฟแรง' : 'ผู้เล่นเกมอินดี้',
      isBanned: false,
      registeredAt: new Date().toISOString().split('T')[0]
    };

    setUsersList((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);

    return {
      success: true,
      message: `สมัครสมาชิกสำเร็จ! ยินดีต้อนรับสู่ IndieThai Hub`,
      user: newUser
    };
  };

  /**
   * ฟังก์ชันออกจากระบบ (Logout)
   */
  const logout = async () => {
    try {
      await logoutFromSupabase();
    } catch (e) {
      console.warn('Supabase logout error:', e);
    }
    // รีเซ็ตกลับเป็น Guest และล้างแคช
    setCurrentUser(null);
    sessionStorage.removeItem('indiethai_session_user');
    localStorage.removeItem('indiethai_current_user');
    localStorage.removeItem('indiethai_current_role');
    localStorage.removeItem('indiethai_wishlist');
    return { success: true, message: 'ออกจากระบบเรียบร้อยแล้ว' };
  };

  /**
   * ฟังก์ชัน Quick Login สำหรับ Demo (สลับเป็น Player, Dev, Admin หรือกลับเป็น Guest ได้ทันที)
   */
  const switchRole = (newRole) => {
    if (newRole === 'guest') {
      logout();
      return;
    }
    if (MOCK_USERS[newRole]) {
      // ค้นหาข้อมูลล่าสุดใน usersList
      const userInList = usersList.find((u) => u.role === newRole) || MOCK_USERS[newRole];
      setCurrentUser(userInList);
    }
  };

  /**
   * อัปเดตยอด Token ของผู้ใช้ปัจจุบัน
   */
  const updateTokenBalance = (delta, targetRole = currentRole) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const updatedBalance = Math.max(0, (prev.tokenBalance || 0) + delta);
      return {
        ...prev,
        tokenBalance: updatedBalance
      };
    });

    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === currentUser?.id || (targetRole === 'developer' && u.role === 'developer')) {
          return {
            ...u,
            tokenBalance: Math.max(0, (u.tokenBalance || 0) + delta)
          };
        }
        return u;
      })
    );
  };

  /**
   * เติมเงินเข้า Steam Wallet จำลอง (Tokens)
   */
  const topUpWallet = (amount) => {
    const added = Number(amount) || 0;
    if (added <= 0) return { success: false, message: 'จำนวนเงินไม่ถูกต้อง' };

    setCurrentUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        walletBalance: (prev.walletBalance || 0) + added
      };
    });

    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === currentUser?.id) {
          return {
            ...u,
            walletBalance: (u.walletBalance || 0) + added
          };
        }
        return u;
      })
    );

    return {
      success: true,
      amount: added,
      message: `เติมเงินเข้าวอลเล็ตสำเร็จ +${added} Tokens!`
    };
  };

  /**
   * ตรวจสอบว่าผู้ใช้เป็นเจ้าของเกมนี้หรือไม่
   */
  const isGameOwned = (gameId) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    const owned = currentUser.ownedGames || ['game-1'];
    return owned.includes(gameId);
  };

  /**
   * สั่งซื้อเกม (Steam Purchase System)
   */
  const purchaseGame = (game) => {
    if (!currentUser) {
      openAuthModal('login');
      return { success: false, reason: 'unauthenticated', message: 'กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ' };
    }

    if (isGameOwned(game.id)) {
      return { success: false, reason: 'already_owned', message: 'คุณมีเกมนี้อยู่ในคลังเกมแล้ว' };
    }

    const price = Number(game.price) || 0;
    const currentWallet = currentUser.walletBalance ?? 350;

    if (price > 0 && currentWallet < price) {
      const needed = price - currentWallet;
      return {
        success: false,
        reason: 'insufficient_funds',
        needed,
        message: `ยอดเงินในวอลเล็ตไม่เพียงพอ ขาดอีก ${needed} Tokens`
      };
    }

    // หักเงิน (ถ้ามีราคา) และเพิ่มเกมลง ownedGames
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const currentOwned = prev.ownedGames || ['game-1'];
      const newOwned = currentOwned.includes(game.id) ? currentOwned : [...currentOwned, game.id];
      return {
        ...prev,
        walletBalance: Math.max(0, (prev.walletBalance ?? 350) - price),
        ownedGames: newOwned
      };
    });

    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === currentUser?.id) {
          const currentOwned = u.ownedGames || ['game-1'];
          const newOwned = currentOwned.includes(game.id) ? currentOwned : [...currentOwned, game.id];
          return {
            ...u,
            walletBalance: Math.max(0, (u.walletBalance ?? 350) - price),
            ownedGames: newOwned
          };
        }
        return u;
      })
    );

    return {
      success: true,
      message: price === 0 
        ? `เพิ่มเกม "${game.title}" เข้าสู่คลังเกมของคุณเรียบร้อยแล้ว!` 
        : `สั่งซื้อเกม "${game.title}" สำเร็จ! ยอดเงินคงเหลือ ${(currentWallet - price)} Tokens`
    };
  };

  /**
   * เติมเหรียญจำลอง (+100 Tokens)
   */
  const topUpTokens = (amount = 100) => {
    updateTokenBalance(amount, 'developer');
    return {
      success: true,
      amount,
      message: `เติมเหรียญสตูดิโอสำเร็จ +${amount} Tokens!`
    };
  };

  /**
   * ฟังก์ชันสำหรับ Admin: ปรับยอด Token
   */
  const adminAdjustUserToken = (userId, newBalance) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, tokenBalance: Math.max(0, Number(newBalance)) } : u))
    );

    if (currentUser?.id === userId) {
      setCurrentUser((prev) => ({
        ...prev,
        tokenBalance: Math.max(0, Number(newBalance))
      }));
    }

    return { success: true, message: 'ปรับยอด Token ของผู้ใช้เรียบร้อยแล้ว' };
  };

  /**
   * ฟังก์ชันสำหรับ Admin: สลับสถานะ แบน / ปลดแบน
   */
  const adminToggleBanUser = (userId) => {
    if (userId === currentUser?.id) {
      return { success: false, message: 'ไม่สามารถระงับบัญชีตัวเองได้' };
    }
    let updatedStatus = false;
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          updatedStatus = !u.isBanned;
          return { ...u, isBanned: updatedStatus };
        }
        return u;
      })
    );

    if (currentUser?.isRealAuth && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      toggleBanUserInSupabase(userId).catch((e) => console.warn('Ban sync error:', e));
    }

    return {
      success: true,
      message: updatedStatus ? 'ระงับบัญชีผู้ใช้เรียบร้อยแล้ว' : 'ปลดระงับบัญชีผู้ใช้เรียบร้อยแล้ว'
    };
  };

  /**
   * ฟังก์ชันสำหรับ Admin: แต่งตั้งหรือเปลี่ยนสิทธิ์ผู้ใช้ (Player / Developer / Admin)
   */
  const adminSetUserRole = (userId, newRole) => {
    if (!['player', 'developer', 'admin'].includes(newRole)) {
      return { success: false, message: 'บทบาทไม่ถูกต้อง' };
    }
    if (userId === currentUser?.id && newRole !== 'admin') {
      return { success: false, message: 'ไม่สามารถถอดสิทธิ์ Admin ของบัญชีที่ใช้งานอยู่เองได้' };
    }

    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    if (currentUser?.isRealAuth && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      setUserRoleInSupabase(userId, newRole).catch((e) => console.warn('Role sync error:', e));
    }

    const roleLabel = newRole === 'admin' ? 'Admin (ผู้ดูแลระบบ)' : newRole === 'developer' ? 'Developer (นักพัฒนา)' : 'Player (ผู้เล่น)';
    return { success: true, message: `เปลี่ยนสิทธิ์ผู้ใช้เป็น ${roleLabel} เรียบร้อยแล้ว` };
  };

  /**
   * แก้ไขข้อมูลโปรไฟล์ส่วนตัว (Edit Profile)
   */
  const updateUserProfile = (updatedFields) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      return updated;
    });

    setUsersList((prev) =>
      prev.map((u) => (u.id === currentUser?.id ? { ...u, ...updatedFields } : u))
    );

    return { success: true, message: 'บันทึกการแก้ไขโปรไฟล์เรียบร้อยแล้ว' };
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const value = {
    currentUser,
    currentRole,
    isAuthenticated,
    usersList,
    walletBalance: currentUser?.walletBalance ?? 350,
    ownedGames: currentUser?.ownedGames || ['game-1'],
    tokenBalance: currentUser?.tokenBalance || 0,
    devTokenBalance: currentUser?.role === 'developer' ? currentUser?.tokenBalance : 150,
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    isTopUpModalOpen,
    setIsTopUpModalOpen,
    openTopUpModal: () => setIsTopUpModalOpen(true),
    closeTopUpModal: () => setIsTopUpModalOpen(false),
    login,
    register,
    logout,
    switchRole,
    updateTokenBalance,
    topUpTokens,
    topUpWallet,
    purchaseGame,
    isGameOwned,
    adminAdjustUserToken,
    adminToggleBanUser,
    adminSetUserRole,
    isAdminDemoUnlocked,
    verifyAdminDemoPin,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
