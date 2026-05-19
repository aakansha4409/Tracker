import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Archive, FileText, Pin, Plus, Search, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { NoteCategory, NoteColor, useNotesStore } from '../../store/useNotesStore';

const categoryOptions: NoteCategory[] = ['general', 'study', 'work', 'personal', 'ideas', 'reminders'];
const colorOptions: NoteColor[] = ['cream', 'rose', 'sky', 'mint', 'amber', 'lavender'];

const colorClass: Record<NoteColor, string> = {
  cream: 'from-amber-50 to-amber-100 border-amber-200',
  rose: 'from-rose-50 to-pink-100 border-pink-200',
  sky: 'from-sky-50 to-blue-100 border-blue-200',
  mint: 'from-emerald-50 to-green-100 border-green-200',
  amber: 'from-orange-50 to-yellow-100 border-yellow-200',
  lavender: 'from-violet-50 to-purple-100 border-purple-200',
};

export const NotesDashboard = () => {
  const { user } = useAuthStore();
  const userId = user?.id ?? 'guest';

  const { addNote, updateNote, deleteNote, togglePin, toggleArchive, searchNotes } = useNotesStore();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<NoteCategory | 'all'>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'general' as NoteCategory,
    color: 'cream' as NoteColor,
    tags: '',
  });

  const notes = useMemo(() => {
    const matches = searchNotes(userId, query);
    return matches.filter((n) => {
      const categoryPass = filter === 'all' || n.category === filter;
      const archivePass = showArchived ? n.isArchived : !n.isArchived;
      return categoryPass && archivePass;
    });
  }, [filter, query, searchNotes, showArchived, userId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    const payload = {
      userId,
      title: form.title.trim(),
      content: form.content.trim(),
      category: form.category,
      color: form.color,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      isPinned: false,
      isArchived: false,
    };

    if (editingId) {
      updateNote(editingId, payload);
    } else {
      addNote(payload);
    }

    setForm({
      title: '',
      content: '',
      category: 'general',
      color: 'cream',
      tags: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    setEditingId(noteId);
    setForm({
      title: note.title,
      content: note.content,
      category: note.category,
      color: note.color,
      tags: note.tags.join(', '),
    });
    setShowForm(true);
  };

  return (
    <div className="w-full space-y-6 pb-8">
      <div className="glass-card p-8 bg-gradient-to-br from-orange-100/50 to-rose-100/50 rounded-2xl border border-white/30">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-orange-200">
            <FileText className="w-6 h-6 text-orange-700" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-medium text-brown-dark">Notes</h1>
            <p className="text-brown-muted">Capture ideas, reminders, and your quick thought flow in one place.</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-4 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 border border-beige">
          <Search className="w-4 h-4 text-brown-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, content, or tag"
            className="flex-1 bg-transparent focus:outline-none text-brown-dark placeholder:text-brown-muted"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm ${filter === 'all' ? 'bg-brown-dark text-cream' : 'bg-beige text-brown-muted'}`}
          >
            All
          </button>
          {categoryOptions.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-3 py-1 rounded-lg text-sm capitalize ${filter === category ? 'bg-brown-dark text-cream' : 'bg-beige text-brown-muted'}`}
            >
              {category}
            </button>
          ))}
          <button
            onClick={() => setShowArchived((v) => !v)}
            className={`px-3 py-1 rounded-lg text-sm ml-auto ${showArchived ? 'bg-brown-dark text-cream' : 'bg-beige text-brown-muted'}`}
          >
            {showArchived ? 'Showing Archived' : 'Show Archived'}
          </button>
        </div>
      </div>

      <button
        onClick={() => {
          setShowForm((v) => !v);
          if (showForm) {
            setEditingId(null);
            setForm({ title: '', content: '', category: 'general', color: 'cream', tags: '' });
          }
        }}
        className="w-full flex items-center justify-center gap-2 bg-brown-dark text-cream px-6 py-3 rounded-2xl text-sm font-medium hover:bg-brown-dark/90 transition-all"
      >
        <Plus className="w-5 h-5" />
        {editingId ? 'Update Note' : 'Add New Note'}
      </button>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6 rounded-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted"
                required
              />

              <textarea
                placeholder="Write your note"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full h-32 px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted resize-none"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as NoteCategory })}
                  className="px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none"
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category} className="capitalize">
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value as NoteColor })}
                  className="px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none"
                >
                  {colorOptions.map((color) => (
                    <option key={color} value={color} className="capitalize">
                      {color}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="tags, comma-separated"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-beige text-brown-dark"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-brown-dark text-cream">
                  {editingId ? 'Save Changes' : 'Save Note'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {notes.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl">
          <p className="text-brown-muted">No notes found. Add your first note to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-card p-5 rounded-2xl border bg-gradient-to-br ${colorClass[note.color]}`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-base font-serif text-brown-dark line-clamp-2">{note.title}</h3>
                  <p className="text-xs text-brown-muted capitalize">{note.category}</p>
                </div>
                <button onClick={() => togglePin(note.id)} className="p-1 rounded hover:bg-white/50">
                  <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-current text-brown-dark' : 'text-brown-muted'}`} />
                </button>
              </div>

              <p className="text-sm text-brown-dark line-clamp-5 mb-3">{note.content}</p>

              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {note.tags.map((tag) => (
                    <span key={`${note.id}-${tag}`} className="text-[11px] bg-white/60 px-2 py-1 rounded-full text-brown-muted">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-[11px] text-brown-muted mb-3">Updated {new Date(note.updatedAt).toLocaleString()}</p>

              <div className="flex items-center gap-2">
                <button onClick={() => startEdit(note.id)} className="text-xs px-2 py-1 rounded bg-white/60 text-brown-dark">
                  Edit
                </button>
                <button onClick={() => toggleArchive(note.id)} className="text-xs px-2 py-1 rounded bg-white/60 text-brown-dark flex items-center gap-1">
                  <Archive className="w-3 h-3" /> {note.isArchived ? 'Unarchive' : 'Archive'}
                </button>
                <button onClick={() => deleteNote(note.id)} className="ml-auto text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
