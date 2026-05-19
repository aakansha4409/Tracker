import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  error: string | null;
  signup: (email: string, password: string, name: string) => boolean;
  login: (email: string, password: string) => boolean;
  generateVerificationCode?: (email: string) => string | null;
  verifyCode?: (email: string, code: string) => boolean;
  updateProfile: (data: Partial<Pick<User, 'name' | 'avatar'>>) => void;
  logout: () => void;
  clearError: () => void;
}

// Simple in-browser user registry (no backend)
const USERS_KEY = 'tracker_users_registry';

function getRegistry(): Record<string, { passwordHash: string; user: User }> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveRegistry(registry: Record<string, { passwordHash: string; user: User }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(registry));
}

// Very simple hash – fine for a local-only app
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(36);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      error: null,

      signup: (email, password, name) => {
        const registry = getRegistry();
        const key = email.toLowerCase();
        if (registry[key]) {
          set({ error: 'An account with this email already exists.' });
          return false;
        }
        if (password.length < 6) {
          set({ error: 'Password must be at least 6 characters.' });
          return false;
        }
        const user: User = {
          id: Math.random().toString(36).substring(2, 10),
          email: email.toLowerCase(),
          name,
          createdAt: new Date().toISOString(),
        };
        // store verified flag as part of registry entry
        registry[key] = { passwordHash: hashPassword(password), user, verified: false } as any;
        saveRegistry(registry);
        // do not auto-login — require email verification
        set({ user: null, isLoggedIn: false, error: null });
        return true;
      },

      login: (email, password) => {
        const registry = getRegistry();
        const key = email.toLowerCase();
        const entry: any = registry[key];
        if (!entry) {
          set({ error: 'No account found with this email.' });
          return false;
        }
        if (entry.passwordHash !== hashPassword(password)) {
          set({ error: 'Incorrect password.' });
          return false;
        }
        if (!entry.verified) {
          // not verified: don't log in yet
          set({ user: null, isLoggedIn: false, error: 'Email not verified. Please check your inbox for the code.' });
          return false;
        }
        set({ user: entry.user, isLoggedIn: true, error: null });
        return true;
      },

      // Helper: generate and store a verification code for an email (simulated send)
      generateVerificationCode: (email: string) => {
        try {
          const codesRaw = localStorage.getItem('tracker_verification_codes') || '{}';
          const codes = JSON.parse(codesRaw);
          const code = Math.floor(100000 + Math.random() * 900000).toString();
          const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
          codes[email.toLowerCase()] = { code, expires };
          localStorage.setItem('tracker_verification_codes', JSON.stringify(codes));
          // In a production app we'd send this over email — here we return it so UI can show a hint or copy
          // eslint-disable-next-line no-console
          console.info('Verification code for', email, code);
          return code;
        } catch (e) {
          return null;
        }
      },

      verifyCode: (email: string, code: string) => {
        try {
          const raw = localStorage.getItem('tracker_verification_codes') || '{}';
          const store = JSON.parse(raw);
          const entry = store[email.toLowerCase()];
          if (!entry) return false;
          if (Date.now() > entry.expires) return false;
          if (entry.code !== code) return false;
          // mark registry verified
          const registry = getRegistry() as any;
          const key = email.toLowerCase();
          if (!registry[key]) return false;
          registry[key].verified = true;
          saveRegistry(registry);
          // set user and login
          set({ user: registry[key].user, isLoggedIn: true, error: null });
          // remove used code
          delete store[key];
          localStorage.setItem('tracker_verification_codes', JSON.stringify(store));
          return true;
        } catch (e) {
          return false;
        }
      },

      updateProfile: (data) => {
        set((state) => {
          if (!state.user) return state;

          const registry = getRegistry();
          const key = state.user.email.toLowerCase();
          const entry = registry[key];
          if (!entry) return state;

          const updatedUser: User = {
            ...entry.user,
            ...data,
          };

          registry[key] = {
            ...entry,
            user: updatedUser,
          };
          saveRegistry(registry);

          return {
            ...state,
            user: updatedUser,
          };
        });
      },

      logout: () => {
        set({ user: null, isLoggedIn: false, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'tracker-auth-session' }
  )
);
