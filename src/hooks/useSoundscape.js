import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Web Audio API procedural synthesizer for ambient soundscapes:
 * - Rain (filtered noise with random droplet impulse modulations)
 * - Ocean Waves (brownian low-pass noise with rhythmic LFO swell)
 * - White / Pink Focus Noise
 * - Alpha Binaural Tone (calming focus beat)
 */
export function useSoundscape() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePreset, setActivePreset] = useState('rain'); // 'rain', 'waves', 'whitenoise', 'alpha'
  const [volume, setVolume] = useState(0.5);

  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const activeNodesRef = useRef([]);

  const getOrCreateAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const stopAudioNodes = useCallback(() => {
    activeNodesRef.current.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // node already stopped
      }
    });
    activeNodesRef.current = [];
  }, []);

  const createNoiseBuffer = (ctx, type = 'pink') => {
    const bufferSize = ctx.sampleRate * 2; // 2 seconds loop
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Gain compensation
      }
    } else {
      // White noise
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.2;
      }
    }
    return buffer;
  };

  const startSound = useCallback((presetName = activePreset) => {
    try {
      const ctx = getOrCreateAudioContext();
      stopAudioNodes();

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      if (presetName === 'rain') {
        const noiseBuffer = createNoiseBuffer(ctx, 'pink');
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);

        noiseSource.connect(filter);
        filter.connect(masterGain);
        noiseSource.start();

        activeNodesRef.current.push(noiseSource, filter, masterGain);
      } else if (presetName === 'waves') {
        const noiseBuffer = createNoiseBuffer(ctx, 'brown');
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, ctx.currentTime);

        // LFO for rhythmic swells
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8 sec period

        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(250, ctx.currentTime);
        lfo.connect(filter.frequency);

        noiseSource.connect(filter);
        filter.connect(masterGain);

        noiseSource.start();
        lfo.start();

        activeNodesRef.current.push(noiseSource, filter, lfo, lfoGain, masterGain);
      } else if (presetName === 'alpha') {
        // Binaural 432Hz + 442Hz = 10Hz Alpha Brainwave
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(432, ctx.currentTime);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(442, ctx.currentTime);

        osc1.connect(merger, 0, 0);
        osc2.connect(merger, 0, 1);
        merger.connect(masterGain);

        osc1.start();
        osc2.start();

        activeNodesRef.current.push(osc1, osc2, merger, masterGain);
      } else {
        // Pure Focus White Noise
        const noiseBuffer = createNoiseBuffer(ctx, 'white');
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;

        noiseSource.connect(masterGain);
        noiseSource.start();

        activeNodesRef.current.push(noiseSource, masterGain);
      }

      setIsPlaying(true);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }, [activePreset, volume, stopAudioNodes]);

  const togglePlay = () => {
    if (isPlaying) {
      stopAudioNodes();
      setIsPlaying(false);
    } else {
      startSound(activePreset);
    }
  };

  const setPreset = (preset) => {
    setActivePreset(preset);
    if (isPlaying) {
      startSound(preset);
    }
  };

  const updateVolume = (newVol) => {
    setVolume(newVol);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVol, audioCtxRef.current.currentTime);
    }
  };

  useEffect(() => {
    return () => {
      stopAudioNodes();
    };
  }, [stopAudioNodes]);

  return {
    isPlaying,
    activePreset,
    volume,
    togglePlay,
    setPreset,
    updateVolume,
    presets: [
      { id: 'rain', name: 'Rainfall', icon: 'CloudRain' },
      { id: 'waves', name: 'Ocean Waves', icon: 'Waves' },
      { id: 'whitenoise', name: 'White Noise', icon: 'Wind' },
      { id: 'alpha', name: '10Hz Alpha Tone', icon: 'Radio' },
    ]
  };
}
