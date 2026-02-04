import { useCallback, useRef } from 'react';

// Audio context singleton to avoid creating multiple contexts
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

interface SoundEffectsOptions {
  enabled?: boolean;
  volume?: number;
}

export const useSoundEffects = (options: SoundEffectsOptions = {}) => {
  const { enabled = true, volume = 0.15 } = options;
  const lastPlayTime = useRef<number>(0);
  const minInterval = 50; // Minimum ms between sounds to prevent spam

  // Subtle click sound - short, crisp
  const playClick = useCallback(() => {
    if (!enabled) return;
    
    const now = Date.now();
    if (now - lastPlayTime.current < minInterval) return;
    lastPlayTime.current = now;

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // Silently fail if audio context isn't available
    }
  }, [enabled, volume]);

  // Subtle hover sound - very soft, high frequency
  const playHover = useCallback(() => {
    if (!enabled) return;
    
    const now = Date.now();
    if (now - lastPlayTime.current < minInterval) return;
    lastPlayTime.current = now;

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.03);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Silently fail
    }
  }, [enabled, volume]);

  // Success sound - ascending tones
  const playSuccess = useCallback(() => {
    if (!enabled) return;

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      [600, 800, 1000].forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        const startTime = ctx.currentTime + i * 0.08;
        oscillator.frequency.setValueAtTime(freq, startTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(volume * 0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.1);
      });
    } catch (e) {
      // Silently fail
    }
  }, [enabled, volume]);

  // Whoosh sound - for transitions
  const playWhoosh = useCallback(() => {
    if (!enabled) return;

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // White noise for whoosh effect
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      
      const noise = ctx.createBufferSource();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      noise.buffer = buffer;
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.15);
      
      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      gainNode.gain.setValueAtTime(volume * 0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      
      noise.start(ctx.currentTime);
      noise.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // Silently fail
    }
  }, [enabled, volume]);

  return { playClick, playHover, playSuccess, playWhoosh };
};

export default useSoundEffects;
