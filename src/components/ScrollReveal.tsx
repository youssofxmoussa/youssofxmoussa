import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate' | 'blur' | 'split';
  delay?: number;
  duration?: number;
  className?: string;
}

const ScrollReveal = ({ 
  children, 
  animation = 'fadeUp', 
  delay = 0, 
  duration = 1, 
  className = '' 
}: ScrollRevealProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Kill previous trigger if exists
    if (triggerRef.current) {
      triggerRef.current.kill();
    }

    const animations: Record<string, gsap.TweenVars> = {
      fadeUp: { y: 80, opacity: 0 },
      fadeIn: { opacity: 0 },
      slideLeft: { x: -100, opacity: 0 },
      slideRight: { x: 100, opacity: 0 },
      scale: { scale: 0.8, opacity: 0 },
      rotate: { rotation: -10, y: 50, opacity: 0 },
      blur: { filter: 'blur(10px)', opacity: 0, y: 30 },
      split: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
    };

    const endStates: Record<string, gsap.TweenVars> = {
      fadeUp: { y: 0, opacity: 1 },
      fadeIn: { opacity: 1 },
      slideLeft: { x: 0, opacity: 1 },
      slideRight: { x: 0, opacity: 1 },
      scale: { scale: 1, opacity: 1 },
      rotate: { rotation: 0, y: 0, opacity: 1 },
      blur: { filter: 'blur(0px)', opacity: 1, y: 0 },
      split: { clipPath: 'inset(0 0% 0 0)', opacity: 1 },
    };

    const tween = gsap.fromTo(
      element,
      animations[animation],
      {
        ...endStates[animation],
        duration: duration,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    if (tween.scrollTrigger) {
      triggerRef.current = tween.scrollTrigger;
    }

    return () => {
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
      tween.kill();
    };
  }, [animation, delay, duration]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

export default ScrollReveal;