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

const ParallaxSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Clear previous triggers
    triggersRef.current.forEach((t) => t.kill());
    triggersRef.current = [];

    // Heading parallax
    if (headingRef.current) {
      const headingTween = gsap.fromTo(
        headingRef.current,
        { y: 0 },
        {
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
      if (headingTween.scrollTrigger) {
        triggersRef.current.push(headingTween.scrollTrigger);
      }
    }

    // Mobile: Stacked card scroll animation
    if (isMobile && mobileContainerRef.current) {
      const cards = mobileContainerRef.current.querySelectorAll('.stacked-card');
      const cardHeight = 280; // Height of each card + gap
      const totalScrollHeight = cardHeight * (cards.length - 1);

      // Pin the container while cards stack
      const pinTrigger = ScrollTrigger.create({
        trigger: mobileContainerRef.current,
        start: 'top 100px',
        end: `+=${totalScrollHeight}`,
        pin: true,
        pinSpacing: true,
      });
      triggersRef.current.push(pinTrigger);

      // Animate each card stacking
      cards.forEach((card, i) => {
        if (i === 0) return; // First card is already visible

        const cardTween = gsap.fromTo(
          card,
          {
            y: '100%',
            opacity: 0.5,
            scale: 0.95,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: mobileContainerRef.current,
              start: `top+=${cardHeight * (i - 0.5)} 100px`,
              end: `top+=${cardHeight * i} 100px`,
              scrub: 0.5,
            },
          }
        );
        if (cardTween.scrollTrigger) {
          triggersRef.current.push(cardTween.scrollTrigger);
        }

        // Dim previous cards slightly
        if (i > 0) {
          const prevCard = cards[i - 1];
          const dimTween = gsap.to(prevCard, {
            scale: 0.95,
            filter: 'brightness(0.7)',
            ease: 'none',
            scrollTrigger: {
              trigger: mobileContainerRef.current,
              start: `top+=${cardHeight * (i - 0.5)} 100px`,
              end: `top+=${cardHeight * i} 100px`,
              scrub: 0.5,
            },
          });
          if (dimTween.scrollTrigger) {
            triggersRef.current.push(dimTween.scrollTrigger);
          }
        }
      });
    }

    // Desktop: Cards staggered reveal with parallax
    if (!isMobile && cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.feature-card');
      
      cards.forEach((card, i) => {
        // Initial reveal animation
        const revealTween = gsap.fromTo(
          card,
          { 
            y: 100, 
            opacity: 0,
            rotateX: -15,
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
        if (revealTween.scrollTrigger) {
          triggersRef.current.push(revealTween.scrollTrigger);
        }

        // Subtle float on scroll
        const floatTween = gsap.to(card, {
          y: (i % 2 === 0) ? -20 : 20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
        if (floatTween.scrollTrigger) {
          triggersRef.current.push(floatTween.scrollTrigger);
        }
      });
    }

    return () => {
      triggersRef.current.forEach((t) => t.kill());
    };
  }, [isMobile]);

  return (
    <section 
      ref={sectionRef}
      className="py-20 sm:py-28 md:py-40 px-4 sm:px-6 md:px-12 overflow-hidden bg-card/30"
    >
      <div className="max-w-6xl mx-auto">
        <div ref={headingRef} className="text-center mb-12 sm:mb-16 md:mb-20">
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4 sm:mb-6 block">
            Why Choose Me
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            Crafting Excellence
          </h2>
        </div>

        {/* Mobile: Stacked Cards Container */}
        {isMobile && (
          <div 
            ref={mobileContainerRef}
            className="relative md:hidden"
            style={{ height: '260px' }}
          >
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="stacked-card absolute inset-x-0 top-0 p-6 rounded-2xl border border-border bg-background/95 backdrop-blur-md shadow-xl"
                style={{ 
                  zIndex: index + 1,
                  transformOrigin: 'center top',
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Desktop: Grid Layout */}
        {!isMobile && (
          <div 
            ref={cardsRef}
            className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            style={{ perspective: '1000px' }}
          >
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="feature-card group p-6 sm:p-8 rounded-2xl border border-border bg-background/50 backdrop-blur-sm hover:border-primary/50 hover:bg-card/80 transition-all duration-500"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <feature.Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ParallaxSection;
