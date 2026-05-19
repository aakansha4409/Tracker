import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StudyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface StudyTopic {
  id: string;
  userId: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  level: StudyLevel;
  totalHours: number;
  lastStudied: string;
  sessions: number;
  progress: number;
  createdAt: string;
  targetDate?: string;
  targetHours?: number;
}

export interface StudySession {
  id: string;
  userId: string;
  topicId: string;
  topicName: string;
  duration: number; // in minutes
  date: string;
  notes: string;
  focused: boolean;
  createdAt: string;
}

export interface DailyStats {
  date: string;
  totalMinutes: number;
  sessionsCount: number;
  topicsStudied: string[];
}

interface StudyState {
  topics: StudyTopic[];
  sessions: StudySession[];
  dailyStats: DailyStats[];
  currentSession: StudySession | null;
  
  // Topic actions
  addTopic: (topic: Omit<StudyTopic, 'id' | 'createdAt'>) => void;
  updateTopic: (id: string, updates: Partial<StudyTopic>) => void;
  deleteTopic: (id: string) => void;
  getTopic: (id: string) => StudyTopic | undefined;
  
  // Session actions
  addSession: (session: Omit<StudySession, 'id' | 'createdAt'>) => void;
  deleteSession: (id: string) => void;
  getSessionsByTopic: (topicId: string) => StudySession[];
  getSessionsByDate: (date: string) => StudySession[];
  
  // Stats actions
  updateDailyStats: (date: string) => void;
  getWeeklyStats: (days?: number) => DailyStats[];
  
  // Current session
  setCurrentSession: (session: StudySession | null) => void;
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      topics: [],
      sessions: [],
      dailyStats: [],
      currentSession: null,

      addTopic: (topic) => {
        const newTopic: StudyTopic = {
          ...topic,
          id: `topic_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          topics: [...state.topics, newTopic],
        }));
      },

      updateTopic: (id, updates) => {
        set((state) => ({
          topics: state.topics.map((topic) =>
            topic.id === id ? { ...topic, ...updates } : topic
          ),
        }));
      },

      deleteTopic: (id) => {
        set((state) => ({
          topics: state.topics.filter((topic) => topic.id !== id),
          sessions: state.sessions.filter((session) => session.topicId !== id),
        }));
      },

      getTopic: (id) => {
        return get().topics.find((topic) => topic.id === id);
      },

      addSession: (session) => {
        const newSession: StudySession = {
          ...session,
          id: `session_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          sessions: [...state.sessions, newSession],
        }));

        // Update topic stats
        const topic = get().getTopic(session.topicId);
        if (topic) {
          const newTotalHours = topic.totalHours + session.duration / 60;
          get().updateTopic(session.topicId, {
            totalHours: newTotalHours,
            sessions: topic.sessions + 1,
            lastStudied: new Date().toISOString(),
            progress: Math.min((newTotalHours / (topic.targetHours || 10)) * 100, 100),
          });
        }

        // Update daily stats
        get().updateDailyStats(new Date().toISOString().split('T')[0]);
      },

      deleteSession: (id) => {
        const session = get().sessions.find((s) => s.id === id);
        if (session) {
          const topic = get().getTopic(session.topicId);
          if (topic) {
            const newTotalHours = Math.max(0, topic.totalHours - session.duration / 60);
            get().updateTopic(session.topicId, {
              totalHours: newTotalHours,
              sessions: Math.max(0, topic.sessions - 1),
              progress: Math.min((newTotalHours / (topic.targetHours || 10)) * 100, 100),
            });
          }
        }

        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        }));
      },

      getSessionsByTopic: (topicId) => {
        return get().sessions.filter((session) => session.topicId === topicId);
      },

      getSessionsByDate: (date) => {
        return get().sessions.filter((session) => session.date === date);
      },

      updateDailyStats: (date) => {
        const sessionsForDay = get().getSessionsByDate(date);
        const totalMinutes = sessionsForDay.reduce((sum, s) => sum + s.duration, 0);
        const topicsStudied = [...new Set(sessionsForDay.map((s) => s.topicId))];

        set((state) => {
          const existingIndex = state.dailyStats.findIndex((s) => s.date === date);
          const newStats: DailyStats = {
            date,
            totalMinutes,
            sessionsCount: sessionsForDay.length,
            topicsStudied,
          };

          if (existingIndex > -1) {
            const updated = [...state.dailyStats];
            updated[existingIndex] = newStats;
            return { dailyStats: updated };
          }
          return { dailyStats: [...state.dailyStats, newStats] };
        });
      },

      getWeeklyStats: (days = 7) => {
        const today = new Date();
        const weekData: DailyStats[] = [];

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const stats = get().dailyStats.find((s) => s.date === dateStr);
          weekData.push(stats || { date: dateStr, totalMinutes: 0, sessionsCount: 0, topicsStudied: [] });
        }

        return weekData;
      },

      setCurrentSession: (session) => {
        set({ currentSession: session });
      },
    }),
    {
      name: 'aesthetic-tracker-study',
    }
  )
);
