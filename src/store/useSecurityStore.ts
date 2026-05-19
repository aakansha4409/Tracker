import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface VerificationEmail {
  email: string;
  code: string;
  expiresAt: number;
  verified: boolean;
}

export interface UserSession {
  userId: string;
  token: string;
  expiresAt: number;
  createdAt: number;
}

interface SecurityState {
  verificationEmails: VerificationEmail[];
  sessions: UserSession[];
  
  // Email Verification
  generateVerificationCode: (email: string) => string;
  verifyEmail: (email: string, code: string) => boolean;
  isEmailVerified: (email: string) => boolean;
  resendVerificationCode: (email: string) => string;
  
  // Session Management
  createSession: (userId: string) => string;
  validateSession: (token: string) => boolean;
  deleteSession: (token: string) => void;
  getUserFromSession: (token: string) => string | null;
  
  // Security
  encryptData: (data: string) => string;
  decryptData: (encrypted: string) => string;
}

// Email verification codes are 6 digits
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Simple encryption (client-side for demo, should use proper crypto in production)
function simpleEncrypt(data: string): string {
  return btoa(data); // Base64 encode
}

function simpleDecrypt(encrypted: string): string {
  try {
    return atob(encrypted);
  } catch {
    return '';
  }
}

export const useSecurityStore = create<SecurityState>()(
  persist(
    (set, get) => ({
      verificationEmails: [],
      sessions: [],

      generateVerificationCode: (email) => {
        const code = generateCode();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
        
        set((state) => ({
          verificationEmails: [
            ...state.verificationEmails.filter((e) => e.email !== email),
            {
              email: email.toLowerCase(),
              code,
              expiresAt,
              verified: false,
            },
          ],
        }));

        // In production, this would send an email via backend
        console.log(`Verification code for ${email}: ${code}`);
        
        return code;
      },

      verifyEmail: (email, code) => {
        const verification = get().verificationEmails.find(
          (e) => e.email === email.toLowerCase()
        );

        if (!verification) {
          return false;
        }

        if (Date.now() > verification.expiresAt) {
          return false; // Code expired
        }

        if (verification.code !== code) {
          return false;
        }

        set((state) => ({
          verificationEmails: state.verificationEmails.map((e) =>
            e.email === email.toLowerCase() ? { ...e, verified: true } : e
          ),
        }));

        return true;
      },

      isEmailVerified: (email) => {
        const verification = get().verificationEmails.find(
          (e) => e.email === email.toLowerCase()
        );
        return verification?.verified ?? false;
      },

      resendVerificationCode: (email) => {
        // Delete old code and generate new one
        set((state) => ({
          verificationEmails: state.verificationEmails.filter(
            (e) => e.email !== email.toLowerCase()
          ),
        }));
        
        return get().generateVerificationCode(email);
      },

      createSession: (userId) => {
        const token = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

        set((state) => ({
          sessions: [
            ...state.sessions,
            {
              userId,
              token,
              expiresAt,
              createdAt: Date.now(),
            },
          ],
        }));

        return token;
      },

      validateSession: (token) => {
        const session = get().sessions.find((s) => s.token === token);
        if (!session) return false;
        if (Date.now() > session.expiresAt) {
          get().deleteSession(token);
          return false;
        }
        return true;
      },

      deleteSession: (token) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.token !== token),
        }));
      },

      getUserFromSession: (token) => {
        if (!get().validateSession(token)) return null;
        const session = get().sessions.find((s) => s.token === token);
        return session?.userId ?? null;
      },

      encryptData: (data) => {
        return simpleEncrypt(data);
      },

      decryptData: (encrypted) => {
        return simpleDecrypt(encrypted);
      },
    }),
    {
      name: 'aesthetic-tracker-security',
    }
  )
);
