import { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { cn } from '../../utils/cn';
import { format, startOfMonth, getDaysInMonth, getDay, addMonths, subMonths } from 'date-fns';
import { useGoalStore } from '../../store/useGoalStore';
import { useTrackerStore } from '../../store/useTrackerStore';

export const BottomRow = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  const goals = useGoalStore((state) => state.goals);
  const { getToday, studyGoalMinutes, workoutGoalMinutes, waterGoalGlasses } = useTrackerStore();

  const todayLog = getToday();

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) return `${remainingMinutes}m`;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}m`;
  };

  const priorityWeight: Record<'high' | 'medium' | 'low', number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  const activeGoals = [...goals]
    .filter((goal) => !goal.completed)
    .sort((a, b) => {
      const priorityDifference = priorityWeight[a.priority] - priorityWeight[b.priority];
      if (priorityDifference !== 0) return priorityDifference;
      return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
    });

  const studyRemaining = Math.max(0, studyGoalMinutes - todayLog.studyMinutes);
  const workoutRemaining = Math.max(0, workoutGoalMinutes - todayLog.workoutMinutes);
  const waterRemaining = Math.max(0, waterGoalGlasses - todayLog.waterGlasses);

  const todayPlanItems = [
    {
      time: 'Morning',
      task: studyRemaining > 0 ? `Study for ${formatDuration(studyRemaining)}` : 'Review what you studied today',
    },
    {
      time: 'Midday',
      task: workoutRemaining > 0 ? `Move for ${formatDuration(workoutRemaining)}` : 'Your workout goal is already complete',
    },
    {
      time: 'Afternoon',
      task: waterRemaining > 0 ? `Drink ${waterRemaining} more glass${waterRemaining === 1 ? '' : 'es'} of water` : 'Hydration goal reached',
    },
    {
      time: 'Evening',
      task: activeGoals[0] ? `Make progress on ${activeGoals[0].title}` : 'Choose one meaningful priority to move forward',
    },
    {
      time: 'Night',
      task: todayLog.journalEntry ? 'Close the day with a short reflection' : 'Journal a quick reflection before sleep',
    },
  ];

  const daysInMonth = getDaysInMonth(currentMonth);
  // getDay returns 0=Sun..6=Sat; we want Mon-start so offset:
  const firstDayRaw = getDay(startOfMonth(currentMonth)); // 0=Sun
  const offset = firstDayRaw === 0 ? 6 : firstDayRaw - 1; // convert to Mon-start

  const isCurrentMonth =
    today.getFullYear() === currentMonth.getFullYear() &&
    today.getMonth() === currentMonth.getMonth();

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Calendar Widget */}
      <div className="glass-card flex-1 p-6 min-w-[250px]">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
            className="p-1 rounded-lg hover:bg-beige transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-brown-muted" />
          </button>
          <h3 className="font-serif font-medium text-brown-dark">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <button
            onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
            className="p-1 rounded-lg hover:bg-beige transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-brown-muted" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-y-4 text-center">
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
            <div key={d} className="text-[10px] text-brown-muted font-medium">{d}</div>
          ))}
          {/* Empty offset cells */}
          {Array.from({ length: offset }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = isCurrentMonth && day === today.getDate();
            return (
              <div key={i} className="flex justify-center">
                <div className={cn(
                  "w-7 h-7 flex items-center justify-center text-xs rounded-full cursor-pointer transition-colors",
                  isToday ? "bg-pink-dusty text-white shadow-sm" : "text-brown-dark hover:bg-beige"
                )}>
                  {day}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Plan */}
      <div className="glass-card flex-1 p-6 min-w-[250px]">
        <h3 className="font-serif text-brown-dark flex items-center gap-2 mb-6">
          <span className="text-pink-dark">📝</span> Today's Plan
        </h3>
        <div className="space-y-0">
          {todayPlanItems.map((item, i) => (
            <div key={i} className="flex gap-4">
              <span className="text-xs text-brown-muted font-medium w-16 text-right pt-0.5">{item.time}</span>
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full border border-pink-dark bg-white z-10" />
                {i !== todayPlanItems.length - 1 && <div className="w-0.5 h-8 bg-beige-dark -mt-1" />}
              </div>
              <span className="text-sm text-brown-dark pb-4">{item.task}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Priorities & Bottom Quote Banner */}
      <div className="flex-1 flex flex-col gap-6 min-w-[300px]">
        <div className="glass-card p-6">
          <h3 className="font-serif text-brown-dark flex items-center gap-2 mb-6">
            <span className="text-yellow-500">⭐</span> Top Priorities
          </h3>
          <div className="space-y-3 mb-6 pl-2">
            {activeGoals.length > 0 ? (
              activeGoals.slice(0, 3).map((goal, index) => (
                <div key={goal.id} className="flex items-start gap-4">
                  <span className="text-xs font-serif italic text-brown-muted mt-0.5">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-brown-dark font-medium truncate">{goal.title}</p>
                    <p className="text-[11px] text-brown-muted">
                      {goal.priority} priority • {goal.progress}% complete
                    </p>
                  </div>
                </div>
              ))
            ) : (
              todayPlanItems.slice(0, 3).map((item, index) => (
                <div key={item.time} className="flex items-start gap-4">
                  <span className="text-xs font-serif italic text-brown-muted mt-0.5">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-brown-dark font-medium truncate">{item.task}</p>
                    <p className="text-[11px] text-brown-muted">{item.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="w-full h-24 rounded-2xl overflow-hidden relative shadow-sm bg-beige">
            <img
              src="/coffee.png"
              alt="Coffee"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-cream/90 via-cream/50 to-transparent flex items-center justify-end pr-6">
              <p className="font-serif italic text-sm text-brown-dark text-right leading-tight">
                One day<br />or day one.<br />You decide.
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 relative overflow-hidden flex items-center justify-between">
           <div className="absolute inset-0 opacity-20">
             <img src="/flowers.png" alt="Flowers bg" className="w-full h-full object-cover" />
           </div>
           <div className="relative z-10 flex-[2] flex flex-col items-center justify-center border-r border-beige pr-4">
             <p className="font-serif italic text-brown-dark text-center leading-tight">
               "The secret of your future<br />is hidden in your daily routine."
             </p>
             <Heart className="w-3 h-3 text-brown-muted mt-2" />
           </div>
           <div className="relative z-10 flex-1 flex flex-col items-center justify-center pl-4">
             <span className="text-[10px] uppercase tracking-wider text-brown-muted mb-1 font-medium">Reminder</span>
             <p className="font-serif text-xs text-brown-dark text-center italic">You're doing better<br />than you think.</p>
           </div>
        </div>
      </div>
    </div>
  );
};
