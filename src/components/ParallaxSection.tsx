import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Layers, Cpu, Zap, Target, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    Icon: Code2,
    title: 'Clean Code',
    description: 'Writing maintainable, scalable code that stands the test of time.',
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    Icon: Layers,
    title: 'Modern Stack',
    description: 'Using cutting-edge technologies to build future-proof applications.',
    gradient: 'from-accent/20 to-accent/5',
  },
  {
    Icon: Cpu,
    title: 'Performance',
    description: 'Optimizing every millisecond for blazing fast experiences.',
    gradient: 'from-primary/15 to-primary/5',
  },
  {
    Icon: Zap,
    title: 'Animations',
    description: 'Creating smooth, delightful interactions that users love.',
    gradient: 'from-accent/15 to-accent/5',
  },
  {
    Icon: Target,
    title: 'Pixel Perfect',
    description: 'Attention to detail that makes designs come to life.',
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    Icon: Sparkles,
    title: 'Innovation',
    description: 'Pushing boundaries with creative solutions.',
    gradient: 'from-accent/20 to-accent/5',
  },
];

const ParallaxSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Heading parallax for all screens
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 0, opacity: 1 },
          {
            y: -60,
            opacity: 0.8,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'top top',
              scrub: 1,
            },
          }
        );
      }

      // Mobile: Luxe stacked card effect
      if (isMobile && cardsContainerRef.current) {
        const cards = gsap.utils.toArray<HTMLElement>('.stack-card');
        const cardHeight = 200; // Card visible height
        const overlap = 24; // Stack offset between cards
        const totalCards = cards.length;
        
        // Calculate the total scroll distance needed
        const scrollDistance = (totalCards - 1) * cardHeight;

        // Set up initial card positions (all cards start below, except first)
        cards.forEach((card, i) => {
          gsap.set(card, {
            y: i === 0 ? 0 : '100vh',
            scale: 1,
            zIndex: i + 1,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          });
        });

        // Create the pinned scroll animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 15%',
            end: `+=${scrollDistance}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        // Animate each card stacking one by one
        cards.forEach((card, i) => {
          if (i === 0) return; // First card is already in place

          const stackPosition = i * overlap; // Each card stacks with a slight offset

          // Card slides up from bottom and stacks
          tl.to(
            card,
            {
              y: stackPosition,
              duration: 1,
              ease: 'power2.out',
            },
            (i - 1) * 0.5
          );

          // Slightly shrink and dim previous cards as new ones stack
          tl.to(
            cards[i - 1],
            {
              scale: 1 - (0.02 * i),
              filter: `brightness(${1 - (0.08 * i)})`,
              y: (i - 1) * overlap - 5, // Subtle push up
              duration: 0.5,
            },
            (i - 1) * 0.5
          );
        });

        // Final polish - all stacked cards settle
        tl.to(
          cards,
          {
            duration: 0.3,
          },
          '>'
        );
      }

      // Desktop: Elegant staggered reveal
      if (!isMobile && cardsContainerRef.current) {
        const cards = gsap.utils.toArray<HTMLElement>('.feature-card');

        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            {
              y: 80,
              opacity: 0,
              rotateX: -10,
            },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          // Subtle float effect on scroll
          gsap.to(card, {
            y: i % 2 === 0 ? -15 : 15,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28 md:py-40 px-4 sm:px-6 md:px-12 overflow-hidden bg-gradient-to-b from-background via-card/20 to-background"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-12 sm:mb-16 md:mb-20">
          <span className="inline-block text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4 sm:mb-6 px-4 py-2 rounded-full border border-border/50 bg-card/30 backdrop-blur-sm">
            Why Choose Me
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            Crafting{' '}
            <span className="text-gradient">Excellence</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm sm:text-base">
            Every project is an opportunity to push boundaries
          </p>
        </div>

        {/* Mobile: Stacked Cards */}
        {isMobile && (
          <div
            ref={containerRef}
            className="relative md:hidden"
            style={{ height: '280px' }}
          >
            <div ref={cardsContainerRef} className="relative w-full h-full">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`stack-card w-full p-6 rounded-3xl border border-border/50 bg-gradient-to-br ${feature.gradient} backdrop-blur-xl shadow-2xl`}
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <feature.Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-xl font-bold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Card number indicator */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-muted-foreground">
                      {index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Desktop: Premium Grid */}
        {!isMobile && (
          <div
            ref={cardsContainerRef}
            className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6"
            style={{ perspective: '1200px' }}
          >
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`feature-card group relative p-8 rounded-3xl border border-border/50 bg-gradient-to-br ${feature.gradient} backdrop-blur-sm hover:border-primary/30 transition-all duration-500`}
                style={{
                  transformStyle: 'preserve-3d',
                  boxShadow: '0 10px 40px -15px rgba(0, 0, 0, 0.3)',
                }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500 opacity-0 group-hover:opacity-100" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/15 group-hover:scale-105 group-hover:border-primary/30 transition-all duration-300">
                    <feature.Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ParallaxSection;
