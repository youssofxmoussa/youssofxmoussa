import { motion } from 'framer-motion';
import { Code2, Layers, Cpu, Zap, Target, Sparkles } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import ParallaxCards from '@/components/ui/parallaxcards';
import MagneticButton from '@/components/MagneticButton';

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

const ParallaxSection = () => {
  const cards = features.map((feature) => ({
    lightBg: feature.lightBg,
    darkBg: feature.darkBg,
    content: (
      <CardContent className="flex flex-col items-center justify-center h-full text-center text-inherit p-0">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-current/10 border border-current/20 flex items-center justify-center mb-6 sm:mb-8">
          <feature.Icon className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
          {feature.title}
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl max-w-xl mb-8 sm:mb-10 opacity-80 leading-relaxed">
          {feature.description}
        </p>
        <MagneticButton className="px-8 py-4 rounded-full border-2 border-current font-medium text-base sm:text-lg hover:bg-current hover:text-background transition-all duration-300">
          Learn More →
        </MagneticButton>
      </CardContent>
    ),
  }));

  return (
    <section className="relative">
      {/* Section Header - Fixed at top initially */}
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
              Scroll to explore what sets me apart
            </p>
          </motion.div>
        </div>
      </div>

      {/* Parallax Stacking Cards */}
      <ParallaxCards cards={cards} />
    </section>
  );
};

export default ParallaxSection;
