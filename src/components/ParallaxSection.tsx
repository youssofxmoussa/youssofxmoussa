import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Code2, Layers, Cpu, Zap, Target, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const features = [
  {
    Icon: Code2,
    title: 'Clean Code',
    description: 'Writing maintainable, scalable code that stands the test of time.',
  },
  {
    Icon: Layers,
    title: 'Modern Stack',
    description: 'Using cutting-edge technologies to build future-proof applications.',
  },
  {
    Icon: Cpu,
    title: 'Performance',
    description: 'Optimizing every millisecond for blazing fast experiences.',
  },
  {
    Icon: Zap,
    title: 'Animations',
    description: 'Creating smooth, delightful interactions that users love.',
  },
  {
    Icon: Target,
    title: 'Pixel Perfect',
    description: 'Attention to detail that makes designs come to life.',
  },
  {
    Icon: Sparkles,
    title: 'Innovation',
    description: 'Pushing boundaries with creative solutions.',
  },
];

interface StackCardProps {
  feature: typeof features[0];
  index: number;
  totalCards: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

const StackCard = ({ feature, index, totalCards, containerRef }: StackCardProps) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Each card animates during its portion of the scroll
  const cardStart = index / totalCards;
  const cardEnd = (index + 1) / totalCards;
  
  // Y position: starts off-screen, moves to stacked position
  const y = useTransform(
    scrollYProgress,
    [cardStart, cardEnd],
    [300, index * 8] // Stack with 8px offset
  );

  // Scale: slightly smaller as cards stack behind
  const scale = useTransform(
    scrollYProgress,
    [cardStart, cardEnd, cardEnd + 0.1],
    [0.95, 1, 1 - (index * 0.02)]
  );

  // Opacity: fade in as card enters
  const opacity = useTransform(
    scrollYProgress,
    [cardStart, cardStart + 0.05, cardEnd],
    [0, 1, 1]
  );

  // Brightness/filter for cards that are stacked behind
  const brightness = useTransform(
    scrollYProgress,
    [cardEnd, cardEnd + 0.15],
    [1, 0.85 - (index * 0.05)]
  );

  return (
    <motion.div
      className="absolute inset-x-4 top-0"
      style={{
        y,
        scale,
        opacity,
        zIndex: totalCards - index,
        filter: brightness.get() < 1 ? `brightness(${brightness.get()})` : undefined,
      }}
    >
      <motion.div
        className="relative p-6 rounded-3xl border border-border/40 bg-card/95 backdrop-blur-xl overflow-hidden"
        style={{
          boxShadow: `
            0 ${20 - index * 2}px ${40 - index * 4}px -10px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.03),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.05)
          `,
        }}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-60" />
        
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center flex-shrink-0">
            <feature.Icon className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="font-display text-lg font-bold text-foreground mb-1.5">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>

        {/* Card number */}
        <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
          <span className="text-[10px] font-semibold text-muted-foreground">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DesktopCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative p-8 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden cursor-pointer"
      style={{
        boxShadow: '0 10px 40px -15px rgba(0, 0, 0, 0.25)',
      }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/8 group-hover:to-transparent transition-all duration-500 rounded-3xl" />
      
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/15 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:border-primary/25 transition-all duration-300">
          <feature.Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
        </div>
        <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
          {feature.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

const ParallaxSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  return (
    <section className="py-20 sm:py-28 md:py-40 px-4 sm:px-6 md:px-12 overflow-hidden bg-gradient-to-b from-background via-card/10 to-background">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <span className="inline-block text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4 sm:mb-6 px-4 py-2 rounded-full border border-border/50 bg-card/30 backdrop-blur-sm">
            Why Choose Me
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            Crafting <span className="text-gradient">Excellence</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm sm:text-base">
            Every project is an opportunity to push boundaries
          </p>
        </motion.div>

        {/* Mobile: Stacked Cards with Scroll */}
        {isMobile && (
          <div
            ref={containerRef}
            className="relative md:hidden"
            style={{ height: `${features.length * 180 + 200}px` }}
          >
            <div className="sticky top-20" style={{ height: '280px' }}>
              {features.map((feature, index) => (
                <StackCard
                  key={feature.title}
                  feature={feature}
                  index={index}
                  totalCards={features.length}
                  containerRef={containerRef as React.RefObject<HTMLDivElement>}
                />
              ))}
            </div>
          </div>
        )}

        {/* Desktop: Grid Layout */}
        {!isMobile && (
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <DesktopCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ParallaxSection;
