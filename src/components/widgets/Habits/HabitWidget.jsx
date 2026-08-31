import React, { useState } from 'react';
import {
  Flame,
  Plus,
  Trash2,
  Check,
  Calendar,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import WidgetCard from '../../common/WidgetCard';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

// Helper to generate past N days YYYY-MM-DD
function getPastDays(count = 14) {
  const days = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

const DEFAULT_HABITS = [
  {
    id: 'h-1',
    name: 'Code for 45 mins',
    category: 'Dev',
    streak: 12,
    bestStreak: 18,
    color: '#6366f1',
    history: {
      [new Date().toISOString().split('T')[0]]: true,
      [new Date(Date.now() - 86400000).toISOString().split('T')[0]]: true,
      [new Date(Date.now() - 172800000).toISOString().split('T')[0]]: true,
      [new Date(Date.now() - 259200000).toISOString().split('T')[0]]: true
    }
  },
  {
    id: 'h-2',
    name: 'Read 15 pages',
    category: 'Mindset',
    streak: 7,
    bestStreak: 14,
    color: '#10b981',
    history: {
      [new Date().toISOString().split('T')[0]]: true,
      [new Date(Date.now() - 86400000).toISOString().split('T')[0]]: true
    }
  },
  {
    id: 'h-3',
    name: 'Hydrate & Morning Stretch',
    category: 'Health',
    streak: 5,
    bestStreak: 9,
    color: '#38bdf8',
    history: {
      [new Date().toISOString().split('T')[0]]: true
    }
  }
];

const HABIT_CATEGORIES = ['Dev', 'Health', 'Mindset', 'Productivity'];

export default function HabitWidget() {
  const [habits, setHabits] = useLocalStorage('perdash_habits', DEFAULT_HABITS);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Dev');
  const [showAddForm, setShowAddForm] = useState(false);

  const pastDays = getPastDays(14);
  const todayStr = new Date().toISOString().split('T')[0];

  const handleToggleDay = (habitId, dateStr) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const currentVal = !!h.history[dateStr];
          const newHistory = { ...h.history, [dateStr]: !currentVal };

          // Recalculate streak
          let streak = 0;
          let checkDate = new Date();
          while (true) {
            const dKey = checkDate.toISOString().split('T')[0];
            if (newHistory[dKey]) {
              streak++;
              checkDate.setDate(checkDate.getDate() - 1);
            } else {
              break;
            }
          }

          if (!currentVal && dateStr === todayStr) {
            confetti({
              particleCount: 25,
              spread: 45,
              origin: { y: 0.8 },
              colors: ['#10b981', '#6366f1', '#f59e0b']
            });
          }

          return {
            ...h,
            history: newHistory,
            streak,
            bestStreak: Math.max(streak, h.bestStreak || streak)
          };
        }
        return h;
      })
    );
  };

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const colors = ['#6366f1', '#10b981', '#f97316', '#38bdf8', '#d946ef'];
    const newHabit = {
      id: `h-${Date.now()}`,
      name: newHabitName.trim(),
      category: newHabitCategory,
      streak: 0,
      bestStreak: 0,
      color: colors[habits.length % colors.length],
      history: {}
    };

    setHabits([...habits, newHabit]);
    setNewHabitName('');
    setShowAddForm(false);
  };

  const handleDeleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const completedTodayCount = habits.filter((h) => h.history[todayStr]).length;
  const totalHabits = habits.length;

  return (
    <WidgetCard
      id="habits"
      title="Habit Streaks"
      icon={Flame}
      badge={`${completedTodayCount}/${totalHabits} Done Today`}
      badgeVariant={completedTodayCount === totalHabits && totalHabits > 0 ? 'success' : 'primary'}
      actions={
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-1.5 rounded-lg bg-theme-primary/20 text-theme-primary hover:bg-theme-primary/30 border border-theme-primary/30 transition-all text-xs flex items-center space-x-1"
          title="Add New Habit"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-medium">Add</span>
        </button>
      }
    >
      {/* Add Habit Form */}
      {showAddForm && (
        <form onSubmit={handleAddHabit} className="mb-4 p-3 rounded-2xl bg-black/30 border border-theme-border animate-slide-up space-y-2">
          <input
            type="text"
            placeholder="New habit name (e.g. Meditate for 10m)..."
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            className="w-full p-2 rounded-xl bg-white/5 border border-theme-border text-xs text-theme-text placeholder-theme-text-muted outline-none focus:border-theme-primary/50"
            autoFocus
          />
          <div className="flex items-center justify-between">
            <select
              value={newHabitCategory}
              onChange={(e) => setNewHabitCategory(e.target.value)}
              className="p-1.5 rounded-xl bg-theme-card border border-theme-border text-theme-text outline-none text-xs"
            >
              {HABIT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 rounded-xl text-xs text-theme-text-muted hover:text-theme-text hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-theme-primary text-white hover:bg-theme-primary/90"
              >
                Create
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Habits Matrix List */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {habits.length === 0 ? (
          <div className="py-8 text-center text-xs text-theme-text-muted">
            <Award className="w-6 h-6 mx-auto mb-2 text-theme-primary/40" />
            <span>No habits tracked yet. Click Add to begin your streak!</span>
          </div>
        ) : (
          habits.map((habit) => {
            const isDoneToday = !!habit.history[todayStr];
            return (
              <div
                key={habit.id}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-theme-primary/30 transition-all group/habit"
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: habit.color || '#6366f1' }}
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-theme-text truncate">{habit.name}</h4>
                      <span className="text-[10px] text-theme-text-muted">{habit.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 flex-shrink-0">
                    {/* Streak Badge */}
                    <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono font-bold">
                      <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{habit.streak}d</span>
                    </div>

                    {/* Today Check Button */}
                    <button
                      onClick={() => handleToggleDay(habit.id, todayStr)}
                      className={`p-1.5 rounded-xl border transition-all ${
                        isDoneToday
                          ? 'bg-theme-success text-white border-theme-success shadow-md shadow-theme-success/20'
                          : 'bg-white/5 text-theme-text-muted border-white/10 hover:border-theme-success/50 hover:text-theme-success'
                      }`}
                      title={isDoneToday ? 'Completed today' : 'Mark done for today'}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="p-1 rounded-lg text-theme-text-muted hover:text-theme-danger hover:bg-theme-danger/10 transition-colors opacity-0 group-hover/habit:opacity-100"
                      title="Delete habit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 14-Day Heatmap Grid */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-1">
                  {pastDays.map((dStr, idx) => {
                    const isChecked = !!habit.history[dStr];
                    const isToday = dStr === todayStr;
                    const dateObj = new Date(dStr);
                    const dayLetter = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][dateObj.getDay()];

                    return (
                      <div
                        key={dStr}
                        onClick={() => handleToggleDay(habit.id, dStr)}
                        className="flex flex-col items-center cursor-pointer group/cell"
                        title={`${dStr}: ${isChecked ? 'Completed' : 'Missed'}`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md transition-all ${
                            isChecked
                              ? 'shadow-sm hover:opacity-80'
                              : 'bg-white/5 hover:bg-white/15'
                          } ${isToday ? 'ring-1 ring-white/40' : ''}`}
                          style={{
                            backgroundColor: isChecked ? habit.color || '#6366f1' : undefined
                          }}
                        />
                        <span className="text-[8px] font-mono text-theme-text-muted mt-1 opacity-70">
                          {dayLetter}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </WidgetCard>
  );
}
