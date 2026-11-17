/**
 * gameService.js
 * บริการเชื่อมต่อและจัดการข้อมูลเกมผ่าน Supabase Database
 * รองรับการดึงข้อมูลแบบ Realtime, การบันทึกแพตช์โน้ต, รายงานบั๊ก และรีวิว
 */

import { supabase } from '../lib/supabase';
import { INITIAL_GAMES } from '../data/mockData';

/**
 * แปลงข้อมูลจาก Supabase Table Row ให้อยู่ในโครงสร้าง Client Model ของ IndieThaiHub
 */
export const mapSupabaseGameToClient = (row) => ({
  id: row.id,
  title: row.title || 'Untitled Game',
  slug: row.slug || `game-${row.id}`,
  tagline: row.tagline || '',
  description: row.description || '',
  developer: row.developer_name || 'Indie Studio',
  developerId: row.developer_id,
  category: row.category || 'Puzzle',
  engine: row.engine || 'Unity WebGL',
  version: row.version || 'v1.0.0',
  price: Number(row.price) || 0,
  originalPrice: Number(row.original_price) || 0,
  discountPercent: Number(row.discount_percent) || 0,
  rating: Number(row.rating) || 5.0,
  ratingCount: Number(row.rating_count) || 0,
  playCount: Number(row.play_count) || 0,
  downloadCount: Number(row.download_count) || 0,
  downloadSize: row.download_size || '50 MB',
  hasWebgl: Boolean(row.has_webgl),
  hasPcDownload: Boolean(row.has_pc_download),
  webglUrl: row.webgl_url || '',
  downloadUrl: row.download_url || '',
  thumbnail: row.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
  headerImage: row.header_image || row.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
  mediaGallery: Array.isArray(row.media_gallery) ? row.media_gallery : [],
  controls: Array.isArray(row.controls) ? row.controls : [],
  systemRequirements: row.system_requirements || {
    minimum: { os: 'Windows 10 64-bit', processor: 'Intel Core i3', memory: '2 GB RAM', graphics: 'Intel HD 4000', storage: '50 MB' },
    recommended: { os: 'Windows 10/11', processor: 'Intel Core i5', memory: '4 GB RAM', graphics: 'GTX 1050', storage: '100 MB' }
  },
  featuresList: Array.isArray(row.features_list) ? row.features_list : [],
  socialLinks: row.social_links || {},
  status: row.status || 'approved',
  createdAt: row.created_at,
  // แปลง Game Patches
  patchNotes: Array.isArray(row.game_patches)
    ? row.game_patches
        .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
        .map((p) => ({
          id: p.id,
          version: p.version,
          title: p.title,
          date: p.release_date ? p.release_date.split('T')[0] : '',
          details: p.details
        }))
    : [],
  // แปลง Bug Reports
  bugReports: Array.isArray(row.bug_reports)
    ? row.bug_reports.map((b) => ({
        id: b.id,
        reporter: b.reporter_name || 'ผู้เล่นทั่วไป',
        title: b.title,
        description: b.description,
        status: b.status || 'open',
        severity: b.severity || 'medium',
        date: b.created_at ? b.created_at.split('T')[0] : ''
      }))
    : [],
  // แปลง Reviews
  reviewsList: Array.isArray(row.reviews)
    ? row.reviews.map((r) => ({
        id: r.id,
        userName: r.user_name || 'ผู้เล่น',
        userAvatar: r.user_avatar,
        rating: Number(r.rating) || 5,
        comment: r.comment,
        playtimeHours: Number(r.playtime_hours) || 1.0,
        date: r.created_at ? r.created_at.split('T')[0] : ''
      }))
    : []
});

/**
 * ดึงรายการเกมทั้งหมดพร้อม Patches และ Bug Reports จาก Supabase
 */
