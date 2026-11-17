/**
 * authService.js
 * บริการยืนยันตัวตนและจัดการบัญชีผู้ใช้จริงผ่าน Supabase Auth & PostgreSQL Profiles
 */

import { supabase } from '../lib/supabase';

/**
 * สมัครสมาชิกใหม่ผ่าน Supabase Auth
 */
export const registerWithSupabase = async ({ email, password, username, displayName, role = 'player', studioName, promptPayNumber }) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split('@')[0],
          display_name: displayName || username || email.split('@')[0],
          name: displayName || username || email.split('@')[0],
          role: role,
          studio_name: studioName || (role === 'developer' ? `${displayName || username} Studio` : ''),
          promptpay_number: promptPayNumber || '089-765-4321',
          avatar_url: role === 'developer'
            ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
            : 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150'
        }
      }
    });

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Supabase signup error:', err);
    return { success: false, error: err.message };
  }
};

/**
 * เข้าสู่ระบบด้วย Email และ Password
 */
export const loginWithSupabase = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Supabase login error:', err);
    return { success: false, error: err.message };
  }
};

/**
 * ออกจากระบบ
 */
export const logoutFromSupabase = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Supabase logout error:', err);
    return { success: false, error: err.message };
  }
};

/**
 * ดึงโปรไฟล์ผู้ใช้จากตาราง profiles
 */
export const fetchProfileFromSupabase = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { success: true, profile: data };
  } catch (err) {
    console.error('Failed to fetch profile:', err);
    return { success: false, error: err.message };
  }
};

/**
 * อัปเดตข้อมูลโปรไฟล์ (วอลเล็ต, ข้อมูลสตูดิโอ, ข้อมูลติดต่อ)
 */
export const updateProfileInSupabase = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Failed to update profile:', err);
    return { success: false, error: err.message };
  }
};
