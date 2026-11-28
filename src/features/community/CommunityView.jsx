/**
 * CommunityView.jsx
 * ศูนย์รวมชุมชนผู้เล่นและนักพัฒนาเกมอินดี้สัญชาติไทย (Steam Community Hub)
 * - แบนเนอร์กิจกรรม Game Jam & Spotlight ประจำสัปดาห์
 * - กระดานสนทนา (Community Discussions & Forum) สามารถสร้างกระทู้และตอบกลับได้
 * - ฟีดบทวิจารณ์สดจากผู้เล่น (Live Player Reviews)
 * - คู่มือและเทคนิคการเล่น (Guides & Walkthroughs)
 * - แกลเลอรีภาพถ่ายหน้าจอและคลิปจากคอมมูนิตี้ (Screenshots & Artwork)
 */

import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Sparkles, 
  Trophy, 
  Flame, 
  Star, 
  ThumbsUp, 
  Share2, 
  Eye, 
  Search, 
  Plus, 
  BookOpen, 
  Camera, 
  HelpCircle, 
  Code2, 
  ChevronRight,
  Send,
  CheckCircle2,
  Tag,
  X,
  MessageCircle,
  Play,
  History,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';

// ข้อมูลกระทู้ตัวอย่างในคอมมูนิตี้
const INITIAL_DISCUSSIONS = [
  {
    id: 'disc-1',
    category: 'discussion',
    categoryLabel: 'พูดคุยทั่วไป',
    categoryColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    title: 'แนะนำ 3 เกมอินดี้ไทยสาย Puzzle ที่ภาพสวยและเล่นบนเว็บได้ลื่นไหลมากๆ',
    author: 'Tsukiko_83',
    authorAvatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80',
    authorBadge: 'Level 12',
    date: '2 ชั่วโมงที่แล้ว',
    gameRelated: '2048 Cyber Siam',
    repliesCount: 14,
    viewsCount: 342,
    upvotes: 28,
    isPinned: true,
    content: 'หลังจากลองเล่น 2048 Cyber Siam และ Hextris Neon Pulse บน IndieThai Hub ประทับใจมากที่รันบน WebGL ได้ 60 FPS ปราศจากอาการแลค ดนตรีซาวด์แทร็กอิเล็กทรอนิกส์ไทยเพราะมาก อยากชวนเพื่อนๆ มาแลกเปลี่ยนไฮสปีดเทคนิคกันครับ!'
  },
  {
    id: 'disc-2',
    category: 'gamejam',
    categoryLabel: 'หาทีม / Game Jam',
    categoryColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    title: 'หาเพื่อนร่วมทีม Game Jam 2026: ต้องการ 3D Modeler & Sound Designer สไตล์ Cyberpunk',
    author: 'CyberChon Dev',
    authorAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&auto=format&fit=crop&q=80',
    authorBadge: 'Verified Dev',
    date: 'เมื่อวานนี้',
    gameRelated: 'Swoop 3D Siam Flight',
    repliesCount: 9,
    viewsCount: 189,
    upvotes: 19,
    isPinned: false,
    content: 'ทีมเรากำลังพัฒนาเกมแนว Flight Simulation ผสม Sci-Fi กรุงเทพฯ ปี 2088 ด้วย Three.js ต้องการคนช่วยทำ 3D Low-Poly และทำ Sound Effects สไตล์ไทยไซเบอร์ มีแผนส่งประกวดใน Thai Indie Game Jam 2026 ชิงเงินรางวัลครับ'
  },
  {
    id: 'disc-3',
    category: 'devtalk',
    categoryLabel: 'เทคนิคการพัฒนา',
    categoryColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    title: 'แชร์เทคนิค Optimizing WebGL สำหรับ Unity WebGL และ Three.js ให้โหลดไวใน 5 วินาที',
    author: 'SiamPixel Studio',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
    authorBadge: 'Studio Lead',
    date: '3 วันที่แล้ว',
    gameRelated: '2048 Cyber Siam',
    repliesCount: 22,
    viewsCount: 650,
    upvotes: 45,
    isPinned: false,
    content: 'ปัญหาหลักของเกม WebGL ในไทยคือขนาดไฟล์ Asset ที่ใหญ่เกินไป เราใช้ Gzip/Brotli compression + WebP textures ลดขนาดจาก 60MB เหลือเพียง 14MB ทำให้ผู้เล่นเปิดเล่นบนเบราว์เซอร์มือถือและคอมพิวเตอร์ได้ทันทีโดยไม่ต้องรอดาวน์โหลดนาน'
  },
  {
    id: 'disc-4',
    category: 'guides',
    categoryLabel: 'คู่มือและทริค',
    categoryColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    title: 'ทริคเก็บ Achievement 100% ในเกม Swoop 3D Siam Flight (ปลดล็อกเครื่องบินลับ)',
    author: 'SkyGamer_TH',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&auto=format&fit=crop&q=80',
    authorBadge: 'Beta Tester',
    date: '5 วันที่แล้ว',
    gameRelated: 'Swoop 3D Siam Flight',
    repliesCount: 7,
    viewsCount: 215,
    upvotes: 16,
    isPinned: false,
    content: 'สำหรับใครที่กำลังติดเงื่อนไขการบินลอดใต้สะพานพระราม 8 ในเวลา 45 วินาที แนะนำให้ปรับมุมกล้องแบบ First-person และใช้เทอร์โบค้างไว้ตอนเข้าสู่รอบที่ 2 จะช่วยประหยัดเวลาได้ 4 วินาทีเต็มๆ ครับ'
  }
];

