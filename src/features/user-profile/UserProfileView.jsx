/**
 * UserProfileView.jsx
 * หน้าโปรไฟล์ผู้ใช้งานสไตล์ Steam (Steam Profile View)
 * ออกแบบตามต้นแบบ Steam Profile (Tsukiko_83) ที่ผู้ใช้ส่งมาเป๊ะๆ:
 * - กรอบโปรไฟล์พร้อมเลเวล, เหรียญตรา, สถานะ "ออนไลน์อยู่ในขณะนี้"
 * - แท็บกิจกรรมล่าสุด (Recent Activity) พร้อมชั่วโมงการเล่น และแถบรางวัลความสำเร็จ (Achievements)
 * - แท็บสิ่งที่อยากได้ / เกมโปรด (Wishlist & Favorites) สำหรับตรวจสอบและกดเล่น/ดาวน์โหลดเกมที่ชอบ
 * - แถบเมนูด้านขวาสไตล์ Steam: เกม, สิ่งที่อยากได้, ช่องเก็บของ, ภาพหน้าจอ, บทวิจารณ์
 * - ปุ่ม "แก้ไขโปรไฟล์" ที่ใช้งานได้จริง
 */

import React, { useState } from 'react';
import { 
  Play, 
  Download, 
  Heart, 
  Star, 
  Award, 
  Edit3, 
  Clock, 
  ChevronDown, 
  MessageSquare, 
  Bug, 
  ExternalLink, 
  Layers, 
  Gamepad2, 
  Trash2,
  Sparkles,
  Trophy,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { EditProfileModal } from './EditProfileModal';

export const UserProfileView = () => {
  const { currentUser } = useAuth();
  const { 
    games, 
    wishlist, 
    toggleWishlist, 
    playedGames, 
    openGamePlayer, 
    downloadPcGame,
    openGameDetail,
    profileTab: contextProfileTab,
    setProfileTab: contextSetProfileTab
  } = useGame();

  // ตัวสลับแท็บเนื้อหาฝั่งซ้าย: 'recent' | 'wishlist' | 'reviews' | 'bugs'
  const [localProfileTab, setLocalProfileTab] = useState('recent');
  const profileTab = contextProfileTab || localProfileTab;
  const setProfileTab = contextSetProfileTab || setLocalProfileTab;

  // ควบคุมการเปิดปิด Edit Profile Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ค้นหาข้อมูลเกมที่เคยเล่น (Recent Activity)
  const recentGamesList = playedGames.map((played) => {
    const game = games.find((g) => g.id === played.gameId);
    return {
      ...played,
      game: game || {
        id: played.gameId,
        title: 'Unknown Indie Game',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        engine: 'WebGL',
        category: 'Indie'
      }
    };
  });

  // ค้นหาข้อมูลเกมใน Wishlist
  const wishlistGamesList = games.filter((g) => wishlist.includes(g.id));

  // ค้นหารีวิวที่ผู้ใช้นี้เคยเขียน
  const myReviewsList = games.flatMap((g) => 
    (g.reviews || [])
      .filter((r) => r.user === currentUser?.name || r.user === currentUser?.username)
      .map((r) => ({ ...r, gameTitle: g.title, gameId: g.id }))
  );

  // ค้นหารายงานบั๊กที่ผู้ใช้นี้เคยแจ้ง
  const myBugsList = games.flatMap((g) => 
    (g.bugReports || [])
      .filter((b) => b.user === currentUser?.name || b.user === currentUser?.username)
      .map((b) => ({ ...b, gameTitle: g.title, gameId: g.id }))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Steam Profile Container */}
      <div className="relative rounded-2xl bg-[#111827]/90 border border-white/[0.08] p-6 sm:p-8 overflow-hidden">
        
        {/* Subtle Ambient Background Gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

        {/* 1. Profile Header (เหมือนในรูปต้นแบบ Steam) */}
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
          
          {/* Left: Avatar & User Info */}
          <div className="flex items-start sm:items-center gap-5">
            {/* Avatar with Steam Border */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl p-1 bg-gradient-to-b from-indigo-500/40 via-white/10 to-transparent border border-white/20 shadow-xl">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80'}
                  alt={currentUser?.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Display Name & Bio */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                  {currentUser?.name || 'Tsukiko_83'}
                </h1>
                <ChevronDown className="w-4 h-4 text-gray-500 cursor-pointer hover:text-white" />
              </div>

              <p className="text-xs text-gray-400 font-mono">
                @{currentUser?.username || 'tsukiko_83'}
              </p>

              <p className="text-xs text-gray-400 max-w-md leading-relaxed pt-1">
                {currentUser?.bio || 'คุณสามารถนำเสนอหนึ่งในเหรียญตราของคุณได้ที่นี่ เลือกเหรียญตราได้จากหน้าแก้ไขโปรไฟล์ของคุณ'}
              </p>
            </div>
          </div>

          {/* Right: Steam Level Box & Edit Profile Button */}
          <div className="flex flex-col items-start md:items-end justify-between self-stretch gap-4">
            
            {/* Level Badge Box */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-300">เลเวล</span>
              <div className="w-10 h-10 rounded-full border-2 border-indigo-400/80 bg-black/60 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                {currentUser?.level || 12}
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-gray-200 hover:text-white text-xs font-medium border border-white/[0.08] transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-gray-400" />
              <span>แก้ไขโปรไฟล์</span>
            </button>

          </div>

        </div>

        {/* 2. Main Two-Column Layout (Left: Content, Right: Steam Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
          
          {/* Left Column (2 Cols): Activities, Wishlist, Reviews */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* Navigation Sub-Tabs */}
            <div className="flex items-center gap-1.5 border-b border-white/[0.06] pb-3 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setProfileTab('recent')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  profileTab === 'recent'
                    ? 'bg-white/[0.1] text-white border border-white/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                กิจกรรมล่าสุด ({recentGamesList.length})
              </button>

              <button
                onClick={() => setProfileTab('wishlist')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  profileTab === 'wishlist'
                    ? 'bg-white/[0.1] text-white border border-white/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${profileTab === 'wishlist' ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                <span>สิ่งที่อยากได้ / เกมโปรด ({wishlistGamesList.length})</span>
              </button>

              <button
                onClick={() => setProfileTab('reviews')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  profileTab === 'reviews'
                    ? 'bg-white/[0.1] text-white border border-white/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                บทวิจารณ์ ({myReviewsList.length})
              </button>

              <button
                onClick={() => setProfileTab('bugs')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  profileTab === 'bugs'
                    ? 'bg-white/[0.1] text-white border border-white/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                รายงานปัญหา ({myBugsList.length})
              </button>
            </div>

            {/* Sub-View 1: กิจกรรมล่าสุด (Recent Activity & Played Games) */}
            {profileTab === 'recent' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="font-semibold text-gray-300">กิจกรรมล่าสุด (เกมที่เล่นเร็วๆ นี้)</span>
                  <span>บันทึกชั่วโมงการเล่นบน WebGL</span>
                </div>

                <div className="space-y-3">
                  {recentGamesList.map((item, idx) => (
                    <div
                      key={item.gameId || idx}
                      className="p-3.5 rounded-xl bg-[#0B0F19] border border-white/[0.06] hover:border-white/15 transition-colors space-y-3"
                    >
                      {/* Top Info Row */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={item.game.thumbnail}
                            alt={item.game.title}
                            className="w-24 h-14 rounded-lg object-cover border border-white/[0.08] shrink-0"
                          />
                          <div>
                            <h4 
                              onClick={() => openGameDetail(item.game)}
                              className="text-sm font-semibold text-white hover:text-indigo-300 transition-colors cursor-pointer"
                            >
                              {item.game.title}
                            </h4>
                            <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                              {item.game.category}
                            </p>
                          </div>
                        </div>

                        {/* Playtime stats */}
                        <div className="text-left sm:text-right text-xs font-mono">
                          <div className="text-gray-300 font-medium">เล่นไปแล้ว {item.hoursPlayed} ชม.</div>
                          <div className="text-gray-500 text-[11px]">เล่นล่าสุด {item.lastPlayed}</div>
                        </div>
                      </div>

                      {/* Achievements Bar (เหมือนในรูปต้นแบบ Steam) */}
                      <div className="pt-2 border-t border-white/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                          <div className="flex items-center gap-1.5 text-gray-400 text-[11px] shrink-0">
                            <Award className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{item.achievementsCount}/{item.totalAchievements} รางวัลความสำเร็จ</span>
                          </div>

                          {/* Progress bar */}
                          <div className="flex-1 max-w-xs h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${(item.achievementsCount / item.totalAchievements) * 100}%` }}
                            />
                          </div>

                          {/* Badge icons */}
                          <div className="flex items-center gap-1 text-xs">
                            {item.achievementIcons?.map((ico, i) => (
                              <span key={i} className="p-1 rounded bg-white/[0.04] border border-white/[0.06] text-[11px]">
                                {ico}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => openGamePlayer(item.game)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>เล่นต่อ</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-View 2: สิ่งที่อยากได้ / เกมโปรด (Wishlist & Favorites) */}
            {profileTab === 'wishlist' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="font-semibold text-gray-300">
                    รายการสิ่งที่อยากได้ (Wishlist - {wishlistGamesList.length} เกม)
                  </span>
                  <span>บันทึกเกมที่คุณชอบไว้เล่นภายหลัง</span>
                </div>

                {wishlistGamesList.length === 0 ? (
                  <div className="p-12 text-center rounded-xl bg-[#0B0F19] border border-white/[0.06] space-y-3">
                    <Heart className="w-10 h-10 text-gray-600 mx-auto" />
                    <p className="text-gray-300 text-sm font-medium">ยังไม่มีเกมในรายการสิ่งที่อยากได้</p>
                    <p className="text-gray-500 text-xs">
                      คุณสามารถคลิกที่ไอคอนรูปหัวใจที่มุมการ์ดเกมในหน้าร้านค้าเพื่อบันทึกไว้ที่นี่
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {wishlistGamesList.map((game) => (
                      <div
                        key={game.id}
                        className="p-3.5 rounded-xl bg-[#0B0F19] border border-white/[0.06] hover:border-white/15 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={game.thumbnail}
                            alt={game.title}
                            className="w-24 h-14 rounded-lg object-cover border border-white/[0.08] shrink-0"
                          />
                          <div>
                            <h4 
                              onClick={() => openGameDetail(game)}
                              className="text-sm font-semibold text-white hover:text-indigo-300 transition-colors cursor-pointer"
                            >
                              {game.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono mt-0.5">
                              <span>{game.category}</span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5 text-amber-300">
                                <Star className="w-3 h-3 fill-amber-300" />
                                {game.rating > 0 ? game.rating : 'New'}
                              </span>
                              <span>•</span>
                              <span>โดย {game.developer}</span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Play & Remove actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          {game.hasWebgl && (
                            <button
                              onClick={() => openGamePlayer(game)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>เล่น WebGL</span>
                            </button>
                          )}

                          {game.hasPcDownload && (
                            <button
                              onClick={() => downloadPcGame(game.id)}
                              className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-200 text-gray-950 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              <span>โหลด PC</span>
                            </button>
                          )}

                          <button
                            onClick={() => toggleWishlist(game.id)}
                            title="ลบออกจากรายการสิ่งที่อยากได้"
                            className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 border border-white/[0.06] transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sub-View 3: บทวิจารณ์ของฉัน (Reviews) */}
            {profileTab === 'reviews' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="font-semibold text-gray-300">บทวิจารณ์ที่คุณเขียน</span>
                  <span>ทั้งหมด {myReviewsList.length} รายการ</span>
                </div>

                {myReviewsList.length === 0 ? (
                  <div className="p-10 text-center rounded-xl bg-[#0B0F19] border border-white/[0.06] text-gray-500 text-xs">
                    ยังไม่มีบทวิจารณ์ที่คุณเขียน ลองเข้าไปเขียนรีวิวให้คะแนนเกมที่คุณชอบได้เลย!
                  </div>
                ) : (
                  myReviewsList.map((rev) => (
                    <div key={rev.id} className="p-3.5 rounded-xl bg-[#0B0F19] border border-white/[0.06] space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <strong className="text-white font-medium">{rev.gameTitle}</strong>
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{rev.comment}</p>
                      <span className="text-[10px] text-gray-500 font-mono block">{rev.date}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Sub-View 4: รายงานปัญหา (Bug Reports) */}
            {profileTab === 'bugs' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="font-semibold text-gray-300">รายงานบั๊กที่คุณแจ้งถึงผู้พัฒนา</span>
                  <span>ทั้งหมด {myBugsList.length} รายการ</span>
                </div>

                {myBugsList.length === 0 ? (
                  <div className="p-10 text-center rounded-xl bg-[#0B0F19] border border-white/[0.06] text-gray-500 text-xs">
                    ไม่พบประวัติการแจ้งปัญหา
                  </div>
                ) : (
                  myBugsList.map((bug) => (
                    <div key={bug.id} className="p-3.5 rounded-xl bg-[#0B0F19] border border-white/[0.06] space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <strong className="text-white font-medium">{bug.title}</strong>
                          <span className="text-gray-400">({bug.gameTitle})</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          bug.status === 'fixed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {bug.status === 'fixed' ? 'แก้ไขแล้ว' : 'กำลังตรวจสอบ'}
                        </span>
                      </div>
                      {bug.description && (
                        <p className="text-xs text-gray-400 leading-relaxed">{bug.description}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

          {/* Right Column (1 Col): Steam Profile Sidebar (เหมือนในรูปเป๊ะๆ) */}
          <div className="space-y-5">
            
            {/* Status Indicator */}
            <div className="p-4 rounded-xl bg-[#0B0F19] border border-white/[0.06] space-y-1">
              <span className="text-[11px] text-gray-500 block uppercase font-mono">สถานะ</span>
              <div className="flex items-center gap-2 text-sky-400 text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>ออนไลน์อยู่ในขณะนี้</span>
              </div>
            </div>

            {/* Badges Box (เหรียญตรา 3) */}
            <div className="p-4 rounded-xl bg-[#0B0F19] border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-medium">เหรียญตรา</span>
                <span className="text-gray-300 font-mono font-bold">3</span>
              </div>

              {/* Badges Showcase Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] flex flex-col items-center justify-center text-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-xs font-bold text-indigo-300 font-mono">
                    12
                  </div>
                  <span className="text-[9px] text-gray-400 line-clamp-1">Beta Tester</span>
                </div>

                <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] flex flex-col items-center justify-center text-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-xs font-bold text-emerald-300 font-mono">
                    5+
                  </div>
                  <span className="text-[9px] text-gray-400 line-clamp-1">Years</span>
                </div>

                <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] flex flex-col items-center justify-center text-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xs font-bold text-amber-300 font-mono">
                    🏆
                  </div>
                  <span className="text-[9px] text-gray-400 line-clamp-1">Jam 2026</span>
                </div>
              </div>
            </div>

            {/* Quick Links Navigation List (สไตล์ Steam) */}
            <div className="p-4 rounded-xl bg-[#0B0F19] border border-white/[0.06] divide-y divide-white/[0.04] text-xs">
              
              <button
                onClick={() => setProfileTab('recent')}
                className="w-full flex items-center justify-between py-2.5 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <span>เกมในคลัง</span>
                <span className="font-mono text-gray-500">{recentGamesList.length}</span>
              </button>

              <button
                onClick={() => setProfileTab('wishlist')}
                className="w-full flex items-center justify-between py-2.5 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>สิ่งที่อยากได้ (Wishlist)</span>
                </span>
                <span className="font-mono text-gray-500">{wishlistGamesList.length}</span>
              </button>

              <div className="flex items-center justify-between py-2.5 text-gray-400">
                <span>ช่องเก็บของ / โดเนท</span>
                <span className="font-mono text-gray-500">2</span>
              </div>

              <div className="flex items-center justify-between py-2.5 text-gray-400">
                <span>ภาพหน้าจอ</span>
                <span className="font-mono text-gray-500">8</span>
              </div>

              <button
                onClick={() => setProfileTab('reviews')}
                className="w-full flex items-center justify-between py-2.5 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <span>บทวิจารณ์</span>
                <span className="font-mono text-gray-500">{myReviewsList.length}</span>
              </button>

              <button
                onClick={() => setProfileTab('bugs')}
                className="w-full flex items-center justify-between py-2.5 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <span>รายงานปัญหา</span>
                <span className="font-mono text-gray-500">{myBugsList.length}</span>
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

    </div>
  );
};

