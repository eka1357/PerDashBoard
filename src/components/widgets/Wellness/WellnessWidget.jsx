import React, { useState, useEffect } from 'react';
import {
  Heart,
  Droplets,
  Wind,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  Play,
  Pause,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import WidgetCard from '../../common/WidgetCard';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

export default function WellnessWidget() {
  const [waterGlasses, setWaterGlasses] = useLocalStorage('perdash_water_glasses', 4);
  const [waterTarget] = useState(8);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale'); // Inhale (4s), Hold (7s), Exhale (8s)
  const [breathTimer, setBreathTimer] = useState(4);

  // 4-7-8 Breathing Technique Cycle
  useEffect(() => {
    let interval = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            if (breathPhase === 'Inhale') {
              setBreathPhase('Hold');
              return 7;
            } else if (breathPhase === 'Hold') {
              setBreathPhase('Exhale');
              return 8;
            } else {
              setBreathPhase('Inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathPhase('Inhale');
      setBreathTimer(4);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathPhase]);

  const handleAddWater = () => {
    const nextVal = Math.min(waterTarget + 4, waterGlasses + 1);
    setWaterGlasses(nextVal);
    if (nextVal === waterTarget) {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.8 },
        colors: ['#38bdf8', '#0ea5e9', '#6366f1']
      });
    }
  };

  const handleRemoveWater = () => {
    setWaterGlasses(Math.max(0, waterGlasses - 1));
  };

  const handleResetWater = () => {
    setWaterGlasses(0);
  };

  const progressPercent = Math.min(100, Math.round((waterGlasses / waterTarget) * 100));

  const getBreathCircleScale = () => {
    if (breathPhase === 'Inhale') return 'scale-125 duration-[4000ms]';
    if (breathPhase === 'Hold') return 'scale-125 duration-[7000ms]';
    return 'scale-90 duration-[8000ms]';
  };

  return (
    <WidgetCard
      id="wellness"
      title="Mindful Wellness"
      icon={Heart}
      badge={`${waterGlasses}/${waterTarget} Glasses (${progressPercent}%)`}
      badgeVariant={progressPercent >= 100 ? 'success' : 'primary'}
      actions={
        <button
          onClick={handleResetWater}
          className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-white/5 transition-colors"
          title="Reset Daily Water"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      }
    >
      {/* Water Intake Section */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs font-semibold text-theme-text-muted uppercase tracking-wider mb-2.5">
          <div className="flex items-center space-x-1.5 text-cyan-400">
            <Droplets className="w-3.5 h-3.5" />
            <span>Hydration Tracker</span>
          </div>
          <span className="font-mono text-white text-xs">{waterGlasses * 250} ml / {waterTarget * 250} ml</span>
        </div>

        {/* Glasses Visual Grid */}
        <div className="grid grid-cols-8 gap-1.5 mb-3">
          {Array.from({ length: waterTarget }).map((_, idx) => {
            const isFilled = idx < waterGlasses;
            return (
              <div
                key={idx}
                onClick={() => setWaterGlasses(idx + 1)}
                className={`h-9 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
                  isFilled
                    ? 'bg-gradient-to-t from-cyan-500 to-sky-400 border-cyan-400/50 text-white shadow-md shadow-cyan-500/20 scale-105'
                    : 'bg-white/5 border-white/10 text-white/20 hover:border-cyan-400/40 hover:bg-white/10'
                }`}
                title={`Glass ${idx + 1} (250ml)`}
              >
                <Droplets className={`w-3.5 h-3.5 ${isFilled ? 'fill-white' : ''}`} />
              </div>
            );
          })}
        </div>

        {/* Water Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRemoveWater}
              disabled={waterGlasses <= 0}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-theme-text-muted hover:text-white border border-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleAddWater}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 font-medium text-xs flex items-center space-x-1.5 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Drink 250ml</span>
            </button>
          </div>
          {progressPercent >= 100 && (
            <span className="text-[11px] font-bold text-theme-success flex items-center space-x-1">
              <Award className="w-3.5 h-3.5" />
              <span>Goal Met!</span>
            </span>
          )}
        </div>
      </div>

      {/* 4-7-8 Breathing Guide Section */}
      <div className="pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-xs font-semibold text-theme-text-muted uppercase tracking-wider mb-3">
          <div className="flex items-center space-x-1.5 text-theme-accent">
            <Wind className="w-3.5 h-3.5" />
            <span>4-7-8 Mindful Breath</span>
          </div>
          <button
            onClick={() => setIsBreathingActive(!isBreathingActive)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all ${
              isBreathingActive
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-theme-primary/20 text-theme-primary border border-theme-primary/30'
            }`}
          >
            {isBreathingActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
            <span>{isBreathingActive ? 'Stop' : 'Start'}</span>
          </button>
        </div>

        {/* Breathing Visual Circle */}
        <div className="relative py-4 flex flex-col items-center justify-center">
          <div
            className={`w-24 h-24 rounded-full border-2 border-theme-primary/40 bg-gradient-to-tr from-theme-primary/20 to-theme-accent/20 flex flex-col items-center justify-center shadow-lg shadow-theme-primary-glow transition-transform ease-in-out ${
              isBreathingActive ? getBreathCircleScale() : 'scale-100'
            }`}
          >
            <span className="text-xs font-extrabold uppercase tracking-widest text-white">
              {isBreathingActive ? breathPhase : 'Relax'}
            </span>
            {isBreathingActive && (
              <span className="text-lg font-mono font-bold text-theme-accent">
                {breathTimer}s
              </span>
            )}
          </div>
          <p className="text-[11px] text-theme-text-muted mt-3 text-center">
            {isBreathingActive
              ? `${breathPhase} smoothly for ${breathTimer} more seconds...`
              : 'Tap Start for a 4-7-8 relaxing breathing reset.'}
          </p>
        </div>
      </div>
    </WidgetCard>
  );
}
