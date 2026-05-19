import React, { useState } from 'react';
import { useStudyStore, StudyLevel, StudyTopic } from '../../store/useStudyStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Plus, Trash2, Edit2, BookOpen, Brain, Zap, Clock, Target } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const topicIcons = ['📚', '🧠', '💻', '🔬', '📐', '🎨', '⚡', '🎯', '🏆', '📖'];
const topicColors = ['from-blue-100 to-blue-50', 'from-purple-100 to-purple-50', 'from-green-100 to-green-50', 'from-pink-100 to-pink-50', 'from-orange-100 to-orange-50'];

export const StudyTopics = () => {
  const { topics, addTopic, deleteTopic, updateTopic } = useStudyStore();
  const { user } = useAuthStore();
  const userId = user?.id ?? 'guest';

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📚',
    color: 'from-blue-100 to-blue-50',
    level: 'beginner' as StudyLevel,
    targetHours: 10,
  });

  const userTopics = topics.filter((t) => t.userId === userId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      updateTopic(editingId, {
        ...formData,
        progress: 0,
      });
      setEditingId(null);
    } else {
      addTopic({
        ...formData,
        userId,
        totalHours: 0,
        sessions: 0,
        progress: 0,
        lastStudied: new Date().toISOString(),
      });
    }

    setFormData({
      name: '',
      description: '',
      icon: '📚',
      color: 'from-blue-100 to-blue-50',
      level: 'beginner',
      targetHours: 10,
    });
    setShowForm(false);
  };

  const startEdit = (topic: StudyTopic) => {
    setFormData({
      name: topic.name,
      description: topic.description,
      icon: topic.icon,
      color: topic.color,
      level: topic.level,
      targetHours: topic.targetHours || 10,
    });
    setEditingId(topic.id);
    setShowForm(true);
  };

  const levelColors: Record<StudyLevel, string> = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-serif font-medium text-brown-dark flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-brown-muted" />
          My Study Topics
        </h3>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: '',
              description: '',
              icon: '📚',
              color: 'from-blue-100 to-blue-50',
              level: 'beginner',
              targetHours: 10,
            });
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-brown-dark text-cream px-4 py-2 rounded-2xl text-sm font-medium hover:bg-brown-dark/90 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Topic
        </button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6 rounded-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Topic name (e.g., React Fundamentals)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted text-brown-dark placeholder:text-brown-muted"
                  required
                />
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as StudyLevel })}
                  className="px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted text-brown-dark"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted text-brown-dark placeholder:text-brown-muted resize-none h-20"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-brown-muted mb-2 block">Icon</label>
                  <div className="flex gap-2 flex-wrap">
                    {topicIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={cn(
                          'w-10 h-10 rounded-lg text-lg transition-all',
                          formData.icon === icon
                            ? 'bg-brown-dark scale-110'
                            : 'bg-beige hover:bg-beige-dark'
                        )}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-brown-muted mb-2 block">Target Hours</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.targetHours}
                    onChange={(e) => setFormData({ ...formData, targetHours: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted text-brown-dark"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl bg-beige text-brown-dark hover:bg-beige-dark transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-brown-dark text-cream hover:bg-brown-dark/90 transition-all font-medium"
                >
                  {editingId ? 'Update Topic' : 'Create Topic'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Topics Grid */}
      {userTopics.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl">
          <Brain className="w-12 h-12 text-brown-muted mx-auto mb-3 opacity-50" />
          <p className="text-brown-muted">No topics yet. Create one to start tracking your study progress!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {userTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={`glass-card p-5 bg-gradient-to-br ${topic.color} rounded-2xl group hover:shadow-soft transition-all`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{topic.icon}</div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(topic)}
                      className="p-2 rounded-lg bg-white/50 hover:bg-white text-brown-muted transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTopic(topic.id)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title and Level */}
                <h4 className="text-sm font-serif font-medium text-brown-dark mb-1">{topic.name}</h4>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${levelColors[topic.level]}`}>
                    {topic.level.charAt(0).toUpperCase() + topic.level.slice(1)}
                  </span>
                </div>

                {/* Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-brown-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Study Hours
                    </span>
                    <span className="font-semibold text-brown-dark">
                      {topic.totalHours.toFixed(1)} / {topic.targetHours}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-dusty to-pink-dark rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(topic.progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Session Count */}
                <div className="flex items-center justify-between text-xs text-brown-muted pt-3 border-t border-white/50">
                  <span>{topic.sessions} sessions</span>
                  <span className="text-[10px]">
                    {topic.lastStudied
                      ? `Last: ${new Date(topic.lastStudied).toLocaleDateString()}`
                      : 'Not started'}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
