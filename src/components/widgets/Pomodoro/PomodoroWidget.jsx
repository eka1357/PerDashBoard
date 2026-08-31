import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  CloudRain,
  Waves,
  Wind,
  Radio,
  Flame,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import WidgetCard from '../../common/WidgetCard';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { useSoundscape } from '../../../hooks/useSoundscape';

const MODES = {
  focus: { label: 'Focus', defaultMinutes: 25, color: '#6366f1' },
  shortBreak: { label: 'Short Break', defaultMinutes: 5, color: '#10b981' },
  longBreak: { label: 'Long Break', defaultMinutes: 15, color: '#38bdf8' }
};

export default function PomodoroWidget() {
  const [mode, setMode] = useState('focus');
  const [customDurations, setCustomDurations] = useLocalStorage('perdash_pomo_durations', {
    focus: 25,
    shortBreak: 5,
    longBreak: 15
  });
  const [timeLeft, setTimeLeft] = useState(customDurations.focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useLocalStorage('perdash_pomo_sessions', 0);
  const [totalFocusMinutes, setTotalFocusMinutes] = useLocalStorage('perdash_pomo_total_mins', 0);

  const {
    isPlaying: isSoundPlaying,
    activePreset,
    volume,
    togglePlay: toggleSound,
    setPreset: setSoundPreset,
    updateVolume: setSoundVolume
  } = useSoundscape();

  const totalDuration = (customDurations[mode] || 25) * 60;
  const progressPercent = Math.max(0, Math.min(100, ((totalDuration - timeLeft) / totalDuration) * 100));

  // Timer Tick Interval
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      // Play celebratory finish chime using Web Audio
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } catch (e) {}

      if (mode === 'focus') {
        setCompletedSessions((prev) => prev + 1);
        setTotalFocusMinutes((prev) => prev + customDurations.focus);
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#6366f1', '#10b981', '#f59e0b']
        });
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, customDurations, setCompletedSessions, setTotalFocusMinutes]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft((customDurations[newMode] || 25) * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft((customDurations[mode] || 25) * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // SVG Circular progress params
  const strokeWidth = 8;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const soundPresets = [
    { id: 'rain', name: 'Rain', icon: CloudRain },
    { id: 'waves', name: 'Ocean', icon: Waves },
    { id: 'whitenoise', name: 'White Noise', icon: Wind },
    { id: 'alpha', name: 'Alpha 10Hz', icon: Radio },
  ];

  return (
    <WidgetCard
      id="pomodoro"
      title="Focus Timer"
      icon={Timer}
      badge={`${completedSessions} Sessions • ${totalFocusMinutes}m`}
      badgeVariant="primary"
    >
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between p-1 rounded-2xl bg-white/5 border border-white/5 mb-5 text-xs">
        {Object.entries(MODES).map(([key, config]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`flex-1 py-1.5 rounded-xl font-medium transition-all ${
              mode === key
                ? 'bg-theme-primary text-white shadow-sm'
                : 'text-theme-text-muted hover:text-theme-text'
            }`}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Circular Progress Display */}
      <div className="flex flex-col items-center justify-center my-2 relative">
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background Ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-white/5"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="var(--color-primary)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500"
              style={{
                filter: 'drop-shadow(0 0 6px var(--color-primary-glow))'
              }}
            />
          </svg>

          {/* Time and Status Label inside circle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-white">
              {timeFormatted}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-theme-text-muted mt-0.5">
              {isRunning ? 'Session Active' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3 mt-4">
          <button
            onClick={handleReset}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-theme-text-muted hover:text-theme-text border border-white/5 transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-theme-primary to-theme-secondary text-white font-bold text-sm shadow-lg shadow-theme-primary-glow hover:scale-105 transition-all flex items-center space-x-2"
          >
            {isRunning ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
          </button>

          <button
            onClick={() => {
              const modesList = ['focus', 'shortBreak', 'longBreak'];
              const nextMode = modesList[(modesList.indexOf(mode) + 1) % modesList.length];
              switchMode(nextMode);
            }}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-theme-text-muted hover:text-theme-text border border-white/5 transition-all"
            title="Skip to next stage"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Ambient Soundscapes Synthesizer Panel */}
      <div className="mt-5 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-theme-text-muted flex items-center space-x-1.5">
            <span>Ambient Soundscapes</span>
            {isSoundPlaying && (
              <span className="inline-block w-2 h-2 rounded-full bg-theme-success animate-ping" />
            )}
          </div>
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-xl border transition-all ${
              isSoundPlaying
                ? 'bg-theme-primary/20 text-theme-primary border-theme-primary/40'
                : 'bg-white/5 text-theme-text-muted border-white/10 hover:text-theme-text'
            }`}
            title={isSoundPlaying ? 'Mute ambient sound' : 'Play ambient sound'}
          >
            {isSoundPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Sound preset pills */}
        <div className="grid grid-cols-4 gap-1.5">
          {soundPresets.map((snd) => {
            const SndIcon = snd.icon;
            const isActive = activePreset === snd.id;
            return (
              <button
                key={snd.id}
                onClick={() => {
                  setSoundPreset(snd.id);
                  if (!isSoundPlaying) toggleSound();
                }}
                className={`p-2 rounded-xl text-center flex flex-col items-center justify-center border transition-all ${
                  isActive && isSoundPlaying
                    ? 'bg-theme-primary text-white border-theme-primary shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-theme-text-muted hover:text-theme-text border-white/5'
                }`}
              >
                <SndIcon className="w-3.5 h-3.5 mb-1" />
                <span className="text-[10px] font-medium truncate w-full">{snd.name}</span>
              </button>
            );
          })}
        </div>

        {/* Volume slider */}
        {isSoundPlaying && (
          <div className="mt-3 flex items-center space-x-2 px-1">
            <Volume2 className="w-3 h-3 text-theme-text-muted flex-shrink-0" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-theme-primary"
            />
            <span className="text-[10px] font-mono text-theme-text-muted flex-shrink-0">
              {Math.round(volume * 100)}%
            </span>
          </div>
        )}
      </div>
    </WidgetCard>
  );
}
