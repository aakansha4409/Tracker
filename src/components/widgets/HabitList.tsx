import React, { useState } from 'react';
import { format } from 'date-fns';
import { useHabitStore, HabitCategory } from '../../store/useHabitStore';
import { HabitCard } from './HabitCard';
import { Plus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

const CATEGORY_ICONS: Record<HabitCategory, string> = {
  health: 'Droplets',
  productivity: 'BookOpen',
  mindfulness: 'Wind',
  fitness: 'Dumbbell',
  custom: 'Check',
};

export const HabitList = () => {
  const { habits, toggleHabit, addHabit } = useHabitStore();
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HabitCategory>('health');

  const completedCount = habits.filter(h => h.completedDates.includes(todayStr)).length;
  const progress = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addHabit({ title: title.trim(), category, icon: CATEGORY_ICONS[category] });
    setTitle('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif font-medium text-brown-dark">
          Today's Habits
        </h2>
        <div className="flex items-center gap-3">
          {habits.length > 0 && (
            <span className="text-sm font-medium text-brown-muted">
              {completedCount} / {habits.length} Done
            </span>
          )}
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 bg-brown-dark text-cream px-4 py-2 rounded-xl text-xs font-medium hover:bg-brown-dark/90 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> Add Habit
          </button>
        </div>
      </div>

      {/* Inline Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleAdd}
            className="flex flex-col sm:flex-row gap-3 overflow-hidden"
          >
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Habit name (e.g. Drink 2L water)"
              autoFocus
              required
              className="flex-1 bg-white/60 border border-beige rounded-2xl px-4 py-3 text-sm text-brown-dark placeholder:text-brown-muted/50 focus:outline-none focus:border-pink-dark focus:ring-2 focus:ring-pink-dusty/30 transition-all"
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value as HabitCategory)}
              className="bg-white/60 border border-beige rounded-2xl px-4 py-3 text-sm text-brown-dark focus:outline-none focus:border-pink-dark transition-all cursor-pointer"
            >
              <option value="health">Health</option>
              <option value="productivity">Productivity</option>
              <option value="mindfulness">Mindfulness</option>
              <option value="fitness">Fitness</option>
              <option value="custom">Custom</option>
            </select>
            <button
              type="submit"
              className="bg-brown-dark text-cream px-5 py-3 rounded-2xl text-sm font-medium hover:bg-brown-dark/90 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      {habits.length > 0 && (
        <div className="w-full h-2 bg-beige/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-pink-dusty transition-all duration-1000 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Empty State */}
      {habits.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center py-16 text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-pink-soft/60 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-brown-muted" />
          </div>
          <div>
            <h3 className="font-serif text-lg text-brown-dark mb-1">Start your habit journey</h3>
            <p className="text-sm text-brown-muted max-w-xs">
              Add your first habit and begin building a beautiful routine ✨
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-brown-dark text-cream px-6 py-3 rounded-2xl text-sm font-medium hover:bg-brown-dark/90 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Your First Habit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              isCompleted={habit.completedDates.includes(todayStr)}
              onToggle={() => toggleHabit(habit.id, todayStr)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
