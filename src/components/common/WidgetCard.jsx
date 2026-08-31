import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCw } from 'lucide-react';

export default function WidgetCard({
  id,
  title,
  icon: Icon,
  badge,
  badgeVariant = 'primary', // 'primary', 'success', 'warning', 'danger', 'neutral'
  actions,
  onRefresh,
  isRefreshing = false,
  className = '',
  headerClassName = '',
  children,
  collapsible = true,
  defaultCollapsed = false
}) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const getBadgeStyle = () => {
    switch (badgeVariant) {
      case 'success':
        return 'bg-theme-success/15 text-theme-success border-theme-success/30';
      case 'warning':
        return 'bg-theme-warning/15 text-theme-warning border-theme-warning/30';
      case 'danger':
        return 'bg-theme-danger/15 text-theme-danger border-theme-danger/30';
      case 'neutral':
        return 'bg-white/10 text-theme-text-muted border-white/10';
      case 'primary':
      default:
        return 'bg-theme-primary/15 text-theme-primary border-theme-primary/30';
    }
  };

  return (
    <div
      id={`widget-${id}`}
      className={`group relative rounded-3xl glass-panel border border-theme-border transition-all duration-300 hover:border-theme-primary/30 hover:shadow-xl hover:shadow-theme-primary-glow flex flex-col overflow-hidden ${className}`}
    >
      {/* Decorative top ambient glow line */}
      <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-theme-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Widget Header */}
      <div className={`p-4 sm:p-5 flex items-center justify-between gap-3 select-none border-b border-theme-border/60 ${headerClassName}`}>
        <div className="flex items-center space-x-3 min-w-0">
          {Icon && (
            <div className="p-2 rounded-xl bg-theme-primary/10 border border-theme-primary/20 text-theme-primary flex-shrink-0 group-hover:scale-105 transition-transform">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-sm font-semibold tracking-tight text-theme-text truncate">
              {title}
            </h3>
          </div>
          {badge !== undefined && (
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getBadgeStyle()} flex-shrink-0`}>
              {badge}
            </span>
          )}
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
          {actions}

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-white/5 transition-all ${
                isRefreshing ? 'animate-spin text-theme-primary' : ''
              }`}
              title="Refresh widget data"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}

          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-white/5 transition-colors"
              title={isCollapsed ? 'Expand Widget' : 'Collapse Widget'}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Widget Body */}
      {!isCollapsed && (
        <div className="p-4 sm:p-5 flex-1 flex flex-col animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}
