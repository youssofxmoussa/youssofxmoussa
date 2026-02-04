import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSound } from '@/contexts/SoundContext';

interface MagneticWrapperProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
}

const MagneticWrapper = ({ 
  children, 
  className, 
  strength = 0.3,
  radius = 200 
}: MagneticWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const { playHover } = useSound();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance < radius) {
      const force = (radius - distance) / radius;
      setPosition({
        x: deltaX * strength * force,
        y: deltaY * strength * force
      });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playHover();
  };

  return (
    <motion.div
      ref={ref}
      className={cn("relative inline-block", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      animate={{
        x: position.x,
        y: position.y,
        scale: isHovered ? 1.05 : 1
      }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 15,
        mass: 0.5
      }}
    >
      {children}
      
      {/* Glow effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 -z-10 rounded-inherit"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.2 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            background: 'radial-gradient(circle, hsla(var(--primary), 0.3) 0%, transparent 70%)',
            filter: 'blur(20px)'
          }}
        />
      )}
    </motion.div>
  );
};

export default MagneticWrapper;
