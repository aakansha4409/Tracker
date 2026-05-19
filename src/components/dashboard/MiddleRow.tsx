import React from 'react';
import { Heart } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { useHabitStore } from '../../store/useHabitStore';
import { format, subDays } from 'date-fns';

export const MiddleRow = () => {
  const { habits } = useHabitStore();

  // Calculate real streak (consecutive days all habits completed, going backwards from today)
  const calcStreak = () => {
    if (!habits.length) return 0;
    let streak = 0;
    let i = 0;
    while (true) {
      const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const allDone = habits.every(h => h.completedDates.includes(d));
      // For today, allow partial (at least 1 habit done)
      const anyDone = habits.some(h => h.completedDates.includes(d));
      if (i === 0 && anyDone) {
        streak++;
        i++;
        continue;
      }
      if (i > 0 && allDone) {
        streak++;
        i++;
      } else {
        break;
      }
      if (i > 365) break; // safety
    }
    return streak;
  };

  // Last 7 days completion % for sparkline
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
    const pct = habits.length > 0
      ? Math.round((habits.filter(h => h.completedDates.includes(d)).length / habits.length) * 100)
      : 0;
    return { day: format(new Date(d + 'T00:00:00'), 'EEE'), value: pct };
  });

  const streak = calcStreak();
  const streakMsg = streak >= 30 ? 'Legendary! 🏆'
    : streak >= 14 ? 'On fire! 🔥'
    : streak >= 7 ? 'Amazing! ✨'
    : streak >= 3 ? 'Keep going! 💪'
    : streak > 0 ? 'Just started!'
    : 'Start today!';

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full items-center">
      {/* Consistency Streak */}
      <div className="glass-card flex-1 p-6 h-40 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-brown-dark text-sm mb-1">Consistency Streak</h3>
          <div className="flex items-center gap-2">
            <span className="text-xl">{streak >= 7 ? '🔥' : streak > 0 ? '✨' : '💤'}</span>
            <span className="text-xl font-medium text-brown-dark">
              {streak} {streak === 1 ? 'day' : 'days'}
            </span>
          </div>
          <p className="text-xs text-brown-muted mt-1">{streakMsg}</p>
        </div>
        <div className="h-16 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Tooltip
                contentStyle={{ background: 'rgba(253,251,247,0.95)', border: '1px solid #F4EDE4', borderRadius: 12, fontSize: 11 }}
                formatter={(v: number) => [`${v}%`, 'Completion']}
                labelStyle={{ color: '#4A3B32', fontWeight: 500 }}
              />
              <Line
                type="monotone" dataKey="value" stroke="#E8C1BD" strokeWidth={3}
                dot={{ r: 3, fill: '#8C7A6B', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#E8C1BD' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sticky Notes */}
      <div className="flex gap-8 flex-1 justify-center px-4">
        <div className="sticky-note bg-cream transform -rotate-3 text-center flex flex-col items-center justify-center w-40 h-40">
          <p className="text-sm">Small progress<br />is still progress.</p>
          <Heart className="w-3 h-3 text-brown-muted mt-3" />
        </div>
        <div className="sticky-note bg-pink-dusty transform rotate-2 text-center flex flex-col items-center justify-center w-40 h-40 shadow-sm">
          <p className="text-sm text-brown-dark">Don't stop<br />until you're<br />proud</p>
          <Heart className="w-3 h-3 text-brown-dark/60 mt-3 fill-brown-dark/20" />
        </div>
      </div>
    </div>
  );
};
