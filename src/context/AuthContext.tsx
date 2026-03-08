'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AuthUser {
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
}

interface StoredCredential {
  email: string;
  password: string;
  user: AuthUser;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
}

const DEMO_CREDENTIALS: StoredCredential[] = [
  {
    email: 'demo@saascore.io',
    password: 'demo1234',
    user: { name: 'Alex Turner', email: 'demo@saascore.io', role: 'Admin', avatarInitials: 'AT' },
  },
];

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('auth_user');
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setLoading(false);
  }, []);

  async function login(email: string, password: string): Promise<{ error?: string }> {
    const registered: StoredCredential[] = JSON.parse(
      localStorage.getItem('registered_users') ?? '[]'
    );
    const match = [...DEMO_CREDENTIALS, ...registered].find(
      (c) => c.email === email && c.password === password
    );
    if (!match) return { error: 'Invalid email or password.' };
    localStorage.setItem('auth_user', JSON.stringify(match.user));
    setUser(match.user);
    return {};
  }

  async function register(
    name: string,
    email: string,
    password: string
  ): Promise<{ error?: string }> {
    const registered: StoredCredential[] = JSON.parse(
      localStorage.getItem('registered_users') ?? '[]'
    );
    const exists = [...DEMO_CREDENTIALS, ...registered].some((c) => c.email === email);
    if (exists) return { error: 'An account with this email already exists.' };

    const initials = name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newUser: AuthUser = { name, email, role: 'Member', avatarInitials: initials };
    const newEntry: StoredCredential = { email, password, user: newUser };
    localStorage.setItem('registered_users', JSON.stringify([...registered, newEntry]));
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    setUser(newUser);
    return {};
  }

  function logout() {
    localStorage.removeItem('auth_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
