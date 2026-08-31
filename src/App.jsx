import React from 'react';
import { LayoutDashboard } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex flex-col">
      <header className="border-b border-theme-border p-4 flex items-center justify-between glass-panel">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-theme-primary/20 text-theme-primary">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">PerDash</h1>
            <p className="text-xs text-theme-text-muted">Modular Personal Dashboard</p>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div className="glass-panel p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-theme-primary">Personal Dashboard Initialized</h2>
          <p className="text-theme-text-muted mt-2">Vite, React, and Tailwind CSS configured successfully.</p>
        </div>
      </main>
    </div>
  );
}
