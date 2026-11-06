import React from 'react';
import { X, ExternalLink, Maximize2, Shield, Heart, QrCode } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const WebGLModal = () => {
  const { activePlayingGame, closeGamePlayer } = useGame();

  if (!activePlayingGame) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#111827] border border-indigo-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-[#0B0F19]">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide font-['Rajdhani',sans-serif]">
                  {activePlayingGame.title}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {activePlayingGame.engine}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
                  {activePlayingGame.category}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                พัฒนาโดย: <strong className="text-gray-300">{activePlayingGame.developer}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={activePlayingGame.webglUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="เปิดในแท็บใหม่"
              className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={closeGamePlayer}
              title="ปิดหน้าต่างเล่นเกม"
              className="p-2 rounded-xl bg-gray-800 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* WebGL Iframe Canvas Container */}
        <div className="relative flex-1 bg-black">
          <iframe
            src={activePlayingGame.webglUrl}
            title={activePlayingGame.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>

        {/* Modal Footer (Support Thai Dev with PromptPay) */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3 border-t border-gray-800 bg-[#0B0F19] text-xs text-gray-400 gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>WebGL Sandboxed Runtime | ปลอดภัย ไม่ต้องติดตั้งไฟล์ลงเครื่อง</span>
          </div>

          {activePlayingGame.promptPayNumber && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#161F30] border border-amber-500/30 text-amber-300">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>ซัพพอร์ตผู้พัฒนาผ่านพร้อมเพย์:</span>
              <strong className="text-white font-mono bg-black/40 px-2 py-0.5 rounded border border-gray-700">
                {activePlayingGame.promptPayNumber}
              </strong>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

