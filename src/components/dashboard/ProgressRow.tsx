import React from 'react';
import { useHabitStore } from '../../store/useHabitStore';
import { format, subDays, startOfWeek, startOfMonth, startOfYear, eachDayOfInterval } from 'date-fns';

const ProgressCircle = ({ percentage, label, subtext, color = '#E8C1BD' }: {
  percentage: number;
  label: string;
  subtext: string;
  color?: string;
}) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="glass-card flex-1 p-6 flex flex-col items-center justify-center gap-3 min-w-[160px]">
      <h3 className="font-serif text-brown-dark text-sm mb-1">{label}</h3>
      <div className="relative flex items-center justify-center">
        <svg className="w-28 h-28 transform -rotate-90">
          <circle cx="56" cy="56" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-beige-dark" />
          <circle
            cx="56" cy="56" r={radius} stroke={color} strokeWidth="4" fill="transparent"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            strokeLinecap="round" className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-xl font-sans font-light text-brown-dark">{Math.round(percentage)}%</span>
      </div>
      <p className="text-xs text-brown-muted font-medium text-center">{subtext}</p>
    </div>
  );
};

export const ProgressRow = () => {
  const { habits } = useHabitStore();
  const today = format(new Date(), 'yyyy-MM-dd');

  const calcPct = (dates: string[]) => {
    if (!habits.length) return 0;
    const completed = habits.filter(h => h.completedDates.includes(today)).length;

    // For period-based, calculate average completion over all days in period
    if (dates.length === 0) return 0;
    const totalPossible = habits.length * dates.length;
    const totalDone = habits.reduce((sum, h) => {
      return sum + dates.filter(d => h.completedDates.includes(d)).length;
    }, 0);
    return totalPossible > 0 ? (totalDone / totalPossible) * 100 : 0;
  };

  // Daily: today's completion
  const dailyPct = habits.length > 0
    ? (habits.filter(h => h.completedDates.includes(today)).length / habits.length) * 100
    : 0;

  // Weekly: Mon-today
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDates = eachDayOfInterval({ start: weekStart, end: new Date() }).map(d => format(d, 'yyyy-MM-dd'));
  const weeklyPct = calcPct(weekDates);

  // Monthly: 1st-today
  const monthStart = startOfMonth(new Date());
  const monthDates = eachDayOfInterval({ start: monthStart, end: new Date() }).map(d => format(d, 'yyyy-MM-dd'));
  const monthlyPct = calcPct(monthDates);

  // Yearly: Jan 1-today
  const yearStart = startOfYear(new Date());
  const yearDates = eachDayOfInterval({ start: yearStart, end: new Date() }).map(d => format(d, 'yyyy-MM-dd'));
  const yearlyPct = calcPct(yearDates);

  const getMessage = (pct: number) => {
    if (pct >= 100) return 'Perfect! ⭐️';
    if (pct >= 80) return 'Great job! 🌟';
    if (pct >= 60) return 'Keep it up!';
    if (pct >= 40) return 'Getting there!';
    if (pct >= 20) return 'Just starting!';
    return 'Let\'s go! 💪';
  };

  return (
    <div className="flex gap-4 w-full overflow-x-auto pb-2 custom-scrollbar">
      <ProgressCircle percentage={dailyPct} label="Daily Progress" subtext={getMessage(dailyPct)} />
      <ProgressCircle percentage={weeklyPct} label="Weekly Progress" subtext={getMessage(weeklyPct)} color="#A69688" />
      <ProgressCircle percentage={monthlyPct} label="Monthly Progress" subtext={getMessage(monthlyPct)} color="#C4B5A5" />
      <ProgressCircle percentage={yearlyPct} label="Yearly Progress" subtext={getMessage(yearlyPct)} color="#D4C5B8" />
    </div>
  );
};
