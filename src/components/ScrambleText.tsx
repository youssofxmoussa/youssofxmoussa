import { useEffect, useState, useRef } from 'react';

interface ScrambleTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

const ScrambleText = ({ text, className = '', delay = 0, speed = 50 }: ScrambleTextProps) => {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  const intervalRef = useRef<NodeJS.Timeout>();

  const scramble = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    let iteration = 0;
    
    clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      
      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
        setIsAnimating(false);
      }
      
      iteration += 1/3;
    }, speed);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      scramble();
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <span 
      className={`font-mono ${className}`}
      onMouseEnter={scramble}
    >
      {displayText}
    </span>
  );
};

export default ScrambleText;
