import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserSettings {
  userId: string;
  dailyStudyGoalHours: number;
  dailyFitnessGoalMinutes: number;
  dailyWaterGoalGlasses: number;
  focusDurationMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  notificationsEnabled: boolean;
  emailReminders: boolean;
  compactCards: boolean;
  startWeekOnMonday: boolean;
  showArchivedItems: boolean;
  timezone: string;
}

interface SettingsState {
  settingsByUser: Record<string, UserSettings>;
  getUserSettings: (userId: string) => UserSettings;
  updateUserSettings: (userId: string, patch: Partial<UserSettings>) => void;
  resetUserSettings: (userId: string) => void;
}

const buildDefaultSettings = (userId: string): UserSettings => ({
  userId,
  dailyStudyGoalHours: 2,
  dailyFitnessGoalMinutes: 45,
  dailyWaterGoalGlasses: 8,
  focusDurationMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  notificationsEnabled: true,
  emailReminders: false,
  compactCards: false,
  startWeekOnMonday: false,
  showArchivedItems: false,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
});

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settingsByUser: {},

      getUserSettings: (userId) => {
        const existing = get().settingsByUser[userId];
        return existing ?? buildDefaultSettings(userId);
      },

      updateUserSettings: (userId, patch) => {
        set((state) => {
          const current = state.settingsByUser[userId] ?? buildDefaultSettings(userId);
          return {
            settingsByUser: {
              ...state.settingsByUser,
              [userId]: {
                ...current,
                ...patch,
                userId,
              },
            },
          };
        });
      },

      resetUserSettings: (userId) => {
        set((state) => ({
          settingsByUser: {
            ...state.settingsByUser,
            [userId]: buildDefaultSettings(userId),
          },
        }));
      },
    }),
    {
      name: 'aesthetic-tracker-settings',
    }
  )
);
