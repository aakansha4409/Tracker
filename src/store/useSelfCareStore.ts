import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SelfCareCategory = 'meditation' | 'skincare' | 'relaxation' | 'exercise' | 'sleep' | 'nutrition' | 'hobby' | 'social' | 'other';
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface SelfCareActivity {
  id: string;
  userId: string;
  name: string;
  category: SelfCareCategory;
  duration: number; // in minutes
  mood: MoodLevel; // 1-5
  energyBefore: MoodLevel;
  energyAfter: MoodLevel;
  notes: string;
  date: string;
  createdAt: string;
}

export interface DailySelfCareStats {
  date: string;
  activitiesCount: number;
  totalMinutes: number;
  averageMood: number;
  categories: SelfCareCategory[];
}

interface SelfCareState {
  activities: SelfCareActivity[];
  dailyStats: DailySelfCareStats[];
  
  // Activity actions
  addActivity: (activity: Omit<SelfCareActivity, 'id' | 'createdAt'>) => void;
  deleteActivity: (id: string) => void;
  getActivitiesByDate: (date: string) => SelfCareActivity[];
  getActivitiesByUser: (userId: string) => SelfCareActivity[];
  
  // Stats actions
  updateDailyStats: (date: string, userId: string) => void;
  getWeeklyStats: (userId: string, days?: number) => DailySelfCareStats[];
  getAverageMood: (userId: string, days?: number) => number;
}

export const useSelfCareStore = create<SelfCareState>()(
  persist(
    (set, get) => ({
      activities: [],
      dailyStats: [],

      addActivity: (activity) => {
        const newActivity: SelfCareActivity = {
          ...activity,
          id: `activity_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          activities: [...state.activities, newActivity],
        }));
        get().updateDailyStats(activity.date, activity.userId);
      },

      deleteActivity: (id) => {
        const activity = get().activities.find((a) => a.id === id);
        if (activity) {
          get().updateDailyStats(activity.date, activity.userId);
        }
        set((state) => ({
          activities: state.activities.filter((a) => a.id !== id),
        }));
      },

      getActivitiesByDate: (date) => {
        return get().activities.filter((a) => a.date === date);
      },

      getActivitiesByUser: (userId) => {
        return get().activities.filter((a) => a.userId === userId);
      },

      updateDailyStats: (date, userId) => {
        const dayActivities = get().getActivitiesByDate(date).filter((a) => a.userId === userId);
        const totalMinutes = dayActivities.reduce((sum, a) => sum + a.duration, 0);
        const averageMood =
          dayActivities.length > 0
            ? dayActivities.reduce((sum, a) => sum + a.mood, 0) / dayActivities.length
            : 0;
        const categories = [...new Set(dayActivities.map((a) => a.category))];

        set((state) => {
          const existingIndex = state.dailyStats.findIndex((s) => s.date === date);
          const newStats: DailySelfCareStats = {
            date,
            activitiesCount: dayActivities.length,
            totalMinutes,
            averageMood,
            categories,
          };

          if (existingIndex > -1) {
            const updated = [...state.dailyStats];
            updated[existingIndex] = newStats;
            return { dailyStats: updated };
          }
          return { dailyStats: [...state.dailyStats, newStats] };
        });
      },

      getWeeklyStats: (userId, days = 7) => {
        const today = new Date();
        const weekData: DailySelfCareStats[] = [];

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const stats = get().dailyStats.find((s) => s.date === dateStr);
          weekData.push(
            stats || {
              date: dateStr,
              activitiesCount: 0,
              totalMinutes: 0,
              averageMood: 0,
              categories: [],
            }
          );
        }

        return weekData;
      },

      getAverageMood: (userId, days = 7) => {
        const weekStats = get().getWeeklyStats(userId, days);
        const validStats = weekStats.filter((s) => s.averageMood > 0);
        return validStats.length > 0
          ? validStats.reduce((sum, s) => sum + s.averageMood, 0) / validStats.length
          : 0;
      },
    }),
    {
      name: 'aesthetic-tracker-selfcare',
    }
  )
);
