import React, { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import CommandPalette from './components/common/CommandPalette';
import WidgetGrid from './components/common/WidgetGrid';
import WidgetCard from './components/common/WidgetCard';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DEFAULT_WIDGET_CONFIGS } from './utils/constants';
import { Sparkles, CheckCircle2, Clock, Activity } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useLocalStorage('perdash_theme', 'midnight');
  const [userName, setUserName] = useLocalStorage('perdash_username', 'Mahin');
  const [widgets, setWidgets] = useLocalStorage('perdash_widgets', DEFAULT_WIDGET_CONFIGS);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Apply theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Global keyboard shortcut
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
    <div className="min-h-screen bg-theme-bg text-theme-text flex flex-col font-sans transition-colors duration-300 selection:bg-theme-primary selection:text-white">
      {/* Top Navigation */}
      <Navbar
        userName={userName}
        theme={theme}
        onThemeChange={setTheme}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeWidgetCount={activeWidgetCount}
      />

      {/* Main Grid View */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Quick Welcome Banner */}
        <div className="mb-6 p-5 sm:p-6 rounded-3xl glass-panel border border-theme-border relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-theme-primary to-theme-secondary text-white shadow-lg shadow-theme-primary-glow">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Workspace Dashboard Ready
              </h2>
              <p className="text-xs sm:text-sm text-theme-text-muted">
                Core hooks, local persistence, sound engine, and widget framework loaded.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs font-medium text-theme-primary bg-theme-primary/10 px-3 py-1.5 rounded-xl border border-theme-primary/20">
            <Activity className="w-4 h-4" />
            <span>{activeWidgetCount} Widgets Enabled</span>
          </div>
        </div>

        {/* Dynamic Widget Grid Container */}
        <WidgetGrid>
          {widgets.filter((w) => w.enabled).map((widget) => (
            <div key={widget.id} className={widget.colSpan || 'col-span-1 md:col-span-2'}>
              <WidgetCard
                id={widget.id}
                title={widget.name}
                badge={widget.category}
                badgeVariant="primary"
                onRefresh={() => console.log(`Refreshing ${widget.name}`)}
              >
                <div className="py-6 text-center text-sm text-theme-text-muted">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-theme-primary/40" />
                  <span>Module component will bolt on next.</span>
                </div>
              </WidgetCard>
            </div>
          ))}
        </WidgetGrid>
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
