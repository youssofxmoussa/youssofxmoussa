import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Code2, Layers, Cpu, Zap, Target, Sparkles, LucideIcon } from 'lucide-react';
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

interface MobileCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  index: number;
  scrollYProgress: MotionValue<number>;
  totalCards: number;
}

const MobileCard = ({ Icon, title, description, index, scrollYProgress, totalCards }: MobileCardProps) => {
  // Calculate animation ranges for this card
  // Each card gets an equal portion of the scroll
  const segmentSize = 1 / totalCards;
  const start = index * segmentSize;
  const end = start + segmentSize;
  
  // Card slides up from below and settles into position
  const y = useTransform(
    scrollYProgress,
    [start, end],
    [150, 0]
  );
  
  // Card scales up slightly as it enters
  const scale = useTransform(
    scrollYProgress,
    [start, start + segmentSize * 0.3, end],
    [0.92, 0.98, 1]
  );
  
  // Fade in smoothly
  const opacity = useTransform(
    scrollYProgress,
    [start, start + segmentSize * 0.2],
    [0, 1]
  );
  
  // After card is placed, it dims and scales down slightly as next cards stack on top
  const dimStart = end;
  const dimEnd = Math.min(1, end + segmentSize * 1.5);
  
  const brightness = useTransform(
    scrollYProgress,
    [dimStart, dimEnd],
    [1, 0.7]
  );
  
  const stackScale = useTransform(
    scrollYProgress,
    [dimStart, dimEnd],
    [1, 0.95]
  );
  
  // Push card down slightly as new cards stack on top
  const stackY = useTransform(
    scrollYProgress,
    [dimStart, dimEnd],
    [0, index * 6]
  );

  return (
    <motion.div
      className="absolute inset-x-0 top-0 px-4"
      style={{
        y,
        scale,
        opacity,
        zIndex: totalCards - index,
      }}
    >
      <motion.div
        className="relative rounded-2xl border border-border/30 bg-card/98 backdrop-blur-2xl overflow-hidden"
        style={{
          scale: stackScale,
          y: stackY,
          filter: useTransform(brightness, (b) => `brightness(${b})`),
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.35),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.08)
          `,
        }}
      >
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent" />
        
        <div className="relative z-10 p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/25 to-primary/5 border border-primary/15 flex items-center justify-center flex-shrink-0">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-base font-bold text-foreground mb-1">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
            {/* Card number badge */}
            <div className="w-6 h-6 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-semibold text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          </div>
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
  
  // Single scroll tracker for all cards - smooth and synchronized
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Calculate container height to give enough scroll room
  // More height = slower, more luxurious animation
  const scrollHeight = features.length * 120 + 400;

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

        {/* Mobile: Smooth Stacked Cards */}
        {isMobile && (
          <div
            ref={containerRef}
            className="relative md:hidden"
            style={{ height: `${scrollHeight}px` }}
          >
            {/* Sticky container that holds the cards in place while scrolling */}
            <div 
              className="sticky top-24"
              style={{ height: '180px' }}
            >
              {features.map((feature, index) => (
                <MobileCard
                  key={feature.title}
                  Icon={feature.Icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                  scrollYProgress={scrollYProgress}
                  totalCards={features.length}
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
