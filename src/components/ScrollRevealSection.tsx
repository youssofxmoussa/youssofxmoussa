import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealSectionProps {
  children: React.ReactNode;
  className?: string;
  effect?: 'split' | 'zoom' | 'glitch' | 'curtain';
}

const ScrollRevealSection = ({ 
  children, 
  className,
  effect = 'split' 
}: ScrollRevealSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Different effects based on prop
  const y = useTransform(smoothProgress, [0, 0.5], [100, 0]);
  const opacity = useTransform(smoothProgress, [0, 0.3], [0, 1]);
  const scale = useTransform(smoothProgress, [0, 0.5], [0.8, 1]);
  const rotateX = useTransform(smoothProgress, [0, 0.5], [15, 0]);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    if (effect === 'glitch') {
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 80%",
        onEnter: () => {
          // Glitch reveal animation
          gsap.fromTo(contentRef.current, 
            { 
              opacity: 0,
              skewX: 10,
              x: -50
            },
            {
              opacity: 1,
              skewX: 0,
              x: 0,
              duration: 0.6,
              ease: "power3.out",
              onStart: () => {
                // Quick glitch flickers
                const tl = gsap.timeline();
                tl.to(contentRef.current, { x: 10, duration: 0.05 })
                  .to(contentRef.current, { x: -5, duration: 0.05 })
                  .to(contentRef.current, { x: 3, duration: 0.05 })
                  .to(contentRef.current, { x: 0, duration: 0.05 });
              }
            }
          );
        },
        once: true
      });

      return () => trigger.kill();
    }

    if (effect === 'curtain') {
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 70%",
        onEnter: () => {
          gsap.fromTo(contentRef.current,
            {
              clipPath: "inset(100% 0 0 0)"
            },
            {
              clipPath: "inset(0% 0 0 0)",
              duration: 1,
              ease: "power4.inOut"
            }
          );
        },
        once: true
      });

      return () => trigger.kill();
    }
  }, [effect]);

  if (effect === 'split') {
    return (
      <motion.div
        ref={containerRef}
        className={cn("relative", className)}
        style={{
          y,
          opacity,
          perspective: 1000
        }}
      >
        <motion.div
          ref={contentRef}
          style={{
            rotateX,
            transformOrigin: "center bottom"
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }

  if (effect === 'zoom') {
    return (
      <motion.div
        ref={containerRef}
        className={cn("relative overflow-hidden", className)}
        style={{ opacity }}
      >
        <motion.div
          ref={contentRef}
          style={{ scale }}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }

  // Default for glitch and curtain (GSAP handles animation)
  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
};

export default ScrollRevealSection;
