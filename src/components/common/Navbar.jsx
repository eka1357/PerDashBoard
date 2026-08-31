import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Clock, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import { formatTime, formatDate, getGreeting } from '../../utils/formatters';

export default function Navbar({
  userName = 'Eka Vardhan',
  theme,
  onThemeChange,
  onOpenCommandPalette,
  onOpenSettings,
  activeWidgetCount = 0
}) {
  const [time, setTime] = useState(new Date());
  const [is24h, setIs24h] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-theme-border glass-panel px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Greeting */}
        <div className="flex items-center space-x-3.5 min-w-0">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-theme-primary/30 to-theme-secondary/20 border border-theme-primary/30 text-theme-primary shadow-lg shadow-theme-primary-glow flex-shrink-0">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent truncate">
                {getGreeting()}, <span className="text-theme-primary font-extrabold">{userName}</span>
              </h1>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-theme-primary/10 text-theme-primary border border-theme-primary/20">
                <Sparkles className="w-3 h-3 mr-1" />
                Vibe Mode
              </span>
            </div>
            <p className="text-xs text-theme-text-muted hidden sm:block">
              {formatDate(time)} • {activeWidgetCount} active modules
            </p>
          </div>
        </div>

        {/* Center/Right Clock & Quick Search */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          {/* Digital Clock */}
          <button
            onClick={() => setIs24h(!is24h)}
            title="Click to toggle 12h/24h format"
            className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-xl bg-theme-card border border-theme-border text-xs font-mono font-medium hover:border-theme-primary/30 transition-all text-theme-text shadow-sm"
          >
            <Clock className="w-3.5 h-3.5 text-theme-accent" />
            <span>{formatTime(time, is24h)}</span>
          </button>

          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-theme-card border border-theme-border hover:border-theme-primary/40 text-theme-text-muted hover:text-theme-text text-xs sm:text-sm transition-all shadow-sm group"
            title="Open Command Palette (Ctrl+K or Cmd+K)"
          >
            <Search className="w-4 h-4 text-theme-primary group-hover:scale-110 transition-transform" />
            <span className="hidden lg:inline text-xs">Search actions...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-black/20 rounded border border-white/10 text-theme-text-muted">
              ⌘K
            </kbd>
          </button>

          {/* Theme Selector */}
          <ThemeSelector currentTheme={theme} onSelectTheme={onThemeChange} />

          {/* Settings Drawer Button */}
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-text hover:text-theme-primary hover:border-theme-primary/40 transition-all shadow-sm"
            title="Dashboard Settings & Widgets"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
