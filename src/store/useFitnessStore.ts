import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ExerciseType = 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';
export type IntensityLevel = 'light' | 'moderate' | 'intense';

export interface Exercise {
  id: string;
  userId: string;
  name: string;
  type: ExerciseType;
  duration: number; // in minutes
  caloriesBurned?: number;
  intensity: IntensityLevel;
  date: string;
  notes: string;
  createdAt: string;
}

export interface FitnessGoal {
  id: string;
  userId: string;
  name: string;
  targetCalories?: number;
  targetMinutes?: number;
  targetDays?: number;
  deadline: string;
  completed: boolean;
  progress: number;
  createdAt: string;
}

export interface DailyFitnessStats {
  date: string;
  totalMinutes: number;
  caloriesBurned: number;
  exercisesCount: number;
  types: ExerciseType[];
}

interface FitnessState {
  exercises: Exercise[];
  goals: FitnessGoal[];
  dailyStats: DailyFitnessStats[];
  
  // Exercise actions
  addExercise: (exercise: Omit<Exercise, 'id' | 'createdAt'>) => void;
  deleteExercise: (id: string) => void;
  getExercisesByDate: (date: string) => Exercise[];
  getExercisesByUser: (userId: string) => Exercise[];
  
  // Goal actions
  addGoal: (goal: Omit<FitnessGoal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<FitnessGoal>) => void;
  deleteGoal: (id: string) => void;
  
  // Stats actions
  updateDailyStats: (date: string, userId: string) => void;
  getWeeklyStats: (userId: string, days?: number) => DailyFitnessStats[];
}

export const useFitnessStore = create<FitnessState>()(
  persist(
    (set, get) => ({
      exercises: [],
      goals: [],
      dailyStats: [],

      addExercise: (exercise) => {
        const newExercise: Exercise = {
          ...exercise,
          id: `exercise_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          exercises: [...state.exercises, newExercise],
        }));
        get().updateDailyStats(exercise.date, exercise.userId);
      },

      deleteExercise: (id) => {
        const exercise = get().exercises.find((e) => e.id === id);
        if (exercise) {
          get().updateDailyStats(exercise.date, exercise.userId);
        }
        set((state) => ({
          exercises: state.exercises.filter((e) => e.id !== id),
        }));
      },

      getExercisesByDate: (date) => {
        return get().exercises.filter((e) => e.date === date);
      },

      getExercisesByUser: (userId) => {
        return get().exercises.filter((e) => e.userId === userId);
      },

      addGoal: (goal) => {
        const newGoal: FitnessGoal = {
          ...goal,
          id: `goal_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          goals: [...state.goals, newGoal],
        }));
      },

      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, ...updates } : goal
          ),
        }));
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        }));
      },

      updateDailyStats: (date, userId) => {
        const dayExercises = get().getExercisesByDate(date).filter((e) => e.userId === userId);
        const totalMinutes = dayExercises.reduce((sum, e) => sum + e.duration, 0);
        const caloriesBurned = dayExercises.reduce((sum, e) => sum + (e.caloriesBurned || 0), 0);
        const types = [...new Set(dayExercises.map((e) => e.type))];

        set((state) => {
          const existingIndex = state.dailyStats.findIndex((s) => s.date === date);
          const newStats: DailyFitnessStats = {
            date,
            totalMinutes,
            caloriesBurned,
            exercisesCount: dayExercises.length,
            types,
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
        const weekData: DailyFitnessStats[] = [];

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const stats = get().dailyStats.find((s) => s.date === dateStr);
          weekData.push(stats || { date: dateStr, totalMinutes: 0, caloriesBurned: 0, exercisesCount: 0, types: [] });
        }

        return weekData;
      },
    }),
    {
      name: 'aesthetic-tracker-fitness',
    }
  )
);
