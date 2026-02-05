import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MorphingTextProps {
  words: string[];
  className?: string;
  interval?: number;
}

// Simplified - no flying animation, just fade between words
const MorphingText = ({ words, className, interval = 3000 }: MorphingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span className={cn("inline-block transition-opacity duration-300", className)}>
      {words[currentIndex]}
    </span>
  );
};

export default MorphingText;