// ข้อมูลภาพหน้าจอคอมมูนิตี้ (Community Screenshots)
const COMMUNITY_SCREENSHOTS = [
  {
    id: 'shot-1',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    title: 'Neon Bangkok Skyway (2048 Cyber Siam)',
    author: 'Tsukiko_83',
    likes: 42,
    game: '2048 Cyber Siam'
  },
  {
    id: 'shot-2',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    title: 'Chao Phraya Sunset Flight',
    author: 'FlightMaster',
    likes: 38,
    game: 'Swoop 3D Siam Flight'
  },
  {
    id: 'shot-3',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    title: 'Hexagon Overdrive Highscore 120k',
    author: 'Krit_Arcade',
    likes: 29,
    game: 'Hextris Neon Pulse'
  }
];

// ข้อมูลความคิดเห็นตัวอย่างในกระทู้ (Community Discussion Comments)
const INITIAL_COMMENTS = {
  'disc-1': [
    {
      id: 'comm-1',
      author: 'CyberChon Dev',
      authorAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
      authorBadge: 'Verified Dev',
      date: '1 ชั่วโมงที่แล้ว',
      content: 'เห็นด้วยเลยครับ ทีมงาน SiamPixel เขา optimize WebGL shader มาได้ดีมาก ตัวไฟล์โหลดไวไม่ถึง 5 วินาที',
      upvotes: 8
    },
    {
      id: 'comm-2',
      author: 'SkyGamer_TH',
      authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      authorBadge: 'Beta Tester',
      date: '30 นาทีที่แล้ว',
      content: 'ชอบดนตรีซาวด์แทร็กตอนคะแนนแตะ 16,384 มาก ดนตรีเปลี่ยนจังหวะเร้าใจสุดๆ!',
      upvotes: 4
    }
  ],
  'disc-2': [
    {
      id: 'comm-3',
      author: 'SiamPixel Studio',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      authorBadge: 'Studio Lead',
      date: '5 ชั่วโมงที่แล้ว',
      content: 'น่าสนใจมากครับ แวะมาแชร์ใน Discord กลางคอมมูนิตี้ได้เลย กำลังมี 3D Modeler หลายคนมองหาทีมแยมอยู่',
      upvotes: 6
    }
  ],
  'disc-3': [
    {
      id: 'comm-4',
      author: 'Tsukiko_83',
      authorAvatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80',
      authorBadge: 'Level 12',
      date: '1 วันที่แล้ว',
      content: 'ขอบคุณสำหรับเทคนิคครับ มีประโยชน์กับมือใหม่ Three.js มากๆ ครับ',
      upvotes: 12
    }
  ],
  'disc-4': [
    {
      id: 'comm-5',
      author: 'NEONPLAYER_T',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      authorBadge: 'Player',
      date: '2 วันที่แล้ว',
      content: 'ทำตามแล้วปลดล็อกเครื่องบินลับได้จริง ขอบคุณครับ!',
      upvotes: 3
    }
  ]
};

