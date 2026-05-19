import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';

export type MoodType = 'great' | 'good' | 'okay' | 'bad' | 'awful' | null;

export interface DayLog {
  date: string; // yyyy-MM-dd
  mood: MoodType;
  waterGlasses: number;
  waterGoal: number;
  studyMinutes: number;
  workoutMinutes: number;
  selfCareActivities: string[];
  journalEntry: string;
  notes: string;
}

interface TrackerState {
  logs: Record<string, DayLog>; // keyed by date string
  studyGoalMinutes: number;
  workoutGoalMinutes: number;
  waterGoalGlasses: number;

  // Getters
  getToday: () => DayLog;
  getLog: (date: string) => DayLog;

  // Setters
  setMood: (date: string, mood: MoodType) => void;
  setWater: (date: string, glasses: number) => void;
  addWaterGlass: (date: string) => void;
  removeWaterGlass: (date: string) => void;
  setStudyMinutes: (date: string, minutes: number) => void;
  addStudyMinutes: (date: string, minutes: number) => void;
  setWorkoutMinutes: (date: string, minutes: number) => void;
  addWorkoutMinutes: (date: string, minutes: number) => void;
  toggleSelfCare: (date: string, activity: string) => void;
  setJournal: (date: string, entry: string) => void;
  setNotes: (date: string, notes: string) => void;
  setGoals: (study: number, workout: number, water: number) => void;
}

const defaultLog = (date: string, waterGoal: number): DayLog => ({
  date,
  mood: null,
  waterGlasses: 0,
  waterGoal,
  studyMinutes: 0,
  workoutMinutes: 0,
  selfCareActivities: [],
  journalEntry: '',
  notes: '',
});

export const useTrackerStore = create<TrackerState>()(
  persist(
    (set, get) => ({
      logs: {},
      studyGoalMinutes: 360, // 6 hours
      workoutGoalMinutes: 60,
      waterGoalGlasses: 10,

      getToday: () => {
        const today = format(new Date(), 'yyyy-MM-dd');
        return get().getLog(today);
      },

      getLog: (date) => {
        const state = get();
        return state.logs[date] ?? defaultLog(date, state.waterGoalGlasses);
      },

      setMood: (date, mood) => {
        set((state) => ({
          logs: {
            ...state.logs,
            [date]: { ...(state.logs[date] ?? defaultLog(date, state.waterGoalGlasses)), mood },
          },
        }));
      },

      setWater: (date, glasses) => {
        set((state) => ({
          logs: {
            ...state.logs,
            [date]: { ...(state.logs[date] ?? defaultLog(date, state.waterGoalGlasses)), waterGlasses: Math.max(0, glasses) },
          },
        }));
      },

      addWaterGlass: (date) => {
        const state = get();
        const log = state.logs[date] ?? defaultLog(date, state.waterGoalGlasses);
        set((s) => ({
          logs: {
            ...s.logs,
            [date]: { ...log, waterGlasses: Math.min(log.waterGlasses + 1, 20) },
          },
        }));
      },

      removeWaterGlass: (date) => {
        const state = get();
        const log = state.logs[date] ?? defaultLog(date, state.waterGoalGlasses);
        set((s) => ({
          logs: {
            ...s.logs,
            [date]: { ...log, waterGlasses: Math.max(0, log.waterGlasses - 1) },
          },
        }));
      },

      setStudyMinutes: (date, minutes) => {
        set((state) => ({
          logs: {
            ...state.logs,
            [date]: { ...(state.logs[date] ?? defaultLog(date, state.waterGoalGlasses)), studyMinutes: Math.max(0, minutes) },
          },
        }));
      },

      addStudyMinutes: (date, minutes) => {
        const state = get();
        const log = state.logs[date] ?? defaultLog(date, state.waterGoalGlasses);
        set((s) => ({
          logs: {
            ...s.logs,
            [date]: { ...log, studyMinutes: log.studyMinutes + minutes },
          },
        }));
      },

      setWorkoutMinutes: (date, minutes) => {
        set((state) => ({
          logs: {
            ...state.logs,
            [date]: { ...(state.logs[date] ?? defaultLog(date, state.waterGoalGlasses)), workoutMinutes: Math.max(0, minutes) },
          },
        }));
      },

      addWorkoutMinutes: (date, minutes) => {
        const state = get();
        const log = state.logs[date] ?? defaultLog(date, state.waterGoalGlasses);
        set((s) => ({
          logs: {
            ...s.logs,
            [date]: { ...log, workoutMinutes: log.workoutMinutes + minutes },
          },
        }));
      },

      toggleSelfCare: (date, activity) => {
        const state = get();
        const log = state.logs[date] ?? defaultLog(date, state.waterGoalGlasses);
        const existing = log.selfCareActivities;
        const updated = existing.includes(activity)
          ? existing.filter((a) => a !== activity)
          : [...existing, activity];
        set((s) => ({
          logs: {
            ...s.logs,
            [date]: { ...log, selfCareActivities: updated },
          },
        }));
      },

      setJournal: (date, entry) => {
        set((state) => ({
          logs: {
            ...state.logs,
            [date]: { ...(state.logs[date] ?? defaultLog(date, state.waterGoalGlasses)), journalEntry: entry },
          },
        }));
      },

      setNotes: (date, notes) => {
        set((state) => ({
          logs: {
            ...state.logs,
            [date]: { ...(state.logs[date] ?? defaultLog(date, state.waterGoalGlasses)), notes },
          },
        }));
      },

      setGoals: (study, workout, water) => {
        set({ studyGoalMinutes: study, workoutGoalMinutes: workout, waterGoalGlasses: water });
      },
    }),
    { name: 'tracker-daily-logs' }
  )
);
