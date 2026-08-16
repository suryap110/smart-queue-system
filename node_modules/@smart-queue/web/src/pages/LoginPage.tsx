import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { useLangStore } from '../store/useLangStore';
import { Hospital, Mail, Lock, LogIn, AlertCircle, Eye, EyeOff, UserPlus } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { setAuth } = useAuthStore();
  const { t } = useLangStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/doctor';

  const [email, setEmail] = useState('doctor@aiiph.gov.in');
  const [password, setPassword] = useState('Doctor@123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        setAuth(res.data.data.user, res.data.data.token);
        navigate(redirectPath);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-teal-50 text-teal-700 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
            <Hospital className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">MediQueue OS™ Authentication</h2>
          <p className="text-xs text-slate-500">Sign in with your official hospital staff credentials</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Credentials */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border text-[11px] text-slate-600 space-y-1.5">
            <p className="font-extrabold text-slate-800">Quick Demo Accounts:</p>
            <div className="flex flex-wrap gap-1.5">
              <button type="button" onClick={() => { setEmail('doctor@aiiph.gov.in'); setPassword('Doctor@123'); }} className="bg-teal-100 hover:bg-teal-200 text-teal-900 px-2.5 py-1 rounded-lg font-mono font-bold">Doctor</button>
              <button type="button" onClick={() => { setEmail('nurse@aiiph.gov.in'); setPassword('Nurse@123'); }} className="bg-sky-100 hover:bg-sky-200 text-sky-900 px-2.5 py-1 rounded-lg font-mono font-bold">Nurse</button>
              <button type="button" onClick={() => { setEmail('superadmin@aiiph.gov.in'); setPassword('Admin@123'); }} className="bg-purple-100 hover:bg-purple-200 text-purple-900 px-2.5 py-1 rounded-lg font-mono font-bold">Admin</button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-extrabold py-3.5 rounded-2xl shadow-xl transition text-xs flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          Need a new staff account?{' '}
          <Link to="/register" className="font-bold text-teal-700 hover:underline">
            Register Staff Account
          </Link>
        </div>

      </div>
    </div>
  );
};
