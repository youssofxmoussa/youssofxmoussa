import { useRef, ReactNode, forwardRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ children, className = '', onClick }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const actualRef = (ref as React.RefObject<HTMLButtonElement>) || buttonRef;

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!actualRef.current) return;
      
      const rect = actualRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(actualRef.current, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      if (!actualRef.current) return;
      
      gsap.to(actualRef.current, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    return (
      <motion.button
        ref={actualRef}
        className={`relative overflow-hidden group ${className}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
      >
        <span className="relative z-10">{children}</span>
        <motion.div
          className="absolute inset-0 bg-foreground/10"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ borderRadius: 'inherit' }}
        />
      </motion.button>
    );
  }
);

MagneticButton.displayName = 'MagneticButton';

export default MagneticButton;
