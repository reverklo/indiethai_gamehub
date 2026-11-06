/**
 * UserManagement.jsx
 * ตารางจัดการรายชื่อผู้ใช้ทั้งหมดในแพลตฟอร์มสำหรับผู้ดูแลระบบ
 * - ค้นหาผู้ใช้ตามชื่อและอีเมล
 * - สลับสถานะ แบน/ระงับบัญชี (Ban / Suspend)
 * - แก้ไขยอด Token กระเป๋าเงิน
 */

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ShieldAlert, 
  Coins, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  UserX, 
  UserCheck,
  User,
  Code2,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const UserManagement = () => {
  const { usersList, adminAdjustUserToken, adminToggleBanUser } = useAuth();

  const [searchEmail, setSearchEmail] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [notification, setNotification] = useState(null);

  // โมดอลแก้ไข Token
  const [editingTokenUser, setEditingTokenUser] = useState(null);
  const [tokenInput, setTokenInput] = useState(0);

  // กรองผู้ใช้ตามอีเมลและบทบาท
  const filteredUsers = usersList.filter((u) => {
    const matchEmail =
      u.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
      u.name.toLowerCase().includes(searchEmail.toLowerCase()) ||
      u.username.toLowerCase().includes(searchEmail.toLowerCase());

    const matchRole = roleFilter === 'All' || u.role === roleFilter;

    return matchEmail && matchRole;
  });

  // จัดการแบน/ปลดแบน
  const handleToggleBan = (userId) => {
    const res = adminToggleBanUser(userId);
    setNotification(res.message);
    setTimeout(() => setNotification(null), 3000);
  };

  // จัดการบันทึกยอด Token
  const handleTokenSubmit = (e) => {
    e.preventDefault();
    if (!editingTokenUser) return;

    const res = adminAdjustUserToken(editingTokenUser.id, tokenInput);
    setNotification(res.message);
    setEditingTokenUser(null);
    setTimeout(() => setNotification(null), 3000);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin',
          badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
          icon: ShieldCheck
        };
      case 'developer':
        return {
          label: 'Developer',
          badge: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
          icon: Code2
        };
      case 'player':
      default:
        return {
          label: 'Player',
          badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          icon: User
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Toast Notice */}
      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-['Rajdhani',sans-serif]">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>จัดการผู้ใช้งานในระบบ (User Management)</span>
          </h3>
          <p className="text-xs text-gray-400">
            แสดง {filteredUsers.length} จากทั้งหมด {usersList.length} บัญชี
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search by Email or Name */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="ค้นหาชื่อ หรืออีเมล..."
              className="w-full bg-[#111827] border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Filter by Role */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#111827] border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">ทุกบทบาท</option>
            <option value="player">Player</option>
            <option value="developer">Developer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-[#111827]">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-[#0B0F19] text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-800">
            <tr>
              <th className="px-5 py-3.5">ผู้ใช้งาน</th>
              <th className="px-4 py-3.5">อีเมล (Email)</th>
              <th className="px-4 py-3.5">บทบาท (Role)</th>
              <th className="px-4 py-3.5">ยอด Token Balance</th>
              <th className="px-4 py-3.5">สถานะบัญชี</th>
              <th className="px-5 py-3.5 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/80">
            {filteredUsers.map((user) => {
              const roleInfo = getRoleBadge(user.role);
              const RoleIcon = roleInfo.icon;

              return (
                <tr key={user.id} className="hover:bg-gray-800/40 transition">
                  
                  {/* Name & Avatar */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-gray-700"
                      />
                      <div>
                        <p className="font-bold text-white leading-tight">{user.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono">@{user.username}</p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-4 font-mono text-gray-400">
                    {user.email}
                  </td>

                  {/* Role */}
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${roleInfo.badge}`}>
                      <RoleIcon className="w-3 h-3" />
                      {roleInfo.label}
                    </span>
                  </td>

                  {/* Token Balance */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        {user.tokenBalance}
                      </span>
                      <span className="text-[10px] text-gray-500">Tokens</span>
                    </div>
                  </td>

                  {/* Account Status */}
                  <td className="px-4 py-4">
                    {user.isBanned ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        <XCircle className="w-3 h-3" />
                        ถูกระงับ (Banned)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        ปกติ (Active)
                      </span>
                    )}
                  </td>

                  {/* Actions: Edit Token & Ban/Unban */}
                  <td className="px-5 py-4 text-right space-x-2">
                    
                    {/* Edit Token Button */}
                    <button
                      onClick={() => {
                        setEditingTokenUser(user);
                        setTokenInput(user.tokenBalance);
                      }}
                      title="แก้ไขยอด Token"
                      className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-amber-500/20 hover:text-amber-400 text-gray-300 text-xs font-semibold transition cursor-pointer"
                    >
                      <Coins className="w-3.5 h-3.5 inline mr-1" />
                      <span>แก้ Token</span>
                    </button>

                    {/* Ban / Unban Button */}
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleBan(user.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          user.isBanned
                            ? 'bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-gray-950 border border-emerald-500/30'
                            : 'bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30'
                        }`}
                      >
                        {user.isBanned ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5 inline mr-1" />
                            <span>ปลดแบน</span>
                          </>
                        ) : (
                          <>
                            <UserX className="w-3.5 h-3.5 inline mr-1" />
                            <span>ระงับบัญชี</span>
                          </>
                        )}
                      </button>
                    )}

                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Token Modal */}
      {editingTokenUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111827] border border-amber-500/40 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-['Rajdhani',sans-serif]">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>แก้ไขยอดเหรียญ Token</span>
            </h3>

            <p className="text-xs text-gray-400">
              ผู้ใช้: <strong className="text-white">{editingTokenUser.name}</strong> ({editingTokenUser.email})
            </p>

            <form onSubmit={handleTokenSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 mb-1 font-medium">กำหนดยอดเหรียญใหม่ (Tokens):</label>
                <input
                  type="number"
                  min="0"
                  max="99999"
                  required
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold text-base focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setEditingTokenUser(null)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold cursor-pointer"
                >
                  บันทึกยอด Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

