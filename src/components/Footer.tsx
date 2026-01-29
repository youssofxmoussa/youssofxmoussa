import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const leftTextRef = useRef<HTMLParagraphElement>(null);
  const rightTextRef = useRef<HTMLParagraphElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (!footerRef.current) return;
    
    // Clear previous triggers
    triggersRef.current.forEach((t) => t.kill());
    triggersRef.current = [];

    // Simple fade-in animation that works on all devices
    const elements = [leftTextRef.current, rightTextRef.current].filter(Boolean);
    
    elements.forEach((el) => {
      if (el) {
        gsap.set(el, { opacity: 0, y: 20 });
      }
    });

    const footerTrigger = ScrollTrigger.create({
      trigger: footerRef.current,
      start: 'top 95%',
      onEnter: () => {
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        });
      },
      once: true,
    });
    triggersRef.current.push(footerTrigger);

    return () => {
      triggersRef.current.forEach((t) => t.kill());
    };
  }, []);

  return (
    <footer 
      ref={footerRef}
      className="py-8 sm:py-10 px-4 sm:px-6 md:px-12 border-t border-border/50"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <p 
          ref={leftTextRef}
          className="text-xs sm:text-sm text-muted-foreground font-light"
        >
          © 2026 Youssof Moussa. All rights reserved.
        </p>
        <p 
          ref={rightTextRef}
          className="text-xs sm:text-sm text-muted-foreground font-light"
        >
          Crafted with precision ✨
        </p>
      </div>
    </footer>
  );
};

export default Footer;