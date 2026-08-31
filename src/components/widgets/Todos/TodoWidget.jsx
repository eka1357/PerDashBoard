import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Tag,
  AlertCircle,
  Sparkles,
  Search,
  Filter,
  CheckSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import WidgetCard from '../../common/WidgetCard';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

const DEFAULT_TODOS = [
  {
    id: '1',
    title: 'Review Antigravity agent architecture specifications',
    category: 'Dev',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    completed: false,
    subtasks: [
      { id: '1-1', title: 'Verify widget contract', completed: true },
      { id: '1-2', title: 'Check localStorage sync', completed: false }
    ]
  },
  {
    id: '2',
    title: 'Design glassmorphic theme variations',
    category: 'Work',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    completed: true,
    subtasks: []
  },
  {
    id: '3',
    title: 'Complete 30m mindful walk',
    category: 'Personal',
    priority: 'low',
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
    subtasks: []
  }
];

const CATEGORIES = ['All', 'Dev', 'Work', 'Personal', 'Study'];
const PRIORITIES = ['all', 'high', 'medium', 'low'];

export default function TodoWidget() {
  const [todos, setTodos] = useLocalStorage('perdash_todos', DEFAULT_TODOS);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Dev');
  const [newPriority, setNewPriority] = useState('medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('active'); // 'all', 'active', 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTodo = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      dueDate: newDueDate || new Date().toISOString().split('T')[0],
      completed: false,
      subtasks: []
    };

    setTodos([newTodo, ...todos]);
    setNewTitle('');
    setShowAddForm(false);
  };

  const handleToggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            confetti({
              particleCount: 40,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#6366f1', '#10b981', '#f59e0b', '#38bdf8']
            });
          }
          return {
            ...t,
            completed: nextCompleted,
            subtasks: t.subtasks.map((st) => ({ ...st, completed: nextCompleted }))
          };
        }
        return t;
      })
    );
  };

  const handleToggleSubtask = (todoId, subtaskId) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id === todoId) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          const allDone = updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.completed);
          return {
            ...t,
            subtasks: updatedSubtasks,
            completed: allDone ? true : t.completed
          };
        }
        return t;
      })
    );
  };

  const handleDelete = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTodos = todos.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'completed'
        ? t.completed
        : !t.completed;
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-theme-danger/20 text-theme-danger border-theme-danger/30';
      case 'medium':
        return 'bg-theme-warning/20 text-theme-warning border-theme-warning/30';
      case 'low':
      default:
        return 'bg-theme-success/20 text-theme-success border-theme-success/30';
    }
  };

  return (
    <WidgetCard
      id="todos"
      title="Task Planner"
      icon={CheckSquare}
      badge={`${completedCount}/${totalCount} Done (${progressPercent}%)`}
      badgeVariant={progressPercent === 100 ? 'success' : 'primary'}
      actions={
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-1.5 rounded-lg bg-theme-primary/20 text-theme-primary hover:bg-theme-primary/30 border border-theme-primary/30 transition-all text-xs flex items-center space-x-1"
          title="Add New Task"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-medium">Add</span>
        </button>
      }
    >
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-theme-text-muted mb-1.5 font-medium">
          <span>Sprint Completion</span>
          <span className="font-mono font-bold text-theme-primary">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-theme-primary to-theme-accent transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Add Task Form Modal / Expansion */}
      {showAddForm && (
        <form onSubmit={handleAddTodo} className="mb-4 p-3 rounded-2xl bg-black/30 border border-theme-border animate-slide-up space-y-2.5">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full p-2 rounded-xl bg-white/5 border border-theme-border text-xs text-theme-text placeholder-theme-text-muted outline-none focus:border-theme-primary/50"
            autoFocus
          />
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="p-1.5 rounded-xl bg-theme-card border border-theme-border text-theme-text outline-none text-xs"
            >
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="p-1.5 rounded-xl bg-theme-card border border-theme-border text-theme-text outline-none text-xs"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="p-1.5 rounded-xl bg-theme-card border border-theme-border text-theme-text outline-none text-xs"
            />

            <div className="flex-1 flex justify-end space-x-2">
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
                Save
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-1 bg-white/5 p-0.5 rounded-xl border border-white/5 text-[11px]">
          {['active', 'all', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                filterStatus === st
                  ? 'bg-theme-primary text-white font-medium shadow-sm'
                  : 'text-theme-text-muted hover:text-theme-text'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-1.5">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-theme-text-muted outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {filteredTodos.length === 0 ? (
          <div className="py-8 text-center text-xs text-theme-text-muted">
            <Sparkles className="w-6 h-6 mx-auto mb-2 text-theme-primary/40" />
            <span>No tasks matching your current filters.</span>
          </div>
        ) : (
          filteredTodos.map((todo) => {
            const isCompleted = todo.completed;
            return (
              <div
                key={todo.id}
                className={`p-3 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-white/2 border-white/5 opacity-60'
                    : 'bg-white/5 border-white/10 hover:border-theme-primary/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3 min-w-0">
                    <button
                      onClick={() => handleToggleComplete(todo.id)}
                      className="mt-0.5 text-theme-primary hover:scale-110 transition-transform flex-shrink-0"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-theme-success" />
                      ) : (
                        <Circle className="w-4 h-4 text-theme-text-muted" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-medium text-theme-text break-words ${
                          isCompleted ? 'line-through text-theme-text-muted' : ''
                        }`}
                      >
                        {todo.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-theme-text-muted border border-white/5">
                          {todo.category}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getPriorityBadge(todo.priority)}`}>
                          {todo.priority}
                        </span>
                        {todo.dueDate && (
                          <span className="text-[10px] text-theme-text-muted flex items-center space-x-1">
                            <Calendar className="w-2.5 h-2.5 mr-0.5" />
                            <span>{todo.dueDate}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="p-1 rounded-lg text-theme-text-muted hover:text-theme-danger hover:bg-theme-danger/10 transition-colors flex-shrink-0"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtasks */}
                {todo.subtasks && todo.subtasks.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-white/5 pl-7 space-y-1">
                    {todo.subtasks.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => handleToggleSubtask(todo.id, st.id)}
                        className="flex items-center space-x-2 text-[11px] cursor-pointer text-theme-text-muted hover:text-theme-text"
                      >
                        <div
                          className={`w-3 h-3 rounded border flex items-center justify-center ${
                            st.completed
                              ? 'bg-theme-primary border-theme-primary text-white'
                              : 'border-white/20'
                          }`}
                        >
                          {st.completed && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <span className={st.completed ? 'line-through opacity-70' : ''}>
                          {st.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </WidgetCard>
  );
}
