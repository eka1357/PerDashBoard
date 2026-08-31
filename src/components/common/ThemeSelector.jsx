import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { THEMES } from '../../utils/constants';

export default function ThemeSelector({ currentTheme, onSelectTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-text hover:text-theme-primary hover:border-theme-primary/40 transition-all flex items-center space-x-2 text-sm shadow-sm"
        title="Select Visual Theme"
      >
        <Palette className="w-4 h-4 text-theme-primary" />
        <span className="hidden sm:inline font-medium">Theme</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl glass-panel border border-theme-border shadow-2xl z-50 animate-scale-in">
          <div className="text-xs font-semibold uppercase tracking-wider text-theme-text-muted px-3 py-1.5">
            Select Theme
          </div>
          <div className="space-y-1 mt-1">
            {THEMES.map((theme) => {
              const isActive = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    onSelectTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                    isActive
                      ? 'bg-theme-primary/15 text-theme-primary font-medium'
                      : 'text-theme-text hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <span>{theme.name}</span>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-theme-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
