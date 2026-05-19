import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GoalCategory = 'health' | 'productivity' | 'mindfulness' | 'fitness' | 'finance' | 'personal' | 'career' | 'custom';
export type GoalPriority = 'high' | 'medium' | 'low';

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  priority: GoalPriority;
  targetDate: string;
  progress: number; // 0-100
  completed: boolean;
  createdAt: string;
  userId: string;
}

interface GoalState {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'completed'>) => void;
  updateGoal: (id: string, data: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  setProgress: (id: string, progress: number) => void;
  toggleComplete: (id: string) => void;
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set) => ({
      goals: [],

      addGoal: (goalData) => {
        set((state) => ({
          goals: [
            ...state.goals,
            {
              ...goalData,
              id: Math.random().toString(36).substring(2, 10),
              completed: false,
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      },

      updateGoal: (id, data) => {
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...data } : g)),
        }));
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        }));
      },

      setProgress: (id, progress) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, progress, completed: progress >= 100 } : g
          ),
        }));
      },

      toggleComplete: (id) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, completed: !g.completed, progress: g.completed ? g.progress : 100 } : g
          ),
        }));
      },
    }),
    { name: 'tracker-goals' }
  )
);
