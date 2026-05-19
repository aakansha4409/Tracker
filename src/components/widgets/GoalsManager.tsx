import React, { useState } from 'react';
import { useGoalStore, GoalCategory, GoalPriority } from '../../store/useGoalStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Plus, Trash2, Target, CheckCircle2, Circle, ChevronRight, Flame } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const categoryColors: Record<GoalCategory, string> = {
  health: 'bg-green-100 text-green-700',
  productivity: 'bg-blue-100 text-blue-700',
  mindfulness: 'bg-purple-100 text-purple-700',
  fitness: 'bg-orange-100 text-orange-700',
  finance: 'bg-yellow-100 text-yellow-700',
  personal: 'bg-pink-100 text-pink-700',
  career: 'bg-indigo-100 text-indigo-700',
  custom: 'bg-gray-100 text-gray-700',
};

const priorityColors: Record<GoalPriority, string> = {
  high: 'text-red-500',
  medium: 'text-yellow-500',
  low: 'text-green-500',
};

const priorityDots: Record<GoalPriority, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

export const GoalsManager = () => {
  const { goals, addGoal, deleteGoal, setProgress, toggleComplete } = useGoalStore();
  const { user } = useAuthStore();
  const userId = user?.id ?? 'guest';

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('personal');
  const [priority, setPriority] = useState<GoalPriority>('medium');
  const [targetDate, setTargetDate] = useState('');
  const [filterCategory, setFilterCategory] = useState<GoalCategory | 'all'>('all');

  const myGoals = goals.filter((g) => g.userId === userId);
  const filtered = filterCategory === 'all' ? myGoals : myGoals.filter((g) => g.category === filterCategory);
  const completed = myGoals.filter((g) => g.completed).length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addGoal({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      targetDate: targetDate || format(new Date(), 'yyyy-MM-dd'),
      progress: 0,
      userId,
    });
    setTitle('');
    setDescription('');
    setCategory('personal');
    setPriority('medium');
    setTargetDate('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-medium text-brown-dark flex items-center gap-3">
            <Target className="w-6 h-6 text-brown-muted" /> My Goals
          </h2>
          <p className="text-sm text-brown-muted mt-1">
            {completed} of {myGoals.length} goals completed
          </p>
        </div>
        <div className="flex items-center gap-3">
          {myGoals.length > 0 && (
            <div className="h-2 w-40 bg-beige rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-pink-dark rounded-full transition-all duration-700"
                style={{ width: `${myGoals.length ? (completed / myGoals.length) * 100 : 0}%` }}
              />
            </div>
          )}
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-brown-dark text-cream px-5 py-2.5 rounded-2xl text-sm font-medium hover:bg-brown-dark/90 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Goal
          </button>
        </div>
      </div>

      {/* Add Goal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAdd} className="glass-card p-6 space-y-4">
              <h3 className="font-serif font-medium text-brown-dark mb-4">New Goal</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-brown-muted mb-1.5 uppercase tracking-wide">Goal Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Run a 5K"
                    required
                    autoFocus
                    className="w-full bg-white/60 border border-beige rounded-xl px-4 py-3 text-brown-dark placeholder:text-brown-muted/50 focus:outline-none focus:border-pink-dark focus:ring-2 focus:ring-pink-dusty/30 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brown-muted mb-1.5 uppercase tracking-wide">Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full bg-white/60 border border-beige rounded-xl px-4 py-3 text-brown-dark focus:outline-none focus:border-pink-dark focus:ring-2 focus:ring-pink-dusty/30 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-brown-muted mb-1.5 uppercase tracking-wide">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Why is this goal important to you?"
                  rows={2}
                  className="w-full bg-white/60 border border-beige rounded-xl px-4 py-3 text-brown-dark placeholder:text-brown-muted/50 focus:outline-none focus:border-pink-dark focus:ring-2 focus:ring-pink-dusty/30 transition-all text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-brown-muted mb-1.5 uppercase tracking-wide">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GoalCategory)}
                    className="w-full bg-white/60 border border-beige rounded-xl px-4 py-3 text-brown-dark focus:outline-none focus:border-pink-dark transition-all text-sm cursor-pointer"
                  >
                    {(['health','productivity','mindfulness','fitness','finance','personal','career','custom'] as GoalCategory[]).map(c => (
                      <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-brown-muted mb-1.5 uppercase tracking-wide">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as GoalPriority)}
                    className="w-full bg-white/60 border border-beige rounded-xl px-4 py-3 text-brown-dark focus:outline-none focus:border-pink-dark transition-all text-sm cursor-pointer"
                  >
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-brown-dark text-cream py-3 rounded-xl text-sm font-medium hover:bg-brown-dark/90 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Goal
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 rounded-xl border border-beige text-brown-muted text-sm hover:bg-beige/50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      {myGoals.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {(['all', 'health', 'productivity', 'mindfulness', 'fitness', 'finance', 'personal', 'career', 'custom'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                filterCategory === cat
                  ? 'bg-brown-dark text-cream'
                  : 'bg-white/60 border border-beige text-brown-muted hover:bg-beige/50'
              )}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Goals List */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
          <Flame className="w-12 h-12 text-pink-dark mb-4 opacity-40" />
          <h3 className="font-serif text-xl text-brown-dark mb-2">No goals yet</h3>
          <p className="text-brown-muted text-sm max-w-xs">
            {myGoals.length === 0
              ? 'Set your first goal and start building the life you want.'
              : 'No goals in this category.'}
          </p>
          {myGoals.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-6 bg-brown-dark text-cream px-6 py-2.5 rounded-2xl text-sm font-medium hover:bg-brown-dark/90 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Your First Goal
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filtered.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  'glass-card p-5 flex flex-col gap-4 transition-all',
                  goal.completed && 'opacity-60'
                )}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleComplete(goal.id)}
                      className="mt-0.5 flex-shrink-0 transition-transform active:scale-90"
                    >
                      {goal.completed
                        ? <CheckCircle2 className="w-5 h-5 text-brown-muted" />
                        : <Circle className="w-5 h-5 text-beige-dark hover:text-pink-dark transition-colors" />
                      }
                    </button>
                    <div className="min-w-0">
                      <h3 className={cn(
                        'font-medium text-brown-dark leading-snug',
                        goal.completed && 'line-through text-brown-muted'
                      )}>
                        {goal.title}
                      </h3>
                      {goal.description && (
                        <p className="text-xs text-brown-muted mt-0.5 line-clamp-2">{goal.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1.5 text-brown-muted/40 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Tags row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn('text-[10px] font-medium px-2.5 py-1 rounded-full capitalize', categoryColors[goal.category])}>
                    {goal.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-brown-muted">
                    <span className={cn('w-1.5 h-1.5 rounded-full', priorityDots[goal.priority])} />
                    {goal.priority} priority
                  </span>
                  {goal.targetDate && (
                    <span className="text-[10px] text-brown-muted ml-auto">
                      Due {format(new Date(goal.targetDate + 'T00:00:00'), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] uppercase tracking-wide text-brown-muted font-medium">Progress</span>
                    <span className="text-xs font-medium text-brown-dark">{goal.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-beige rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-dark rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={goal.progress}
                    onChange={(e) => setProgress(goal.id, Number(e.target.value))}
                    className="w-full mt-2 accent-pink-dark cursor-pointer"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
