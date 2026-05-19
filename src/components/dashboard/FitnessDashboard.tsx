import React, { useState } from 'react';
import { useFitnessStore } from '../../store/useFitnessStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Activity, TrendingUp, Flame, Clock, Plus, Trash2, Target, Footprints } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const FitnessDashboard = () => {
  const { exercises, goals, addExercise, deleteExercise, addGoal, deleteGoal, getWeeklyStats } = useFitnessStore();
  const { user } = useAuthStore();
  const userId = user?.id ?? 'guest';

  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'exercises' | 'goals'>('overview');

  const userExercises = exercises.filter((e) => e.userId === userId);
  const userGoals = goals.filter((g) => g.userId === userId);
  const weeklyStats = getWeeklyStats(userId);

  const [exerciseForm, setExerciseForm] = useState({
    name: '',
    type: 'cardio' as const,
    duration: 30,
    caloriesBurned: 150,
    intensity: 'moderate' as const,
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [goalForm, setGoalForm] = useState({
    name: '',
    targetCalories: 500,
    targetMinutes: 300,
    deadline: '',
  });

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseForm.name.trim()) return;

    addExercise({
      ...exerciseForm,
      userId,
    });

    setExerciseForm({
      name: '',
      type: 'cardio',
      duration: 30,
      caloriesBurned: 150,
      intensity: 'moderate',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setShowExerciseForm(false);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalForm.name.trim() || !goalForm.deadline) return;

    addGoal({
      ...goalForm,
      userId,
      completed: false,
      progress: 0,
    });

    setGoalForm({
      name: '',
      targetCalories: 500,
      targetMinutes: 300,
      deadline: '',
    });
    setShowGoalForm(false);
  };

  const totalMinutes = userExercises.reduce((sum, e) => sum + e.duration, 0);
  const totalCalories = userExercises.reduce((sum, e) => sum + (e.caloriesBurned || 0), 0);

  const chartData = weeklyStats.map((day) => ({
    name: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    minutes: day.totalMinutes,
    calories: day.caloriesBurned,
  }));

  const estimateStepCount = (type: string, intensity: string) => {
    const baseStepsPerMinute =
      type === 'cardio' ? 130 : type === 'sports' ? 115 : type === 'strength' ? 85 : type === 'flexibility' ? 55 : 95;
    const intensityMultiplier = intensity === 'intense' ? 1.2 : intensity === 'light' ? 0.85 : 1;
    return Math.round(baseStepsPerMinute * intensityMultiplier);
  };

  const estimatedSteps = userExercises.reduce((sum, exercise) => {
    return sum + exercise.duration * estimateStepCount(exercise.type, exercise.intensity);
  }, 0);

  const stepGoal = 10000;
  const stepProgress = Math.min(100, Math.round((estimatedSteps / stepGoal) * 100));

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Header */}
      <div className="glass-card p-8 bg-gradient-to-br from-orange-100/50 to-red-100/50 rounded-2xl border border-white/30">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-orange-200">
            <Activity className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-medium text-brown-dark">Fitness Tracker</h1>
            <p className="text-brown-muted">Track workouts, monitor progress, and crush your fitness goals</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="glass-card p-4 rounded-2xl">
        <nav className="flex gap-2">
          {['overview', 'exercises', 'goals'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-xl transition-all font-medium text-sm ${
                activeTab === tab
                  ? 'bg-brown-dark text-cream shadow-soft'
                  : 'bg-beige text-brown-muted hover:bg-beige-dark'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="bg-orange-200 p-3 rounded-lg">
                  <Activity className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <p className="text-brown-muted text-xs font-medium mb-1">Total Workouts</p>
              <p className="text-3xl font-bold text-brown-dark">{userExercises.length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-5 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="bg-blue-200 p-3 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-brown-muted text-xs font-medium mb-1">Total Minutes</p>
              <p className="text-3xl font-bold text-brown-dark">{totalMinutes}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-5 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="bg-red-200 p-3 rounded-lg">
                  <Flame className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <p className="text-brown-muted text-xs font-medium mb-1">Calories Burned</p>
              <p className="text-3xl font-bold text-brown-dark">{totalCalories}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-5 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="bg-green-200 p-3 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-brown-muted text-xs font-medium mb-1">Active Goals</p>
              <p className="text-3xl font-bold text-brown-dark">{userGoals.filter((g) => !g.completed).length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-5 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="bg-amber-200 p-3 rounded-lg">
                  <Footprints className="w-5 h-5 text-amber-700" />
                </div>
              </div>
              <p className="text-brown-muted text-xs font-medium mb-1">Auto Steps</p>
              <p className="text-3xl font-bold text-brown-dark">{estimatedSteps.toLocaleString()}</p>
              <p className="text-[11px] text-brown-muted mt-1">Estimated from logged workouts</p>
              <div className="mt-3 h-1.5 bg-white/70 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${stepProgress}%` }} />
              </div>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-serif font-medium text-brown-dark mb-4">Weekly Minutes</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E9DEC9" />
                  <XAxis dataKey="name" stroke="#8C7A6B" />
                  <YAxis stroke="#8C7A6B" />
                  <Tooltip contentStyle={{ backgroundColor: '#FDFBF7', border: '1px solid #E9DEC9', borderRadius: '8px' }} />
                  <Bar dataKey="minutes" fill="#F0D5D1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-serif font-medium text-brown-dark mb-4">Weekly Calories</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E9DEC9" />
                  <XAxis dataKey="name" stroke="#8C7A6B" />
                  <YAxis stroke="#8C7A6B" />
                  <Tooltip contentStyle={{ backgroundColor: '#FDFBF7', border: '1px solid #E9DEC9', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="calories" stroke="#E8C1BD" strokeWidth={2} dot={{ fill: '#E8C1BD', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Exercises Tab */}
      {activeTab === 'exercises' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-serif font-medium text-brown-dark">My Workouts</h2>
            <button
              onClick={() => setShowExerciseForm(!showExerciseForm)}
              className="flex items-center gap-2 bg-brown-dark text-cream px-4 py-2 rounded-2xl text-sm font-medium hover:bg-brown-dark/90 transition-all"
            >
              <Plus className="w-4 h-4" />
              Log Workout
            </button>
          </div>

          <AnimatePresence>
            {showExerciseForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass-card p-6 rounded-2xl">
                <form onSubmit={handleAddExercise} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Exercise name"
                      value={exerciseForm.name}
                      onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                      className="px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted"
                      required
                    />
                    <select
                      value={exerciseForm.type}
                      onChange={(e) => setExerciseForm({ ...exerciseForm, type: e.target.value as any })}
                      className="px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted"
                    >
                      <option value="cardio">Cardio</option>
                      <option value="strength">Strength</option>
                      <option value="flexibility">Flexibility</option>
                      <option value="sports">Sports</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium text-brown-muted mb-1 block">Duration (min)</label>
                      <input type="number" min="1" value={exerciseForm.duration} onChange={(e) => setExerciseForm({ ...exerciseForm, duration: parseInt(e.target.value) })} className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-brown-muted mb-1 block">Calories</label>
                      <input type="number" min="0" value={exerciseForm.caloriesBurned} onChange={(e) => setExerciseForm({ ...exerciseForm, caloriesBurned: parseInt(e.target.value) })} className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-brown-muted mb-1 block">Intensity</label>
                      <select value={exerciseForm.intensity} onChange={(e) => setExerciseForm({ ...exerciseForm, intensity: e.target.value as any })} className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted">
                        <option value="light">Light</option>
                        <option value="moderate">Moderate</option>
                        <option value="intense">Intense</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-brown-muted mb-1 block">Date</label>
                      <input type="date" value={exerciseForm.date} onChange={(e) => setExerciseForm({ ...exerciseForm, date: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted" />
                    </div>
                  </div>

                  <textarea placeholder="Notes (optional)" value={exerciseForm.notes} onChange={(e) => setExerciseForm({ ...exerciseForm, notes: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted resize-none h-16" />

                  <div className="flex gap-3 justify-end">
                    <button type="button" onClick={() => setShowExerciseForm(false)} className="px-4 py-2 rounded-xl bg-beige text-brown-dark hover:bg-beige-dark">
                      Cancel
                    </button>
                    <button type="submit" className="px-6 py-2 rounded-xl bg-brown-dark text-cream hover:bg-brown-dark/90">
                      Log Workout
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Exercises List */}
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {userExercises.length === 0 ? (
              <div className="glass-card p-8 text-center rounded-2xl">
                <Activity className="w-12 h-12 text-brown-muted mx-auto mb-3 opacity-50" />
                <p className="text-brown-muted">No workouts logged yet. Start your fitness journey!</p>
              </div>
            ) : (
              userExercises
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 20)
                .map((exercise, index) => (
                  <motion.div key={exercise.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="glass-card p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-brown-dark">{exercise.name}</p>
                        <p className="text-xs text-brown-muted">
                          {exercise.duration}m • {exercise.caloriesBurned}kcal • {new Date(exercise.date).toLocaleDateString()} • {exercise.intensity}
                        </p>
                      </div>
                      <button onClick={() => deleteExercise(exercise.id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
            )}
          </div>
        </motion.div>
      )}

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-serif font-medium text-brown-dark">Fitness Goals</h2>
            <button
              onClick={() => setShowGoalForm(!showGoalForm)}
              className="flex items-center gap-2 bg-brown-dark text-cream px-4 py-2 rounded-2xl text-sm font-medium hover:bg-brown-dark/90 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Goal
            </button>
          </div>

          <AnimatePresence>
            {showGoalForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass-card p-6 rounded-2xl">
                <form onSubmit={handleAddGoal} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Goal name (e.g., Run a 5K)"
                    value={goalForm.name}
                    onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted"
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium text-brown-muted mb-1 block">Target Calories</label>
                      <input type="number" value={goalForm.targetCalories} onChange={(e) => setGoalForm({ ...goalForm, targetCalories: parseInt(e.target.value) })} className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-brown-muted mb-1 block">Target Minutes</label>
                      <input type="number" value={goalForm.targetMinutes} onChange={(e) => setGoalForm({ ...goalForm, targetMinutes: parseInt(e.target.value) })} className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-brown-muted mb-1 block">Deadline</label>
                      <input type="date" value={goalForm.deadline} onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted" required />
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button type="button" onClick={() => setShowGoalForm(false)} className="px-4 py-2 rounded-xl bg-beige text-brown-dark hover:bg-beige-dark">
                      Cancel
                    </button>
                    <button type="submit" className="px-6 py-2 rounded-xl bg-brown-dark text-cream hover:bg-brown-dark/90">
                      Create Goal
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Goals List */}
          <div className="space-y-3">
            {userGoals.length === 0 ? (
              <div className="glass-card p-8 text-center rounded-2xl">
                <Target className="w-12 h-12 text-brown-muted mx-auto mb-3 opacity-50" />
                <p className="text-brown-muted">No goals yet. Set your first fitness goal!</p>
              </div>
            ) : (
              userGoals.map((goal) => (
                <motion.div key={goal.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-5 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-brown-dark">{goal.name}</h4>
                    <button onClick={() => deleteGoal(goal.id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {goal.targetCalories && <p className="text-xs text-brown-muted">📊 Target: {goal.targetCalories} calories</p>}
                    {goal.targetMinutes && <p className="text-xs text-brown-muted">⏱️ Target: {goal.targetMinutes} minutes</p>}
                    <p className="text-xs text-brown-muted">📅 Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
