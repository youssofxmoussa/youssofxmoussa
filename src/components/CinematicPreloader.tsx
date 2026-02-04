import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

interface CinematicPreloaderProps {
  onComplete: () => void;
}

const CinematicPreloader = ({ onComplete }: CinematicPreloaderProps) => {
  const [phase, setPhase] = useState<'loading' | 'reveal' | 'exit'>('loading');
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  const name = "YOUSSOF";
  const surname = "MOUSSA";

  useEffect(() => {
    // Counter animation
    const counter = { value: 0 };
    gsap.to(counter, {
      value: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.floor(counter.value).toString().padStart(3, '0');
        }
      },
      onComplete: () => setPhase('reveal')
    });

    // Line animation
    if (lineRef.current) {
      gsap.fromTo(lineRef.current, 
        { scaleX: 0 },
        { scaleX: 1, duration: 2.5, ease: "power2.inOut" }
      );
    }
  }, []);

  useEffect(() => {
    if (phase === 'reveal') {
      // Explosive letter reveal
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(() => setPhase('exit'), 800);
        }
      });

      // First, scale up the letters dramatically
      tl.to(lettersRef.current, {
        y: 0,
        rotateX: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.8,
        ease: "back.out(1.7)",
      });

      // Add glitch effect
      tl.to(lettersRef.current, {
        x: () => gsap.utils.random(-5, 5),
        duration: 0.1,
        repeat: 3,
        yoyo: true,
        ease: "none",
      }, "-=0.3");

      // Create particle explosion
      if (particlesRef.current) {
        for (let i = 0; i < 50; i++) {
          const particle = document.createElement('div');
          particle.className = 'absolute w-1 h-1 rounded-full bg-primary';
          particle.style.left = '50%';
          particle.style.top = '50%';
          particlesRef.current.appendChild(particle);

          gsap.to(particle, {
            x: gsap.utils.random(-400, 400),
            y: gsap.utils.random(-400, 400),
            opacity: 0,
            scale: gsap.utils.random(0.5, 2),
            duration: gsap.utils.random(1, 2),
            ease: "power2.out",
            onComplete: () => particle.remove()
          });
        }
      }
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'exit') {
      const tl = gsap.timeline({
        onComplete: onComplete
      });

      // Split reveal - dramatic curtain effect
      tl.to('.preloader-top', {
        yPercent: -100,
        duration: 1,
        ease: "power4.inOut",
      });
      tl.to('.preloader-bottom', {
        yPercent: 100,
        duration: 1,
        ease: "power4.inOut",
      }, "<");
      tl.to('.preloader-content', {
        scale: 1.5,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      }, "<");
    }
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        className="fixed inset-0 z-[9999] overflow-hidden"
        initial={{ opacity: 1 }}
      >
        {/* Split background */}
        <div className="preloader-top absolute inset-x-0 top-0 h-1/2 bg-background" />
        <div className="preloader-bottom absolute inset-x-0 bottom-0 h-1/2 bg-background" />
        
        {/* Center line */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px flex items-center justify-center overflow-hidden">
          <div 
            ref={lineRef}
            className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-primary to-transparent origin-center"
          />
        </div>

        {/* Main content */}
        <div className="preloader-content absolute inset-0 flex flex-col items-center justify-center">
          {/* Counter */}
          <motion.div 
            className="absolute top-8 right-8 font-mono text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span ref={counterRef} className="text-4xl font-bold text-foreground">000</span>
            <span className="text-muted-foreground">%</span>
          </motion.div>

          {/* Particle container */}
          <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />

          {/* Name reveal */}
          <div className="relative">
            {/* First name */}
            <div className="overflow-hidden">
              <div className="flex">
                {name.split('').map((letter, i) => (
                  <span
                    key={`name-${i}`}
                    ref={el => { if (el) lettersRef.current[i] = el; }}
                    className="font-display text-6xl sm:text-8xl md:text-9xl font-bold text-foreground inline-block"
                    style={{
                      transform: 'translateY(100%) rotateX(-90deg)',
                      opacity: 0,
                      transformOrigin: 'center bottom',
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </div>

            {/* Surname with gradient */}
            <div className="overflow-hidden">
              <div className="flex justify-center">
                {surname.split('').map((letter, i) => (
                  <span
                    key={`surname-${i}`}
                    ref={el => { if (el) lettersRef.current[name.length + i] = el; }}
                    className="font-display text-6xl sm:text-8xl md:text-9xl font-bold text-gradient inline-block"
                    style={{
                      transform: 'translateY(100%) rotateX(-90deg)',
                      opacity: 0,
                      transformOrigin: 'center bottom',
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Loading text */}
          {phase === 'loading' && (
            <motion.p
              className="absolute bottom-12 text-sm tracking-[0.5em] text-muted-foreground uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading Experience
            </motion.p>
          )}

          {/* Decorative corners */}
          <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/30" />
          <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-primary/30" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-primary/30" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary/30" />

          {/* Scanlines effect */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--foreground)) 2px, hsl(var(--foreground)) 4px)',
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CinematicPreloader;
