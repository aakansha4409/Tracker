import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [sentCodeHint, setSentCodeHint] = useState<string | null>(null);

  const { login, signup, error, clearError, generateVerificationCode, verifyCode } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400)); // tiny UX delay
    if (mode === 'login') {
      const res = login(email, password);
      if (!res) {
        // if login failed due to not-verified, request a code
        const code = generateVerificationCode?.(email);
        setSentCodeHint(code ?? null);
        setOtpMode(true);
      }
    } else {
      if (!name.trim()) { setLoading(false); return; }
      const created = signup(email, password, name.trim());
      if (created) {
        const code = generateVerificationCode?.(email);
        setSentCodeHint(code ?? null);
        setOtpMode(true);
      }
    }
    setLoading(false);
  };

  const handleVerify = () => {
    if (!verifyCode) return;
    const ok = verifyCode(email, otpCode.trim());
    if (!ok) {
      // show generic error via store
      // set local error by using store's set? reuse clearError and set error via signup/login flows
      // For simplicity, setOtpMode stays and we update sentCodeHint to null to avoid revealing code
      // eslint-disable-next-line no-console
      console.warn('Invalid verification code');
      return;
    }
    // success — AuthStore will mark user as logged in
    setOtpMode(false);
    setOtpCode('');
    setSentCodeHint(null);
  };

  const handleResend = () => {
    const code = generateVerificationCode?.(email);
    setSentCodeHint(code ?? null);
  };

  const switchMode = () => {
    clearError();
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cream relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-pink-soft opacity-60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-beige opacity-80 blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-pink-dusty/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur border border-white shadow-soft flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-brown-muted" />
          </div>
          <h1 className="text-3xl font-serif font-medium text-brown-dark tracking-wide">Aura</h1>
          <p className="text-brown-muted text-sm mt-1">Your aesthetic habit tracker ✨</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          {/* Tab Switcher */}
          <div className="flex bg-beige/50 rounded-2xl p-1 mb-8">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { if (mode !== m) switchMode(); }}
                className={cn(
                  'flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
                  mode === m
                    ? 'bg-white text-brown-dark shadow-soft'
                    : 'text-brown-muted hover:text-brown-dark'
                )}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {otpMode ? (
              <motion.div
                key="otp"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="text-sm text-brown-muted">We sent a 6-digit verification code to <strong className="text-brown-dark">{email}</strong>. Enter it below to continue.</div>
                <div className="relative">
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter verification code"
                    className="w-full pl-4 pr-4 py-3.5 bg-white/60 border border-beige rounded-2xl text-brown-dark placeholder:text-brown-muted/60 focus:outline-none focus:border-pink-dark focus:ring-2 focus:ring-pink-dusty/30 transition-all text-sm"
                  />
                </div>

                <div className="flex gap-3">
                  <button onClick={handleVerify} className="flex-1 py-3.5 bg-brown-dark text-cream rounded-2xl font-medium text-sm">Verify</button>
                  <button onClick={handleResend} type="button" className="py-3.5 px-4 bg-white/60 rounded-2xl text-sm">Resend</button>
                </div>

                {sentCodeHint && (
                  <div className="text-xs text-brown-muted/70">Dev hint: code is <strong className="text-brown-dark">{sentCodeHint}</strong></div>
                )}
              </motion.div>
            ) : (
              <motion.form
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
              {mode === 'signup' && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-muted" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-white/60 border border-beige rounded-2xl text-brown-dark placeholder:text-brown-muted/60 focus:outline-none focus:border-pink-dark focus:ring-2 focus:ring-pink-dusty/30 transition-all text-sm"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white/60 border border-beige rounded-2xl text-brown-dark placeholder:text-brown-muted/60 focus:outline-none focus:border-pink-dark focus:ring-2 focus:ring-pink-dusty/30 transition-all text-sm"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Password (min 6 chars)' : 'Password'}
                  required
                  className="w-full pl-11 pr-12 py-3.5 bg-white/60 border border-beige rounded-2xl text-brown-dark placeholder:text-brown-muted/60 focus:outline-none focus:border-pink-dark focus:ring-2 focus:ring-pink-dusty/30 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brown-muted hover:text-brown-dark transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brown-dark text-cream rounded-2xl font-medium text-sm hover:bg-brown-dark/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer hint */}
          <p className="text-center text-xs text-brown-muted mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={switchMode} className="text-brown-dark font-medium hover:underline">
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="text-center text-[11px] text-brown-muted/60 mt-6">
          Your data is stored locally on this device 🔒
        </p>
      </div>
    </div>
  );
};
