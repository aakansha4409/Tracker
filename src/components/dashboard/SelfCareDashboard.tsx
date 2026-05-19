import React, { useState } from 'react';
import { useSelfCareStore } from '../../store/useSelfCareStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Heart, Plus, Trash2, Clock, Smile, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const moodEmojis = { 1: '😢', 2: '😞', 3: '😐', 4: '😊', 5: '😄' };
const categoryEmojis = {
  meditation: '🧘',
  skincare: '💆',
  relaxation: '🛀',
  exercise: '🏃',
  sleep: '😴',
  nutrition: '🥗',
  hobby: '🎨',
  social: '👥',
  other: '⭐',
};

export const SelfCareDashboard = () => {
  const { activities, addActivity, deleteActivity, getWeeklyStats, getAverageMood } = useSelfCareStore();
  const { user } = useAuthStore();
  const userId = user?.id ?? 'guest';

  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'mood'>('overview');

  const userActivities = activities.filter((a) => a.userId === userId);
  const weeklyStats = getWeeklyStats(userId);
  const averageMood = getAverageMood(userId);

  const [formData, setFormData] = useState({
    name: '',
    category: 'meditation' as const,
    duration: 30,
    mood: 5 as const,
    energyBefore: 3 as const,
    energyAfter: 4 as const,
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addActivity({
      ...formData,
      userId,
    });

    setFormData({
      name: '',
      category: 'meditation',
      duration: 30,
      mood: 5,
      energyBefore: 3,
      energyAfter: 4,
      notes: '',
      date: new Date().toISOString().split('T')[0],
    });
    setShowForm(false);
  };

  const totalMinutes = userActivities.reduce((sum, a) => sum + a.duration, 0);
  const thisWeekMinutes = weeklyStats.reduce((sum, d) => sum + d.totalMinutes, 0);

  const chartData = weeklyStats.map((day) => ({
    name: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    minutes: day.totalMinutes,
    mood: day.averageMood,
  }));

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Header */}
      <div className="glass-card p-8 bg-gradient-to-br from-pink-100/50 to-purple-100/50 rounded-2xl border border-white/30">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-pink-200">
            <Heart className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-medium text-brown-dark">Self-Care Tracker</h1>
            <p className="text-brown-muted">Prioritize wellness, track mood, and nurture yourself daily</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="glass-card p-4 rounded-2xl">
        <nav className="flex gap-2">
          {['overview', 'activities', 'mood'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-xl transition-all font-medium text-sm ${
                activeTab === tab
                  ? 'bg-brown-dark text-cream shadow-soft'
                  : 'bg-beige text-brown-muted hover:bg-beige-dark'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5 bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="bg-pink-200 p-3 rounded-lg">
                  <Heart className="w-5 h-5 text-pink-600" />
                </div>
              </div>
              <p className="text-brown-muted text-xs font-medium mb-1">Total Activities</p>
              <p className="text-3xl font-bold text-brown-dark">{userActivities.length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-5 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="bg-purple-200 p-3 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-brown-muted text-xs font-medium mb-1">Total Minutes</p>
              <p className="text-3xl font-bold text-brown-dark">{totalMinutes}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-5 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="bg-blue-200 p-3 rounded-lg">
                  <Smile className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-brown-muted text-xs font-medium mb-1">Average Mood</p>
              <p className="text-3xl font-bold text-brown-dark">{averageMood.toFixed(1)}</p>
              <p className="text-xs text-brown-muted">{moodEmojis[Math.round(averageMood) as keyof typeof moodEmojis]}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-5 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="bg-green-200 p-3 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-brown-muted text-xs font-medium mb-1">This Week</p>
              <p className="text-3xl font-bold text-brown-dark">{thisWeekMinutes}</p>
              <p className="text-xs text-brown-muted">minutes</p>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-serif font-medium text-brown-dark mb-4">Weekly Activity</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E9DEC9" />
                  <XAxis dataKey="name" stroke="#8C7A6B" />
                  <YAxis stroke="#8C7A6B" />
                  <Tooltip contentStyle={{ backgroundColor: '#FDFBF7', border: '1px solid #E9DEC9', borderRadius: '8px' }} />
                  <Bar dataKey="minutes" fill="#F0D5D1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-serif font-medium text-brown-dark mb-4">Mood Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E9DEC9" />
                  <XAxis dataKey="name" stroke="#8C7A6B" />
                  <YAxis domain={[0, 5]} stroke="#8C7A6B" />
                  <Tooltip contentStyle={{ backgroundColor: '#FDFBF7', border: '1px solid #E9DEC9', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="mood" stroke="#E8C1BD" strokeWidth={2} dot={{ fill: '#E8C1BD', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Activities Tab */}
      {activeTab === 'activities' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-serif font-medium text-brown-dark">My Activities</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-brown-dark text-cream px-4 py-2 rounded-2xl text-sm font-medium hover:bg-brown-dark/90 transition-all"
            >
              <Plus className="w-4 h-4" />
              Log Activity
            </button>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass-card p-6 rounded-2xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Activity name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted"
                      required
                    />
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted"
                    >
                      <option value="meditation">🧘 Meditation</option>
                      <option value="skincare">💆 Skincare</option>
                      <option value="relaxation">🛀 Relaxation</option>
                      <option value="exercise">🏃 Exercise</option>
                      <option value="sleep">😴 Sleep</option>
                      <option value="nutrition">🥗 Nutrition</option>
                      <option value="hobby">🎨 Hobby</option>
                      <option value="social">👥 Social</option>
                      <option value="other">⭐ Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs font-medium text-brown-muted mb-1 block">Duration (min)</label>
                      <input type="number" min="1" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })} className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-brown-muted mb-1 block">Mood After</label>
                      <select value={formData.mood} onChange={(e) => setFormData({ ...formData, mood: parseInt(e.target.value) as any })} className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted">
                        <option value={1}>😢 Terrible</option>
                        <option value={2}>😞 Bad</option>
                        <option value={3}>😐 Okay</option>
                        <option value={4}>😊 Good</option>
                        <option value={5}>😄 Excellent</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-brown-muted mb-1 block">Energy Before</label>
                      <select value={formData.energyBefore} onChange={(e) => setFormData({ ...formData, energyBefore: parseInt(e.target.value) as any })} className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted">
                        <option value={1}>Low</option>
                        <option value={2}>Medium</option>
                        <option value={3}>High</option>
                        <option value={4}>Very High</option>
                        <option value={5}>Maximum</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-brown-muted mb-1 block">Energy After</label>
                      <select value={formData.energyAfter} onChange={(e) => setFormData({ ...formData, energyAfter: parseInt(e.target.value) as any })} className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted">
                        <option value={1}>Low</option>
                        <option value={2}>Medium</option>
                        <option value={3}>High</option>
                        <option value={4}>Very High</option>
                        <option value={5}>Maximum</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-brown-muted mb-1 block">Date</label>
                    <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted" />
                  </div>

                  <textarea placeholder="Notes (optional)" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted resize-none h-16" />

                  <div className="flex gap-3 justify-end">
                    <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl bg-beige text-brown-dark hover:bg-beige-dark">
                      Cancel
                    </button>
                    <button type="submit" className="px-6 py-2 rounded-xl bg-brown-dark text-cream hover:bg-brown-dark/90">
                      Log Activity
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Activities List */}
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {userActivities.length === 0 ? (
              <div className="glass-card p-8 text-center rounded-2xl">
                <Heart className="w-12 h-12 text-brown-muted mx-auto mb-3 opacity-50" />
                <p className="text-brown-muted">No activities logged. Start your self-care journey!</p>
              </div>
            ) : (
              userActivities
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 20)
                .map((activity, index) => (
                  <motion.div key={activity.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="glass-card p-4 bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-brown-dark">
                          {categoryEmojis[activity.category]} {activity.name}
                        </p>
                        <p className="text-xs text-brown-muted">
                          {activity.duration}m • {moodEmojis[activity.mood]} {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                      <button onClick={() => deleteActivity(activity.id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
            )}
          </div>
        </motion.div>
      )}

      {/* Mood Tab */}
      {activeTab === 'mood' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((mood) => {
              const moodActivities = userActivities.filter((a) => a.mood === mood);
              return (
                <motion.div
                  key={mood}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: mood * 0.05 }}
                  className="glass-card p-5 text-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50"
                >
                  <p className="text-4xl mb-2">{moodEmojis[mood as keyof typeof moodEmojis]}</p>
                  <p className="text-sm font-medium text-brown-dark">{moodActivities.length} times</p>
                  <p className="text-xs text-brown-muted">
                    {mood === 1 && 'Terrible'}
                    {mood === 2 && 'Bad'}
                    {mood === 3 && 'Okay'}
                    {mood === 4 && 'Good'}
                    {mood === 5 && 'Excellent'}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-serif font-medium text-brown-dark mb-4">Energy Impact</h3>
            <div className="space-y-3">
              {userActivities
                .slice(0, 5)
                .map((activity) => {
                  const energyChange = activity.energyAfter - activity.energyBefore;
                  return (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-beige rounded-lg">
                      <span className="text-sm text-brown-dark">{activity.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-brown-muted">{activity.energyBefore} → {activity.energyAfter}</span>
                        <span className={`text-sm font-bold ${energyChange > 0 ? 'text-green-600' : energyChange < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {energyChange > 0 ? '+' : ''}{energyChange}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
