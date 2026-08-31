import React, { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import CommandPalette from './components/common/CommandPalette';
import WidgetGrid from './components/common/WidgetGrid';
import WidgetCard from './components/common/WidgetCard';
import WeatherWidget from './components/widgets/Weather/WeatherWidget';
import TodoWidget from './components/widgets/Todos/TodoWidget';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DEFAULT_WIDGET_CONFIGS } from './utils/constants';
import { Clock } from 'lucide-react';

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

  const renderWidgetContent = (widgetId) => {
    switch (widgetId) {
      case 'weather':
        return <WeatherWidget />;
      case 'todos':
        return <TodoWidget />;
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

            if (widgetContent) {
              return (
                <div key={widget.id} className={widget.colSpan || 'col-span-1 md:col-span-2'}>
                  {widgetContent}
                </div>
              );
            }

            return (
              <div key={widget.id} className={widget.colSpan || 'col-span-1 md:col-span-2'}>
                <WidgetCard
                  id={widget.id}
                  title={widget.name}
                  badge={widget.category}
                  badgeVariant="neutral"
                >
                  <div className="py-8 text-center text-sm text-theme-text-muted">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-theme-primary/30" />
                    <span>Module '{widget.name}' will bolt on next.</span>
                  </div>
                </WidgetCard>
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
    </div>
  );
}
