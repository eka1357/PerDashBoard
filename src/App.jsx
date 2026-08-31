import React, { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import CommandPalette from './components/common/CommandPalette';
import { DEFAULT_WIDGET_CONFIGS } from './utils/constants';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('perdash_theme') || 'midnight');
  const [userName, setUserName] = useState(() => localStorage.getItem('perdash_username') || 'Mahin');
  const [widgets, setWidgets] = useState(() => {
    const saved = localStorage.getItem('perdash_widgets');
    return saved ? JSON.parse(saved) : DEFAULT_WIDGET_CONFIGS;
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('perdash_theme', theme);
  }, [theme]);

  // Persist widgets
  useEffect(() => {
    localStorage.setItem('perdash_widgets', JSON.stringify(widgets));
  }, [widgets]);

  // Global keyboard shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleWidget = (widgetId) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === widgetId ? { ...w, enabled: !w.enabled } : w))
    );
  };

  const handleResetLayout = () => {
    setWidgets(DEFAULT_WIDGET_CONFIGS);
  };

  const activeWidgetCount = widgets.filter((w) => w.enabled).length;

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex flex-col font-sans transition-colors duration-300">
      {/* Top Navigation */}
      <Navbar
        userName={userName}
        theme={theme}
        onThemeChange={setTheme}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeWidgetCount={activeWidgetCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="glass-panel p-8 rounded-3xl text-center border border-theme-border relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-theme-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Theme & Navigation Core Initialized
            </h2>
            <p className="text-sm text-theme-text-muted mt-2 max-w-md mx-auto">
              Press <kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-theme-primary">⌘K</kbd> to launch the command palette or switch between 6 vibrant themes.
            </p>
          </div>
        </div>
      </main>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        widgets={widgets}
        onToggleWidget={handleToggleWidget}
        currentTheme={theme}
        onSelectTheme={setTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetLayout={handleResetLayout}
      />
    </div>
  );
}
