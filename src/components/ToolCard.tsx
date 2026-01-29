import { motion } from 'framer-motion';
import { useRef } from 'react';
import { gsap } from 'gsap';

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const ToolCard = ({ icon, title, description, index }: ToolCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!iconRef.current) return;
    
    gsap.to(iconRef.current, {
      rotation: 360,
      scale: 1.2,
      duration: 0.6,
      ease: 'back.out(1.7)',
    });
  };

  const handleMouseLeave = () => {
    if (!iconRef.current) return;
    
    gsap.to(iconRef.current, {
      rotation: 0,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative p-6 rounded-2xl bg-gradient-to-br from-card to-secondary/30 border border-border overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div 
          ref={iconRef}
          className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center text-foreground mb-4"
        >
          {icon}
        </div>
        <h3 className="font-display text-lg font-bold mb-2 group-hover:text-foreground transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {/* Animated border */}
      <motion.div 
        className="absolute bottom-0 left-0 h-1 bg-foreground"
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default ToolCard;
