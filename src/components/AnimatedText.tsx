import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  animation?: 'fadeUp' | 'fadeIn' | 'scramble' | 'reveal' | 'bounce';
}

const AnimatedText = ({ 
  text, 
  className = '', 
  delay = 0, 
  stagger = 0.03,
  animation = 'fadeUp' 
}: AnimatedTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll('.char');
    
    gsap.set(chars, { opacity: 0 });

    const animations = {
      fadeUp: {
        y: 50,
        opacity: 0,
        rotationX: -90,
      },
      fadeIn: {
        opacity: 0,
        scale: 0.5,
      },
      scramble: {
        opacity: 0,
        x: () => gsap.utils.random(-50, 50),
        y: () => gsap.utils.random(-50, 50),
        rotation: () => gsap.utils.random(-180, 180),
      },
      reveal: {
        opacity: 0,
        y: 100,
        skewY: 7,
      },
      bounce: {
        opacity: 0,
        y: -100,
        scale: 0,
      }
    };

    gsap.fromTo(chars, animations[animation], {
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      rotation: 0,
      rotationX: 0,
      skewY: 0,
      duration: 0.8,
      stagger: stagger,
      delay: delay,
      ease: 'back.out(1.7)',
    });
  }, [text, delay, stagger, animation]);

  const words = text.split(' ');

  return (
    <div ref={containerRef} className={`inline-block ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-[0.25em]">
          {word.split('').map((char, charIndex) => (
            <span
              key={charIndex}
              className="char inline-block"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
};

export default AnimatedText;
