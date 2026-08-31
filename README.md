# ✨ PerDash — Modular Personal Dashboard

> A high-performance, aesthetically pleasing, and modular personal productivity dashboard built with **React 18+**, **Vite**, **Tailwind CSS**, and **Lucide Icons**. 

![PerDash Banner](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🚀 Key Features

### 🎨 1. Glassmorphism Design & 6 Vibrant Themes
- **Midnight Indigo**: Dark mode with subtle indigo neon glows.
- **Cyberpunk Neon**: High-energy contrast with dark purple and neon yellow/cyan.
- **Emerald Forest**: Deep teal and lush natural emerald hues.
- **Sunset Aurora**: Warm dusk orange, magenta, and coral tones.
- **Synthwave 80s**: Retro neon pink, cyan, and violet aesthetics.
- **Nord Minimal**: Clean slate and frosty Scandinavian blue.

### 📦 2. Pluggable Feature Widgets
- 🌦️ **Live Weather Forecast**: Current conditions, 5-day daily forecast, hourly temperature preview, UV index, wind speed, humidity, city search, and `°C` / `°F` unit toggle.
- ✅ **Task Planner & Todos**: Categorized task management (`Dev`, `Work`, `Personal`, `Study`), priority flags (`High`, `Medium`, `Low`), subtasks, due dates, filters, progress analytics, and celebratory confetti.
- 🔥 **Habit Tracker**: 14-day GitHub-style contribution heatmap matrix, streak counters, daily check-ins, and category tracking.
- ⏱️ **Pomodoro Focus Timer**: Focus (25m), Short Break (5m), Long Break (15m), circular SVG progress ring, and **Web Audio API Procedural Ambient Soundscapes** (Rain, Ocean Waves, White Noise, 10Hz Alpha Binaural Tone).
- 💡 **Daily Wisdom & Quotes**: Curated inspirational quotes across Tech, Philosophy, Growth, and Mindfulness, with favorites collection and one-click copy.
- ⚡ **Dev Quick Links**: Speed dial bookmarks launcher + multi-engine developer search bar (Google, GitHub, MDN, StackOverflow).
- 📝 **Markdown Scratchpad**: Multi-tab note-taking scratchpad with real-time Markdown preview, word/character count, and auto-saving.
- 💧 **Mindful Wellness**: Daily 8-glass water hydration tracker + interactive guided 4-7-8 relaxing breathing animation circle.
- 📈 **Crypto & Market Watch**: Live cryptocurrency and tech stock ticker with mini SVG sparkline trend charts.

### ⚙️ 3. Command Palette & Data Backup
- **Command Palette (`Ctrl+K` / `⌘K`)**: Instant fuzzy search across actions, widget toggling, and theme switching.
- **Data Persistence & Backups**: LocalStorage backed state with one-click **Export Backup (JSON)** and **Import Restore (JSON)** in the Settings Drawer.

---

## 🛠️ Tech Stack

- **Frontend:** React 18+ (Vite SPA)
- **Styling:** Tailwind CSS + Custom CSS Variables
- **Icons:** `lucide-react`
- **Audio Engine:** Pure procedural Web Audio API Synthesizer (Zero audio file downloads needed)
- **Effects:** `canvas-confetti`
- **State Management:** Reactive Custom Hooks with `localStorage` synchronization

---

## 🏁 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 18+ recommended) installed on your system.

### 1. Clone the Repository
```bash
git clone https://github.com/eka1357/PerDashBoard.git
cd PerDashBoard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` (or the port displayed in your terminal).

### 4. Build for Production
To create an optimized production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| <kbd>⌘</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd> | Open Command Palette |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Navigate Command Palette results |
| <kbd>Enter</kbd> | Execute selected command |
| <kbd>Esc</kbd> | Close Modals / Command Palette |

---

## 📂 Project Structure

```text
PerDashBoard/
├── src/
│   ├── components/
│   │   ├── common/             # Navbar, ThemeSelector, CommandPalette, SettingsDrawer, WidgetCard, WidgetGrid
│   │   └── widgets/            # Modular feature widgets
│   │       ├── Weather/        # Weather forecast & city search
│   │       ├── Todos/          # Priority task planner
│   │       ├── Habits/         # Habit tracker with heatmap
│   │       ├── Pomodoro/       # Focus timer & ambient soundscape
│   │       ├── Quotes/         # Quotes & wisdom feed
│   │       ├── QuickLinks/     # Dev bookmarks & search launcher
│   │       ├── Notes/          # Markdown scratchpad
│   │       ├── Wellness/       # Hydration & breathing guide
│   │       └── CryptoTicker/   # Live market sparkline charts
│   ├── hooks/                  # useLocalStorage, useSoundscape, useKeyboardShortcut
│   ├── utils/                  # formatters, constants, storage backup/import
│   ├── App.jsx                 # Root application
│   ├── index.css               # Design system tokens & themes
│   └── main.jsx
├── AGENTS.md                   # Agentic spec & development contract
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
