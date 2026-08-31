export const THEMES = [
  {
    id: 'midnight',
    name: 'Midnight Indigo',
    primary: '#6366f1',
    bg: '#0b0f19',
    card: '#121826',
    border: 'rgba(255, 255, 255, 0.08)'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    primary: '#fcee0a',
    bg: '#090a0f',
    card: '#141024',
    border: 'rgba(245, 223, 77, 0.2)'
  },
  {
    id: 'emerald',
    name: 'Emerald Forest',
    primary: '#10b981',
    bg: '#061814',
    card: '#08261e',
    border: 'rgba(52, 211, 153, 0.15)'
  },
  {
    id: 'sunset',
    name: 'Sunset Aurora',
    primary: '#f97316',
    bg: '#140b17',
    card: '#261026',
    border: 'rgba(244, 114, 182, 0.18)'
  },
  {
    id: 'synthwave',
    name: 'Synthwave 80s',
    primary: '#d946ef',
    bg: '#120726',
    card: '#200e42',
    border: 'rgba(217, 70, 239, 0.22)'
  },
  {
    id: 'nord',
    name: 'Nord Minimal',
    primary: '#88c0d0',
    bg: '#242933',
    card: '#2e3440',
    border: 'rgba(136, 192, 208, 0.18)'
  }
];

export const DEFAULT_WIDGET_CONFIGS = [
  { id: 'weather', name: 'Weather Forecast', category: 'General', enabled: true, colSpan: 'col-span-1 md:col-span-2 lg:col-span-2' },
  { id: 'todos', name: 'Task Planner', category: 'Productivity', enabled: true, colSpan: 'col-span-1 md:col-span-2 lg:col-span-2' },
  { id: 'pomodoro', name: 'Focus Pomodoro', category: 'Focus', enabled: true, colSpan: 'col-span-1 md:col-span-1 lg:col-span-1' },
  { id: 'habits', name: 'Habit Tracker', category: 'Productivity', enabled: true, colSpan: 'col-span-1 md:col-span-2 lg:col-span-2' },
  { id: 'quotes', name: 'Daily Wisdom', category: 'Mindset', enabled: true, colSpan: 'col-span-1 md:col-span-1 lg:col-span-1' },
  { id: 'quicklinks', name: 'Dev Quick Links', category: 'Tools', enabled: true, colSpan: 'col-span-1 md:col-span-2 lg:col-span-2' },
  { id: 'notes', name: 'Markdown Scratchpad', category: 'Tools', enabled: true, colSpan: 'col-span-1 md:col-span-2 lg:col-span-2' },
  { id: 'wellness', name: 'Mindful Wellness', category: 'Health', enabled: true, colSpan: 'col-span-1 md:col-span-1 lg:col-span-1' },
  { id: 'crypto', name: 'Market Watch', category: 'Finance', enabled: true, colSpan: 'col-span-1 md:col-span-1 lg:col-span-1' },
];
