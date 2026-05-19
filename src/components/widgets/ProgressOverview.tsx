import React from 'react';
import { useHabitStore } from '../../store/useHabitStore';
import { format, subDays } from 'date-fns';

export const ProgressOverview = () => {
  const { habits } = useHabitStore();
  
  // Calculate stats
  const last7Days = Array.from({ length: 7 }).map((_, i) => format(subDays(new Date(), i), 'yyyy-MM-dd')).reverse();
  
  const weeklyData = last7Days.map(date => {
    const completed = habits.filter(h => h.completedDates.includes(date)).length;
    return {
      date,
      label: format(new Date(date), 'EEEE').charAt(0),
      percentage: habits.length > 0 ? (completed / habits.length) * 100 : 0
    };
  });

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <h3 className="text-lg font-serif font-medium text-brown-dark dark:text-cream mb-6">Weekly Progress</h3>
      
      <div className="flex items-end justify-between flex-1 gap-2 min-h-[120px]">
        {weeklyData.map((day, i) => (
          <div key={day.date} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
            <div className="w-full bg-beige/30 dark:bg-gray-700/50 rounded-t-lg relative h-[100px]">
              <div 
                className="absolute bottom-0 w-full bg-pink-dusty rounded-t-lg transition-all duration-500"
                style={{ height: `${day.percentage}%` }}
              />
            </div>
            <span className="text-xs font-medium text-brown-muted dark:text-gray-400">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
