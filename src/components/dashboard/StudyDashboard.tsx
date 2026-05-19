import React, { useState } from 'react';
import { BookOpen, BarChart3, Calendar, TrendingUp, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { StudyStats } from '../widgets/StudyStats';
import { StudyTopics } from '../widgets/StudyTopics';
import { StudySession } from '../widgets/StudySession';
import { LearningProgress } from '../widgets/LearningProgress';
import { StudySchedule } from '../widgets/StudySchedule';

type TabType = 'overview' | 'topics' | 'sessions' | 'progress' | 'schedule';

export const StudyDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'topics', label: 'Topics', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'sessions', label: 'Sessions', icon: <Settings className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Header */}
      <div className="glass-card p-8 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-2xl border border-white/30">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-blue-200">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-medium text-brown-dark">Study Tracker</h1>
            <p className="text-brown-muted">Track your learning journey and master every topic</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="glass-card p-4 rounded-2xl">
        <nav className="flex items-center gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-medium text-sm whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-brown-dark text-cream shadow-soft'
                  : 'bg-beige text-brown-muted hover:bg-beige-dark'
              )}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'overview' && <StudyStats />}
        {activeTab === 'topics' && <StudyTopics />}
        {activeTab === 'sessions' && <StudySession />}
        {activeTab === 'progress' && <LearningProgress />}
        {activeTab === 'schedule' && <StudySchedule />}
      </motion.div>
    </div>
  );
};
