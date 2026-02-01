import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Layers, Cpu, Zap, Target, Sparkles } from 'lucide-react';
import ParallaxCards from '@/components/ui/parallaxcards';
import MagneticButton from '@/components/MagneticButton';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    Icon: Code2,
    title: 'Clean Code',
    description: 'Writing maintainable, scalable code that stands the test of time.',
    lightBg: 'bg-foreground text-background',
    darkBg: '',
  },
  {
    Icon: Layers,
    title: 'Modern Stack',
    description: 'Using cutting-edge technologies to build future-proof applications.',
    lightBg: 'bg-background text-foreground',
    darkBg: '',
  },
  {
    Icon: Cpu,
    title: 'Performance',
    description: 'Optimizing every millisecond for blazing fast experiences.',
    lightBg: 'bg-foreground text-background',
    darkBg: '',
  },
  {
    Icon: Zap,
    title: 'Animations',
    description: 'Creating smooth, delightful interactions that users love.',
    lightBg: 'bg-background text-foreground',
    darkBg: '',
  },
  {
    Icon: Target,
    title: 'Pixel Perfect',
    description: 'Attention to detail that makes designs come to life.',
    lightBg: 'bg-foreground text-background',
    darkBg: '',
  },
  {
    Icon: Sparkles,
    title: 'Innovation',
    description: 'Pushing boundaries with creative solutions.',
    lightBg: 'bg-background text-foreground',
    darkBg: '',
  },
];

// Desktop Grid Card Component
const DesktopCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isLight = index % 2 === 0;

  useEffect(() => {
    if (!cardRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = cardRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / 20;
      const y = (e.clientY - rect.top - rect.height / 2) / 20;
      
      gsap.to(cardRef.current, {
        rotateY: x,
        rotateX: -y,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(cardRef.current, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    cardRef.current.addEventListener('mousemove', handleMouseMove);
    cardRef.current.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (cardRef.current) {
        cardRef.current.removeEventListener('mousemove', handleMouseMove);
        cardRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group cursor-pointer"
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
    >
      <div
        className={cn(
          "relative h-[320px] lg:h-[380px] rounded-2xl border overflow-hidden transition-all duration-500",
          isLight 
            ? "bg-foreground text-background border-foreground/20 hover:border-foreground/40" 
            : "bg-card text-foreground border-border hover:border-primary/50"
        )}
      >
        {/* Number watermark */}
        <div className={cn(
          "absolute top-6 left-6 text-7xl font-display font-bold transition-colors",
          isLight ? "text-background/10 group-hover:text-background/20" : "text-foreground/10 group-hover:text-foreground/20"
        )}>
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110",
            isLight ? "bg-background/10 border border-background/20" : "bg-primary/10 border border-primary/20"
          )}>
            <feature.Icon className="w-8 h-8" />
          </div>
          
          <h3 className="font-display text-2xl lg:text-3xl font-bold mb-3">
            {feature.title}
          </h3>
          
          <p className={cn(
            "text-sm lg:text-base leading-relaxed max-w-xs",
            isLight ? "text-background/70" : "text-muted-foreground"
          )}>
            {feature.description}
          </p>

          {/* Hover arrow */}
          <div className={cn(
            "mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0",
            isLight ? "text-background" : "text-primary"
          )}>
            <span className="text-sm font-medium">Learn More</span>
            <span className="text-lg">→</span>
          </div>
        </div>

        {/* Gradient overlay on hover */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
          isLight 
            ? "bg-gradient-to-t from-background/10 to-transparent" 
            : "bg-gradient-to-t from-primary/5 to-transparent"
        )} />
      </div>
    </motion.div>
  );
};

// Mobile Card Content for Parallax
const MobileCardContent = ({ feature }: { feature: typeof features[0] }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-6">
    <div className="w-20 h-20 rounded-2xl bg-current/10 border border-current/20 flex items-center justify-center mb-6">
      <feature.Icon className="w-10 h-10" />
    </div>
    <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
      {feature.title}
    </h2>
    <p className="text-lg sm:text-xl max-w-md mb-8 opacity-80 leading-relaxed">
      {feature.description}
    </p>
    <MagneticButton className="px-8 py-4 rounded-full border-2 border-current font-medium text-base hover:bg-current hover:text-background transition-all duration-300">
      Learn More →
    </MagneticButton>
  </div>
);

const ParallaxSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile: Parallax stacking cards
  const cards = features.map((feature) => ({
    lightBg: feature.lightBg,
    darkBg: feature.darkBg,
    content: <MobileCardContent feature={feature} />,
  }));

  return (
    <section className="relative">
      {/* Section Header */}
      <div className="relative z-10 py-20 sm:py-28 md:py-40 px-4 sm:px-6 md:px-12 bg-background">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4 sm:mb-6 px-4 py-2 rounded-full border border-border/50 bg-card/30 backdrop-blur-sm">
              Why Choose Me
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Crafting <span className="text-gradient">Excellence</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm sm:text-base">
              {isMobile ? 'Scroll to explore what sets me apart' : 'Hover to discover what sets me apart'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mobile: Parallax Cards / Desktop: Grid */}
      {isMobile ? (
        <ParallaxCards cards={cards} />
      ) : (
        <div className="px-4 sm:px-6 md:px-12 pb-20 md:pb-40">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <DesktopCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ParallaxSection;