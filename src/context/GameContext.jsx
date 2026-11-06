/**
 * GameContext.jsx
 * ศูนย์รวม State และฟังก์ชันสำหรับจัดการข้อมูลเกมอินดี้ WebGL/PC
 * - จัดการคลังเกม, กรอง Engine, อนุมัติ/ปฏิเสธเกม, หักเหรียญ Token
 * - จัดการรายงานบั๊ก (Bug Tracking): ให้ Dev ตรวจสอบและอัปเดตสถานะบั๊กเป็น 'fixed' หรือ 'investigating'
 * - ระบบ Wishlist / บันทึกเกมโปรด
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_GAMES, TOKEN_COST_PER_GAME } from '../data/mockData';
import { useAuth } from './AuthContext';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { currentUser, devTokenBalance, updateTokenBalance } = useAuth();

  // รายการเกมทั้งหมด
  const [games, setGames] = useState(() => {
    const saved = localStorage.getItem('indiethai_games');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved games, fallback to initial.', e);
      }
    }
    return INITIAL_GAMES;
  });

  // รายการเกมที่กดบันทึกเป็นรายการโปรด (Wishlist)
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('indiethai_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // ตัวกรอง (Search, Engine, Category, Sort)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'rating' | 'newest'

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

  // กรองและจัดเรียงเกมที่อนุมัติแล้ว
  const filteredApprovedGames = useMemo(() => {
    let result = approvedGames.filter((game) => {
      const matchSearch =
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchEngine = selectedEngine === 'All' || game.engine === selectedEngine;
      const matchCategory = selectedCategory === 'All' || game.category === selectedCategory;

      return matchSearch && matchEngine && matchCategory;
    });

    // เรียงลำดับ
    if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      // popular
      result.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
    }

    return result;
  }, [approvedGames, searchQuery, selectedEngine, selectedCategory, sortBy]);

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
   * ฟังก์ชันสำหรับ Developer: อัปเดตสถานะของบั๊กที่ถูกรายงาน (Bug Tracking)
   * เช่น จาก 'pending' -> 'investigating' -> 'fixed'
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
   * ฟังก์ชันลงเกมใหม่สำหรับ Developer (หัก 50 Tokens)
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
      trailerUrl: gameData.trailerUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1',
      thumbnail:
        gameData.thumbnail ||
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
      screenshots: [
        gameData.thumbnail ||
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80'
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

    return {
      success: true,
      message: `ส่งเกม "${newGame.title}" เข้าคิวตรวจสอบเรียบร้อยแล้ว! (หักค่าธรรมเนียม ${cost} Tokens)`,
      game: newGame
    };
  };

  /**
   * ฟังก์ชันสำหรับ Admin: อนุมัติเกม
   */
  const approveGame = (gameId) => {
    setGames((prev) =>
      prev.map((game) => (game.id === gameId ? { ...game, status: 'approved' } : game))
    );
    return {
      success: true,
      message: 'อนุมัติเกมขึ้นสโตร์เรียบร้อยแล้ว!'
    };
  };

  /**
   * ฟังก์ชันสำหรับ Admin: ปฏิเสธเกม
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
   * อัปเดตเวอร์ชันเกม
   */
  const updateGameVersion = (gameId, newVersion) => {
    setGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, version: newVersion } : g))
    );
    return {
      success: true,
      message: `อัปเดตเวอร์ชันเป็น ${newVersion} สำเร็จ!`
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
      status: 'pending', // 'pending' | 'investigating' | 'fixed'
      date: new Date().toISOString().split('T')[0]
    };

    setGames((prev) =>
      prev.map((g) => {
        if (g.id === gameId) {
          return {
            ...g,
            bugReports: [newBug, ...(g.bugReports || [])]
          };
        }
        return g;
      })
    );

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
    localStorage.removeItem('indiethai_games');
  };

  const value = {
    games,
    approvedGames,
    pendingGames,
    myDeveloperGames,
    filteredApprovedGames,
    wishlist,
    toggleWishlist,
    searchQuery,
    setSearchQuery,
    selectedEngine,
    setSelectedEngine,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    selectedGameForDetail,
    setSelectedGameForDetail,
    activePlayingGame,
    openGamePlayer,
    closeGamePlayer,
    submitNewGame,
    approveGame,
    rejectGame,
    updateGameVersion,
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
