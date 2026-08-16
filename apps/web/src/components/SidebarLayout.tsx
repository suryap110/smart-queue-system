import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLangStore } from '../store/useLangStore';
import { 
  Hospital, Ticket, Monitor, HeartPulse, Stethoscope, ShieldCheck, 
  Building2, Printer, Siren, FileText, Star, User, LogOut, Globe, 
  ChevronLeft, ChevronRight, UserPlus, Activity, Lock, Search, Bell, Video, Heart, Users, MapPin
} from 'lucide-react';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const { lang, setLang, t } = useLangStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  // Check if current route is an unauthenticated Auth route (Login / Register / Landing)
  const isAuthPage = 
    location.pathname === '/' || 
    location.pathname === '/login' || 
    location.pathname === '/register';

  // If on Auth Page: Render ONLY clean full-bleed children without Sidebar!
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        <main className="flex-1 flex items-center justify-center p-4">
          {children}
        </main>
      </div>
    );
  }

  const navCategories = [
    {
      title: t('SYSTEM OVERVIEW', 'सिस्टम अवलोकन'),
      items: [
        { path: '/dashboard', label: t('Master Dashboard', 'मास्टर डैशबोर्ड'), icon: Hospital, roles: [] }
      ]
    },
    {
      title: t('CITIZEN ACCESS', 'नागरिक सेवाएं'),
      items: [
        { path: '/kiosk', label: t('Self-Service Kiosk', 'टोकन कियोस्क'), icon: Ticket, roles: [] },
        { path: '/patient-portal', label: t('Patient Health Hub', 'रोगी डिजिटल लॉकर'), icon: Heart, roles: [] },
        { path: '/display', label: t('Public Waiting TV', 'वेटिंग हॉल टीवी'), icon: Monitor, roles: [] },
        { path: '/crowd-tracker', label: t('Crowd & Slot Tracker', 'भीड़ और स्लॉट ट्रैकर'), icon: Users, roles: [] },
        { path: '/feedback', label: t('Citizen Feedback', 'नागरिक प्रतिक्रिया'), icon: Star, roles: [] }
      ]
    },
    {
      title: t('CLINICAL STATIONS', 'चिकित्सा कंसोल'),
      items: [
        { path: '/triage', label: t('Nurse Triage Desk', 'नर्स ट्राइएज'), icon: HeartPulse, roles: ['NURSE', 'DOCTOR', 'ADMIN', 'SUPER_ADMIN'] },
        { path: '/doctor', label: t('Doctor OPD Console', 'डॉक्टर कंसोल'), icon: Stethoscope, roles: ['DOCTOR', 'NURSE', 'STAFF', 'ADMIN', 'SUPER_ADMIN'] },
        { path: '/tele-opd', label: t('AI Tele-OPD Camera', 'वेबकैम ट्राइएज'), icon: Video, roles: ['DOCTOR', 'NURSE', 'ADMIN', 'SUPER_ADMIN'] }
      ]
    },
    {
      title: t('EXECUTIVE & FLEET', 'अधीक्षक एवं बेड़ा'),
      items: [
        { path: '/admin', label: t('Superintendent Portal', 'अधीक्षक पोर्टल'), icon: ShieldCheck, roles: ['ADMIN', 'SUPER_ADMIN', 'HOD'] },
        { path: '/departments', label: t('Departments & Rooms', 'विभाग एवं कक्ष'), icon: Building2, roles: ['ADMIN', 'SUPER_ADMIN', 'HOD'] },
        { path: '/kiosks', label: t('Kiosk Hardware Fleet', 'कियोस्क बेड़ा'), icon: Printer, roles: ['ADMIN', 'SUPER_ADMIN'] },
        { path: '/surge-command', label: t('Disaster Surge Command', 'आपदा कमांड'), icon: Siren, roles: ['ADMIN', 'SUPER_ADMIN'] },
        { path: '/audit-logs', label: t('Audit Trail Logs', 'ऑडिट लॉग्स'), icon: FileText, roles: ['ADMIN', 'SUPER_ADMIN'] }
      ]
    },
    {
      title: t('ACCOUNT & AUTH', 'खाता एवं सुरक्षा'),
      items: [
        { path: '/profile', label: t('My Profile', 'मेरा प्रोफाइल'), icon: User, roles: ['USER', 'DOCTOR', 'NURSE', 'STAFF', 'ADMIN', 'SUPER_ADMIN'] }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900/5 flex flex-col font-sans">
      
      {/* Top System Taskbar */}
      <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 shadow-lg px-4 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-2 text-teal-400 text-xs font-bold bg-teal-950 px-2.5 py-1 rounded border border-teal-800">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span>MediQueue OS™ Live System</span>
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-300 text-xs font-medium hidden sm:inline">AIIPH Main Campus • New Delhi</span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center space-x-1 bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded-xl text-xs font-bold transition border border-slate-700 text-slate-200"
          >
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            <span>{lang === 'en' ? 'HI' : 'EN'}</span>
          </button>

          {user && (
            <div className="flex items-center space-x-2 bg-slate-900 p-1 pl-2.5 rounded-xl border border-slate-800 text-xs">
              <span className="font-bold text-slate-200">{user.name}</span>
              <span className="bg-teal-950 text-teal-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-teal-800">
                {user.role}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-1 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded transition"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Body with Sidebar Drawer & Post-Login Content */}
      <div className="flex-1 flex">
        
        {/* Sidebar Drawer (Rendered ONLY Post-Login) */}
        <aside className={`fixed top-14 bottom-0 left-0 z-30 bg-slate-950 text-white border-r border-slate-800 shadow-2xl transition-all duration-300 flex flex-col justify-between ${
          collapsed ? 'w-20' : 'w-64'
        }`}>
          
          {/* Sidebar Header & Brand Logo */}
          <div>
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <Link to="/dashboard" className="flex items-center space-x-3 overflow-hidden">
                <div className="bg-gradient-to-tr from-teal-600 to-sky-600 p-2.5 rounded-2xl text-white shadow-lg flex-shrink-0">
                  <Hospital className="w-5 h-5" />
                </div>
                {!collapsed && (
                  <div className="truncate">
                    <h1 className="font-black text-xs text-white tracking-tight leading-tight">MediQueue OS™</h1>
                    <span className="text-[9px] text-teal-400 font-bold bg-teal-950 px-1.5 py-0.2 rounded border border-teal-800">
                      POST-AUTH WORKSTATION
                    </span>
                  </div>
                )}
              </Link>

              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-lg transition border border-slate-800"
                title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Navigation Links */}
            <div className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-none">
              {navCategories.map((cat, catIdx) => {
                const visibleItems = cat.items.filter((item) => {
                  if (item.roles.length === 0) return true;
                  if (!user) return false;
                  return item.roles.includes(user.role);
                });

                if (visibleItems.length === 0) return null;

                return (
                  <div key={catIdx} className="space-y-1">
                    {!collapsed && (
                      <h3 className="px-3 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                        {cat.title}
                      </h3>
                    )}

                    <div className="space-y-1">
                      {visibleItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            title={collapsed ? item.label : undefined}
                            className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                              isActive
                                ? 'bg-gradient-to-r from-teal-600 to-sky-600 text-white shadow-lg shadow-teal-500/20'
                                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                            }`}
                          >
                            <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            {!collapsed && <span className="truncate">{item.label}</span>}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer Profile Badge */}
          {user && !collapsed && (
            <div className="p-3 border-t border-slate-800 bg-slate-950/80">
              <div className="flex items-center space-x-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="truncate text-left">
                  <p className="text-xs font-bold text-slate-100 truncate">{user.name}</p>
                  <p className="text-[10px] text-teal-400 font-mono">{user.role}</p>
                </div>
              </div>
            </div>
          )}

        </aside>

        {/* Main Content View Area */}
        <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>

      </div>

    </div>
  );
};
