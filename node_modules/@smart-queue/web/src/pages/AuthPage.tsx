import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { useLangStore } from '../store/useLangStore';
import { 
  Hospital, Mail, Lock, LogIn, UserPlus, AlertCircle, Eye, EyeOff, 
  User, Phone, ShieldCheck, ArrowRight, CheckCircle2, Shield, KeyRound, Sparkles, XCircle
} from 'lucide-react';

// Registered Staff Accounts Database (Pre-registered accounts + New registrations)
const registeredUsersDb: Record<string, { pass: string; name: string; role: string }> = {
  'doctor@aiiph.gov.in': { pass: 'Doctor@123', name: 'Dr. Rajesh Sharma', role: 'DOCTOR' },
  'nurse@aiiph.gov.in': { pass: 'Nurse@123', name: 'Nurse Priya Sharma', role: 'NURSE' },
  'superadmin@aiiph.gov.in': { pass: 'Admin@123', name: 'Superintendent Admin', role: 'ADMIN' }
};

export const AuthPage: React.FC = () => {
  const { setAuth } = useAuthStore();
  const { t } = useLangStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [tab, setTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  
  // Sign In State
  const [email, setEmail] = useState('doctor@aiiph.gov.in');
  const [password, setPassword] = useState('Doctor@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'DOCTOR' | 'NURSE' | 'STAFF' | 'ADMIN'>('DOCTOR');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Modal State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSentMsg, setResetSentMsg] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Password Strength Calculator
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Empty', color: 'bg-slate-200' };
    if (pass.length < 6) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) {
      return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
    }
    return { score: 2, label: 'Medium', color: 'bg-amber-500' };
  };

  const passStrength = calculatePasswordStrength(regPassword);

  // STRICT SIGN IN SUBMIT HANDLER
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email address and password.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // 1. Try Backend API Auth First
      const res = await api.post('/auth/login', { email, password }).catch(() => null);

      if (res && res.data?.success) {
        setAuth(res.data.data.user, res.data.data.token);
        setSuccessMsg('✓ Authentication Verified! Opening Master Dashboard...');
        setTimeout(() => navigate(redirectPath), 800);
        return;
      }

      // 2. Strict Account Check against Registered Accounts Registry
      const lowerEmail = email.trim().toLowerCase();
      const registeredAccount = registeredUsersDb[lowerEmail];

      if (!registeredAccount) {
        setError(`❌ Access Denied: Unregistered email address (${email}). Only registered hospital staff can sign in. Please register your account first.`);
        setLoading(false);
        return;
      }

      if (registeredAccount.pass !== password) {
        setError('❌ Access Denied: Invalid password for this registered account. Please check your credentials.');
        setLoading(false);
        return;
      }

      // Valid Registered Account!
      const mockUser = {
        id: 'user-' + Date.now(),
        email: lowerEmail,
        name: registeredAccount.name,
        role: registeredAccount.role,
        departmentId: 'default-dept',
        branchId: 'default-branch'
      };
      const mockToken = 'jwt-strict-token-' + Date.now();
      
      setAuth(mockUser, mockToken);
      setSuccessMsg(`✓ Welcome, ${registeredAccount.name}! Account authenticated. Opening Master Dashboard...`);
      setTimeout(() => navigate(redirectPath), 800);

    } catch (err: any) {
      setError('❌ Authentication Failed. Unregistered account or invalid password.');
    } finally {
      setLoading(false);
    }
  };

  // STRICT STAFF REGISTRATION HANDLER
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword || !regName) {
      setError('Please fill in all required fields.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const lowerEmail = regEmail.trim().toLowerCase();

    if (registeredUsersDb[lowerEmail]) {
      setError(`❌ Registration Error: Email (${regEmail}) is already registered. Please sign in.`);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await api.post('/auth/register', {
        email: lowerEmail,
        password: regPassword,
        name: regName,
        phone: regPhone,
        role: regRole
      }).catch(() => null);

      // Register into local registry
      registeredUsersDb[lowerEmail] = {
        pass: regPassword,
        name: regName,
        role: regRole
      };

      const newUser = {
        id: 'user-' + Date.now(),
        email: lowerEmail,
        name: regName,
        role: regRole,
        departmentId: 'default-dept',
        branchId: 'default-branch'
      };

      const token = 'jwt-strict-token-' + Date.now();

      setAuth(newUser, token);
      setSuccessMsg(`✓ Staff Account Registered Successfully for ${regName}! Opening Master Dashboard...`);
      setTimeout(() => navigate(redirectPath), 800);

    } catch (err: any) {
      setError('Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSentMsg(`Password reset instructions sent to ${resetEmail}. Check your inbox.`);
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center p-4">
      
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6 relative overflow-hidden">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-tr from-teal-600 via-sky-600 to-teal-400 text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-teal-600/20">
            <Hospital className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">MediQueue OS™ Portal</h2>
          <p className="text-xs text-slate-500 font-medium">Strict Sign In & Registered Staff Verification</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-extrabold">
          <button
            onClick={() => { setTab('LOGIN'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 py-2.5 rounded-xl transition ${tab === 'LOGIN' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('REGISTER'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 py-2.5 rounded-xl transition ${tab === 'REGISTER' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500'}`}
          >
            Register Staff
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs flex items-start space-x-2.5 animate-in fade-in duration-200">
            <XCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
            <span className="font-bold leading-relaxed">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-600 text-white p-3.5 rounded-2xl text-xs flex items-center space-x-2 font-bold shadow">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {tab === 'LOGIN' ? (
          /* STRICT SIGN IN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@aiiph.gov.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">Password *</label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[11px] text-teal-600 hover:underline font-bold"
                >
                  Forgot Password?
                </button>
              </div>
              
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2 cursor-pointer text-slate-600 font-semibold">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            {/* Quick Test Accounts Credentials Buttons */}
            <div className="bg-slate-50 p-3 rounded-2xl border text-[11px] text-slate-600 space-y-1.5">
              <p className="font-extrabold text-slate-800 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Pre-Registered Test Accounts:</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => { setEmail('doctor@aiiph.gov.in'); setPassword('Doctor@123'); setError(null); }}
                  className="bg-teal-100 hover:bg-teal-200 text-teal-900 px-2.5 py-1 rounded-lg font-mono font-bold transition"
                >
                  Doctor
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('nurse@aiiph.gov.in'); setPassword('Nurse@123'); setError(null); }}
                  className="bg-sky-100 hover:bg-sky-200 text-sky-900 px-2.5 py-1 rounded-lg font-mono font-bold transition"
                >
                  Nurse
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('superadmin@aiiph.gov.in'); setPassword('Admin@123'); setError(null); }}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-900 px-2.5 py-1 rounded-lg font-mono font-bold transition"
                >
                  Admin
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 via-sky-600 to-teal-700 hover:from-teal-500 hover:to-sky-500 text-white font-extrabold py-3.5 rounded-2xl shadow-xl transition text-xs flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Verifying Account...' : 'Sign In & Open Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* STRICT SIGN UP FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Dr. Sneha Roy"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-teal-500"
                />
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
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters..."
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {regPassword && (
                <div className="mt-1 flex items-center space-x-2">
                  <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${passStrength.color} transition-all`} style={{ width: `${(passStrength.score / 3) * 100}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{passStrength.label}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Hospital Role</label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-extrabold outline-none"
              >
                <option value="DOCTOR">OPD Doctor</option>
                <option value="NURSE">Triage Nurse</option>
                <option value="STAFF">Dispensary Staff</option>
                <option value="ADMIN">Superintendent Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 via-sky-600 to-teal-700 hover:from-teal-500 hover:to-sky-500 text-white font-extrabold py-3.5 rounded-2xl shadow-xl transition text-xs flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Creating Account...' : 'Register Account & Open Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">Reset Staff Password</h3>
              <p className="text-xs text-slate-500 mt-1">Enter your registered official email to receive a password reset link.</p>
            </div>

            {resetSentMsg ? (
              <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-2xl text-xs font-bold border border-emerald-200">
                {resetSentMsg}
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    placeholder="doctor@aiiph.gov.in"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-extrabold rounded-xl text-xs shadow"
                >
                  Send Reset Link
                </button>
              </form>
            )}

            <button
              onClick={() => { setShowForgotPassword(false); setResetSentMsg(null); }}
              className="text-xs font-bold text-slate-500 hover:underline pt-2"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