export const fetchAllGamesFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*, game_patches(*), bug_reports(*), reviews(*)');

    if (error) {
      console.warn('Supabase fetchGames error, falling back to local:', error.message);
      return { success: false, data: null, error };
    }

    if (!data || data.length === 0) {
      return { success: true, data: [] };
    }

    const mappedGames = data.map(mapSupabaseGameToClient);
    return { success: true, data: mappedGames };
  } catch (err) {
    console.error('Network error while fetching games from Supabase:', err);
    return { success: false, data: null, error: err };
  }
};

/**
 * อัปเดตข้อมูลเกมใน Supabase
 */
export const updateGameInSupabase = async (gameId, payload) => {
  try {
    const updateData = {};
    if (payload.title !== undefined) updateData.title = payload.title;
    if (payload.tagline !== undefined) updateData.tagline = payload.tagline;
    if (payload.description !== undefined) updateData.description = payload.description;
    if (payload.category !== undefined) updateData.category = payload.category;
    if (payload.engine !== undefined) updateData.engine = payload.engine;
    if (payload.version !== undefined) updateData.version = payload.version;
    if (payload.price !== undefined) updateData.price = payload.price;
    if (payload.hasWebgl !== undefined) updateData.has_webgl = payload.hasWebgl;
    if (payload.hasPcDownload !== undefined) updateData.has_pc_download = payload.hasPcDownload;
    if (payload.webglUrl !== undefined) updateData.webgl_url = payload.webglUrl;
    if (payload.downloadUrl !== undefined) updateData.download_url = payload.downloadUrl;
    if (payload.downloadSize !== undefined) updateData.download_size = payload.downloadSize;
    if (payload.systemRequirements !== undefined) updateData.system_requirements = payload.systemRequirements;
    if (payload.socialLinks !== undefined) updateData.social_links = payload.socialLinks;
    if (payload.status !== undefined) updateData.status = payload.status;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('games')
      .update(updateData)
      .eq('id', gameId)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Failed to update game in Supabase:', err);
    return { success: false, error: err };
  }
};

/**
 * บันทึก Patch Notes ใหม่ลง Supabase
 */
export const createPatchNoteInSupabase = async (gameId, { version, title, details }) => {
  try {
    const { data, error } = await supabase
      .from('game_patches')
      .insert({
        game_id: gameId,
        version: version || 'v1.0.0',
        title: title || `อัปเดตเวอร์ชัน ${version}`,
        details: details || 'ปรับปรุงประสิทธิภาพและความเสถียรของเกม',
        release_date: new Date().toISOString()
      })
      .select();

    if (error) throw error;

    // อัปเดต version ในตาราง games ด้วย
    await supabase
      .from('games')
      .update({ version, updated_at: new Date().toISOString() })
      .eq('id', gameId);

    return { success: true, data };
  } catch (err) {
    console.error('Failed to create patch note in Supabase:', err);
    return { success: false, error: err };
  }
};

/**
 * อัปเดตสถานะบั๊ก (open / fixed)
 */
export const updateBugStatusInSupabase = async (bugId, newStatus) => {
  try {
    const { data, error } = await supabase
      .from('bug_reports')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', bugId)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Failed to update bug status in Supabase:', err);
    return { success: false, error: err };
  }
};

/**
 * ส่งรายงานบั๊กใหม่
 */
export const submitBugReportToSupabase = async (gameId, { reporterName, title, description, severity = 'medium' }) => {
  try {
    const { data, error } = await supabase
      .from('bug_reports')
      .insert({
        game_id: gameId,
        reporter_name: reporterName || 'ผู้เล่นทั่วไป',
        title,
        description,
        status: 'open',
        severity
      })
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Failed to submit bug report to Supabase:', err);
    return { success: false, error: err };
  }
};

/**
 * ส่งรีวิวใหม่
 */
export const submitReviewToSupabase = async (gameId, { userId, userName, userAvatar, rating, comment, playtimeHours = 1.0 }) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        game_id: gameId,
        user_id: userId,
        user_name: userName || 'ผู้เล่น',
        user_avatar: userAvatar,
        rating,
        comment,
        playtime_hours: playtimeHours
      })
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Failed to submit review to Supabase:', err);
    return { success: false, error: err };
  }
};
