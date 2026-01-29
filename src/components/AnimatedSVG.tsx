import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedSVG = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const circlesRef = useRef<SVGGElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (!svgRef.current || !pathRef.current) return;

    // Clear previous triggers
    triggersRef.current.forEach((t) => t.kill());
    triggersRef.current = [];

    const path = pathRef.current;
    const length = path.getTotalLength();

    // Set initial state for path drawing
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    // Animate path drawing on scroll
    const pathTween = gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: svgRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
      },
    });
    
    if (pathTween.scrollTrigger) {
      triggersRef.current.push(pathTween.scrollTrigger);
    }

    // Animate circles
    if (circlesRef.current) {
      const circles = circlesRef.current.querySelectorAll('circle');
      circles.forEach((circle, i) => {
        const circleTween = gsap.fromTo(
          circle,
          { scale: 0, opacity: 0, transformOrigin: 'center' },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
              trigger: svgRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
        
        if (circleTween.scrollTrigger) {
          triggersRef.current.push(circleTween.scrollTrigger);
        }
      });
    }

    return () => {
      // Only kill our own triggers
      triggersRef.current.forEach((t) => t.kill());
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
      viewBox="0 0 1200 800"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Animated flowing path */}
      <path
        ref={pathRef}
        d="M-50 400 Q150 200 300 400 T600 400 T900 400 T1250 400"
        stroke="hsl(var(--foreground))"
        strokeWidth="1"
        fill="none"
        className="drop-shadow-lg"
        opacity="0.3"
      />
      
      {/* Decorative circles */}
      <g ref={circlesRef}>
        <circle cx="150" cy="350" r="80" stroke="hsl(var(--foreground))" strokeWidth="0.5" fill="none" opacity="0.2" />
        <circle cx="450" cy="450" r="120" stroke="hsl(var(--foreground))" strokeWidth="0.5" fill="none" opacity="0.2" />
        <circle cx="800" cy="300" r="100" stroke="hsl(var(--foreground))" strokeWidth="0.5" fill="none" opacity="0.2" />
        <circle cx="1050" cy="400" r="60" stroke="hsl(var(--foreground))" strokeWidth="0.5" fill="none" opacity="0.2" />
      </g>

      {/* Grid lines */}
      {[...Array(12)].map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 100}
          y1="0"
          x2={i * 100}
          y2="800"
          stroke="hsl(var(--foreground))"
          strokeWidth="0.2"
          opacity="0.1"
        />
      ))}
      {[...Array(8)].map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * 100}
          x2="1200"
          y2={i * 100}
          stroke="hsl(var(--foreground))"
          strokeWidth="0.2"
          opacity="0.1"
        />
      ))}
    </svg>
  );
};

export default AnimatedSVG;