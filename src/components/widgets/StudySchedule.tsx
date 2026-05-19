import React, { useState } from 'react';
import { useStudyStore } from '../../store/useStudyStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, addDays, isSameDay, startOfWeek } from 'date-fns';

export const StudySchedule = () => {
  const { topics, sessions, getSessionsByDate } = useStudyStore();
  const { user } = useAuthStore();
  const userId = user?.id ?? 'guest';

  const userTopics = topics.filter((t) => t.userId === userId);
  const userSessions = sessions.filter((s) => s.userId === userId);

  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const weekStart = startOfWeek(viewDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getSessionsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return getSessionsByDate(dateStr);
  };

  const getTotalMinutesForDate = (date: Date) => {
    return getSessionsForDate(date).reduce((sum, s) => sum + s.duration, 0);
  };

  const getTopicsForDate = (date: Date) => {
    const dateSessions = getSessionsForDate(date);
    const uniqueTopics = [...new Set(dateSessions.map((s) => s.topicId))];
    return uniqueTopics.map((id) => userTopics.find((t) => t.id === id)).filter(Boolean);
  };

  const selectedDateSessions = selectedDate ? getSessionsForDate(selectedDate) : [];
  const selectedDateTopics = selectedDate ? getTopicsForDate(selectedDate) : [];

  const estimatedGoal = 120; // 2 hours per day

  return (
    <div className="space-y-6">
      {/* Calendar View */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-serif font-medium text-brown-dark flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brown-muted" />
            Study Calendar
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setViewDate(addDays(viewDate, -7))}
              className="px-3 py-1 rounded-lg bg-beige hover:bg-beige-dark text-brown-dark text-sm"
            >
              ← Prev
            </button>
            <button
              onClick={() => setViewDate(new Date())}
              className="px-3 py-1 rounded-lg bg-brown-dark hover:bg-brown-dark/90 text-cream text-sm"
            >
              Today
            </button>
            <button
              onClick={() => setViewDate(addDays(viewDate, 7))}
              className="px-3 py-1 rounded-lg bg-beige hover:bg-beige-dark text-brown-dark text-sm"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Week View */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {weekDays.map((day, index) => {
            const daySessionsCount = getSessionsForDate(day).length;
            const dayMinutes = getTotalMinutesForDate(day);
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const dayTopics = getTopicsForDate(day);

            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(day)}
                className={`p-3 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-brown-dark text-cream shadow-soft'
                    : isToday
                      ? 'bg-pink-dusty border-2 border-pink-dark'
                      : 'bg-beige hover:bg-beige-dark'
                }`}
              >
                <p className={`text-xs font-medium mb-1 ${isSelected ? 'text-cream' : 'text-brown-muted'}`}>
                  {format(day, 'EEE')}
                </p>
                <p className={`text-lg font-bold ${isSelected ? 'text-cream' : 'text-brown-dark'}`}>
                  {format(day, 'd')}
                </p>
                <p className={`text-xs mt-1 ${isSelected ? 'text-cream/80' : 'text-brown-muted'}`}>
                  {dayMinutes > 0 ? `${dayMinutes}m` : '—'}
                </p>
                {dayMinutes >= estimatedGoal && (
                  <div className={`text-xs mt-0.5 ${isSelected ? 'text-cream' : 'text-green-600'}`}>
                    ✓
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Daily Goal Progress */}
        <div className="pt-4 border-t border-beige">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-brown-muted">Daily Goal</span>
            <span className="text-sm font-bold text-brown-dark">{estimatedGoal} min</span>
          </div>
          <div className="w-full h-3 bg-beige rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: selectedDate
                  ? `${Math.min((getTotalMinutesForDate(selectedDate) / estimatedGoal) * 100, 100)}%`
                  : 0,
              }}
              transition={{ duration: 0.6 }}
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
            />
          </div>
          {selectedDate && (
            <p className="text-xs text-brown-muted mt-2">
              {getTotalMinutesForDate(selectedDate)} min of {estimatedGoal} min
              {getTotalMinutesForDate(selectedDate) >= estimatedGoal && ' ✓ Goal reached!'}
            </p>
          )}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-serif font-medium text-brown-dark">
              {format(selectedDate, 'EEEE, MMMM d')}
            </h3>
            <div className="flex items-center gap-2 text-brown-muted">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{getTotalMinutesForDate(selectedDate)} min studied</span>
            </div>
          </div>

          {selectedDateSessions.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-brown-muted/50 mx-auto mb-3" />
              <p className="text-brown-muted text-sm">No sessions recorded for this date</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateSessions.map((session, index) => {
                const topic = userTopics.find((t) => t.id === session.topicId);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 bg-gradient-to-br ${topic?.color || 'from-gray-100 to-gray-50'} rounded-xl flex items-start justify-between`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">{topic?.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-brown-dark">{session.topicName}</p>
                        <p className="text-xs text-brown-muted mt-1">{session.duration} minutes</p>
                        {session.notes && (
                          <p className="text-xs text-brown-muted mt-2 italic">"{session.notes}"</p>
                        )}
                      </div>
                    </div>
                    {session.focused && (
                      <div className="text-lg ml-2">🎯</div>
                    )}
                  </motion.div>
                );
              })}

              {/* Topics Summary */}
              {selectedDateTopics.length > 0 && (
                <div className="pt-4 border-t border-beige">
                  <p className="text-xs font-medium text-brown-muted mb-2">Topics Studied</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedDateTopics.map((topic) => (
                      <div
                        key={topic?.id}
                        className={`px-3 py-1 rounded-lg bg-gradient-to-br ${topic?.color} border border-white/50`}
                      >
                        <p className="text-xs font-medium text-brown-dark">
                          {topic?.icon} {topic?.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Weekly Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 rounded-2xl"
      >
        <h3 className="text-lg font-serif font-medium text-brown-dark mb-4">Week Summary</h3>
        <div className="space-y-3">
          {weekDays.map((day, index) => {
            const dayMinutes = getTotalMinutesForDate(day);
            const dayTopics = getTopicsForDate(day);
            const percentOfGoal = Math.min((dayMinutes / estimatedGoal) * 100, 100);

            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-brown-dark">
                    {format(day, 'EEE')} — {dayMinutes}m
                  </span>
                  <span className="text-xs text-brown-muted">{Math.round(percentOfGoal)}%</span>
                </div>
                <div className="w-full h-2 bg-beige rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentOfGoal}%` }}
                    transition={{ delay: index * 0.05, duration: 0.6 }}
                    className={`h-full rounded-full ${
                      percentOfGoal >= 100
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                        : percentOfGoal >= 50
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                          : 'bg-gradient-to-r from-pink-dusty to-pink-dark'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
