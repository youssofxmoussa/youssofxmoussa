import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MorphingTextProps {
  words: string[];
  className?: string;
  interval?: number;
}

const MorphingText = ({ words, className, interval = 3000 }: MorphingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 500);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  const currentWord = words[currentIndex];

  return (
    <span className={cn("relative inline-block overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          className="inline-flex"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {currentWord.split('').map((char, i) => (
            <motion.span
              key={`${currentIndex}-${i}`}
              className="inline-block"
              variants={{
                hidden: { 
                  y: 50, 
                  opacity: 0,
                  rotateX: -90,
                  filter: 'blur(10px)'
                },
                visible: { 
                  y: 0, 
                  opacity: 1,
                  rotateX: 0,
                  filter: 'blur(0px)'
                },
                exit: { 
                  y: -50, 
                  opacity: 0,
                  rotateX: 90,
                  filter: 'blur(10px)'
                }
              }}
              transition={{
                duration: 0.4,
                delay: i * 0.03,
                ease: [0.215, 0.61, 0.355, 1]
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
      
      {/* Underline animation */}
      <motion.span
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary"
        initial={{ scaleX: 0 }}
        animate={{ 
          scaleX: isAnimating ? 1 : 0,
          originX: isAnimating ? 0 : 1
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </span>
  );
};

export default MorphingText;
