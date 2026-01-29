import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface MarqueeProps {
  items: string[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  separator?: string;
}

const Marquee = ({ 
  items, 
  speed = 50, 
  direction = 'left', 
  className = '',
  separator = '•'
}: MarqueeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current || !containerRef.current) return;

    const track = trackRef.current;
    const trackWidth = track.scrollWidth / 2;
    
    gsap.set(track, { x: direction === 'left' ? 0 : -trackWidth });

    const animation = gsap.to(track, {
      x: direction === 'left' ? -trackWidth : 0,
      duration: trackWidth / speed,
      ease: 'none',
      repeat: -1,
    });

    const handleMouseEnter = () => {
      gsap.to(animation, { timeScale: 0.3, duration: 0.5 });
    };

    const handleMouseLeave = () => {
      gsap.to(animation, { timeScale: 1, duration: 0.5 });
    };

    const container = containerRef.current;
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      animation.kill();
      container?.removeEventListener('mouseenter', handleMouseEnter);
      container?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [items, speed, direction]);

  const content = items.map((item, i) => (
    <span key={i} className="flex items-center whitespace-nowrap">
      <span className="mx-3 sm:mx-6 md:mx-8">{item}</span>
      <span className="text-primary mx-3 sm:mx-6 md:mx-8">{separator}</span>
    </span>
  ));

  return (
    <div 
      ref={containerRef}
      className={`overflow-hidden ${className}`}
    >
      <div ref={trackRef} className="flex">
        {content}
        {content}
      </div>
    </div>
  );
};

export default Marquee;
