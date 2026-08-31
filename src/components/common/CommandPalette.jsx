import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Check, ArrowRight, Sun, Moon, Sparkles, Sliders, RefreshCw } from 'lucide-react';
import { THEMES } from '../../utils/constants';

export default function CommandPalette({
  isOpen,
  onClose,
  widgets,
  onToggleWidget,
  currentTheme,
  onSelectTheme,
  onOpenSettings,
  onResetLayout
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Build command list based on search query
  const widgetCommands = widgets.map((w) => ({
    id: `widget-${w.id}`,
    type: 'Widget',
    title: `Toggle ${w.name}`,
    description: w.enabled ? 'Currently Visible' : 'Currently Hidden',
    active: w.enabled,
    icon: Sparkles,
    action: () => {
      onToggleWidget(w.id);
      onClose();
    }
  }));

  const themeCommands = THEMES.map((t) => ({
    id: `theme-${t.id}`,
    type: 'Theme',
    title: `Switch Theme to ${t.name}`,
    description: currentTheme === t.id ? 'Active theme' : 'Switch palette',
    active: currentTheme === t.id,
    icon: Sun,
    action: () => {
      onSelectTheme(t.id);
      onClose();
    }
  }));

  const generalCommands = [
    {
      id: 'open-settings',
      type: 'Action',
      title: 'Open Dashboard Settings',
      description: 'Configure preferences & backup',
      icon: Sliders,
      action: () => {
        onOpenSettings();
        onClose();
      }
    },
    {
      id: 'reset-dashboard',
      type: 'Action',
      title: 'Reset Dashboard Layout',
      description: 'Restore default widgets & grid',
      icon: RefreshCw,
      action: () => {
        if (window.confirm('Reset all widgets to default layout?')) {
          onResetLayout();
          onClose();
        }
      }
    }
  ];

  const allCommands = [...generalCommands, ...widgetCommands, ...themeCommands];

  const filteredCommands = allCommands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.type.toLowerCase().includes(query.toLowerCase()) ||
    (cmd.description && cmd.description.toLowerCase().includes(query.toLowerCase()))
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-2xl glass-panel border border-theme-border shadow-2xl overflow-hidden z-10 animate-scale-in">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-theme-border bg-black/20">
          <Search className="w-5 h-5 text-theme-primary mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search widgets..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none text-theme-text placeholder-theme-text-muted text-sm sm:text-base font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-theme-text-muted hover:text-theme-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-sm text-theme-text-muted">
              No matching commands or widgets found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = cmd.icon;
              return (
                <div
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-theme-primary/20 text-theme-text border border-theme-primary/30'
                      : 'text-theme-text-muted hover:bg-white/5 hover:text-theme-text border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? 'bg-theme-primary text-white' : 'bg-white/5 text-theme-primary'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-theme-text truncate flex items-center space-x-2">
                        <span>{cmd.title}</span>
                        {cmd.active !== undefined && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                              cmd.active
                                ? 'bg-theme-success/20 text-theme-success'
                                : 'bg-white/10 text-theme-text-muted'
                            }`}
                          >
                            {cmd.active ? 'ON' : 'OFF'}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-theme-text-muted truncate">{cmd.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-theme-text-muted">
                      {cmd.type}
                    </span>
                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isSelected ? 'text-theme-primary translate-x-0.5' : 'text-transparent'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 bg-black/30 border-t border-theme-border flex items-center justify-between text-[11px] text-theme-text-muted">
          <div className="flex items-center space-x-3">
            <span>
              <kbd className="font-mono bg-white/10 px-1 py-0.5 rounded">↑↓</kbd> to navigate
            </span>
            <span>
              <kbd className="font-mono bg-white/10 px-1 py-0.5 rounded">↵</kbd> to select
            </span>
            <span>
              <kbd className="font-mono bg-white/10 px-1 py-0.5 rounded">esc</kbd> to close
            </span>
          </div>
          <span className="font-medium text-theme-primary">PerDash Vibe Engine</span>
        </div>
      </div>
    </div>
  );
}
