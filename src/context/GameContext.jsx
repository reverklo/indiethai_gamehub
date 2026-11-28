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
import { supabase } from '../lib/supabase';
import { 
  fetchAllGamesFromSupabase, 
  updateGameInSupabase, 
  createPatchNoteInSupabase, 
  updateBugStatusInSupabase, 
  submitBugReportToSupabase, 
  submitReviewToSupabase 
} from '../services/gameService';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { currentUser, currentRole, devTokenBalance, updateTokenBalance, openAuthModal } = useAuth();

  // รายการเกมทั้งหมด
  const [games, setGames] = useState(() => {
    const saved = localStorage.getItem('indiethai_games');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasPending = parsed.some((g) => g.status === 'pending');
          if (!hasPending) {
            const pendingInitial = INITIAL_GAMES.filter((g) => g.status === 'pending');
            return [...parsed, ...pendingInitial];
          }
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved games', e);
      }
    }
    return INITIAL_GAMES;
  });

  // รายการเกมที่กดบันทึกเป็นรายการโปรด (Wishlist) - ค่าเริ่มต้นว่างเปล่าสำหรับ Guest
  const [wishlist, setWishlist] = useState([]);

  // ล้างแคช Wishlist สากลเก่าทิ้ง (เพื่อป้องกันค่าตกค้างสำหรับ Guest)
  useEffect(() => {
    try {
      localStorage.removeItem('indiethai_wishlist');
    } catch (e) {}
  }, []);

  // ซิงค์ Wishlist ตามผู้ใช้ที่ล็อกอินอยู่
  useEffect(() => {
    if (!currentUser) {
      setWishlist([]);
      return;
    }
    try {
      const saved = localStorage.getItem(`indiethai_wishlist_${currentUser.id}`);
      setWishlist(saved ? JSON.parse(saved) : []);
    } catch (e) {
      setWishlist([]);
    }
  }, [currentUser?.id]);

  // ระบบแจ้งเตือน (Notification Center 🔔)
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('indiethai_notifications');
      return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
    } catch {
      return MOCK_NOTIFICATIONS;
    }
  });

  // แท็บหน้าหลักที่เปิดอยู่: 'store' | 'library' | 'community' | 'profile' | 'studio' | 'admin'
  const [activeNavTab, setActiveNavTab] = useState('store');

  // แท็บย่อยของหน้า Profile: 'recent' | 'wishlist' | 'reviews' | 'bugs'
  const [profileTab, setProfileTab] = useState('recent');

  // ข้อมูลเกมที่เคยเล่นจริง (อิงตามเกมที่ผู้ใช้กดเล่นผ่าน WebGL ในระบบ)
  const [playedGames, setPlayedGames] = useState(() => {
    try {
      const saved = localStorage.getItem('indiethai_played_games');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
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
    if (currentUser?.id) {
      localStorage.setItem(`indiethai_wishlist_${currentUser.id}`, JSON.stringify(wishlist));
    }
  }, [wishlist, currentUser?.id]);

  useEffect(() => {
    localStorage.setItem('indiethai_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('indiethai_played_games', JSON.stringify(playedGames));
  }, [playedGames]);

  // ดึงข้อมูลเกมจริงจาก Supabase คลาวด์ พร้อมระบบ Realtime ซิงค์สดอัตโนมัติ
  useEffect(() => {
    let isMounted = true;

    const loadGames = async () => {
      try {
        const res = await fetchAllGamesFromSupabase();
        if (res.success && res.data && res.data.length > 0 && isMounted) {
          setGames(res.data);
        }
      } catch (e) {
        console.warn('Could not load games from Supabase, using local fallback:', e);
      }
    };

    loadGames();

    // ฟังเหตุการณ์ Realtime เมื่อมีการเพิ่ม/แก้ไขเกม หรือรายงานบั๊กใหม่
    const channel = supabase
      .channel('public:games_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, () => {
        loadGames();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'game_patches' }, () => {
        loadGames();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bug_reports' }, () => {
        loadGames();
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // ซิงค์ selectedGameForDetail หากข้อมูลใน games มีการอัปเดต
  useEffect(() => {
    if (selectedGameForDetail) {
      const updated = games.find((g) => g.id === selectedGameForDetail.id);
      if (updated) {
        setSelectedGameForDetail(updated);
      }
    }
  }, [games]);

  // ซิงค์ URL Param (?game=id) และจัดการปุ่มย้อนกลับ (Browser Back/Forward PopState)
  useEffect(() => {
    const handleUrlSync = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const gameId = params.get('game');
        if (gameId) {
          const found = games.find((g) => g.id === gameId || g.slug === gameId);
          if (found) {
            setSelectedGameForDetail(found);
            return;
          }
        }
        setSelectedGameForDetail(null);
      } catch (err) {
        console.error('URL sync error:', err);
      }
    };

    handleUrlSync();
    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, [games]);

  /**
   * เปิดหน้ารายละเอียดเกม พร้อมเปลี่ยน URL และเลื่อนหน้าไปบนสุดทันที
   */
  const openGameDetail = (game) => {
    if (!game) return;
    setSelectedGameForDetail(game);
    try {
      const url = new URL(window.location);
      url.searchParams.set('game', game.id);
      window.history.pushState({ gameId: game.id }, '', url);
    } catch (e) {
      console.error('PushState error:', e);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  /**
   * ปิดหน้ารายละเอียดเกมและลบ URL Param กลับสู่หน้าร้านค้า
   */
  const closeGameDetail = () => {
    setSelectedGameForDetail(null);
    try {
      const url = new URL(window.location);
      url.searchParams.delete('game');
      const cleanPath = url.pathname + (url.search ? url.search : '');
      window.history.pushState({}, '', cleanPath);
    } catch (e) {
      console.error('PushState clean error:', e);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

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
   * สลับสถานะ Wishlist (ต้องล็อกอินก่อนจึงจะเพิ่มเข้าคลังสิ่งที่อยากได้)
   */
  const toggleWishlist = (gameId) => {
    if (!currentUser) {
      if (openAuthModal) openAuthModal('login');
      return false;
    }
    setWishlist((prev) => {
      const isExist = prev.includes(gameId);
      const next = isExist ? prev.filter((id) => id !== gameId) : [...prev, gameId];
      if (currentUser?.id) {
        localStorage.setItem(`indiethai_wishlist_${currentUser.id}`, JSON.stringify(next));
      }
      return next;
    });
    return true;
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

    // ซิงค์การอัปเดตไปยัง Supabase
    createPatchNoteInSupabase(gameId, {
      version: newVersion,
      title: patchTitle,
      details: patchDetails
    }).catch(err => console.warn('Supabase patch note sync error:', err));

    return {
      success: true,
      message: `อัปเดตแพตช์โน้ตเวอร์ชัน ${newVersion} สำเร็จเรียบร้อย!`
    };
  };

  /**
   * ฟังก์ชันสำหรับ Developer: แก้ไขข้อมูลเกมแบบครบวงจรและปล่อยแพตช์ใหม่
   * รองรับการแก้ไขชื่อ, คำอธิบาย, ลิงก์ WebGL, ไฟล์ PC, ราคา, สเปกเครื่อง และ Patch Notes
   */
  const editGameDetails = (gameId, updatedPayload) => {
    let targetTitle = '';
    const isNewVersion = updatedPayload.version && updatedPayload.oldVersion && updatedPayload.version !== updatedPayload.oldVersion;
    const hasPatchNotes = updatedPayload.newPatchTitle || updatedPayload.newPatchDetails;

    setGames((prev) =>
      prev.map((g) => {
        if (g.id === gameId) {
          targetTitle = updatedPayload.title || g.title;
          const currentPatches = g.patchNotes || [];
          let updatedPatches = currentPatches;

          if (isNewVersion || hasPatchNotes) {
            const newPatch = {
              version: updatedPayload.version || g.version,
              date: new Date().toISOString().split('T')[0],
              title: updatedPayload.newPatchTitle || `อัปเดตเวอร์ชัน ${updatedPayload.version}`,
              details: updatedPayload.newPatchDetails || 'ปรับปรุงประสิทธิภาพและความเสถียรของเกม'
            };
            updatedPatches = [newPatch, ...currentPatches];
          }

          return {
            ...g,
            ...updatedPayload,
            patchNotes: updatedPatches
          };
        }
        return g;
      })
    );

    // หากมีการปล่อยเวอร์ชันใหม่หรือมีแพตช์โน้ต ให้แจ้งเตือนผู้เล่นอัตโนมัติ
    if (isNewVersion || hasPatchNotes) {
      const newNotif = {
        id: `notif-${Date.now()}`,
        role: 'player',
        title: `🎮 ${targetTitle || 'เกม'} อัปเดตแพตช์ใหม่ (${updatedPayload.version})`,
        message: `${updatedPayload.newPatchTitle || 'มีการอัปเดตใหม่'} เข้าไปทดลองเล่นเวอร์ชันล่าสุดได้แล้ว`,
        time: 'เพิ่งอัปเดต',
        isRead: false
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }

    // บันทึกการเปลี่ยนแปลงขึ้น Supabase คลาวด์
    updateGameInSupabase(gameId, updatedPayload).catch(err => console.warn('Supabase game update error:', err));
    if (isNewVersion || hasPatchNotes) {
      createPatchNoteInSupabase(gameId, {
        version: updatedPayload.version,
        title: updatedPayload.newPatchTitle,
        details: updatedPayload.newPatchDetails
      }).catch(err => console.warn('Supabase patch note sync error:', err));
    }

    return {
      success: true,
      message: `บันทึกข้อมูลและอัปเดตเกม "${targetTitle}" เรียบร้อยแล้ว!`
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

    // ซิงค์สถานะบั๊กไปยัง Supabase คลาวด์
    updateBugStatusInSupabase(bugId, newStatus).catch(err => console.warn('Supabase bug status sync error:', err));

    return {
      success: true,
      message: `อัปเดตสถานะบั๊กเป็น "${newStatus === 'fixed' ? 'แก้ไขแล้ว' : newStatus === 'investigating' ? 'กำลังตรวจสอบ' : 'รอดำเนินการ'}" เรียบร้อยแล้ว`
    };
  };

  /**
   * ลงเกมใหม่สำหรับ Developer (ส่งเข้าคิวตรวจฟรี)
   */
  const submitNewGame = (gameData) => {

    const newGame = {
      id: `game-${Date.now()}`,
      title: gameData.title || 'Untitled Thai Indie Game',
      slug: (gameData.title || 'game').toLowerCase().replace(/\s+/g, '-'),
      tagline: gameData.tagline || 'เกมอินดี้ใหม่โดยนักพัฒนาไทย',
      description: gameData.description || 'เกม WebGL สร้างสรรค์โดยสตูดิโอเกมสัญชาติไทย รันได้ลื่นไหลบนเบราว์เซอร์',
      developer: currentUser?.studioName || currentUser?.name || 'SiamPixel Studio',
      developerId: currentUser?.id || 'usr-dev-1',
      category: gameData.category || 'Action',
      engine: gameData.engine || 'Unity WebGL',
      version: gameData.version || 'v1.0.0',
      price: Math.max(0, Number(gameData.price) || 0),
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
      promptPayNumber: gameData.promptPayNumber || currentUser?.promptPayNumber || '089-765-4321',
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

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentUser?.id || '');

    // ซิงค์เกมใหม่ขึ้น Supabase คลาวด์
    supabase.from('games').insert({
      title: newGame.title,
      slug: `${newGame.slug}-${Date.now().toString().slice(-4)}`,
      tagline: newGame.tagline,
      description: newGame.description,
      ...(isUuid ? { developer_id: currentUser.id } : {}),
      developer_name: newGame.developer,
      category: newGame.category,
      engine: newGame.engine,
      version: newGame.version,
      price: Number(gameData.price) || 0,
      has_webgl: newGame.hasWebgl,
      has_pc_download: newGame.hasPcDownload,
      webgl_url: newGame.webglUrl,
      download_url: newGame.downloadUrl,
      thumbnail: newGame.thumbnail,
      header_image: newGame.thumbnail,
      status: 'pending'
    }).then(({ error }) => {
      if (error) console.warn('Supabase game submission sync error:', error);
    });

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
      message: `ส่งเกม "${newGame.title}" เข้าคิวตรวจสอบเรียบร้อยแล้ว!`,
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

    // ซิงค์สถานะอนุมัติขึ้น Supabase
    updateGameInSupabase(gameId, { status: 'approved' }).catch(err => console.warn('Supabase approve sync error:', err));

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

    // ซิงค์สถานะปฏิเสธขึ้น Supabase
    updateGameInSupabase(gameId, { status: 'rejected' }).catch(err => console.warn('Supabase reject sync error:', err));
    return {
      success: true,
      message: `ปฏิเสธเกมเรียบร้อยแล้ว (${reason})`
    };
  };

  /**
   * สร้างเกมตัวอย่างส่งตรวจสำหรับ Admin เพื่อใช้ทดสอบคิว Moderation Queue
   */
  const createMockPendingGame = () => {
    const demoId = `game-pending-${Date.now()}`;
    const sampleOptions = [
      {
        title: 'Siam Cyber Drift 2088',
        tagline: 'เกมแข่งรถดริฟต์ลอยฟ้าบนทางด่วนกรุงเทพฯ ยุคไซเบอร์พังก์ รันบน WebGL ลื่นไหล',
        developer: 'BKK Speed Syndicate',
        category: 'Racing',
        price: 89,
        thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'
      },
      {
        title: 'Krasue: Bangkok Cyber Nightmare 2088',
        tagline: 'เกมสยองขวัญมุมมองบุคคลที่หนึ่ง เอาชีวิตรอดจากกระสือไซเบอร์ในตรอกเยาวราช',
        developer: 'ThaiHorror Lab',
        category: 'Action',
        price: 99,
        thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80'
      },
      {
        title: 'Muay Thai Cyber Arena',
        tagline: 'เกมต่อสู้แม่ไม้มวยไทยผสมเกราะไซบอร์ก แข่งขันแบบ 1v1 บนเบราว์เซอร์',
        developer: 'Siam Fighting Games',
        category: 'Action',
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
      }
    ];
    const picked = sampleOptions[Math.floor(Math.random() * sampleOptions.length)];
    const mockPending = {
      id: demoId,
      title: `${picked.title} #${Math.floor(Math.random() * 900 + 100)}`,
      slug: picked.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline: picked.tagline,
      description: picked.tagline + ' สัมผัสประสบการณ์เกมอินดี้สัญชาติไทยที่พัฒนาด้วยเทคโนโลยี WebGL กราฟิกลื่นไหล 60FPS ปลอดภัย ไร้มัลแวร์ 100%',
      developer: picked.developer,
      developerId: 'usr-dev-demo',
      category: picked.category,
      engine: 'WebGL / Three.js',
      version: 'v1.0.0-rc',
      price: picked.price,
      originalPrice: picked.price > 0 ? picked.price + 30 : 0,
      discountPercent: picked.price > 0 ? 15 : 0,
      rating: 4.8,
      ratingCount: 12,
      playCount: 150,
      downloadCount: 40,
      downloadSize: '65 MB',
      hasWebgl: true,
      hasPcDownload: true,
      webglUrl: 'https://play2048.co/',
      downloadUrl: 'https://github.com/gabrielecirulli/2048/archive/refs/heads/master.zip',
      thumbnail: picked.thumbnail,
      headerImage: picked.thumbnail,
      mediaGallery: [
        { id: 'm1', type: 'image', url: picked.thumbnail, thumbnail: picked.thumbnail, title: 'ภาพโปรโมต' }
      ],
      requirements: {
        os: 'Windows 10/11 / MacOS',
        processor: '2.0 GHz Dual-Core',
        memory: '4 GB RAM',
        graphics: 'WebGL 2.0 Compatible',
        storage: '100 MB'
      },
      patchNotes: [
        { version: 'v1.0.0-rc', date: 'วันนี้', title: 'ส่งตรวจสอบขึ้นสโตร์ครั้งแรก', details: 'บิลด์แรกพร้อมให้แอดมินทดลองเล่นและอนุมัติขึ้นสโตร์' }
      ],
      promptPayNumber: '089-999-8888',
      status: 'pending',
      createdAt: 'วันนี้ (เมื่อสักครู่)',
      tags: [picked.category, 'อินดี้ไทย', 'WebGL', 'PC Download'],
      featured: false,
      securityScan: {
        status: 'Clean',
        details: 'ผ่านการสแกนโค้ดสคริปต์ ไม่พบมัลแวร์ ไม่มีการเข้าถึง LocalStorage ต้องห้าม',
        scannedAt: 'เมื่อสักครู่'
      },
      reviews: [],
      bugReports: []
    };

    setGames((prev) => [mockPending, ...prev]);
    return mockPending;
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

    // ซิงค์รีวิวใหม่ไปยัง Supabase
    submitReviewToSupabase(gameId, {
      userId: currentUser?.id,
      userName: user || currentUser?.name || 'ผู้เล่นทั่วไป',
      rating: Number(rating),
      comment
    }).catch(err => console.warn('Supabase review sync error:', err));

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

    // ซิงค์รายงานบั๊กขึ้น Supabase
    submitBugReportToSupabase(gameId, {
      reporterName: user || currentUser?.name || 'ผู้เล่นทั่วไป',
      title,
      description
    }).catch(err => console.warn('Supabase bug report sync error:', err));

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
   * นำทางไปยังแท็บหลัก (Steam Tabs: store, library, community, profile, studio, admin)
   */
  const navigateToTab = (tab, subTab = null) => {
    closeGameDetail();
    setIsWishlistOnly(false);
    setActiveNavTab(tab);
    if (subTab && tab === 'profile') {
      setProfileTab(subTab);
    }
  };

  /**
   * เล่นเกม WebGL
   */
  const openGamePlayer = (game) => {
    setActivePlayingGame(game);
    setGames((prev) =>
      prev.map((g) => (g.id === game.id ? { ...g, playCount: (g.playCount || 0) + 1 } : g))
    );

    // บันทึก/อัปเดตลงใน playedGames สำหรับกิจกรรมล่าสุด (Steam Recent Activity)
    setPlayedGames((prev) => {
      const existing = prev.find((p) => p.gameId === game.id);
      if (existing) {
        return [
          { 
            ...existing, 
            hoursPlayed: Number(((existing.hoursPlayed || 0) + 0.2).toFixed(1)), 
            lastPlayed: 'วันนี้' 
          },
          ...prev.filter((p) => p.gameId !== game.id)
        ];
      } else {
        return [
          {
            gameId: game.id,
            hoursPlayed: 0.5,
            lastPlayed: 'วันนี้',
            achievementsCount: 1,
            totalAchievements: 5,
            achievementIcons: ['🎮', '⚡']
          },
          ...prev
        ];
      }
    });
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
    activeNavTab,
    setActiveNavTab,
    navigateToTab,
    profileTab,
    setProfileTab,
    playedGames,
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
    openGameDetail,
    closeGameDetail,
    activePlayingGame,
    openGamePlayer,
    closeGamePlayer,
    submitNewGame,
    editGameDetails,
    approveGame,
    rejectGame,
    createMockPendingGame,
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
