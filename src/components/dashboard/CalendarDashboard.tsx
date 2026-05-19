import React, { useState } from 'react';
import { useCalendarStore, EventCategory, EventColor } from '../../store/useCalendarStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Calendar, Plus, Trash2, Clock, MapPin, Users, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, getDaysInMonth, startOfMonth, addMonths, subMonths } from 'date-fns';

const categoryIcons: Record<EventCategory, string> = {
  birthday: '🎂',
  anniversary: '💑',
  holiday: '🎉',
  event: '🎪',
  deadline: '⏰',
  reminder: '📌',
  other: '⭐',
};

const colorMap: Record<EventColor, string> = {
  red: 'from-red-100 to-red-50',
  blue: 'from-blue-100 to-blue-50',
  green: 'from-green-100 to-green-50',
  purple: 'from-purple-100 to-purple-50',
  orange: 'from-orange-100 to-orange-50',
  pink: 'from-pink-100 to-pink-50',
  yellow: 'from-yellow-100 to-yellow-50',
  gray: 'from-gray-100 to-gray-50',
};

const colorBg: Record<EventColor, string> = {
  red: 'bg-red-100 border-red-200',
  blue: 'bg-blue-100 border-blue-200',
  green: 'bg-green-100 border-green-200',
  purple: 'bg-purple-100 border-purple-200',
  orange: 'bg-orange-100 border-orange-200',
  pink: 'bg-pink-100 border-pink-200',
  yellow: 'bg-yellow-100 border-yellow-200',
  gray: 'bg-gray-100 border-gray-200',
};

