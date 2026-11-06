/**
 * AuthContext.jsx
 * จัดการข้อมูลผู้ใช้ปัจจุบัน การสลับ Role (Player, Developer, Admin) ยอดเหรียญ Token
 * และฟังก์ชันการจัดการผู้ใช้สำหรับฝั่ง Admin Backoffice
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS, MOCK_USERS_LIST } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // เก็บ State ข้อมูลผู้ใช้จำลองตาม Role
  const [usersState, setUsersState] = useState(() => {
    const saved = localStorage.getItem('indiethai_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved users, resetting...', e);
      }
    }
    return MOCK_USERS;
  });

  // รายชื่อผู้ใช้ทั้งหมดในระบบสำหรับหน้า Admin User Management
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('indiethai_users_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved users list, resetting...', e);
      }
    }
    return MOCK_USERS_LIST;
  });

  // Role ปัจจุบัน: 'player' | 'developer' | 'admin'
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('indiethai_current_role') || 'player';
  });

  // บันทึกลง LocalStorage
  useEffect(() => {
    localStorage.setItem('indiethai_users', JSON.stringify(usersState));
  }, [usersState]);

  useEffect(() => {
    localStorage.setItem('indiethai_users_list', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('indiethai_current_role', currentRole);
  }, [currentRole]);

  // ดึงข้อมูล User ประจำ Role นั้นๆ
  const currentUser = usersState[currentRole] || usersState.player;

  // ฟังก์ชันสลับ Role
  const switchRole = (newRole) => {
    if (['player', 'developer', 'admin'].includes(newRole)) {
      setCurrentRole(newRole);
    }
  };

  // จัดการยอดเหรียญ tokenBalance (หักหรือเพิ่ม)
  const updateTokenBalance = (delta, targetRole = currentRole) => {
    setUsersState((prev) => {
      const user = prev[targetRole];
      if (!user) return prev;
      const updatedBalance = Math.max(0, (user.tokenBalance || 0) + delta);
      return {
        ...prev,
        [targetRole]: {
          ...user,
          tokenBalance: updatedBalance
        }
      };
    });

    // อัปเดตใน usersList ด้วย
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.role === targetRole || (targetRole === 'developer' && u.id === 'usr-dev-1')) {
          return {
            ...u,
            tokenBalance: Math.max(0, (u.tokenBalance || 0) + delta)
          };
        }
        return u;
      })
    );
  };

  // ฟังก์ชันจำลองการเติม Token สำหรับ Developer
  const topUpTokens = (amount = 100) => {
    updateTokenBalance(amount, 'developer');
    return {
      success: true,
      amount,
      message: `เติมเหรียญสตูดิโอสำเร็จ +${amount} Tokens!`
    };
  };

  // ฟังก์ชันสำหรับ Admin: ปรับยอดเหรียญผู้ใช้
  const adminAdjustUserToken = (userId, newBalance) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, tokenBalance: Math.max(0, Number(newBalance)) } : u))
    );

    // หากเป็น dev ตัวหลัก
    if (userId === 'usr-dev-1') {
      setUsersState((prev) => ({
        ...prev,
        developer: {
          ...prev.developer,
          tokenBalance: Math.max(0, Number(newBalance))
        }
      }));
    }

    return {
      success: true,
      message: `ปรับยอด Token ของผู้ใช้เรียบร้อยแล้ว`
    };
  };

  // ฟังก์ชันสำหรับ Admin: สลับสถานะ แบน / ยกเลิกแบน
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
      message: updatedStatus ? `ระงับบัญชีผู้ใช้เรียบร้อยแล้ว` : `ปลดระงับบัญชีผู้ใช้เรียบร้อยแล้ว`
    };
  };

  // รีเซ็ตข้อมูลกลับสู่ค่าเริ่มต้น
  const resetToDefaultUsers = () => {
    setUsersState(MOCK_USERS);
    setUsersList(MOCK_USERS_LIST);
    localStorage.removeItem('indiethai_users');
    localStorage.removeItem('indiethai_users_list');
  };

  const value = {
    currentUser,
    currentRole,
    usersState,
    usersList,
    tokenBalance: currentUser.tokenBalance || 0,
    devTokenBalance: usersState.developer?.tokenBalance || 0,
    switchRole,
    updateTokenBalance,
    topUpTokens,
    adminAdjustUserToken,
    adminToggleBanUser,
    resetToDefaultUsers
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
