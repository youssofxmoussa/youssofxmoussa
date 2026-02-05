import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollRevealSectionProps {
  children: React.ReactNode;
  className?: string;
  effect?: 'split' | 'zoom' | 'glitch' | 'curtain';
}

// Simplified - lightweight fade-in only for performance
const ScrollRevealSection = ({ 
  children, 
  className
}: ScrollRevealSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollRevealSection;