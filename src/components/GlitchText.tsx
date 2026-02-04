import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchOnHover?: boolean;
  continuous?: boolean;
}

const GlitchText = ({ text, className, glitchOnHover = true, continuous = false }: GlitchTextProps) => {
  const [isGlitching, setIsGlitching] = useState(continuous);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (continuous) {
      const interval = setInterval(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [continuous]);

  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const getRandomChar = () => glitchChars[Math.floor(Math.random() * glitchChars.length)];

  const glitchedText = isGlitching
    ? text.split('').map((char, i) => 
        Math.random() > 0.7 ? getRandomChar() : char
      ).join('')
    : text;

  return (
    <motion.span
      ref={textRef}
      className={cn("relative inline-block", className)}
      onMouseEnter={() => glitchOnHover && setIsGlitching(true)}
      onMouseLeave={() => glitchOnHover && !continuous && setIsGlitching(false)}
      style={{ willChange: 'transform' }}
    >
      {/* Main text */}
      <span className="relative z-10">{glitchedText}</span>
      
      {/* Glitch layers */}
      {isGlitching && (
        <>
          <motion.span
            className="absolute inset-0 text-primary z-0"
            animate={{
              x: [0, -2, 3, -1, 0],
              opacity: [1, 0.8, 1, 0.9, 1],
            }}
            transition={{ duration: 0.1, repeat: Infinity }}
            style={{ clipPath: 'inset(0 0 50% 0)' }}
            aria-hidden
          >
            {text}
          </motion.span>
          <motion.span
            className="absolute inset-0 text-accent z-0"
            animate={{
              x: [0, 2, -3, 1, 0],
              opacity: [1, 0.9, 1, 0.8, 1],
            }}
            transition={{ duration: 0.1, repeat: Infinity }}
            style={{ clipPath: 'inset(50% 0 0 0)' }}
            aria-hidden
          >
            {text}
          </motion.span>
        </>
      )}
    </motion.span>
  );
};

export default GlitchText;