export const CalendarDashboard = () => {
  const { events, addEvent, deleteEvent, getEventsByDate, getEventsByMonth, getUpcomingEvents } = useCalendarStore();
  const { user } = useAuthStore();
  const userId = user?.id ?? 'guest';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = startOfMonth(currentDate).getDay();
  const monthEvents = getEventsByMonth(currentDate.getFullYear(), currentDate.getMonth()).filter((e) => e.userId === userId);
  const upcomingEvents = getUpcomingEvents(userId, 14);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    category: 'event' as EventCategory,
    color: 'blue' as EventColor,
    isAllDay: true,
    isRepeating: false,
    repeatPattern: 'weekly' as const,
    notificationMinutes: 60,
    location: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addEvent({
      ...formData,
      userId,
      endDate: formData.date,
    });

    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      category: 'event',
      color: 'blue',
      isAllDay: true,
      isRepeating: false,
      repeatPattern: 'weekly',
      notificationMinutes: 60,
      location: '',
    });
    setShowForm(false);
  };

  const dayEvents = selectedDate ? getEventsByDate(selectedDate).filter((e) => e.userId === userId) : [];

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Header */}
      <div className="glass-card p-8 bg-gradient-to-br from-green-100/50 to-blue-100/50 rounded-2xl border border-white/30">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-green-200">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-medium text-brown-dark">Calendar</h1>
            <p className="text-brown-muted">Plan, organize, and never miss important dates</p>
          </div>
        </div>
      </div>

      {/* Add Event Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full flex items-center justify-center gap-2 bg-brown-dark text-cream px-6 py-3 rounded-2xl text-sm font-medium hover:bg-brown-dark/90 transition-all"
      >
        <Plus className="w-5 h-5" />
        Add Event
      </button>

      {/* Event Form */}
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
                  placeholder="Event title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted"
                  required
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
                  className="px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted"
                >
                  <option value="birthday">🎂 Birthday</option>
                  <option value="anniversary">💑 Anniversary</option>
                  <option value="holiday">🎉 Holiday</option>
                  <option value="event">🎪 Event</option>
                  <option value="deadline">⏰ Deadline</option>
                  <option value="reminder">📌 Reminder</option>
                  <option value="other">⭐ Other</option>
                </select>
              </div>

              <textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted resize-none h-16"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-brown-muted mb-1 block">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-brown-muted mb-1 block">Time (optional)</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    disabled={formData.isAllDay}
                    className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-brown-muted mb-1 block">Color</label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value as EventColor })}
                    className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted"
                  >
                    <option value="red">🔴 Red</option>
                    <option value="blue">🔵 Blue</option>
                    <option value="green">🟢 Green</option>
                    <option value="purple">🟣 Purple</option>
                    <option value="orange">🟠 Orange</option>
                    <option value="pink">🩷 Pink</option>
                    <option value="yellow">🟡 Yellow</option>
                    <option value="gray">⚫ Gray</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Location (optional)"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted"
                />
                <select
                  value={formData.notificationMinutes}
                  onChange={(e) => setFormData({ ...formData, notificationMinutes: parseInt(e.target.value) })}
                  className="px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted"
                >
                  <option value={0}>No reminder</option>
                  <option value={15}>15 minutes before</option>
                  <option value={30}>30 minutes before</option>
                  <option value={60}>1 hour before</option>
                  <option value={1440}>1 day before</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-brown-dark">
                  <input
                    type="checkbox"
                    checked={formData.isAllDay}
                    onChange={(e) => setFormData({ ...formData, isAllDay: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  All Day Event
                </label>
                <label className="flex items-center gap-2 text-sm text-brown-dark">
                  <input
                    type="checkbox"
                    checked={formData.isRepeating}
                    onChange={(e) => setFormData({ ...formData, isRepeating: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  Repeating Event
                </label>
              </div>

              {formData.isRepeating && (
                <select
                  value={formData.repeatPattern}
                  onChange={(e) => setFormData({ ...formData, repeatPattern: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 border border-beige focus:outline-none focus:ring-2 focus:ring-brown-muted"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              )}

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl bg-beige text-brown-dark hover:bg-beige-dark">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-brown-dark text-cream hover:bg-brown-dark/90">
                  Create Event
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mini Calendar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-serif font-medium text-brown-dark">{format(currentDate, 'MMMM yyyy')}</h3>
            <div className="flex gap-2">
              <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="px-3 py-1 rounded-lg bg-beige hover:bg-beige-dark text-sm">
                ←
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 rounded-lg bg-brown-dark text-cream text-sm">
                Today
              </button>
              <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="px-3 py-1 rounded-lg bg-beige hover:bg-beige-dark text-sm">
                →
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-brown-muted py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents = monthEvents.filter((e) => e.date === dateStr);
              const isSelected = selectedDate === dateStr;

              return (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`p-2 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-brown-dark text-cream shadow-soft'
                      : dayEvents.length > 0
                        ? 'bg-pink-dusty border-2 border-pink-dark'
                        : 'bg-beige hover:bg-beige-dark'
                  }`}
                >
                  <div>{day}</div>
                  {dayEvents.length > 0 && <div className="text-[8px]">•••</div>}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-serif font-medium text-brown-dark mb-4">Upcoming</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-brown-muted">No upcoming events</p>
            ) : (
              upcomingEvents.slice(0, 10).map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 bg-gradient-to-br ${colorMap[event.color]} rounded-lg text-sm`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-brown-dark">
                        {categoryIcons[event.category]} {event.title}
                      </p>
                      <p className="text-xs text-brown-muted">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => deleteEvent(event.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-serif font-medium text-brown-dark mb-4">{format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}</h3>

          {dayEvents.length === 0 ? (
            <p className="text-brown-muted text-sm">No events scheduled for this day</p>
          ) : (
            <div className="space-y-3">
              {dayEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 bg-gradient-to-br ${colorMap[event.color]} rounded-xl`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-brown-dark">
                      {categoryIcons[event.category]} {event.title}
                    </h4>
                    <button onClick={() => deleteEvent(event.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {!event.isAllDay && event.time && (
                    <p className="text-sm text-brown-muted flex items-center gap-1 mb-2">
                      <Clock className="w-3 h-3" />
                      {event.time}
                    </p>
                  )}

                  {event.location && (
                    <p className="text-sm text-brown-muted flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </p>
                  )}

                  {event.description && <p className="text-sm text-brown-dark">{event.description}</p>}

                  {event.isRepeating && (
                    <p className="text-xs text-brown-muted mt-2">
                      🔄 Repeats {event.repeatPattern}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
