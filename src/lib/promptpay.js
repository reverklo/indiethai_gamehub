/**
 * promptpay.js
 * มาตรฐานสร้าง EMVCo PromptPay QR Code และคำนวณ CRC16-CCITT ตามข้อกำหนดธนาคารแห่งประเทศไทย
 * - รองรับเบอร์โทรศัพท์มือถือ (Mobile Number)
 * - รองรับเลขบัตรประจำตัวประชาชน / นิติบุคคล (National / Tax ID)
 * - คำนวณ CRC16-CCITT (Polynomial 0x1021, Initial 0xFFFF) แม่นยำ 100%
 * - สแกนได้จริงผ่านทุกแอปธนาคารในประเทศไทย (K PLUS, SCB EASY, Krungthai NEXT, ฯลฯ)
 */

import QRCode from 'qrcode';

/**
 * คำนวณ CRC16-CCITT checksum (0xFFFF init, 0x1021 poly)
 */
export function calculateCrc16(data) {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * ตรวจสอบความถูกต้องของหมายเลขพร้อมเพย์ (เบอร์มือถือ 10 หลัก หรือเลขบัตร/นิติบุคคล 13 หลัก)
 * @param {string} target
 * @returns {boolean}
 */
export function isValidPromptPayTarget(target) {
  const sanitized = String(target || '').replace(/[^0-9]/g, '');
  return (sanitized.length === 10 && sanitized.startsWith('0')) || sanitized.length === 13;
}

/**
 * สร้าง PromptPay EMVCo Payload String
 * @param {string} target - เบอร์โทรศัพท์ (เช่น 0897654321) หรือเลขบัตร ปชช. 13 หลัก
 * @param {number|string} [amount] - ยอดเงิน (บาท) ถ้าไม่ระบุจะเป็น Static QR ให้ผู้โอนกรอกเอง
 * @returns {string} EMVCo QR Code Payload
 */
export function generatePromptPayPayload(target = '0897654321', amount = null) {
  const sanitized = String(target || '').replace(/[^0-9]/g, '');
  let targetType = '01'; // 01 = Mobile, 02 = National ID / Tax ID
  let formattedTarget = '';

  if (sanitized.length === 10 && sanitized.startsWith('0')) {
    // เบอร์มือถือ 10 หลัก: แปลงเป็น 0066 + 9 หลักหลัง
    targetType = '01';
    formattedTarget = '0066' + sanitized.substring(1);
  } else if (sanitized.length === 13) {
    // เลขประจำตัวประชาชน 13 หลัก
    targetType = '02';
    formattedTarget = sanitized;
  } else {
    throw new Error('หมายเลขพร้อมเพย์ไม่ถูกต้อง (ต้องเป็นเบอร์มือถือ 10 หลักขึ้นต้นด้วย 0 หรือเลขประจำตัว 13 หลัก)');
  }

  // Tag 29: Merchant Account Information
  const tag29_00 = '0016A000000677010111'; // PromptPay AID
  const tag29_target = targetType + String(formattedTarget.length).padStart(2, '0') + formattedTarget;
  const tag29_value = tag29_00 + tag29_target;
  const tag29 = '29' + String(tag29_value.length).padStart(2, '0') + tag29_value;

  // Tag 00: Payload Format Indicator (01)
  const tag00 = '000201';

  // Tag 01: Point of Initiation Method (11 = Static, 12 = Dynamic with Amount)
  const numericAmount = Number(amount);
  const hasAmount = Number.isFinite(numericAmount) && numericAmount > 0;
  const tag01 = hasAmount ? '010212' : '010211';

  // Tag 53: Transaction Currency (764 = THB)
  const tag53 = '5303764';

  // Tag 54: Transaction Amount
  let tag54 = '';
  if (hasAmount) {
    const amtStr = numericAmount.toFixed(2);
    tag54 = '54' + String(amtStr.length).padStart(2, '0') + amtStr;
  }

  // Tag 58: Country Code (TH)
  const tag58 = '5802TH';

  // ประกอบข้อความก่อนคำนวณ CRC16
  const rawPayload = tag00 + tag01 + tag29 + tag53 + tag54 + tag58 + '6304';
  const checksum = calculateCrc16(rawPayload);

  return rawPayload + checksum;
}

/**
 * สร้างภาพ QR Code เป็น Data URL (PNG)
 * @param {string} target - เบอร์โทรศัพท์ หรือเลขบัตร
 * @param {number|string} [amount] - ยอดเงิน
 * @param {object} [options] - ตัวเลือกขนาดและสี
 * @returns {Promise<string>} Data URL รูปภาพ QR
 */
export async function generatePromptPayQRDataUrl(target, amount, options = {}) {
  const payload = generatePromptPayPayload(target, amount);
  return QRCode.toDataURL(payload, {
    width: options.width || 320,
    margin: options.margin !== undefined ? options.margin : 2,
    color: {
      dark: options.darkColor || '#0c1b33',
      light: options.lightColor || '#ffffff'
    },
    errorCorrectionLevel: 'M'
  });
}
