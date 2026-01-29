import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  text: string;
  className?: string;
}

const TextReveal = ({ text, className = '' }: TextRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous triggers
    triggersRef.current.forEach((t) => t.kill());
    triggersRef.current = [];

    wordsRef.current.forEach((word) => {
      if (!word) return;

      const tween = gsap.fromTo(
        word,
        { opacity: 0.1 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: word,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
          },
        }
      );
      
      if (tween.scrollTrigger) {
        triggersRef.current.push(tween.scrollTrigger);
      }
    });

    return () => {
      // Only kill our own triggers, not all of them
      triggersRef.current.forEach((t) => t.kill());
    };
  }, [text]);

  const words = text.split(' ');

  return (
    <div ref={containerRef} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          ref={(el) => (wordsRef.current[i] = el)}
          className="mr-[0.25em] inline-block"
        >
          {word}
        </span>
      ))}
    </div>
  );
};

export default TextReveal;