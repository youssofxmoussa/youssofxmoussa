import { createContext, useContext, useState, ReactNode } from 'react';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface SoundContextType {
  playClick: () => void;
  playHover: () => void;
  playSuccess: () => void;
  playWhoosh: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const sounds = useSoundEffects({ enabled: soundEnabled, volume: 0.12 });

  const toggleSound = () => setSoundEnabled(prev => !prev);

  return (
    <SoundContext.Provider value={{ ...sounds, soundEnabled, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
