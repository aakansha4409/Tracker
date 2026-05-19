import React from 'react';
import { BookOpen, Dumbbell, Droplet, Star, Coffee, Moon, Heart, Plus, Minus } from 'lucide-react';
import { useTrackerStore } from '../../store/useTrackerStore';
import { format } from 'date-fns';
import { cn } from '../../utils/cn';

const SELF_CARE_ITEMS = [
  { id: 'skincare', label: 'Skincare', icon: Star },
  { id: 'coffee', label: 'Tea/Coffee ritual', icon: Coffee },
  { id: 'sleep', label: 'Good sleep', icon: Moon },
  { id: 'stretch', label: 'Stretching', icon: Heart },
  { id: 'walk', label: 'Walk outside', icon: Heart },
];

export const TrackersRow = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const {
    getLog,
    addWaterGlass,
    removeWaterGlass,
    addStudyMinutes,
    setStudyMinutes,
    addWorkoutMinutes,
    setWorkoutMinutes,
    toggleSelfCare,
    studyGoalMinutes,
    workoutGoalMinutes,
    waterGoalGlasses,
  } = useTrackerStore();

  const log = getLog(today);

  const fmtTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const studyPct = Math.min(100, Math.round((log.studyMinutes / studyGoalMinutes) * 100));
  const workoutPct = Math.min(100, Math.round((log.workoutMinutes / workoutGoalMinutes) * 100));

  return (
    <div className="flex flex-wrap lg:flex-nowrap gap-4 w-full">
      {/* Study Tracker */}
      <div className="glass-card flex-[1.5] p-6 relative overflow-hidden min-w-[200px]">
        <h3 className="font-serif text-brown-dark flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-brown-muted" /> Study Tracker
        </h3>
        <div className="text-3xl font-sans font-light text-brown-dark mb-1">{fmtTime(log.studyMinutes)}</div>
        <p className="text-xs text-brown-muted mb-3">Hours Studied</p>

        <div className="flex justify-between items-end">
          <div className="flex-1">
            <p className="text-[10px] text-brown-dark mb-1">Goal: {fmtTime(studyGoalMinutes)}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-beige-dark rounded-full">
                <div className="h-full bg-brown-muted rounded-full transition-all duration-500" style={{ width: `${studyPct}%` }} />
              </div>
              <span className="text-[10px] text-brown-muted font-medium">{studyPct}%</span>
            </div>
          </div>
          <div className="text-4xl ml-4 opacity-80">📚</div>
        </div>

        {/* Quick-add buttons */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {[30, 60, 90].map(m => (
            <button
              key={m}
              onClick={() => addStudyMinutes(today, m)}
              className="text-[10px] px-3 py-1.5 bg-beige rounded-full text-brown-muted hover:bg-beige-dark transition-colors font-medium"
            >
              +{m}m
            </button>
          ))}
          {log.studyMinutes > 0 && (
            <button
              onClick={() => setStudyMinutes(today, 0)}
              className="text-[10px] px-3 py-1.5 bg-red-50 rounded-full text-red-400 hover:bg-red-100 transition-colors font-medium"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Workout Tracker */}
      <div className="glass-card flex-[1.5] p-6 relative overflow-hidden min-w-[200px]">
        <h3 className="font-serif text-brown-dark flex items-center gap-2 mb-2">
          <Dumbbell className="w-4 h-4 text-brown-muted" /> Workout Tracker
        </h3>
        <div className="text-3xl font-sans font-light text-brown-dark mb-1">{fmtTime(log.workoutMinutes)}</div>
        <p className="text-xs text-brown-muted mb-3">Minutes Active</p>

        <div className="flex justify-between items-end">
          <div className="flex-1">
            <p className="text-[10px] text-brown-dark mb-1">Goal: {fmtTime(workoutGoalMinutes)}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-beige-dark rounded-full">
                <div className="h-full bg-brown-muted rounded-full transition-all duration-500" style={{ width: `${workoutPct}%` }} />
              </div>
              <span className="text-[10px] text-brown-muted font-medium">{workoutPct}%</span>
            </div>
          </div>
          <div className="text-4xl ml-4 opacity-80">🏃🏽‍♀️</div>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          {[15, 30, 45].map(m => (
            <button
              key={m}
              onClick={() => addWorkoutMinutes(today, m)}
              className="text-[10px] px-3 py-1.5 bg-beige rounded-full text-brown-muted hover:bg-beige-dark transition-colors font-medium"
            >
              +{m}m
            </button>
          ))}
          {log.workoutMinutes > 0 && (
            <button
              onClick={() => setWorkoutMinutes(today, 0)}
              className="text-[10px] px-3 py-1.5 bg-red-50 rounded-full text-red-400 hover:bg-red-100 transition-colors font-medium"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Water Intake */}
      <div className="glass-card flex-1 p-6 min-w-[150px]">
        <h3 className="font-serif text-brown-dark flex items-center gap-2 mb-2">
          <Droplet className="w-4 h-4 text-[#89B4E3]" /> Water Intake
        </h3>
        <div className="text-2xl font-sans font-light text-brown-dark mb-1">
          {log.waterGlasses} / {waterGoalGlasses}
        </div>
        <p className="text-xs text-brown-muted mb-3">Glasses Today</p>

        <div className="flex gap-1 flex-wrap mb-3">
          {Array.from({ length: waterGoalGlasses }).map((_, i) => (
            <button
              key={i}
              onClick={() => i < log.waterGlasses ? removeWaterGlass(today) : addWaterGlass(today)}
              className="transition-transform hover:scale-110"
            >
              <Droplet className={cn(
                'w-4 h-4 transition-colors',
                i < log.waterGlasses ? 'text-[#89B4E3] fill-[#89B4E3]' : 'text-beige-dark'
              )} />
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => removeWaterGlass(today)}
            className="p-1.5 rounded-lg border border-beige text-brown-muted hover:bg-beige transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={() => addWaterGlass(today)}
            className="p-1.5 rounded-lg bg-[#89B4E3]/20 text-[#5a9fd4] hover:bg-[#89B4E3]/40 transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <p className="text-[10px] text-brown-muted mt-2">
          {log.waterGlasses >= waterGoalGlasses ? '✨ Goal reached!' : 'Keep sipping!'}
        </p>
      </div>

      {/* Self Care */}
      <div className="glass-card flex-1 p-6 min-w-[150px]">
        <h3 className="font-serif text-brown-dark flex items-center gap-2 mb-2">
          <span className="text-pink-dark text-lg leading-none">🌸</span> Self Care
        </h3>
        <div className="text-2xl font-sans font-light text-brown-dark mb-1">
          {log.selfCareActivities.length} / {SELF_CARE_ITEMS.length}
        </div>
        <p className="text-xs text-brown-muted mb-3">Activities Done</p>

        <div className="space-y-1.5">
          {SELF_CARE_ITEMS.map(({ id, label, icon: Icon }) => {
            const done = log.selfCareActivities.includes(id);
            return (
              <button
                key={id}
                onClick={() => toggleSelfCare(today, id)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] transition-all text-left',
                  done ? 'bg-pink-dusty/50 text-brown-dark font-medium' : 'bg-beige/40 text-brown-muted hover:bg-beige'
                )}
              >
                <Icon className={cn('w-3 h-3 flex-shrink-0', done ? 'text-pink-dark' : 'text-brown-muted')} />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
