/**
 * GameContext.jsx
 * ศูนย์รวม State และฟังก์ชันสำหรับจัดการข้อมูลเกมอินดี้ WebGL/PC
 * - จัดการคลังเกม, กรอง Engine, อนุมัติ/ปฏิเสธเกม, หักเหรียญ Token
 * - จัดการรายงานบั๊ก (Bug Tracking)
 * - ระบบ Wishlist (คลังเกมโปรด ❤️)
 * - ระบบศูนย์การแจ้งเตือน (Notification Center 🔔) สไตล์ Steam
 * - ระบบบันทึกแพตช์โน้ต (Patch Notes / DevLog) สไตล์ itch.io
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_GAMES, TOKEN_COST_PER_GAME, MOCK_NOTIFICATIONS } from '../data/mockData';
import { useAuth } from './AuthContext';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { currentUser, currentRole, devTokenBalance, updateTokenBalance } = useAuth();

  // รายการเกมทั้งหมด
  const [games, setGames] = useState(() => {
    const saved = localStorage.getItem('indiethai_games');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved games', e);
      }
    }
    return INITIAL_GAMES;
  });

  // รายการเกมที่กดบันทึกเป็นรายการโปรด (Wishlist)
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('indiethai_wishlist');
    return saved ? JSON.parse(saved) : ['game-1', 'game-3'];
  });

  // ระบบแจ้งเตือน (Notification Center 🔔)
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('indiethai_notifications');
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  });

  // ตัวกรอง (Search, Engine, Category, Sort, WishlistOnly)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isWishlistOnly, setIsWishlistOnly] = useState(false);

  // จัดการเกมที่กำลังเปิดดูหน้ารายละเอียด GameDetailView สไตล์ Steam
  const [selectedGameForDetail, setSelectedGameForDetail] = useState(null);

  // จัดการเกมที่กำลังเปิดเล่นใน WebGL Modal
  const [activePlayingGame, setActivePlayingGame] = useState(null);

  // บันทึกลง LocalStorage
  useEffect(() => {
    localStorage.setItem('indiethai_games', JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem('indiethai_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('indiethai_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // ซิงค์ selectedGameForDetail หากข้อมูลใน games มีการอัปเดต
  useEffect(() => {
    if (selectedGameForDetail) {
      const updated = games.find((g) => g.id === selectedGameForDetail.id);
      if (updated) {
        setSelectedGameForDetail(updated);
      }
    }
  }, [games]);

  // เกมที่ได้รับอนุมัติแล้ว
  const approvedGames = useMemo(() => {
    return games.filter((g) => g.status === 'approved');
  }, [games]);

  // เกมที่รอตรวจสอบความปลอดภัย (Moderation Queue)
  const pendingGames = useMemo(() => {
    return games.filter((g) => g.status === 'pending');
  }, [games]);

  // เกมในสังกัดของสตูดิโอ Developer ปัจจุบัน
  const myDeveloperGames = useMemo(() => {
    return games.filter(
      (g) =>
        g.developerId === currentUser?.id ||
        g.developer === currentUser?.studioName ||
        (currentUser?.role === 'developer' && (g.developerId === 'usr-dev-1' || g.developer.includes('SiamPixel')))
    );
  }, [games, currentUser]);

  // กรองการแจ้งเตือนตามบทบาทปัจจุบัน
  const roleNotifications = useMemo(() => {
    return notifications.filter(
      (n) => n.role === currentRole || n.role === 'all'
    );
  }, [notifications, currentRole]);

  const unreadNotificationCount = useMemo(() => {
    return roleNotifications.filter((n) => !n.isRead).length;
  }, [roleNotifications]);

  // กรองเกมที่อนุมัติแล้ว
  const filteredApprovedGames = useMemo(() => {
    return approvedGames.filter((game) => {
      const matchSearch =
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchEngine = selectedEngine === 'All' || game.engine === selectedEngine;
      const matchCategory = selectedCategory === 'All' || game.category === selectedCategory;
      const matchWishlist = !isWishlistOnly || wishlist.includes(game.id);

      return matchSearch && matchEngine && matchCategory && matchWishlist;
    });
  }, [approvedGames, searchQuery, selectedEngine, selectedCategory, isWishlistOnly, wishlist]);

  /**
   * สลับสถานะ Wishlist
   */
  const toggleWishlist = (gameId) => {
    setWishlist((prev) => {
      const isExist = prev.includes(gameId);
      if (isExist) {
        return prev.filter((id) => id !== gameId);
      } else {
        return [...prev, gameId];
      }
    });
  };

  /**
   * อ่านการแจ้งเตือน
   */
  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.role === currentRole ? { ...n, isRead: true } : n))
    );
  };

  /**
   * ฟังก์ชันสำหรับ Developer: อัปเดตเวอร์ชันเกมพร้อมบันทึก Patch Notes / DevLog
   */
  const updateGameVersionWithPatchNotes = (gameId, newVersion, patchTitle, patchDetails) => {
    const newPatch = {
      version: newVersion,
      date: new Date().toISOString().split('T')[0],
      title: patchTitle || `อัปเดตเวอร์ชัน ${newVersion}`,
      details: patchDetails || 'ปรับปรุงประสิทธิภาพและความเสถียรของเกม'
    };

    setGames((prev) =>
      prev.map((g) => {
        if (g.id === gameId) {
          const currentPatches = g.patchNotes || [];
          return {
            ...g,
            version: newVersion,
            patchNotes: [newPatch, ...currentPatches]
          };
        }
        return g;
      })
    );

    // สร้างแจ้งเตือนอัตโนมัติถึง Player
    const newNotif = {
      id: `notif-${Date.now()}`,
      role: 'player',
      title: `🎮 เกมโปรดอัปเดตใหม่ (${newVersion})`,
      message: `${patchTitle || 'มีการปล่อยแพตช์ใหม่'} สามารถทดลองเล่นเวอร์ชันล่าสุดได้แล้ว`,
      time: 'เพิ่งอัปเดต',
      isRead: false
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return {
      success: true,
      message: `อัปเดตแพตช์โน้ตเวอร์ชัน ${newVersion} สำเร็จเรียบร้อย!`
    };
  };

  /**
   * อัปเดตสถานะของบั๊ก
   */
  const updateBugStatus = (gameId, bugId, newStatus) => {
    setGames((prev) =>
      prev.map((g) => {
        if (g.id === gameId) {
          const updatedBugs = (g.bugReports || []).map((b) =>
            b.id === bugId ? { ...b, status: newStatus } : b
          );
          return {
            ...g,
            bugReports: updatedBugs
          };
        }
        return g;
      })
    );

    return {
      success: true,
      message: `อัปเดตสถานะบั๊กเป็น "${newStatus === 'fixed' ? 'แก้ไขแล้ว' : newStatus === 'investigating' ? 'กำลังตรวจสอบ' : 'รอดำเนินการ'}" เรียบร้อยแล้ว`
    };
  };

  /**
   * ลงเกมใหม่สำหรับ Developer (หัก 50 Tokens)
   */
  const submitNewGame = (gameData) => {
    const cost = TOKEN_COST_PER_GAME;

    if (devTokenBalance < cost) {
      return {
        success: false,
        message: `ยอดเหรียญ Token ไม่เพียงพอ (ต้องการ ${cost} Tokens แต่คุณมี ${devTokenBalance} Tokens) กรุณาเติมเหรียญก่อนส่งเกม`
      };
    }

    updateTokenBalance(-cost, 'developer');

    const newGame = {
      id: `game-${Date.now()}`,
      title: gameData.title || 'Untitled Thai Indie Game',
      slug: (gameData.title || 'game').toLowerCase().replace(/\s+/g, '-'),
      tagline: gameData.tagline || 'เกมอินดี้ใหม่โดยนักพัฒนาไทย',
      description: gameData.description || 'เกม WebGL สร้างสรรค์โดยสตูดิโอเกมสัญชาติไทย รันได้ลื่นไหลบนเบราว์เซอร์',
      developer: currentUser.studioName || currentUser.name || 'SiamPixel Studio',
      developerId: currentUser.id || 'usr-dev-1',
      category: gameData.category || 'Action',
      engine: gameData.engine || 'Unity WebGL',
      version: gameData.version || 'v1.0.0',
      rating: 0,
      ratingCount: 0,
      playCount: 0,
      downloadCount: 0,
      downloadSize: gameData.downloadSize || '120 MB',
      hasWebgl: Boolean(gameData.hasWebgl ?? true),
      hasPcDownload: Boolean(gameData.hasPcDownload ?? true),
      webglUrl: gameData.webglUrl || 'https://play2048.co/',
      downloadUrl: gameData.downloadUrl || 'https://github.com/gabrielecirulli/2048/archive/refs/heads/master.zip',
      thumbnail:
        gameData.thumbnail ||
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
      mediaGallery: gameData.mediaGallery || [
        {
          id: 'm-1',
          type: 'image',
          url: gameData.thumbnail || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
          thumbnail: gameData.thumbnail || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80',
          title: 'ภาพสกรีนช็อตเกมเพลย์'
        }
      ],
      controls: [
        { key: '[ ลูกศร ] หรือ [ WASD ]', action: 'ควบคุมการเคลื่อนที่' },
        { key: '[ Spacebar ]', action: 'กระโดด / แอ็กชันพิเศษ' }
      ],
      requirements: {
        os: 'Windows 10 / 11 64-bit, macOS, Linux',
        browser: 'เบราว์เซอร์ที่รองรับ WebGL 2.0 (Chrome, Edge, Firefox, Safari)',
        memory: 'RAM 4 GB ขึ้นไป',
        graphics: 'รองรับ Hardware Acceleration'
      },
      patchNotes: [
        {
          version: gameData.version || 'v1.0.0',
          date: new Date().toISOString().split('T')[0],
          title: 'เปิดตัวเกมรอบ Early Access / Beta',
          details: 'เปิดให้ผู้เล่นทดสอบผ่านระบบ WebGL และดาวน์โหลดไฟล์ PC'
        }
      ],
      promptPayNumber: gameData.promptPayNumber || currentUser.promptPayNumber || '089-765-4321',
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      tags: gameData.tags || ['Thai Indie', 'WebGL', 'New Release'],
      featured: false,
      securityScan: {
        status: 'Clean',
        details: 'Sandbox Scan: ไม่พบมัลแวร์หรือสคริปต์อันตราย, WebGL Package ตรวจสอบผ่าน 100%',
        scannedAt: new Date().toLocaleString('th-TH')
      },
      reviews: [],
      bugReports: []
    };

    setGames((prev) => [newGame, ...prev]);

    // สร้างแจ้งเตือนถึง Admin
    const adminNotif = {
      id: `notif-admin-${Date.now()}`,
      role: 'admin',
      title: '🛡️ มีเกมใหม่รอการตรวจสอบ',
      message: `สตูดิโอ ${newGame.developer} ได้ส่งเกม "${newGame.title}" เข้าคิวตรวจสอบ`,
      time: 'เมื่อสักครู่',
      isRead: false
    };
    setNotifications((prev) => [adminNotif, ...prev]);

    return {
      success: true,
      message: `ส่งเกม "${newGame.title}" เข้าคิวตรวจสอบเรียบร้อยแล้ว! (หักค่าธรรมเนียม ${cost} Tokens)`,
      game: newGame
    };
  };

  /**
   * อนุมัติเกม
   */
  const approveGame = (gameId) => {
    let approvedGameTitle = '';
    let targetDevId = '';

    setGames((prev) =>
      prev.map((game) => {
        if (game.id === gameId) {
          approvedGameTitle = game.title;
          targetDevId = game.developerId;
          return { ...game, status: 'approved' };
        }
        return game;
      })
    );

    // แจ้งเตือนไปยัง Dev
    const devNotif = {
      id: `notif-dev-${Date.now()}`,
      role: 'developer',
      title: '🎉 เกมของคุณได้รับอนุมัติแล้ว!',
      message: `เกม "${approvedGameTitle}" ผ่านการตรวจสอบความปลอดภัยและขึ้นสู่หน้าสโตร์เรียบร้อยแล้ว`,
      time: 'เมื่อสักครู่',
      isRead: false
    };
    setNotifications((prev) => [devNotif, ...prev]);

    return {
      success: true,
      message: 'อนุมัติเกมขึ้นสโตร์เรียบร้อยแล้ว!'
    };
  };

  /**
   * ปฏิเสธเกม
   */
  const rejectGame = (gameId, reason = 'ไฟล์ WebGL หรือข้อมูลเกมยังไม่สมบูรณ์') => {
    setGames((prev) =>
      prev.map((game) =>
        game.id === gameId
          ? { ...game, status: 'rejected', rejectReason: reason }
          : game
      )
    );
    return {
      success: true,
      message: `ปฏิเสธเกมเรียบร้อยแล้ว (${reason})`
    };
  };

  /**
   * ดาวน์โหลดไฟล์ PC
   */
  const downloadPcGame = (gameId) => {
    setGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, downloadCount: (g.downloadCount || 0) + 1 } : g))
    );
  };

  /**
   * เพิ่มคะแนนรีวิว
   */
  const addReview = (gameId, { rating, comment, user }) => {
    const newReview = {
      id: `rev-${Date.now()}`,
      user: user || currentUser?.name || 'Anonymous Gamer',
      rating: Number(rating),
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    setGames((prev) =>
      prev.map((g) => {
        if (g.id === gameId) {
          const currentReviews = g.reviews || [];
          const updatedReviews = [newReview, ...currentReviews];
          const avgRating =
            updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length;
          return {
            ...g,
            reviews: updatedReviews,
            rating: Number(avgRating.toFixed(1)),
            ratingCount: updatedReviews.length
          };
        }
        return g;
      })
    );

    return {
      success: true,
      message: 'ส่งคะแนนรีวิวเรียบร้อยแล้ว ขอบคุณที่สนับสนุนเกมอินดี้ไทย!'
    };
  };

  /**
   * แจ้งบั๊ก
   */
  const addBugReport = (gameId, { title, description, user }) => {
    const newBug = {
      id: `bug-${Date.now()}`,
      user: user || currentUser?.name || 'Anonymous',
      title,
      description,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };

    let targetGameTitle = '';
    setGames((prev) =>
      prev.map((g) => {
        if (g.id === gameId) {
          targetGameTitle = g.title;
          return {
            ...g,
            bugReports: [newBug, ...(g.bugReports || [])]
          };
        }
        return g;
      })
    );

    // แจ้งเตือน Dev ทันที
    const bugNotif = {
      id: `notif-bug-${Date.now()}`,
      role: 'developer',
      title: '🐛 มีผู้เล่นรายงานบั๊กใหม่',
      message: `มีผู้ใช้แจ้งปัญหาในเกม "${targetGameTitle}": "${title}"`,
      time: 'เมื่อสักครู่',
      isRead: false
    };
    setNotifications((prev) => [bugNotif, ...prev]);

    return {
      success: true,
      message: 'ส่งรายงานบั๊กถึงผู้พัฒนาเรียบร้อยแล้ว!'
    };
  };

  /**
   * ลบเกม
   */
  const deleteGame = (gameId) => {
    setGames((prev) => prev.filter((g) => g.id !== gameId));
  };

  /**
   * เล่นเกม WebGL
   */
  const openGamePlayer = (game) => {
    setActivePlayingGame(game);
    setGames((prev) =>
      prev.map((g) => (g.id === game.id ? { ...g, playCount: (g.playCount || 0) + 1 } : g))
    );
  };

  const closeGamePlayer = () => {
    setActivePlayingGame(null);
  };

  /**
   * รีเซ็ตเกมกลับสู่ค่าเริ่มต้น
   */
  const resetToDefaultGames = () => {
    setGames(INITIAL_GAMES);
    setNotifications(MOCK_NOTIFICATIONS);
    localStorage.removeItem('indiethai_games');
    localStorage.removeItem('indiethai_notifications');
  };

  const value = {
    games,
    approvedGames,
    pendingGames,
    myDeveloperGames,
    filteredApprovedGames,
    wishlist,
    toggleWishlist,
    notifications: roleNotifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    searchQuery,
    setSearchQuery,
    selectedEngine,
    setSelectedEngine,
    selectedCategory,
    setSelectedCategory,
    isWishlistOnly,
    setIsWishlistOnly,
    selectedGameForDetail,
    setSelectedGameForDetail,
    activePlayingGame,
    openGamePlayer,
    closeGamePlayer,
    submitNewGame,
    approveGame,
    rejectGame,
    updateGameVersionWithPatchNotes,
    updateBugStatus,
    downloadPcGame,
    addReview,
    addBugReport,
    deleteGame,
    resetToDefaultGames,
    TOKEN_COST_PER_GAME
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
