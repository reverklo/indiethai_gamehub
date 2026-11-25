/**
 * urlSafety.js
 * ตัวช่วยตรวจสอบความปลอดภัยของ URL ภายนอก
 * ป้องกัน XSS / URI Injection จากโปรโตคอลอันตราย เช่น javascript:, data:, vbscript:
 */

/**
 * ตรวจสอบว่า URL ใช้โปรโตคอล https:// (หรือ http:// เฉพาะ localhost สำหรับพัฒนา)
 * @param {string} rawUrl
 * @returns {string|null} URL ที่ปลอดภัย หรือ null หากไม่ผ่านเกณฑ์
 */
export function getSafeExternalUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:') {
      return parsed.toString();
    }
    if (
      parsed.protocol === 'http:' &&
      (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')
    ) {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}
