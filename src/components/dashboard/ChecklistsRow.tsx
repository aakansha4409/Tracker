import React from 'react';
import { useHabitStore } from '../../store/useHabitStore';
import { useGoalStore } from '../../store/useGoalStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Check, Plus, Target } from 'lucide-react';
import { cn } from '../../utils/cn';
import confetti from 'canvas-confetti';
import { format, subDays, startOfWeek, startOfMonth, isAfter } from 'date-fns';
import { useUserStore } from '../../store/useUserStore';

export const ChecklistsRow = () => {
  const { habits, toggleHabit } = useHabitStore();
  const { goals, toggleComplete } = useGoalStore();
  const { user } = useAuthStore();
  const { setActiveTab } = useUserStore();
  const userId = user?.id ?? 'guest';

  // Last 7 real dates oldest → newest
  const last7Dates = Array.from({ length: 7 }).map((_, i) =>
    format(subDays(new Date(), 6 - i), 'yyyy-MM-dd')
  );
  const dayLabels = last7Dates.map(d => format(new Date(d + 'T00:00:00'), 'EEEEE'));

  // Filter goals by this user
  const myGoals = goals.filter(g => g.userId === userId);

  // Weekly goals = goals whose targetDate is within this week (Mon–Sun)
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weeklyGoals = myGoals.filter(g => {
    if (!g.targetDate) return false;
    const td = new Date(g.targetDate + 'T00:00:00');
    return isAfter(td, weekStart) || format(td, 'yyyy-MM-dd') === format(weekStart, 'yyyy-MM-dd');
  }).slice(0, 5);

  // Monthly goals = goals created or due this month, not in weekly
  const monthStart = startOfMonth(new Date());
  const monthlyGoals = myGoals.filter(g => {
    if (!g.targetDate) return true; // no date → show in monthly
    const td = new Date(g.targetDate + 'T00:00:00');
    return isAfter(td, monthStart) || format(td, 'yyyy-MM-dd') === format(monthStart, 'yyyy-MM-dd');
  }).filter(g => !weeklyGoals.includes(g)).slice(0, 4);

  const handleToggle = (id: string, date: string, currentlyChecked: boolean) => {
    toggleHabit(id, date);
    if (!currentlyChecked) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#F0D5D1', '#E8C1BD', '#8C7A6B'] });
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full">
      {/* Daily Habits */}
      <div className="glass-card flex-[2] p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif text-brown-dark flex items-center gap-2">
            <span className="text-pink-dusty">✧</span> Daily Habits
          </h3>
          <div className="flex gap-4">
            {dayLabels.map((d, i) => (
              <span key={i} className="text-xs text-brown-muted w-6 text-center font-medium">{d}</span>
            ))}
          </div>
        </div>

        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="font-serif italic text-brown-muted text-sm mb-4">No habits yet — add your first one!</p>
            <button
              onClick={() => setActiveTab('habits')}
              className="flex items-center gap-2 bg-brown-dark text-cream px-4 py-2 rounded-xl text-xs font-medium hover:bg-brown-dark/90 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add Habits
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.slice(0, 8).map(habit => (
              <div key={habit.id} className="flex justify-between items-center">
                <span className="text-sm text-brown-dark truncate pr-4 max-w-[150px] font-medium">{habit.title}</span>
                <div className="flex gap-4">
                  {last7Dates.map((date, i) => {
                    const isChecked = habit.completedDates.includes(date);
                    return (
                      <button
                        key={i}
                        onClick={() => handleToggle(habit.id, date, isChecked)}
                        className={cn(
                          'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0',
                          isChecked
                            ? 'border-pink-dusty bg-pink-dusty text-white'
                            : 'border-beige text-transparent hover:border-pink-dusty'
                        )}
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly Goals */}
      <div className="glass-card flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-brown-dark flex items-center gap-2">
            <span className="text-pink-dusty">🌸</span> Weekly Goals
          </h3>
          <button
            onClick={() => setActiveTab('goals')}
            className="text-[10px] text-brown-muted hover:text-brown-dark transition-colors flex items-center gap-1"
          >
            <Target className="w-3 h-3" /> Manage
          </button>
        </div>

        {weeklyGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="font-serif italic text-brown-muted text-xs mb-3">No weekly goals set yet.</p>
            <button
              onClick={() => setActiveTab('goals')}
              className="flex items-center gap-1.5 text-xs text-brown-dark border border-beige px-3 py-1.5 rounded-xl hover:bg-beige/50 transition-all"
            >
              <Plus className="w-3 h-3" /> Add a Goal
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {weeklyGoals.map((goal) => (
              <div key={goal.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleComplete(goal.id)}
                    className={cn(
                      'w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 transition-all',
                      goal.completed
                        ? 'bg-brown-muted border-brown-muted text-white'
                        : 'border-brown-muted text-transparent hover:border-pink-dark'
                    )}
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <span className={cn('text-sm', goal.completed ? 'text-brown-muted line-through' : 'text-brown-dark')}>
                    {goal.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 pl-7">
                  <div className="flex-1 h-1 bg-beige-dark rounded-full overflow-hidden">
                    <div className="h-full bg-brown-muted rounded-full transition-all duration-500" style={{ width: `${goal.progress}%` }} />
                  </div>
                  <span className="text-[10px] text-brown-muted font-medium w-6">{goal.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly Milestones */}
      <div className="glass-card flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-brown-dark flex items-center gap-2">
            <span className="text-pink-dusty">🎀</span> Monthly Milestones
          </h3>
          <button
            onClick={() => setActiveTab('goals')}
            className="text-[10px] text-brown-muted hover:text-brown-dark transition-colors flex items-center gap-1"
          >
            <Target className="w-3 h-3" /> Manage
          </button>
        </div>

        {monthlyGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="font-serif italic text-brown-muted text-xs mb-3">No monthly milestones yet.</p>
            <button
              onClick={() => setActiveTab('goals')}
              className="flex items-center gap-1.5 text-xs text-brown-dark border border-beige px-3 py-1.5 rounded-xl hover:bg-beige/50 transition-all"
            >
              <Plus className="w-3 h-3" /> Add a Goal
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {monthlyGoals.map((goal) => (
              <div key={goal.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleComplete(goal.id)}
                    className={cn(
                      'w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 transition-all',
                      goal.completed
                        ? 'bg-brown-muted border-brown-muted text-white'
                        : 'border-brown-muted text-transparent hover:border-pink-dark'
                    )}
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <span className={cn('text-sm', goal.completed ? 'text-brown-muted line-through' : 'text-brown-dark')}>
                    {goal.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 pl-7">
                  <div className="flex-1 h-1 bg-beige-dark rounded-full overflow-hidden">
                    <div className="h-full bg-brown-muted rounded-full transition-all duration-500" style={{ width: `${goal.progress}%` }} />
                  </div>
                  <span className="text-[10px] text-brown-muted font-medium w-6">{goal.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
