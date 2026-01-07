
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface UserManagementProps {
  users: User[];
  currentUser: User;
  onToggleStatus: (userId: string) => void;
  onDelete: (userId: string) => void;
  onUpdateRole: (userId: string, role: UserRole) => void;
  onUpdatePassword: (userId: string, newPass: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, currentUser, onToggleStatus, onDelete, onUpdateRole, onUpdatePassword }) => {
  const [editingPassId, setEditingPassId] = useState<string | null>(null);
  const [newPassVal, setNewPassVal] = useState('');

  const handleSavePass = (userId: string) => {
    if (!newPassVal) return;
    onUpdatePassword(userId, newPassVal);
    setEditingPassId(null);
    setNewPassVal('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <i className="fas fa-users-cog text-indigo-600"></i>
            إدارة الحسابات والصلاحيات
          </h2>
          <div className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100 font-bold">
            عدد المستخدمين: {users.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
                <th className="px-4 py-3 font-medium">المستخدم</th>
                <th className="px-4 py-3 font-medium">الدور</th>
                <th className="px-4 py-3 font-medium">الرقم القومي / السري</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
                <th className="px-4 py-3 font-medium">العمليات</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-bold flex items-center gap-2">
                      {u.username}
                      {u.id === currentUser.id && <span className="text-[10px] bg-green-500 text-white px-1 rounded">أنت</span>}
                    </div>
                    <div className="text-xs text-gray-400">{u.createdAt}</div>
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={u.role}
                      disabled={u.id === currentUser.id || (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.MODERATOR)}
                      onChange={(e) => onUpdateRole(u.id, e.target.value as UserRole)}
                      className="bg-transparent border rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 text-indigo-600 font-medium"
                    >
                      {Object.values(UserRole).map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-xs font-mono text-gray-600 mb-1">
                      ID: {u.nationalId || 'N/A'}
                    </div>
                    {currentUser.role === UserRole.ADMIN ? (
                      editingPassId === u.id ? (
                        <div className="flex items-center gap-1">
                          <input 
                            type="text" 
                            className="text-xs border rounded px-1 py-0.5 w-24"
                            value={newPassVal}
                            onChange={(e) => setNewPassVal(e.target.value)}
                            placeholder="New PW"
                          />
                          <button onClick={() => handleSavePass(u.id)} className="text-green-600"><i className="fas fa-check"></i></button>
                          <button onClick={() => setEditingPassId(null)} className="text-red-600"><i className="fas fa-times"></i></button>
                        </div>
                      ) : (
                        <div className="text-xs font-mono text-indigo-400 flex items-center gap-2">
                          PW: {u.password}
                          <button onClick={() => { setEditingPassId(u.id); setNewPassVal(u.password || ''); }} className="text-gray-400 hover:text-indigo-600">
                            <i className="fas fa-edit"></i>
                          </button>
                        </div>
                      )
                    ) : (
                      <div className="text-xs text-gray-300 italic">مخفي للمشرفين</div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.isActive ? 'نشط' : 'معطل'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleStatus(u.id)}
                        disabled={u.id === currentUser.id}
                        className={`p-2 rounded-lg transition-colors ${u.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                        title={u.isActive ? 'تعطيل' : 'تفعيل'}
                      >
                        <i className={`fas fa-${u.isActive ? 'user-slash' : 'user-check'}`}></i>
                      </button>
                      <button
                        onClick={() => onDelete(u.id)}
                        disabled={u.id === currentUser.id || currentUser.role !== UserRole.ADMIN}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
