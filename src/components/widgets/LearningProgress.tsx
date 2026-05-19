import React from 'react';
import { useStudyStore } from '../../store/useStudyStore';
import { useAuthStore } from '../../store/useAuthStore';
import { TrendingUp, Trophy, Target, BookOpen, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const LearningProgress = () => {
  const { topics, sessions, getSessionsByTopic } = useStudyStore();
  const { user } = useAuthStore();
  const userId = user?.id ?? 'guest';

  const userTopics = topics.filter((t) => t.userId === userId).sort((a, b) => b.totalHours - a.totalHours);
  const userSessions = sessions.filter((s) => s.userId === userId);

  const getMilestones = (totalHours: number) => {
    const milestones = [];
    if (totalHours >= 1) milestones.push({ label: '1 Hour', icon: '🔥' });
    if (totalHours >= 5) milestones.push({ label: '5 Hours', icon: '⭐' });
    if (totalHours >= 10) milestones.push({ label: '10 Hours', icon: '🎯' });
    if (totalHours >= 25) milestones.push({ label: '25 Hours', icon: '🏆' });
    if (totalHours >= 50) milestones.push({ label: '50 Hours', icon: '👑' });
    if (totalHours >= 100) milestones.push({ label: '100 Hours', icon: '🌟' });
    return milestones;
  };

  const getConsistency = (topicId: string) => {
    const topicSessions = getSessionsByTopic(topicId);
    if (topicSessions.length === 0) return 0;

    const dates = new Set(topicSessions.map((s) => s.date));
    return Math.round((dates.size / 30) * 100); // Last 30 days
  };

  const getFocusRate = (topicId: string) => {
    const topicSessions = getSessionsByTopic(topicId);
    if (topicSessions.length === 0) return 0;

    const focusedSessions = topicSessions.filter((s) => s.focused).length;
    return Math.round((focusedSessions / topicSessions.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Master Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="glass-card p-5 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-200 p-3 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs text-purple-600 font-medium">Overall</span>
          </div>
          <p className="text-brown-muted text-xs font-medium mb-1">Total Topics</p>
          <p className="text-3xl font-bold text-brown-dark">{userTopics.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-200 p-3 rounded-lg">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-green-600 font-medium">Active</span>
          </div>
          <p className="text-brown-muted text-xs font-medium mb-1">Sessions</p>
          <p className="text-3xl font-bold text-brown-dark">{userSessions.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="bg-orange-200 p-3 rounded-lg">
              <Trophy className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-xs text-orange-600 font-medium">Avg</span>
          </div>
          <p className="text-brown-muted text-xs font-medium mb-1">Focus Rate</p>
          <p className="text-3xl font-bold text-brown-dark">
            {userSessions.length > 0
              ? Math.round(
                  (userSessions.filter((s) => s.focused).length / userSessions.length) * 100
                )
              : 0}
            %
          </p>
        </motion.div>
      </div>

      {/* Detailed Progress */}
      {userTopics.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl">
          <BookOpen className="w-12 h-12 text-brown-muted mx-auto mb-3 opacity-50" />
          <p className="text-brown-muted">Create topics to track your learning progress</p>
        </div>
      ) : (
        <div className="space-y-3">
          {userTopics.map((topic, index) => {
            const topicSessions = getSessionsByTopic(topic.id);
            const consistency = getConsistency(topic.id);
            const focusRate = getFocusRate(topic.id);
            const milestones = getMilestones(topic.totalHours);
            const totalFocusedMinutes = topicSessions
              .filter((s) => s.focused)
              .reduce((sum, s) => sum + s.duration, 0);

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`glass-card p-5 bg-gradient-to-br ${topic.color} rounded-2xl`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-3xl">{topic.icon}</span>
                    <div>
                      <h4 className="text-sm font-serif font-medium text-brown-dark">{topic.name}</h4>
                      <p className="text-xs text-brown-muted">
                        {topicSessions.length} sessions • {topic.totalHours.toFixed(1)}h studied
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-brown-dark">{Math.round(topic.progress)}%</p>
                    <p className="text-xs text-brown-muted">Complete</p>
                  </div>
                </div>

                {/* Main Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-brown-muted">Overall Progress</span>
                    <span className="text-xs font-medium text-brown-dark">
                      {topic.totalHours.toFixed(1)} / {topic.targetHours} hrs
                    </span>
                  </div>
                  <div className="w-full h-3 bg-white/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(topic.progress, 100)}%` }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                      className="h-full bg-gradient-to-r from-pink-dusty to-pink-dark rounded-full"
                    />
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-white/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-brown-muted mb-1">Consistency</p>
                    <p className="text-lg font-bold text-brown-dark">{consistency}%</p>
                  </div>
                  <div className="bg-white/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-brown-muted mb-1">Focus Rate</p>
                    <p className="text-lg font-bold text-brown-dark">{focusRate}%</p>
                  </div>
                  <div className="bg-white/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-brown-muted mb-1">Focused Hrs</p>
                    <p className="text-lg font-bold text-brown-dark">
                      {(totalFocusedMinutes / 60).toFixed(1)}
                    </p>
                  </div>
                </div>

                {/* Milestones */}
                {milestones.length > 0 && (
                  <div className="pt-3 border-t border-white/50">
                    <p className="text-xs font-medium text-brown-muted mb-2">Achievements</p>
                    <div className="flex gap-2 flex-wrap">
                      {milestones.map((milestone, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 + i * 0.1 }}
                          className="bg-white/50 rounded-lg px-3 py-1 flex items-center gap-1"
                        >
                          <span className="text-sm">{milestone.icon}</span>
                          <span className="text-xs font-medium text-brown-dark">{milestone.label}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
