import React from 'react';
import { useStudyStore } from '../../store/useStudyStore';
import { useAuthStore } from '../../store/useAuthStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BookOpen, Flame, Target, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const StudyStats = () => {
  const { topics, sessions, getWeeklyStats } = useStudyStore();
  const { user } = useAuthStore();
  const userId = user?.id ?? 'guest';

  const userTopics = topics.filter((t) => t.userId === userId);
  const userSessions = sessions.filter((s) => s.userId === userId);
  
  const weeklyData = getWeeklyStats();
  const totalHours = userSessions.reduce((sum, s) => sum + s.duration, 0) / 60;
  const todayMinutes = weeklyData[weeklyData.length - 1]?.totalMinutes ?? 0;
  const thisWeekMinutes = weeklyData.reduce((sum, d) => sum + d.totalMinutes, 0);
  const avgPerDay = Math.round(thisWeekMinutes / 7);

  const chartData = weeklyData.map((day) => ({
    name: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    minutes: day.totalMinutes,
    sessions: day.sessionsCount,
  }));

  const stats = [
    {
      icon: Clock,
      label: 'Total Study Hours',
      value: totalHours.toFixed(1),
      unit: 'hrs',
      color: 'from-blue-100 to-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Target,
      label: 'Topics Active',
      value: userTopics.length,
      unit: 'topics',
      color: 'from-purple-100 to-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: BookOpen,
      label: 'Study Sessions',
      value: userSessions.length,
      unit: 'sessions',
      color: 'from-green-100 to-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: Flame,
      label: 'Today\'s Minutes',
      value: todayMinutes,
      unit: 'min',
      color: 'from-orange-100 to-orange-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-card p-5 bg-gradient-to-br ${stat.color} border border-white/30 rounded-2xl`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`${stat.iconBg} p-3 rounded-xl`}>
                <stat.icon className={`${stat.iconColor} w-5 h-5`} />
              </div>
              <span className="text-xs font-medium text-brown-muted">{stat.unit}</span>
            </div>
            <p className="text-brown-muted text-xs font-medium mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-brown-dark">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Study Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-2xl"
        >
          <h3 className="text-lg font-serif font-medium text-brown-dark mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brown-muted" />
            Weekly Study Time
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9DEC9" />
              <XAxis dataKey="name" stroke="#8C7A6B" style={{ fontSize: '12px' }} />
              <YAxis stroke="#8C7A6B" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FDFBF7',
                  border: '1px solid #E9DEC9',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#4A3B32' }}
              />
              <Bar dataKey="minutes" fill="#F0D5D1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-brown-muted">Weekly Average</span>
            <span className="font-semibold text-brown-dark">{avgPerDay} min/day</span>
          </div>
        </motion.div>

        {/* Study Consistency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 rounded-2xl"
        >
          <h3 className="text-lg font-serif font-medium text-brown-dark mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-brown-muted" />
            Study Streak
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-brown-muted">Current Streak</span>
                <span className="text-2xl font-bold text-pink-dark">
                  {(() => {
                    let streak = 0;
                    for (let i = weeklyData.length - 1; i >= 0; i--) {
                      if (weeklyData[i].totalMinutes > 0) streak++;
                      else break;
                    }
                    return streak;
                  })()}
                  <span className="text-sm text-brown-muted ml-1">days</span>
                </span>
              </div>
              <div className="flex gap-1">
                {weeklyData.slice(0, 7).map((day, i) => (
                  <div
                    key={i}
                    className={`h-8 flex-1 rounded-lg transition-all ${
                      day.totalMinutes > 0
                        ? 'bg-gradient-to-br from-pink-dusty to-pink-dark'
                        : 'bg-beige'
                    }`}
                    title={`${new Date(day.date).toLocaleDateString()}: ${day.totalMinutes} min`}
                  />
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-beige">
              <p className="text-xs text-brown-muted mb-2">This Week</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-brown-dark">{thisWeekMinutes}</span>
                <span className="text-sm text-brown-muted">minutes studied</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
