import React, { useRef } from 'react';
import {
  X,
  Sliders,
  User,
  Palette,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import { THEMES } from '../../utils/constants';
import { exportDashboardData, importDashboardData } from '../../utils/storage';

export default function SettingsDrawer({
  isOpen,
  onClose,
  userName,
  onUpdateUserName,
  currentTheme,
  onSelectTheme,
  widgets,
  onToggleWidget,
  onResetDashboard
}) {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importDashboardData(
      file,
      () => {
        alert('Dashboard backup restored successfully!');
        window.location.reload();
      },
      (err) => {
        alert(`Failed to import backup: ${err.message}`);
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-theme-bg border-l border-theme-border shadow-2xl flex flex-col z-10 animate-slide-up sm:animate-none">
        {/* Header */}
        <div className="p-5 border-b border-theme-border flex items-center justify-between glass-panel">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-theme-primary/20 text-theme-primary">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Dashboard Settings</h2>
              <p className="text-xs text-theme-text-muted">Preferences & customization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-theme-text-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Personalization Section */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-theme-text-muted mb-2.5 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-theme-primary" />
              <span>Personalization</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <label className="text-xs text-theme-text-muted font-medium">Display Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => onUpdateUserName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full p-2.5 rounded-xl bg-theme-card border border-theme-border text-xs text-white placeholder-theme-text-muted outline-none focus:border-theme-primary/50 font-medium"
              />
            </div>
          </div>

          {/* Visual Theme Selection */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-theme-text-muted mb-2.5 flex items-center space-x-1.5">
              <Palette className="w-3.5 h-3.5 text-theme-secondary" />
              <span>Visual Theme</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((theme) => {
                const isActive = currentTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => onSelectTheme(theme.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-theme-primary/15 border-theme-primary text-white shadow-sm'
                        : 'bg-white/5 border-white/5 text-theme-text-muted hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <span className="text-xs font-medium">{theme.name}</span>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 text-theme-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Module / Widget Toggle Switches */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-theme-text-muted mb-2.5 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Active Modules</span>
            </div>
            <div className="space-y-2">
              {widgets.map((widget) => (
                <div
                  key={widget.id}
                  onClick={() => onToggleWidget(widget.id)}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    widget.enabled
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-black/20 border-white/5 text-theme-text-muted opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded-lg ${widget.enabled ? 'bg-theme-primary/20 text-theme-primary' : 'bg-white/5 text-theme-text-muted'}`}>
                      {widget.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold">{widget.name}</div>
                      <div className="text-[10px] text-theme-text-muted">{widget.category}</div>
                    </div>
                  </div>
                  <div
                    className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                      widget.enabled ? 'bg-theme-primary' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        widget.enabled ? 'transform translate-x-4' : ''
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Backup & Data Sync */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-theme-text-muted mb-2.5 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-theme-success" />
              <span>Data & Backup</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2.5">
              <button
                onClick={exportDashboardData}
                className="w-full py-2.5 px-3 rounded-xl bg-theme-card hover:bg-white/10 border border-theme-border text-xs font-medium text-white flex items-center justify-center space-x-2 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-theme-accent" />
                <span>Export Backup (JSON)</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 rounded-xl bg-theme-card hover:bg-white/10 border border-theme-border text-xs font-medium text-white flex items-center justify-center space-x-2 transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-theme-primary" />
                <span>Import Backup (JSON)</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Reset all dashboard layout and preferences to factory defaults?')) {
                    onResetDashboard();
                  }
                }}
                className="w-full py-2 px-3 rounded-xl hover:bg-theme-danger/10 text-xs text-theme-danger border border-transparent hover:border-theme-danger/30 flex items-center justify-center space-x-1.5 transition-all"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset to Factory Defaults</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-theme-border bg-black/20 text-center text-[11px] text-theme-text-muted">
          PerDash v1.0 • Built with Google Antigravity
        </div>
      </div>
    </div>
  );
}
