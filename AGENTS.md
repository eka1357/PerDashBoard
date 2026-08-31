# AGENTS.md — Personal Dashboard Project Specification

## Project Overview
A modular, high-performance, and visually stunning personal dashboard built with **React 18+, Vite, Tailwind CSS, and Lucide Icons**. The architecture is explicitly optimized for agentic development ("vibe coding") in environments like Google Antigravity. It is designed to be cleanly modular so new widgets, theme packs, and utilities can be plugged in seamlessly without refactoring core components.

---

## Tech Stack & Architecture
- **Framework:** React 18+ (Vite SPA)
- **Styling:** Tailwind CSS + Custom CSS Variables for Glassmorphism & Themes
- **Icons:** `lucide-react`
- **Effects:** `canvas-confetti`, Custom Web Audio API Ambient Synthesizer
- **State/Persistence:** React Hooks backed by typed `localStorage` schema
- **Project Structure:**
  ```text
  src/
  ├── components/
  │   ├── common/             # Navbar, ThemeSelector, CommandPalette, SettingsDrawer, WidgetCard
  │   └── widgets/            # Self-contained feature modules
  │       ├── Weather/        # Live conditions, forecasts, city search
  │       ├── Todos/          # Priority tasks, subtasks, categories, progress
  │       ├── Habits/         # Habit tracker, streak calendar, completion heatmap
  │       ├── Pomodoro/       # Focus timer, break cycles, ambient soundscapes
  │       ├── Quotes/         # Wisdom feed, categories, favorites collection
  │       ├── QuickLinks/     # Dev speed dial, bookmark groups, search shortcuts
  │       ├── Notes/          # Markdown scratchpad, live preview, multi-note tabs
  │       ├── Wellness/       # Water tracker, interactive breathing guide
  │       └── CryptoTicker/   # Live market prices & sparkline charts
  ├── hooks/                  # Custom hooks (useLocalStorage, useSoundscape, useKeyboardShortcut)
  ├── types/                  # Data structures and contracts
  └── utils/                  # Formatters, storage export/import, default presets
  ```

---

## Widget Development Contract
Every widget must adhere to the following contract:
1. **Self-Contained State:** Use `useLocalStorage` with a unique key namespace (`perdash_widget_<name>`).
2. **Unified Container:** Wrap widget root in `<WidgetCard title="..." icon={...} badge={...} onRefresh={...} ...>`.
3. **No External Network Hard Dependencies:** Use graceful offline fallback mock data if public APIs (e.g., Open-Meteo, CoinGecko) are unreachable.
4. **Theme Awareness:** Use CSS variable tokens (`bg-card`, `text-primary`, `border-border`, `accent-glow`) for dynamic dark/light/neon/emerald/synthwave/nord theming.
5. **Accessibility & Responsiveness:** Clean keyboard navigation, ARIA attributes, mobile-to-desktop grid responsiveness.

---

## Development Milestones & Roadmap
- [x] **Milestone 1:** Project specification, architecture contract, and repository setup.
- [ ] **Milestone 2:** Vite + Tailwind CSS project initialization with glassmorphism design system.
- [ ] **Milestone 3:** Common layout, responsive Navbar, Theme Engine (6 presets), and Command Palette (Ctrl+K).
- [ ] **Milestone 4:** Custom state hooks (`useLocalStorage`, `useSoundscape`, `useKeyboardShortcut`) and Dynamic Widget Grid.
- [ ] **Milestone 5:** Weather widget with live forecast, city search, and animated conditions.
- [ ] **Milestone 6:** Todo & Task Planner widget with categories, priority flags, and confetti.
- [ ] **Milestone 7:** Habit Tracker widget with streak counters and contribution heatmap.
- [ ] **Milestone 8:** Pomodoro Focus Timer with circular progress ring and synthesized ambient sounds.
- [ ] **Milestone 9:** Daily Quotes & Wisdom widget with categories and favorites.
- [ ] **Milestone 10:** Dev QuickLinks hub and Markdown Scratchpad with live preview.
- [ ] **Milestone 11:** Wellness (Water & Breathing) tracker and Crypto Market ticker.
- [ ] **Milestone 12:** Settings drawer, JSON data backup & restore, and final UI polish.
