import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  departmentId?: string;
  branchId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

// Initial state from localStorage or default test doctor session for instant testing
const savedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : {
  id: 'doc-101',
  email: 'doctor@aiiph.gov.in',
  name: 'Dr. Rajesh Sharma',
  role: 'DOCTOR',
  departmentId: 'default-dept',
  branchId: 'default-branch'
};

const savedToken = localStorage.getItem('token') || 'jwt-bearer-token-12345';

export const useAuthStore = create<AuthState>((set) => ({
  user: savedUser,
  token: savedToken,
  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  }
}));
