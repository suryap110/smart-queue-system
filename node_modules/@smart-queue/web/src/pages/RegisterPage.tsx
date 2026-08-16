import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { useLangStore } from '../store/useLangStore';
import { Hospital, Mail, Lock, UserPlus, AlertCircle, ShieldCheck, User, Phone, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { setAuth } = useAuthStore();
  const { t } = useLangStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'DOCTOR' | 'NURSE' | 'STAFF' | 'ADMIN'>('DOCTOR');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/register', {
        email,
        password,
        name,
        phone,
        role
      });

      if (res.data.success) {
        setAuth(res.data.data.user, res.data.data.token);
        if (['DOCTOR', 'NURSE', 'STAFF'].includes(res.data.data.user.role)) {
          navigate('/doctor');
        } else {
          navigate('/admin');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-teal-50 text-teal-700 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
            <UserPlus className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">MediQueue OS™ Registration</h2>
          <p className="text-xs text-slate-500">Register new Doctor, Nurse, or Officer credentials into database</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Dr. Sneha Roy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="sneha.roy@aiiph.gov.in"
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
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Role Privilege</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'DOCTOR', label: 'OPD Doctor' },
                { id: 'NURSE', label: 'Triage Nurse' },
                { id: 'STAFF', label: 'Pharmacy Staff' },
                { id: 'ADMIN', label: 'Superintendent' }
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                    role === r.id
                      ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20'
                      : 'border-slate-200 text-slate-600 bg-slate-50'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-extrabold py-3.5 rounded-2xl shadow-xl transition text-xs flex items-center justify-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Create Account & Login'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-teal-700 hover:underline">
            Sign in here
          </Link>
        </div>

      </div>
    </div>
  );
};
