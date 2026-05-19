import React, { useState } from 'react';
import { useJournalStore, JournalMood, JournalCategory } from '../../store/useJournalStore';
import { useAuthStore } from '../../store/useAuthStore';
import { BookHeart, Plus, Trash2, Pin, Search, Filter, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const moodEmojis: Record<JournalMood, string> = {
  amazing: '🤩',
  good: '😊',
  neutral: '😐',
  sad: '😢',
  stressed: '😰',
};

const categoryEmojis: Record<JournalCategory, string> = {
  reflection: '🤔',
  gratitude: '🙏',
  goals: '🎯',
  lessons: '📚',
  memories: '📸',
  dreams: '✨',
  challenges: '💪',
  ideas: '💡',
};

export const JournalDashboard = () => {
  const { entries, addEntry, deleteEntry, togglePin, updateEntry, searchEntries, getEntriesByUser } = useJournalStore();
  const { user } = useAuthStore();
  const userId = user?.id ?? 'guest';

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<JournalCategory | 'all'>('all');
  const [moodFilter, setMoodFilter] = useState<JournalMood | 'all'>('all');

  const userEntries = getEntriesByUser(userId);
  const filteredEntries = searchQuery
    ? searchEntries(userId, searchQuery)
    : categoryFilter === 'all' && moodFilter === 'all'
      ? userEntries
      : userEntries.filter(
          (e) =>
            (categoryFilter === 'all' || e.category === categoryFilter) &&
            (moodFilter === 'all' || e.mood === moodFilter)
        );

  const pinnedEntries = filteredEntries.filter((e) => e.isPinned);
  const regularEntries = filteredEntries.filter((e) => !e.isPinned);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'good' as JournalMood,
    category: 'reflection' as JournalCategory,
    tags: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    if (editingId) {
      updateEntry(editingId, {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()),
        updatedAt: new Date().toISOString(),
      });
      setEditingId(null);
    } else {
      addEntry({
        ...formData,
        userId,
        tags: formData.tags.split(',').map((t) => t.trim()),
        isPinned: false,
      });
    }

    setFormData({
      title: '',
      content: '',
      mood: 'good',
      category: 'reflection',
      tags: '',
      date: new Date().toISOString().split('T')[0],
    });
    setShowForm(false);
  };

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Header */}
      <div className="glass-card p-8 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-2xl border border-white/30">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-purple-200">
            <BookHeart className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-medium text-brown-dark">Journal</h1>
            <p className="text-brown-muted">Reflect, capture moments, and celebrate your journey</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-card p-4 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 border border-beige">
          <Search className="w-4 h-4 text-brown-muted" />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent focus:outline-none text-brown-dark placeholder:text-brown-muted"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                categoryFilter === 'all' ? 'bg-brown-dark text-cream' : 'bg-beige text-brown-muted hover:bg-beige-dark'
              }`}
            >
              All Categories
            </button>
            {(['reflection', 'gratitude', 'goals', 'lessons', 'memories', 'dreams', 'challenges', 'ideas'] as JournalCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  categoryFilter === cat ? 'bg-brown-dark text-cream' : 'bg-beige text-brown-muted hover:bg-beige-dark'
                }`}
              >
                {categoryEmojis[cat]} {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setMoodFilter('all')}
              className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                moodFilter === 'all' ? 'bg-brown-dark text-cream' : 'bg-beige text-brown-muted hover:bg-beige-dark'
              }`}
            >
              All Moods
            </button>
            {(['amazing', 'good', 'neutral', 'sad', 'stressed'] as JournalMood[]).map((mood) => (
              <button
                key={mood}
                onClick={() => setMoodFilter(mood)}
                className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  moodFilter === mood ? 'bg-brown-dark text-cream' : 'bg-beige text-brown-muted hover:bg-beige-dark'
                }`}
              >
                {moodEmojis[mood]} {mood}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Entry Button */}
      <button
        onClick={() => {
          setEditingId(null);
          setShowForm(!showForm);
        }}
        className="w-full flex items-center justify-center gap-2 bg-brown-dark text-cream px-6 py-3 rounded-2xl text-sm font-medium hover:bg-brown-dark/90 transition-all"
      >
        <Plus className="w-5 h-5" />
        Write New Entry
      </button>

      {/* Entry Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Entry title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted"
                  required
                />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: e.target.value as JournalMood })}
                  className="px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted"
                >
                  <option value="amazing">🤩 Amazing</option>
                  <option value="good">😊 Good</option>
                  <option value="neutral">😐 Neutral</option>
                  <option value="sad">😢 Sad</option>
                  <option value="stressed">😰 Stressed</option>
                </select>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as JournalCategory })}
                  className="px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted"
                >
                  <option value="reflection">🤔 Reflection</option>
                  <option value="gratitude">🙏 Gratitude</option>
                  <option value="goals">🎯 Goals</option>
                  <option value="lessons">📚 Lessons</option>
                  <option value="memories">📸 Memories</option>
                  <option value="dreams">✨ Dreams</option>
                  <option value="challenges">💪 Challenges</option>
                  <option value="ideas">💡 Ideas</option>
                </select>
              </div>

              <textarea
                placeholder="Write your thoughts..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted resize-none h-40"
                required
              />

              <input
                type="text"
                placeholder="Tags (comma-separated, optional)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted"
              />

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl bg-beige text-brown-dark hover:bg-beige-dark">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-brown-dark text-cream hover:bg-brown-dark/90">
                  {editingId ? 'Update Entry' : 'Save Entry'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pinned Entries */}
      {pinnedEntries.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-serif font-medium text-brown-dark flex items-center gap-2">
            <Pin className="w-4 h-4" />
            Pinned Entries
          </h3>
          <div className="space-y-3">
            {pinnedEntries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-5 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-2xl border-2 border-yellow-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-serif font-semibold text-brown-dark">{entry.title}</h4>
                    <p className="text-xs text-brown-muted">
                      {categoryEmojis[entry.category]} {entry.category} • {moodEmojis[entry.mood]} • {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button onClick={() => togglePin(entry.id)} className="text-yellow-600">
                    <Pin className="w-4 h-4 fill-current" />
                  </button>
                </div>
                <p className="text-sm text-brown-dark line-clamp-3 mb-2">{entry.content}</p>
                {entry.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap mb-2">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-white/50 px-2 py-1 rounded-full text-brown-muted">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <button onClick={() => deleteEntry(entry.id)} className="text-xs text-red-600 hover:text-red-700">
                  Delete
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Entries */}
      {regularEntries.length === 0 && pinnedEntries.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl">
          <Heart className="w-12 h-12 text-brown-muted mx-auto mb-3 opacity-50" />
          <p className="text-brown-muted">No entries yet. Start your journaling journey!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {regularEntries.length > 0 && <h3 className="text-sm font-serif font-medium text-brown-dark">Entries</h3>}
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {regularEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-5 rounded-xl hover:shadow-soft transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-serif font-semibold text-brown-dark">{entry.title}</h4>
                    <p className="text-xs text-brown-muted">
                      {categoryEmojis[entry.category]} {entry.category} • {moodEmojis[entry.mood]} • {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button onClick={() => togglePin(entry.id)} className="p-1 rounded hover:bg-beige">
                    <Pin className="w-4 h-4 text-brown-muted" />
                  </button>
                </div>
                <p className="text-sm text-brown-dark line-clamp-2 mb-2">{entry.content}</p>
                {entry.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap mb-2">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-beige px-2 py-1 rounded-full text-brown-muted">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <button onClick={() => deleteEntry(entry.id)} className="text-xs text-red-600 hover:text-red-700">
                  Delete
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
