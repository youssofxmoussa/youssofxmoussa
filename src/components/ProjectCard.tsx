import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface ProjectCardProps {
  title: string;
  category: string;
  index: number;
  description: string;
}

const ProjectCard = ({ title, category, index, description }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || !glowRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = cardRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(glowRef.current, {
        x: x - 100,
        y: y - 100,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    cardRef.current.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      cardRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="group relative overflow-hidden rounded-2xl bg-card border border-border p-8 cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
    >
      {/* Glow effect */}
      <div
        ref={glowRef}
        className="absolute w-48 h-48 bg-primary/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      />

      {/* Card content */}
      <div className="relative z-10">
        <span className="text-primary text-sm font-medium tracking-wider uppercase">
          {category}
        </span>
        <h3 className="font-display text-2xl font-bold mt-2 mb-4 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
        
        {/* Arrow icon */}
        <div className="mt-6 flex items-center gap-2 text-primary">
          <span className="text-sm font-medium">View Project</span>
          <motion.svg 
            className="w-4 h-4"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </motion.svg>
        </div>
      </div>

      {/* Border gradient on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl border-2 border-primary/50" />
      </div>
    </motion.div>
  );
};

export default ProjectCard;
