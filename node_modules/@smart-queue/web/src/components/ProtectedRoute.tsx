import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ShieldAlert, Lock, ArrowRight, LogIn } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, token } = useAuthStore();
  const location = useLocation();

  if (!token || !user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900">Sign In Required</h2>
          <p className="text-xs text-slate-500 mt-1">
            Please sign in with your official hospital credentials to access the <span className="font-bold text-slate-800">{location.pathname}</span> module.
          </p>
        </div>

        <Link
          to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs transition shadow-lg"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In to Access Workstation</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-500 mt-1">
            Your current account role (<span className="font-bold text-slate-800">{user.role}</span>) does not have privileges to access this module.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border text-left text-xs text-slate-600 space-y-1 font-mono">
          <p><span className="font-bold text-slate-800">Required Role:</span> {allowedRoles.join(' | ')}</p>
          <p><span className="font-bold text-slate-800">Logged User:</span> {user.email}</p>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-2xl text-xs transition shadow"
        >
          <ArrowRight className="w-4 h-4" />
          <span>Return to Master Dashboard</span>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};
