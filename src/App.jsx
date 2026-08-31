import React, { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import CommandPalette from './components/common/CommandPalette';
import SettingsDrawer from './components/common/SettingsDrawer';
import WidgetGrid from './components/common/WidgetGrid';
import WidgetCard from './components/common/WidgetCard';
import WeatherWidget from './components/widgets/Weather/WeatherWidget';
import TodoWidget from './components/widgets/Todos/TodoWidget';
import HabitWidget from './components/widgets/Habits/HabitWidget';
import PomodoroWidget from './components/widgets/Pomodoro/PomodoroWidget';
import QuotesWidget from './components/widgets/Quotes/QuotesWidget';
import QuickLinksWidget from './components/widgets/QuickLinks/QuickLinksWidget';
import NotesWidget from './components/widgets/Notes/NotesWidget';
import WellnessWidget from './components/widgets/Wellness/WellnessWidget';
import CryptoTickerWidget from './components/widgets/CryptoTicker/CryptoTickerWidget';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DEFAULT_WIDGET_CONFIGS } from './utils/constants';

export default function App() {
  const [theme, setTheme] = useLocalStorage('perdash_theme', 'midnight');
  const [userName, setUserName] = useLocalStorage('perdash_username', 'Eka Vardhan');
  const [widgets, setWidgets] = useLocalStorage('perdash_widgets', DEFAULT_WIDGET_CONFIGS);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Apply theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Global keyboard shortcut (Cmd+K / Ctrl+K)
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
    setTheme('midnight');
  };

  const activeWidgetCount = widgets.filter((w) => w.enabled).length;

  const renderWidgetContent = (widgetId) => {
    switch (widgetId) {
      case 'weather':
        return <WeatherWidget />;
      case 'todos':
        return <TodoWidget />;
      case 'habits':
        return <HabitWidget />;
      case 'pomodoro':
        return <PomodoroWidget />;
      case 'quotes':
        return <QuotesWidget />;
      case 'quicklinks':
        return <QuickLinksWidget />;
      case 'notes':
        return <NotesWidget />;
      case 'wellness':
        return <WellnessWidget />;
      case 'crypto':
        return <CryptoTickerWidget />;
      default:
        return null;
    }
  };

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
        <WidgetGrid>
          {widgets.filter((w) => w.enabled).map((widget) => {
            const widgetContent = renderWidgetContent(widget.id);
            if (!widgetContent) return null;

            return (
              <div key={widget.id} className={widget.colSpan || 'col-span-1 md:col-span-2'}>
                {widgetContent}
              </div>
            );
          })}
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

      {/* Settings Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userName={userName}
        onUpdateUserName={setUserName}
        currentTheme={theme}
        onSelectTheme={setTheme}
        widgets={widgets}
        onToggleWidget={handleToggleWidget}
        onResetDashboard={handleResetLayout}
      />
    </div>
  );
}
