/**
 * TopUpWalletModal.jsx
 * โมดอลเติมเงินเข้ากระเป๋าเงิน Steam Wallet / IndieThai Tokens
 * - แพ็กเกจยอดนิยม: 50฿, 150฿, 300฿, 500฿, 1000฿
 * - จำลองการชำระเงินผ่าน PromptPay QR Code ทันที
 * - ซิงค์ยอดเงินเข้า Wallet อัตโนมัติ พร้อมแจ้งเตือนแบบเรียลไทม์
 */

import React, { useState } from 'react';
import { 
  X, 
  Coins, 
  QrCode, 
  CheckCircle2, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TopUpWalletModal = () => {
  const { 
    currentUser, 
    walletBalance, 
    topUpWallet, 
    isTopUpModalOpen, 
    closeTopUpModal 
  } = useAuth();

  const presets = [
    { amount: 50, label: '฿ 50', bonus: null },
    { amount: 150, label: '฿ 150', bonus: null },
    { amount: 300, label: '฿ 300', popular: true, bonus: '+15 โบนัส' },
    { amount: 500, label: '฿ 500', bonus: '+35 โบนัส' },
    { amount: 1000, label: '฿ 1,000', bonus: '+100 โบนัส' }
  ];

  const [selectedAmount, setSelectedAmount] = useState(300);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastAdded, setLastAdded] = useState(0);

  if (!isTopUpModalOpen) return null;

  const currentAmountToPay = customAmount ? (Number(customAmount) || 0) : selectedAmount;

  const handleSimulatePayment = () => {
    if (currentAmountToPay <= 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      topUpWallet(currentAmountToPay);
      setLastAdded(currentAmountToPay);
      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        closeTopUpModal();
      }, 2200);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-[#0f172a] border border-white/[0.1] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08] bg-[#111827]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Coins className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>เติมเงินเข้าวอลเล็ต (Steam Wallet)</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-mono">
                  1 ฿ = 1 Token
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                ยอดคงเหลือปัจจุบัน: <span className="font-mono font-bold text-amber-300">{walletBalance} Tokens (฿{walletBalance})</span>
              </p>
            </div>
          </div>

          <button
            onClick={closeTopUpModal}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-in zoom-in" />
              </div>
              <h4 className="text-lg font-bold text-white">เติมเงินสำเร็จเรียบร้อย!</h4>
              <p className="text-xs text-gray-300">
                เพิ่ม <strong className="text-emerald-400 font-mono text-sm">+{lastAdded} Tokens</strong> เข้าสู่กระเป๋าเงินของคุณแล้ว
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1e293b] text-xs font-mono text-gray-300">
                <span>ยอดรวมใหม่:</span>
                <span className="font-bold text-amber-300">{walletBalance} Tokens</span>
              </div>
            </div>
          ) : (
            <>
              {/* Presets */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2.5">
                  เลือกจำนวนเงินที่ต้องการเติม:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {presets.map((preset) => {
                    const isSelected = !customAmount && selectedAmount === preset.amount;
                    return (
                      <button
                        key={preset.amount}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(preset.amount);
                          setCustomAmount('');
                        }}
                        className={`relative p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold shadow-lg shadow-amber-500/10'
                            : 'bg-[#1e293b]/70 border-white/[0.06] text-gray-300 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {preset.popular && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-amber-500 text-gray-950 text-[9px] font-bold">
                            ยอดนิยม
                          </span>
                        )}
                        <div className="text-sm font-mono">{preset.label}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {preset.bonus || `${preset.amount} T`}
                        </div>
                      </button>
                    );
                  })}

                  {/* Custom input */}
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="ระบุจำนวน"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                      }}
                      className={`w-full h-full p-2.5 text-center text-xs font-mono rounded-xl border transition ${
                        customAmount
                          ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold'
                          : 'bg-[#1e293b]/70 border-white/[0.06] text-gray-300 placeholder-gray-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* PromptPay QR Simulator Box */}
              <div className="p-4 rounded-xl bg-[#111827] border border-white/[0.08] flex items-center gap-4">
                <div className="w-24 h-24 bg-white p-2 rounded-lg flex items-center justify-center shrink-0 shadow">
                  {/* Clean SVG Mock QR */}
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <QrCode className="w-16 h-16 text-gray-900" />
                    <span className="text-[8px] font-bold text-sky-800 -mt-1 font-mono">PromptPay</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-sky-500/20 text-sky-300 font-semibold">
                      พร้อมเพย์ QR
                    </span>
                    <span className="text-[11px] text-gray-400">สแกนจ่ายได้ทุกแอปธนาคาร</span>
                  </div>
                  <div className="text-xl font-bold text-white font-mono">
                    ฿ {currentAmountToPay} <span className="text-xs font-normal text-gray-400 font-sans">บาท</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-tight">
                    ระบบจะตัดยอดและอัปเดตเหรียญ Tokens เข้ากระเป๋าของคุณทันทีแบบ Real-time
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={isProcessing || currentAmountToPay <= 0}
                onClick={handleSimulatePayment}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                    <span>กำลังตรวจสอบยอดชำระเงิน...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-gray-950" />
                    <span>ยืนยันจำลองการชำระเงิน (฿ {currentAmountToPay})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>จำลองระบบธุรกรรมปลอดภัย รองรับทุกบทบาท (Player / Dev / Admin)</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};