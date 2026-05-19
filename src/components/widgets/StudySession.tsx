import React, { useState, useEffect } from 'react';
import { useStudyStore, StudyTopic } from '../../store/useStudyStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Plus, Play, Pause, RotateCcw, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const StudySession = () => {
  const { topics, addSession, sessions } = useStudyStore();
  const { user } = useAuthStore();
  const userId = user?.id ?? 'guest';

  const userTopics = topics.filter((t) => t.userId === userId);
  const userSessions = sessions.filter((s) => s.userId === userId);

  const [activeSession, setActiveSession] = useState<{
    topicId: string;
    isRunning: boolean;
    elapsedMinutes: number;
  } | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    topicId: '',
    duration: 25,
    notes: '',
    focused: true,
    date: new Date().toISOString().split('T')[0],
  });

  // Timer effect
  useEffect(() => {
    if (!activeSession?.isRunning) return;

    const interval = setInterval(() => {
      setActiveSession((prev) => {
        if (!prev) return null;
        const newMinutes = prev.elapsedMinutes + 0.016; // 1 second
        return { ...prev, elapsedMinutes: newMinutes };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession?.isRunning]);

  const handleStartSession = (topicId: string) => {
    if (activeSession?.topicId === topicId) {
      setActiveSession((prev) => {
        if (!prev) return null;
        return { ...prev, isRunning: !prev.isRunning };
      });
    } else {
      setActiveSession({
        topicId,
        isRunning: true,
        elapsedMinutes: 0,
      });
    }
  };

  const handleEndSession = () => {
    if (!activeSession) return;

    const topic = userTopics.find((t) => t.id === activeSession.topicId);
    if (topic && activeSession.elapsedMinutes > 0) {
      addSession({
        userId,
        topicId: activeSession.topicId,
        topicName: topic.name,
        duration: Math.ceil(activeSession.elapsedMinutes),
        date: formData.date,
        notes: formData.notes,
        focused: formData.focused,
      });

      setActiveSession(null);
      setFormData({
        topicId: '',
        duration: 25,
        notes: '',
        focused: true,
        date: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);
    }
  };

  const handleQuickLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topicId) return;

    const topic = userTopics.find((t) => t.id === formData.topicId);
    if (topic) {
      addSession({
        userId,
        topicId: formData.topicId,
        topicName: topic.name,
        duration: formData.duration,
        date: formData.date,
        notes: formData.notes,
        focused: formData.focused,
      });

      setFormData({
        topicId: '',
        duration: 25,
        notes: '',
        focused: true,
        date: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Session Timer */}
      {activeSession && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl text-center border-2 border-blue-200"
        >
          <h3 className="text-lg font-serif font-medium text-brown-dark mb-4">
            {userTopics.find((t) => t.id === activeSession.topicId)?.name || 'Study Session'}
          </h3>

          <div className="text-6xl font-sans font-light text-brown-dark mb-6 tracking-wider font-mono">
            {Math.floor(activeSession.elapsedMinutes)}
            <span className="text-3xl">m</span>
            {Math.round((activeSession.elapsedMinutes % 1) * 60)}
            <span className="text-3xl">s</span>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => handleStartSession(activeSession.topicId)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all transform ${
                activeSession.isRunning
                  ? 'bg-yellow-400 text-white hover:bg-yellow-500 active:scale-95'
                  : 'bg-green-400 text-white hover:bg-green-500 active:scale-95'
              }`}
            >
              {activeSession.isRunning ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </button>

            <button
              onClick={() => setActiveSession({ ...activeSession, elapsedMinutes: 0 })}
              className="w-12 h-12 rounded-full border-2 border-brown-muted flex items-center justify-center text-brown-muted hover:bg-white/50 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handleEndSession}
              className="w-14 h-14 rounded-full bg-pink-dark text-white hover:bg-pink-dark/90 transition-all transform active:scale-95 flex items-center justify-center"
            >
              <CheckCircle2 className="w-6 h-6" />
            </button>
          </div>

          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add notes about this session..."
            className="w-full px-4 py-2 rounded-xl bg-white/50 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-brown-dark placeholder:text-brown-muted resize-none h-16 text-sm"
          />

          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="focused"
              checked={formData.focused}
              onChange={(e) => setFormData({ ...formData, focused: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="focused" className="text-sm text-brown-dark">
              I stayed focused during this session
            </label>
          </div>
        </motion.div>
      )}

      {/* Start New Session or Quick Log */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-serif font-medium text-brown-dark">Log Study Session</h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-brown-dark text-cream px-4 py-2 rounded-2xl text-sm font-medium hover:bg-brown-dark/90 transition-all"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Cancel' : activeSession ? 'Quick Log' : 'Start Session'}
          </button>
        </div>

        {/* Topics Quick Start */}
        {!showForm && !activeSession && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {userTopics.length === 0 ? (
              <p className="text-sm text-brown-muted col-span-full">Create a topic to start studying</p>
            ) : (
              userTopics.map((topic) => (
                <motion.button
                  key={topic.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStartSession(topic.id)}
                  className={`p-4 rounded-xl bg-gradient-to-br ${topic.color} border-2 border-transparent hover:border-brown-dark transition-all text-center`}
                >
                  <div className="text-2xl mb-2">{topic.icon}</div>
                  <p className="text-xs font-medium text-brown-dark truncate">{topic.name}</p>
                </motion.button>
              ))
            )}
          </div>
        )}

        {/* Quick Log Form */}
        <AnimatePresence>
          {showForm && !activeSession && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleQuickLog}
              className="space-y-4 mt-4"
            >
              <select
                value={formData.topicId}
                onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted text-brown-dark"
                required
              >
                <option value="">Select a topic</option>
                {userTopics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.icon} {topic.name}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-brown-muted mb-1 block">Duration (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="480"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted text-brown-dark"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-brown-muted mb-1 block">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted text-brown-dark"
                  />
                </div>
              </div>

              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notes about this session (optional)"
                className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted text-brown-dark placeholder:text-brown-muted resize-none h-16"
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="focused"
                  checked={formData.focused}
                  onChange={(e) => setFormData({ ...formData, focused: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="focused" className="text-sm text-brown-dark">
                  I stayed focused during this session
                </label>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-2 rounded-xl bg-brown-dark text-cream hover:bg-brown-dark/90 transition-all font-medium"
              >
                Log Session
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Recent Sessions */}
      {userSessions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-serif font-medium text-brown-dark">Recent Sessions</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
            {userSessions
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 8)
              .map((session) => {
                const topic = userTopics.find((t) => t.id === session.topicId);
                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-4 flex items-center justify-between rounded-xl"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl">{topic?.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-brown-dark">{session.topicName}</p>
                        <p className="text-xs text-brown-muted">
                          {session.duration} min • {new Date(session.date).toLocaleDateString()}
                          {session.focused && ' • 🎯 Focused'}
                        </p>
                      </div>
                    </div>
                    {session.notes && (
                      <div className="text-xs text-brown-muted max-w-xs truncate">"{session.notes}"</div>
                    )}
                  </motion.div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
