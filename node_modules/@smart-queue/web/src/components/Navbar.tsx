import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLangStore } from '../store/useLangStore';
import { 
  Hospital, Globe, LogOut, User as UserIcon, Monitor, Stethoscope, 
  ShieldCheck, Ticket, Building2, FileText, HeartPulse, Printer, Siren, Star, Activity
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { lang, setLang, t } = useLangStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { path: '/kiosk', label: t('Self-Service Kiosk', 'टोकन कियोस्क'), icon: Ticket, roles: [] },
    { path: '/display', label: t('Public Waiting TV', 'वेटिंग हॉल टीवी'), icon: Monitor, roles: [] },
    { path: '/triage', label: t('Nurse Triage Desk', 'नर्स ट्राइएज डेस्क'), icon: HeartPulse, roles: ['NURSE', 'DOCTOR', 'ADMIN', 'SUPER_ADMIN'] },
    { path: '/doctor', label: t('Doctor OPD Console', 'डॉक्टर कंसोल'), icon: Stethoscope, roles: ['DOCTOR', 'NURSE', 'STAFF', 'ADMIN', 'SUPER_ADMIN'] },
    { path: '/admin', label: t('Executive Superintendent', 'अधीक्षक पोर्टल'), icon: ShieldCheck, roles: ['ADMIN', 'SUPER_ADMIN', 'HOD'] },
    { path: '/departments', label: t('Departments & Rooms', 'विभाग एवं कक्ष'), icon: Building2, roles: ['ADMIN', 'SUPER_ADMIN', 'HOD'] },
    { path: '/kiosks', label: t('Kiosk Hardware Fleet', 'कियोस्क बेड़ा'), icon: Printer, roles: ['ADMIN', 'SUPER_ADMIN'] },
    { path: '/surge-command', label: t('Disaster Surge Command', 'आपदा कमांड'), icon: Siren, roles: ['ADMIN', 'SUPER_ADMIN'] },
    { path: '/audit-logs', label: t('Audit Trail Logs', 'ऑडिट लॉग्स'), icon: FileText, roles: ['ADMIN', 'SUPER_ADMIN'] },
    { path: '/feedback', label: t('Citizen Feedback', 'नागरिक प्रतिक्रिया'), icon: Star, roles: [] }
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (item.roles.length === 0) return true;
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  return (
    <header className="sticky top-0 z-50 bg-slate-950 text-white shadow-2xl border-b border-slate-800">
      
      {/* Top Utility Ticker Bar */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-1.5 text-[11px] text-slate-300 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 text-teal-400 font-bold bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span>AIIPH NEXT-GEN LIVE SYSTEM</span>
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden sm:inline">All India Institute of Public Health • Rajpath Campus, New Delhi</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-slate-400 font-mono">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>SLA Wait Target: &lt;15 mins</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="font-mono text-sky-300 font-bold">{currentTime}</span>
        </div>
      </div>

      {/* Main Brand Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <Link to="/" className="flex items-center space-x-3.5 hover:opacity-95 transition">
          <div className="bg-gradient-to-tr from-teal-600 via-sky-600 to-teal-400 p-2.5 rounded-2xl text-white shadow-lg shadow-teal-500/20">
            <Hospital className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-black text-lg tracking-tight text-white">AIIPH SMART QUEUE</h1>
              <span className="bg-sky-500/20 text-sky-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-sky-400/30">
                PRO 3.0 ENTERPRISE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Next-Gen Fullstack Hospital & Emergency Suite</p>
          </div>
        </Link>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold transition border border-slate-700 text-slate-200"
          >
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            <span>{lang === 'en' ? 'हिंदी (HI)' : 'English (EN)'}</span>
          </button>

          {user ? (
            <div className="flex items-center space-x-3 bg-slate-900 p-1.5 pl-3 rounded-2xl border border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-100">{user.name}</p>
                <span className="text-[10px] font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800/80">
                  {user.role}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-2 bg-slate-800 hover:bg-red-950/60 hover:text-red-400 rounded-xl text-slate-400 transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-1.5 text-xs bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white px-4 py-2 rounded-xl font-bold transition shadow-lg shadow-teal-500/20"
            >
              <UserIcon className="w-4 h-4" />
              <span>{t('Staff Portal Login', 'स्टाफ लॉगिन')}</span>
            </Link>
          )}
        </div>

      </div>

      {/* Navigation Sub-Bar */}
      <nav className="bg-slate-900/90 backdrop-blur-md border-t border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 overflow-x-auto py-1.5 scrollbar-none">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                  isActive
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

    </header>
  );
};
