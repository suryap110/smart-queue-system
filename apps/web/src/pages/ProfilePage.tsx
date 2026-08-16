import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useLangStore } from '../store/useLangStore';
import { User, ShieldCheck, Mail, Phone, Building2, Lock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { t } = useLangStore();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center space-x-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-teal-600 to-sky-600 text-white rounded-3xl flex items-center justify-center text-2xl font-black shadow-lg">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-black text-slate-900">{user.name}</h2>
              <span className="bg-teal-100 text-teal-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-teal-200">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-700">
          <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Account Metadata</h3>
          
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-500">Email:</span>
              <span className="font-bold text-slate-900">{user.email}</span>
            </div>

            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-500">Role Privilege:</span>
              <span className="font-mono font-bold text-teal-700">{user.role}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-500">Campus Branch:</span>
              <span className="font-bold text-slate-900">Main Campus OPD Block</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-2xl shadow-lg transition text-xs flex items-center justify-center space-x-2"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Sign Out of Account</span>
        </button>

      </div>

    </div>
  );
};
