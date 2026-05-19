import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Moon, Save, Settings, ShieldCheck, User } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useUserStore } from '../../store/useUserStore';

export const SettingsDashboard = () => {
  const { user, updateProfile } = useAuthStore();
  const { theme, toggleTheme } = useUserStore();
  const { getUserSettings, updateUserSettings, resetUserSettings } = useSettingsStore();

  const userId = user?.id ?? 'guest';
  const settings = getUserSettings(userId);

  const [name, setName] = useState(user?.name ?? '');
  const [avatar, setAvatar] = useState(user?.avatar ?? '');
  const [saved, setSaved] = useState(false);

  const initials = useMemo(() => {
    const src = (name || user?.name || 'User').trim();
    return src.charAt(0).toUpperCase();
  }, [name, user?.name]);

  const saveProfile = () => {
    const nextName = name.trim();
    if (!nextName) return;
    updateProfile({ name: nextName, avatar: avatar.trim() || undefined });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const applyQuickPreset = (preset: 'focus' | 'balanced' | 'recovery') => {
    if (preset === 'focus') {
      updateUserSettings(userId, {
        dailyStudyGoalHours: 4,
        focusDurationMinutes: 50,
        shortBreakMinutes: 10,
        longBreakMinutes: 20,
      });
      return;
    }

    if (preset === 'balanced') {
      updateUserSettings(userId, {
        dailyStudyGoalHours: 2,
        dailyFitnessGoalMinutes: 45,
        focusDurationMinutes: 25,
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
      });
      return;
    }

    updateUserSettings(userId, {
      dailyStudyGoalHours: 1,
      dailyFitnessGoalMinutes: 30,
      focusDurationMinutes: 20,
      shortBreakMinutes: 8,
      longBreakMinutes: 20,
    });
  };

  return (
    <div className="w-full space-y-6 pb-8">
      <div className="glass-card p-8 bg-gradient-to-br from-slate-100/60 to-cyan-100/50 rounded-2xl border border-white/30">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-slate-200">
            <Settings className="w-6 h-6 text-slate-700" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-medium text-brown-dark">Settings</h1>
            <p className="text-brown-muted">Personalize your workflow, account preferences, and privacy controls.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl lg:col-span-1 space-y-4">
          <h2 className="text-lg font-serif text-brown-dark flex items-center gap-2">
            <User className="w-4 h-4" /> Profile
          </h2>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-beige flex items-center justify-center overflow-hidden border border-white">
              {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-brown-dark font-serif">{initials}</span>}
            </div>
            <div>
              <p className="text-sm font-medium text-brown-dark">{user?.email}</p>
              <p className="text-xs text-brown-muted">Account created {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</p>
            </div>
          </div>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Display name"
            className="w-full px-4 py-2 rounded-xl bg-white/60 border border-beige focus:outline-none"
          />
          <input
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="Avatar URL (optional)"
            className="w-full px-4 py-2 rounded-xl bg-white/60 border border-beige focus:outline-none"
          />

          <button onClick={saveProfile} className="w-full px-4 py-2 rounded-xl bg-brown-dark text-cream text-sm font-medium flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Save Profile
          </button>
          {saved && <p className="text-xs text-emerald-700">Profile updated.</p>}
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-6 rounded-2xl lg:col-span-2 space-y-5">
          <h2 className="text-lg font-serif text-brown-dark">Daily Targets</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-1 text-sm text-brown-dark">
              <span>Daily Study Goal (hours)</span>
              <input
                type="number"
                min={0}
                max={12}
                value={settings.dailyStudyGoalHours}
                onChange={(e) => updateUserSettings(userId, { dailyStudyGoalHours: Number(e.target.value) || 0 })}
                className="w-full px-4 py-2 rounded-xl bg-white/60 border border-beige"
              />
            </label>

            <label className="space-y-1 text-sm text-brown-dark">
              <span>Daily Fitness Goal (minutes)</span>
              <input
                type="number"
                min={0}
                max={300}
                value={settings.dailyFitnessGoalMinutes}
                onChange={(e) => updateUserSettings(userId, { dailyFitnessGoalMinutes: Number(e.target.value) || 0 })}
                className="w-full px-4 py-2 rounded-xl bg-white/60 border border-beige"
              />
            </label>

            <label className="space-y-1 text-sm text-brown-dark">
              <span>Water Goal (glasses)</span>
              <input
                type="number"
                min={1}
                max={20}
                value={settings.dailyWaterGoalGlasses}
                onChange={(e) => updateUserSettings(userId, { dailyWaterGoalGlasses: Number(e.target.value) || 1 })}
                className="w-full px-4 py-2 rounded-xl bg-white/60 border border-beige"
              />
            </label>

            <label className="space-y-1 text-sm text-brown-dark">
              <span>Timezone</span>
              <input
                value={settings.timezone}
                onChange={(e) => updateUserSettings(userId, { timezone: e.target.value.trim() || 'UTC' })}
                className="w-full px-4 py-2 rounded-xl bg-white/60 border border-beige"
              />
            </label>
          </div>

          <h3 className="text-base font-serif text-brown-dark pt-2">Focus Session</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="space-y-1 text-sm text-brown-dark">
              <span>Focus (min)</span>
              <input
                type="number"
                min={10}
                max={120}
                value={settings.focusDurationMinutes}
                onChange={(e) => updateUserSettings(userId, { focusDurationMinutes: Number(e.target.value) || 25 })}
                className="w-full px-4 py-2 rounded-xl bg-white/60 border border-beige"
              />
            </label>
            <label className="space-y-1 text-sm text-brown-dark">
              <span>Short Break</span>
              <input
                type="number"
                min={1}
                max={30}
                value={settings.shortBreakMinutes}
                onChange={(e) => updateUserSettings(userId, { shortBreakMinutes: Number(e.target.value) || 5 })}
                className="w-full px-4 py-2 rounded-xl bg-white/60 border border-beige"
              />
            </label>
            <label className="space-y-1 text-sm text-brown-dark">
              <span>Long Break</span>
              <input
                type="number"
                min={5}
                max={60}
                value={settings.longBreakMinutes}
                onChange={(e) => updateUserSettings(userId, { longBreakMinutes: Number(e.target.value) || 15 })}
                className="w-full px-4 py-2 rounded-xl bg-white/60 border border-beige"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button onClick={() => applyQuickPreset('focus')} className="px-3 py-1 rounded-lg bg-beige text-brown-dark text-sm">Deep Focus</button>
            <button onClick={() => applyQuickPreset('balanced')} className="px-3 py-1 rounded-lg bg-beige text-brown-dark text-sm">Balanced</button>
            <button onClick={() => applyQuickPreset('recovery')} className="px-3 py-1 rounded-lg bg-beige text-brown-dark text-sm">Recovery</button>
          </div>
        </motion.section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-serif text-brown-dark flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</h2>

          <label className="flex items-center justify-between gap-3 text-sm text-brown-dark">
            <span>Enable in-app notifications</span>
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) => updateUserSettings(userId, { notificationsEnabled: e.target.checked })}
              className="w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between gap-3 text-sm text-brown-dark">
            <span>Email reminders</span>
            <input
              type="checkbox"
              checked={settings.emailReminders}
              onChange={(e) => updateUserSettings(userId, { emailReminders: e.target.checked })}
              className="w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between gap-3 text-sm text-brown-dark">
            <span>Start week on Monday</span>
            <input
              type="checkbox"
              checked={settings.startWeekOnMonday}
              onChange={(e) => updateUserSettings(userId, { startWeekOnMonday: e.target.checked })}
              className="w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between gap-3 text-sm text-brown-dark">
            <span>Compact cards</span>
            <input
              type="checkbox"
              checked={settings.compactCards}
              onChange={(e) => updateUserSettings(userId, { compactCards: e.target.checked })}
              className="w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between gap-3 text-sm text-brown-dark">
            <span>Show archived entries by default</span>
            <input
              type="checkbox"
              checked={settings.showArchivedItems}
              onChange={(e) => updateUserSettings(userId, { showArchivedItems: e.target.checked })}
              className="w-4 h-4"
            />
          </label>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-serif text-brown-dark flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Privacy & Appearance</h2>

          <div className="flex items-center justify-between rounded-xl bg-beige/60 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-brown-dark">Theme</p>
              <p className="text-xs text-brown-muted">Switch between light and dark mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3 py-2 rounded-lg bg-white text-brown-dark text-sm flex items-center gap-2"
            >
              <Moon className="w-4 h-4" /> {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
            </button>
          </div>

          <div className="rounded-xl bg-beige/60 px-4 py-3">
            <p className="text-sm font-medium text-brown-dark">Security status</p>
            <p className="text-xs text-brown-muted mt-1">Email verification and session controls are enabled in the security layer.</p>
          </div>

          <button
            onClick={() => resetUserSettings(userId)}
            className="w-full px-4 py-2 rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-200"
          >
            Reset All Preferences
          </button>
        </motion.section>
      </div>
    </div>
  );
};
