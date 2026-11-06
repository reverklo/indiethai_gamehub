import React from 'react';
import { Gamepad2, Heart, Shield, Cpu, ExternalLink, Terminal } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-800/80 bg-[#0B0F19] text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#10B981] p-0.5">
                <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-wider text-white font-['Rajdhani',sans-serif]">
                INDIETHAI<span className="text-[#6366F1]">.HUB</span>
              </span>
            </div>
            
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              แพลตฟอร์มศูนย์รวมและทดลองเล่นเกมอินดี้สัญชาติไทยผ่าน WebGL ทดลองเล่นได้ทันทีบนเบราว์เซอร์ พร้อมสนับสนุนนักพัฒนาไทยโดยตรงผ่านระบบพร้อมเพย์และโทเคนคอมมูนิตี้
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                WebGL 60FPS Supported
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Cpu className="w-3.5 h-3.5" />
                Unity & Godot & Three.js
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-mono">
              หมวดหมู่ยอดนิยม
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-indigo-400 cursor-pointer transition">🧩 เกม Puzzle & Brain</span>
              </li>
              <li>
                <span className="hover:text-indigo-400 cursor-pointer transition">🕹️ เกม Arcade & Fast Reaction</span>
              </li>
              <li>
                <span className="hover:text-indigo-400 cursor-pointer transition">✈️ เกม Action 3D & Flight</span>
              </li>
              <li>
                <span className="hover:text-indigo-400 cursor-pointer transition">👻 เกมสยองขวัญและตำนานไทย</span>
              </li>
            </ul>
          </div>

          {/* Tech Stack Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-mono">
              ระบบและเทคโนโลยี
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-[#6366F1]">●</span> React 18 & Vite
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#10B981]">●</span> Tailwind CSS Cyberpunk
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#F59E0B]">●</span> 50-Token Submission Queue
              </li>
              <li className="flex items-center gap-2">
                <span className="text-rose-400">●</span> Admin Review & Security Sandbox
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 IndieThai Hub. สร้างสรรค์เพื่อคอมมูนิตี้นักพัฒนาเกมอินดี้สัญชาติไทย</p>
          <div className="flex items-center gap-2 text-gray-400">
            <span>Powered by Thai Indie Game Devs</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>& WebGL Technology</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