export const CommunityView = () => {
  const { currentUser, openAuthModal } = useAuth();
  const { games, openGameDetail, openGamePlayer } = useGame();

  // ตัวกรองหมวดหมู่คอมมูนิตี้: 'all' | 'discussions' | 'gamejam' | 'reviews' | 'guides' | 'screenshots' | 'devlog'
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // กระทู้สนทนา & ความคิดเห็น
  const [discussions, setDiscussions] = useState(INITIAL_DISCUSSIONS);
  const [upvotedIds, setUpvotedIds] = useState([]);
  const [commentsMap, setCommentsMap] = useState(INITIAL_COMMENTS);
  const [upvotedCommentIds, setUpvotedCommentIds] = useState([]);

  // โมดอลกระทู้สนทนาและคอมเมนต์
  const [activeThread, setActiveThread] = useState(null);
  const [newCommentInput, setNewCommentInput] = useState('');
  const [threadCommentNotice, setThreadCommentNotice] = useState(null);

  // โมดอลสร้างกระทู้ใหม่
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('discussion');
  const [newContent, setNewContent] = useState('');
  const [newGameRelated, setNewGameRelated] = useState('2048 Cyber Siam');
  const [postSuccessNotice, setPostSuccessNotice] = useState(false);

  // การกด Upvote กระทู้
  const handleToggleUpvote = (id) => {
    const isAlreadyUpvoted = upvotedIds.includes(id);
    const delta = isAlreadyUpvoted ? -1 : 1;

    setUpvotedIds((prev) => (isAlreadyUpvoted ? prev.filter((i) => i !== id) : [...prev, id]));
    setDiscussions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, upvotes: d.upvotes + delta } : d))
    );
    if (activeThread?.id === id) {
      setActiveThread((prev) => (prev ? { ...prev, upvotes: prev.upvotes + delta } : prev));
    }
  };

  // ฟังก์ชันส่งความคิดเห็นในกระทู้
  const handlePostComment = (e) => {
    e.preventDefault();
    if (!currentUser) {
      if (openAuthModal) openAuthModal('login');
      return;
    }
    if (!newCommentInput.trim() || !activeThread) return;

    const newComment = {
      id: `comm-${Date.now()}`,
      author: currentUser.name,
      authorAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      authorBadge: currentUser.badge || (currentUser.role === 'developer' ? 'Verified Dev' : 'Player'),
      date: 'เมื่อสักครู่',
      content: newCommentInput.trim(),
      upvotes: 1
    };

    setCommentsMap((prev) => ({
      ...prev,
      [activeThread.id]: [newComment, ...(prev[activeThread.id] || [])]
    }));

    // อัปเดตจำนวนตอบกลับในกระทู้
    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === activeThread.id ? { ...d, repliesCount: (d.repliesCount || 0) + 1 } : d
      )
    );

    setNewCommentInput('');
    setThreadCommentNotice('เผยแพร่ความคิดเห็นของคุณสำเร็จ!');
    setTimeout(() => setThreadCommentNotice(null), 3000);
  };

  // ฟังก์ชัน Upvote คอมเมนต์
  const handleToggleCommentUpvote = (commentId) => {
    if (upvotedCommentIds.includes(commentId)) {
      setUpvotedCommentIds((prev) => prev.filter((id) => id !== commentId));
      setCommentsMap((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          next[key] = next[key].map((c) =>
            c.id === commentId ? { ...c, upvotes: c.upvotes - 1 } : c
          );
        });
        return next;
      });
    } else {
      setUpvotedCommentIds((prev) => [...prev, commentId]);
      setCommentsMap((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          next[key] = next[key].map((c) =>
            c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c
          );
        });
        return next;
      });
    }
  };

  // สร้างกระทู้ใหม่
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const categoryMap = {
      discussion: { label: 'พูดคุยทั่วไป', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
      gamejam: { label: 'หาทีม / Game Jam', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
      devtalk: { label: 'เทคนิคการพัฒนา', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      guides: { label: 'คู่มือและทริค', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' }
    };

    const newPost = {
      id: `disc-${Date.now()}`,
      category: newCategory,
      categoryLabel: categoryMap[newCategory]?.label || 'พูดคุยทั่วไป',
      categoryColor: categoryMap[newCategory]?.color || 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      title: newTitle.trim(),
      author: currentUser?.name || 'Tsukiko_83',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80',
      authorBadge: 'Level 12',
      date: 'เมื่อสักครู่',
      gameRelated: newGameRelated,
      repliesCount: 0,
      viewsCount: 1,
      upvotes: 1,
      isPinned: false,
      content: newContent.trim()
    };

    setDiscussions([newPost, ...discussions]);
    setUpvotedIds([...upvotedIds, newPost.id]);
    setIsNewPostModalOpen(false);
    setNewTitle('');
    setNewContent('');

    setPostSuccessNotice(true);
    setTimeout(() => setPostSuccessNotice(false), 3000);
  };

  // กรองกระทู้ตามหมวดหมู่และค้นหา
  const filteredDiscussions = discussions.filter((item) => {
    if (activeFilter === 'discussions' && item.category !== 'discussion') return false;
    if (activeFilter === 'gamejam' && item.category !== 'gamejam') return false;
    if (activeFilter === 'guides' && item.category !== 'guides') return false;
    if (activeFilter === 'devtalk' && item.category !== 'devtalk') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.gameRelated.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // รวบรวมรีวิวล่าสุดจากทุกเกม
  const allRecentReviews = games.flatMap((g) => 
    (g.reviews || []).map((r) => ({
      ...r,
      gameId: g.id,
      gameTitle: g.title,
      gameThumbnail: g.thumbnail,
      gameEngine: g.engine
    }))
  ).slice(0, 6);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notice */}
      {postSuccessNotice && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>โพสต์กระทู้ของคุณลงในคอมมูนิตี้เรียบร้อยแล้ว!</span>
        </div>
      )}

      {/* 1. Community Header Banner - Quiet Chrome */}
      <section className="relative overflow-hidden rounded-2xl bg-[#111827] border border-white/[0.08] p-6 sm:p-8">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-xs font-medium text-indigo-300">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>IndieThai Community Hub</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              ชุมชนผู้เล่นและนักพัฒนาเกมอินดี้ไทย
            </h1>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              พื้นที่แลกเปลี่ยนความคิดเห็น พูดคุยเทคนิคการพัฒนา แนะนำเกมใหม่ 
              และเชื่อมโยงคอมมูนิตี้ผู้สร้างสรรค์ผลงานเกมสัญชาติไทยเข้าด้วยกัน
            </p>
          </div>

          {/* Action: Create Post Button */}
          <div className="shrink-0">
            <button
              onClick={() => setIsNewPostModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-gray-200 text-gray-950 font-semibold text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>สร้างกระทู้สนทนา</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Top Navigation Sub-Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-1.5 rounded-xl bg-[#111827] border border-white/[0.08]">
        {/* Sub-Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-white text-gray-950 font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ทั้งหมด
          </button>

          <button
            onClick={() => setActiveFilter('discussions')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'discussions'
                ? 'bg-white text-gray-950 font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            กระทู้พูดคุย
          </button>

          <button
            onClick={() => setActiveFilter('gamejam')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'gamejam'
                ? 'bg-white text-gray-950 font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            หาทีม Game Jam
          </button>

          <button
            onClick={() => setActiveFilter('devtalk')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'devtalk'
                ? 'bg-white text-gray-950 font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            เทคนิคการพัฒนา
          </button>

          <button
            onClick={() => setActiveFilter('devlog')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'devlog'
                ? 'bg-white text-gray-950 font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🛠️ บันทึกแพตช์ & DevLog
          </button>

          <button
            onClick={() => setActiveFilter('reviews')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'reviews'
                ? 'bg-white text-gray-950 font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            บทวิจารณ์ล่าสุด
          </button>

          <button
            onClick={() => setActiveFilter('screenshots')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'screenshots'
                ? 'bg-white text-gray-950 font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ภาพหน้าจอ & ผลงาน
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาในชุมชน..."
            className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-white/20"
          />
        </div>
      </div>

      {/* 3. Main Content Grid (Two Columns: Left Feed, Right Community Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Discussions / Reviews / Screenshots */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* View 1: Discussions (Default or when filter matches) */}
          {activeFilter !== 'reviews' && activeFilter !== 'screenshots' && activeFilter !== 'devlog' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-semibold text-gray-300">
                  กระทู้สนทนา ({filteredDiscussions.length})
                </span>
                <span>คลิกเพื่อดูและตอบกลับความคิดเห็น</span>
              </div>

              {filteredDiscussions.length === 0 ? (
                <div className="p-12 text-center rounded-xl bg-[#111827] border border-white/[0.06] text-gray-500 text-xs">
                  ไม่พบกระทู้ที่ตรงกับคำค้นหา
                </div>
              ) : (
                filteredDiscussions.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setActiveThread(post)}
                    className="p-5 rounded-xl bg-[#111827] border border-white/[0.08] hover:border-white/20 hover:bg-[#131b2c] transition-all space-y-3 cursor-pointer group"
                  >
                    {/* Header info */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.authorAvatar}
                          alt={post.author}
                          className="w-6 h-6 rounded-md object-cover border border-white/10"
                        />
                        <span className="font-medium text-white">{post.author}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-white/[0.06] text-gray-400 border border-white/[0.06]">
                          {post.authorBadge}
                        </span>
                        <span className="text-gray-500 text-[11px]">• {post.date}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${post.categoryColor}`}>
                          {post.categoryLabel}
                        </span>
                        {post.isPinned && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            📌 ปักหมุด
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {post.title}
                    </h3>

                    {/* Content snippet */}
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                      {post.content}
                    </p>

                    {/* Footer: Related game & interaction buttons */}
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-500">เกมที่เกี่ยวข้อง:</span>
                        <span className="px-2 py-0.5 rounded bg-[#0B0F19] text-gray-300 text-[11px] font-medium border border-white/[0.06]">
                          {post.gameRelated}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Upvote button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleUpvote(post.id);
                          }}
                          className={`flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer ${
                            upvotedIds.includes(post.id)
                              ? 'text-indigo-400 font-semibold'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${upvotedIds.includes(post.id) ? 'fill-current' : ''}`} />
                          <span>{post.upvotes}</span>
                        </button>

                        {/* Reply count */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveThread(post);
                          }}
                          className="flex items-center gap-1.5 text-xs font-mono text-gray-400 group-hover:text-indigo-300 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="font-semibold text-gray-300">{post.repliesCount} ตอบกลับ</span>
                        </button>

                        {/* Views count */}
                        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-gray-500">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{post.viewsCount}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          )}

          {/* View 2: Live Reviews Feed */}
          {activeFilter === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-semibold text-gray-300">บทวิจารณ์ล่าสุดจากคอมมูนิตี้</span>
                <span>จากผู้เล่นทั่วประเทศ</span>
              </div>

              <div className="space-y-3">
                {allRecentReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-[#111827] border border-white/[0.08] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.gameThumbnail}
                          alt={rev.gameTitle}
                          className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                        />
                        <div>
                          <h4 
                            onClick={() => {
                              const targetGame = games.find((g) => g.id === rev.gameId);
                              if (targetGame) openGameDetail(targetGame);
                            }}
                            className="text-xs font-bold text-white hover:text-indigo-300 transition-colors cursor-pointer"
                          >
                            {rev.gameTitle}
                          </h4>
                          <span className="text-[10px] text-gray-500 font-mono">
                            โดย {rev.user} • {rev.date}
                          </span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed bg-[#0B0F19] p-3 rounded-lg border border-white/[0.04]">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View 3: Screenshots & Artwork Showcase */}
          {activeFilter === 'screenshots' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-semibold text-gray-300">ภาพหน้าจอ & ผลงานจากเกมเมอร์</span>
                <span>แชร์ช่วงเวลาประทับใจในเกม</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {COMMUNITY_SCREENSHOTS.map((shot) => (
                  <div
                    key={shot.id}
                    className="group rounded-xl bg-[#111827] border border-white/[0.08] overflow-hidden space-y-3 p-3 hover:border-white/20 transition-colors"
                  >
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-black relative">
                      <img
                        src={shot.imageUrl}
                        alt={shot.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-gray-300 border border-white/[0.08]">
                        {shot.game}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-medium text-white text-xs">{shot.title}</h4>
                        <span className="text-[10px] text-gray-500">โพสต์โดย {shot.author}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-rose-400 font-mono">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{shot.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View 4: DevLog & Game Patch Notes */}
          {activeFilter === 'devlog' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-semibold text-gray-300">
                  บันทึกการพัฒนาและอัปเดตแพตช์ (DevLogs & Patch Notes)
                </span>
                <span>อัปเดตตรงจากทีมผู้สร้างเกม</span>
              </div>

              <div className="space-y-4">
                {[
                  {
                    id: 'devlog-1',
                    gameId: 'game-1',
                    gameTitle: '2048 Cyber Siam',
                    version: 'v1.4.2 Hotfix',
                    date: '20 พ.ย. 2026',
                    author: 'SiamPixel Studio',
                    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                    tag: 'Performance & Shader',
                    summary: 'ปรับปรุงความลื่นไหล WebGL 60 FPS บนมือถือ และเพิ่มเพลงซาวด์แทร็ก synthwave สไตล์ไทยใหม่ 2 เพลง',
                    changes: [
                      'ลดขนาดไฟล์ Bundle จาก 55MB เหลือ 45MB โหลดไวขึ้น 30%',
                      'แก้บั๊กแอนิเมชันรวมบล็อกเลข 8192 ค้างใน Safari',
                      'เพิ่มตัวเลือกปรับระดับเสียง FX แยกกับ BGM'
                    ]
                  },
                  {
                    id: 'devlog-2',
                    gameId: 'game-2',
                    gameTitle: 'Ayutthaya Cyber Samurai: Prototype',
                    version: 'v0.9.5 Combat Polish',
                    date: '18 พ.ย. 2026',
                    author: 'NeonAyodhya Games',
                    authorAvatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150',
                    tag: 'Gameplay Update',
                    summary: 'ปรับสมดุลวิชาดาบพลาสมา Parry Window 0.3s เพิ่มระบบ Dash Dodge และปรับปรุง Hitbox บอสป้อมประตูเมือง',
                    changes: [
                      'เพิ่มเอฟเฟกต์ประกายไฟเมื่อกด Parry สำเร็จ',
                      'รองรับจอยคอนโทรลเลอร์ DualSense และ Xbox ผ่าน Web Gamepad API',
                      'แก้ปัญหาเสียงกระตุกเมื่อศัตรูปรากฏตัวพร้อมกันเกิน 8 ตัว'
                    ]
                  },
                  {
                    id: 'devlog-3',
                    gameId: 'game-3',
                    gameTitle: 'Bangkok Drift 2088',
                    version: 'v1.1.0 New Track',
                    date: '15 พ.ย. 2026',
                    author: 'BKK Speed Syndicate',
                    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
                    tag: 'Content Update',
                    summary: 'เปิดตัวสนามแข่งด่วนลอยฟ้าสะพานพระราม 8 ยามค่ำคืน พร้อมการแต่งรถตุ๊กตุ๊กเทอร์โบไอพ่นพลังงานพลาสมา',
                    changes: [
                      'สนามแข่งใหม่: Rama VIII Skyway (Night Circuit)',
                      'ระบบ Ghost Car เทียบเวลากับอันดับ 1 ของโลกแบบ Real-time',
                      'ปรับจูนฟิสิกส์ Drift ให้ควบคุมง่ายขึ้นบนคีย์บอร์ด'
                    ]
                  }
                ].map((log) => {
                  const targetGame = games.find((g) => g.id === log.gameId);
                  return (
                    <div
                      key={log.id}
                      className="p-5 rounded-xl bg-[#111827] border border-white/[0.08] hover:border-white/20 transition-colors space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={log.authorAvatar}
                            alt={log.author}
                            className="w-7 h-7 rounded-md object-cover border border-white/10"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{log.gameTitle}</span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold">
                                {log.version}
                              </span>
                            </div>
                            <span className="text-[11px] text-gray-500 font-mono">
                              โดย {log.author} • {log.date}
                            </span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {log.tag}
                        </span>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed">
                        {log.summary}
                      </p>

                      <div className="bg-[#0B0F19] rounded-lg p-3 border border-white/[0.04] space-y-1.5">
                        <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5">
                          <History className="w-3.5 h-3.5 text-indigo-400" />
                          <span>รายการเปลี่ยนแปลงในเวอร์ชันนี้:</span>
                        </span>
                        <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                          {log.changes.map((change, idx) => (
                            <li key={idx} className="text-[11px] text-gray-300">{change}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[11px] text-gray-500">เวอร์ชันนี้พร้อมให้เล่นบนเว็บแล้ว</span>
                        <div className="flex items-center gap-2">
                          {targetGame && (
                            <>
                              <button
                                onClick={() => openGamePlayer(targetGame)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                <span>ลองเล่น WebGL</span>
                              </button>
                              <button
                                onClick={() => openGameDetail(targetGame)}
                                className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-gray-300 hover:text-white text-xs font-medium border border-white/[0.08] transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <span>ดูหน้าร้าน</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (1 Col): Community Sidebar */}
        <div className="space-y-5">
          
          {/* Game Jam Spotlight Card */}
          <div className="p-4 rounded-xl bg-[#111827] border border-white/[0.08] space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
              <Trophy className="w-4 h-4" />
              <span>Thai Indie Game Jam 2026</span>
            </div>
            
            <p className="text-xs text-gray-300 leading-relaxed">
              กิจกรรมแข่งขันสร้างเกมอินดี้ธีม <strong>"Cyberpunk Siam 2088"</strong> ชิงเงินรางวัลรวม 50,000 บาท ส่งผลงานก่อนวันที่ 30 พ.ย. 2026
            </p>

            <button
              onClick={() => setActiveFilter('gamejam')}
              className="w-full py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-gray-200 hover:text-white text-xs font-medium border border-white/[0.08] transition-colors cursor-pointer text-center"
            >
              ดูกระทู้หาทีม / สมาชิก
            </button>
          </div>

          {/* Guidelines Box */}
          <div className="p-4 rounded-xl bg-[#111827] border border-white/[0.08] space-y-2 text-xs">
            <span className="font-semibold text-white block">กติกามารยาทในชุมชน</span>
            <ul className="space-y-1.5 text-gray-400 list-disc list-inside text-[11px]">
              <li>สุภาพ ให้เกียรติผู้พัฒนาและผู้เล่นท่านอื่น</li>
              <li>แลกเปลี่ยนติชมผลงานอย่างสร้างสรรค์</li>
              <li>หากพบบั๊ก สามารถแจ้งผ่านหน้ารายละเอียดเกมได้โดยตรง</li>
              <li>ห้ามโพสต์สแปมหรือลิงก์ที่ไม่เกี่ยวข้องกับเกมอินดี้</li>
            </ul>
          </div>

          {/* Popular Tags Box */}
          <div className="p-4 rounded-xl bg-[#111827] border border-white/[0.08] space-y-2.5">
            <span className="text-xs font-semibold text-white block">หัวข้อยอดนิยม</span>
            <div className="flex flex-wrap gap-1.5">
              {['#UnityWebGL', '#ThreeJS', '#GameJam2026', '#ThaiIndie', '#Puzzle', '#Action', '#Feedback', '#PixelArt'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag.replace('#', ''))}
                  className="px-2 py-1 rounded bg-[#0B0F19] hover:bg-white/[0.08] text-gray-400 hover:text-white text-[11px] font-mono border border-white/[0.06] transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 4. New Discussion Modal */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#111827] border border-white/[0.1] shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>สร้างกระทู้สนทนาใหม่</span>
              </h3>
              <button
                onClick={() => setIsNewPostModalOpen(false)}
                className="text-gray-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              
              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">หมวดหมู่</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-white/20"
                >
                  <option value="discussion">พูดคุยทั่วไป (General Discussion)</option>
                  <option value="gamejam">หาทีม / ข่าว Game Jam</option>
                  <option value="devtalk">เทคนิคการพัฒนา (Dev Talks & Engine)</option>
                  <option value="guides">คู่มือและเทคนิคการเล่น (Guides & Tips)</option>
                </select>
              </div>

              {/* Game Related */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">เกมที่เกี่ยวข้อง</label>
                <select
                  value={newGameRelated}
                  onChange={(e) => setNewGameRelated(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-white/20"
                >
                  {games.map((g) => (
                    <option key={g.id} value={g.title}>{g.title}</option>
                  ))}
                  <option value="ทั่วไป">ทั่วไป (General / ไม่ระบุเกม)</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">หัวข้อกระทู้</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ตั้งชื่อหัวข้อที่น่าสนใจและตรงประเด็น..."
                  className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-white/20"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">เนื้อหา</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="เขียนรายละเอียดที่คุณต้องการแบ่งปันหรือสอบถาม..."
                  className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-lg p-3 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-white/20 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-gray-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-white hover:bg-gray-200 text-gray-950 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>เผยแพร่กระทู้</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 5. Discussion Thread & Comments Modal */}
      {activeThread && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-[#111827] border border-white/[0.1] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/[0.08] bg-[#0B0F19]">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${activeThread.categoryColor}`}>
                  {activeThread.categoryLabel}
                </span>
                <span className="text-xs text-gray-400 font-mono">• {activeThread.gameRelated}</span>
              </div>
              <button
                onClick={() => setActiveThread(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                title="ปิดหน้าต่าง"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* Original Post */}
              <div className="space-y-4 border-b border-white/[0.08] pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeThread.authorAvatar}
                      alt={activeThread.author}
                      className="w-9 h-9 rounded-lg object-cover border border-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{activeThread.author}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-white/[0.06] text-gray-300 border border-white/[0.06]">
                          {activeThread.authorBadge}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500 font-mono">{activeThread.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleUpvote(activeThread.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                        upvotedIds.includes(activeThread.id)
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                          : 'bg-white/[0.04] text-gray-300 border-white/[0.08] hover:text-white'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${upvotedIds.includes(activeThread.id) ? 'fill-current' : ''}`} />
                      <span>{activeThread.upvotes}</span>
                    </button>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {activeThread.title}
                </h2>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line bg-[#0B0F19]/50 p-4 rounded-xl border border-white/[0.04]">
                  {activeThread.content}
                </p>
              </div>

              {/* Comments Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-indigo-400" />
                    <span>ความคิดเห็นทั้งหมด ({(commentsMap[activeThread.id] || []).length})</span>
                  </h4>
                  <span className="text-[11px] text-gray-500">เรียงตามล่าสุด</span>
                </div>

                {threadCommentNotice && (
                  <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{threadCommentNotice}</span>
                  </div>
                )}

                {/* Comment List */}
                <div className="space-y-3">
                  {(!commentsMap[activeThread.id] || commentsMap[activeThread.id].length === 0) ? (
                    <div className="p-8 text-center rounded-xl bg-[#0B0F19] border border-white/[0.06] text-gray-500 text-xs">
                      ยังไม่มีความคิดเห็นในกระทู้นี้ ร่วมแสดงความคิดเห็นคนแรกเลย!
                    </div>
                  ) : (
                    commentsMap[activeThread.id].map((comm) => (
                      <div
                        key={comm.id}
                        className="p-3.5 rounded-xl bg-[#0B0F19] border border-white/[0.06] space-y-2 hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <img
                              src={comm.authorAvatar}
                              alt={comm.author}
                              className="w-6 h-6 rounded-md object-cover border border-white/10"
                            />
                            <span className="font-semibold text-white">{comm.author}</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-white/[0.04] text-gray-400 border border-white/[0.06]">
                              {comm.authorBadge}
                            </span>
                            <span className="text-gray-500 text-[11px] font-mono">• {comm.date}</span>
                          </div>

                          <button
                            onClick={() => handleToggleCommentUpvote(comm.id)}
                            className={`flex items-center gap-1 text-[11px] font-mono transition-colors cursor-pointer ${
                              upvotedCommentIds.includes(comm.id)
                                ? 'text-indigo-400 font-semibold'
                                : 'text-gray-500 hover:text-gray-300'
                            }`}
                          >
                            <ThumbsUp className={`w-3 h-3 ${upvotedCommentIds.includes(comm.id) ? 'fill-current' : ''}`} />
                            <span>{comm.upvotes}</span>
                          </button>
                        </div>

                        <p className="text-xs text-gray-300 pl-8 leading-relaxed">
                          {comm.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Comment Input Footer */}
            <div className="p-3 sm:p-4 border-t border-white/[0.08] bg-[#0B0F19]">
              {currentUser ? (
                <form onSubmit={handlePostComment} className="flex gap-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0 hidden sm:block"
                  />
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={newCommentInput}
                      onChange={(e) => setNewCommentInput(e.target.value)}
                      placeholder="เขียนแสดงความคิดเห็นในกระทู้นี้..."
                      className="flex-1 bg-[#111827] border border-white/[0.1] rounded-lg px-3.5 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-400"
                    />
                    <button
                      type="submit"
                      disabled={!newCommentInput.trim()}
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">ตอบกลับ</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#111827] border border-white/[0.06] text-xs">
                  <span className="text-gray-400">เข้าสู่ระบบเพื่อร่วมแสดงความคิดเห็นในกระทู้นี้</span>
                  <button
                    onClick={() => openAuthModal && openAuthModal('login')}
                    className="px-3 py-1.5 rounded-lg bg-white text-gray-950 font-semibold text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    เข้าสู่ระบบ
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

