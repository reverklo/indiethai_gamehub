/**
 * AuthContext.jsx
 * จัดการข้อมูลผู้ใช้, ระบบเข้าสู่ระบบ (Login), สมัครสมาชิก (Register),
 * สลับ Role, ยอดเหรียญ Token และฟังก์ชันสำหรับ Admin
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS, MOCK_USERS_LIST } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // รายชื่อผู้ใช้ทั้งหมดในระบบ
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('indiethai_users_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved users list', e);
      }
    }
    return MOCK_USERS_LIST;
  });

  // ข้อมูลผู้ใช้ปัจจุบันที่ล็อกอินอยู่
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('indiethai_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse current user', e);
      }
    }
    return MOCK_USERS.developer; // ค่าเริ่มต้นให้เป็น Developer เพื่อความสะดวกในการทดสอบ
  });

  // Role ปัจจุบัน
  const currentRole = currentUser?.role || 'player';

  // สถานะล็อกอิน
  const isAuthenticated = Boolean(currentUser);

  // ควบคุมการเปิดปิด Auth Modal (Login / Register)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  // ควบคุมการเปิดปิด Steam Wallet Top-Up Modal
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

  // บันทึกลง LocalStorage
  useEffect(() => {
    localStorage.setItem('indiethai_users_list', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('indiethai_current_user', JSON.stringify(currentUser));
      localStorage.setItem('indiethai_current_role', currentUser.role);
    } else {
      localStorage.removeItem('indiethai_current_user');
    }
  }, [currentUser]);

  /**
   * ฟังก์ชันเข้าสู่ระบบ (Login)
   */
  const login = (email, password) => {
    const user = usersList.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return { success: false, message: 'ไม่พบบัญชีอีเมลนี้ในระบบ' };
    }

    if (user.isBanned) {
      return { success: false, message: 'บัญชีนี้ถูกระงับการใช้งาน กรุณาติดต่อแอดมิน' };
    }

    // ในระบบจำลอง ยอมรับรหัสผ่านที่กรอก
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    return { success: true, message: `ยินดีต้อนรับกลับมา, ${user.name}!`, user };
  };

  /**
   * ฟังก์ชันสมัครสมาชิกใหม่ (Register)
   */
  const register = ({ name, username, email, password, role = 'player', studioName, promptPayNumber }) => {
    // เช็คอีเมลซ้ำ
    const existing = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: 'อีเมลนี้มีผู้ใช้งานแล้วในระบบ' };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      username: username || email.split('@')[0],
      name,
      email,
      role, // 'player' หรือ 'developer'
      avatar:
        role === 'developer'
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
      tokenBalance: role === 'developer' ? 150 : 0, // Dev ได้เหรียญเริ่มต้น 150 Tokens
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
      message: `สมัครสมาชิกสำเร็จ! ยินดีต้อนรับสู่ IndieThai Hub ${role === 'developer' ? '(ได้รับ 150 Tokens สำหรับลงเกม)' : ''}`,
      user: newUser
    };
  };

  /**
   * ฟังก์ชันออกจากระบบ (Logout)
   */
  const logout = () => {
    // รีเซ็ตกลับเป็นผู้เล่น Guest
    setCurrentUser(MOCK_USERS.player);
    return { success: true, message: 'ออกจากระบบเรียบร้อยแล้ว' };
  };

  /**
   * ฟังก์ชัน Quick Login สำหรับ Demo (สลับเป็น Player, Dev, Admin ได้ทันที)
   */
  const switchRole = (newRole) => {
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

    return {
      success: true,
      message: updatedStatus ? 'ระงับบัญชีผู้ใช้เรียบร้อยแล้ว' : 'ปลดระงับบัญชีผู้ใช้เรียบร้อยแล้ว'
    };
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
