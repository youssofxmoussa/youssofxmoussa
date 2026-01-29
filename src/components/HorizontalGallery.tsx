import { useEffect, useRef, forwardRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

import projectEcommerce from '@/assets/project-ecommerce.jpg';
import projectSaas from '@/assets/project-saas.jpg';
import projectPortfolio from '@/assets/project-portfolio.jpg';
import projectMobile from '@/assets/project-mobile.jpg';
import projectFitness from '@/assets/project-fitness.jpg';
import projectRealestate from '@/assets/project-realestate.jpg';

gsap.registerPlugin(ScrollTrigger);

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

const galleryItems: GalleryItem[] = [
  { id: 1, title: 'E-Commerce Platform', category: 'Full Stack', image: projectEcommerce },
  { id: 2, title: 'SaaS Dashboard', category: 'Frontend', image: projectSaas },
  { id: 3, title: 'Creative Portfolio', category: 'Design', image: projectPortfolio },
  { id: 4, title: 'Mobile App UI', category: 'UI/UX', image: projectMobile },
  { id: 5, title: 'Fitness Tracker', category: 'Mobile App', image: projectFitness },
  { id: 6, title: 'Real Estate Platform', category: 'Full Stack', image: projectRealestate },
];

const HorizontalGallery = forwardRef<HTMLElement>((props, ref) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Store our specific ScrollTrigger instances for cleanup
    const triggers: ScrollTrigger[] = [];
    
    if (!sectionRef.current || !trackRef.current) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    
    // Calculate scroll distance - tighter calculation for laptop screens
    const trackWidth = track.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollDistance = trackWidth - viewportWidth + 50;

    // Only enable horizontal scroll on larger screens
    if (viewportWidth < 768) {
      // On mobile, just animate heading without horizontal scroll
      if (headingRef.current) {
        const headingTrigger = ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo(
              headingRef.current,
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
            );
          },
          once: true,
        });
        triggers.push(headingTrigger);
      }
      
      return () => {
        triggers.forEach((t) => t.kill());
      };
    }

    // Heading animation for desktop
    if (headingRef.current) {
      const headingAnimation = gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
      if (headingAnimation.scrollTrigger) {
        triggers.push(headingAnimation.scrollTrigger);
      }
    }

    // Horizontal scroll animation - optimized for laptop screens
    const horizontalScroll = gsap.to(track, {
      x: -scrollDistance,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${scrollDistance}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
    
    if (horizontalScroll.scrollTrigger) {
      triggers.push(horizontalScroll.scrollTrigger);
    }

    // Animate individual cards
    const cards = track.querySelectorAll('.gallery-card');
    cards.forEach((card) => {
      const cardAnimation = gsap.fromTo(
        card,
        { opacity: 0.5, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalScroll,
            start: 'left 80%',
            end: 'left 20%',
            scrub: true,
          },
        }
      );
      if (cardAnimation.scrollTrigger) {
        triggers.push(cardAnimation.scrollTrigger);
      }
    });

    return () => {
      // Only kill our own ScrollTriggers, not all of them
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section 
      ref={(node) => {
        sectionRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }} 
      className="relative py-12 md:py-0 overflow-hidden bg-card/30"
      id="gallery"
    >
      {/* Header - visible on all screens */}
      <div ref={headingRef} className="px-4 sm:px-6 md:px-12 pt-10 md:pt-20 lg:pt-24 pb-6 md:pb-10">
        <span className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4 sm:mb-6 block">
          Featured Work
        </span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
          Selected Projects
        </h2>
      </div>

      {/* Mobile: Vertical scrolling grid */}
      <div className="md:hidden px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {galleryItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
          >
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-[10px] font-medium tracking-wider uppercase text-primary/80 mb-1 block">
                  {item.category}
                </span>
                <h3 className="font-display text-lg font-bold text-foreground">
                  {item.title}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop/Laptop: Horizontal scrolling */}
      <div 
        ref={trackRef} 
        className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8 pl-6 lg:pl-12 pr-12 lg:pr-24 pb-6 lg:pb-0"
        style={{ width: 'max-content' }}
      >
        {galleryItems.map((item, index) => (
          <div
            key={item.id}
            className="gallery-card group relative flex-shrink-0"
          >
            <div className="relative w-[320px] md:w-[380px] lg:w-[450px] xl:w-[550px] h-[240px] md:h-[280px] lg:h-[340px] xl:h-[400px] rounded-xl lg:rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-colors">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              {/* Number */}
              <div className="absolute top-4 lg:top-6 left-4 lg:left-6 text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-foreground/10 group-hover:text-foreground/20 transition-colors">
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 xl:p-8">
                <span className="text-[10px] lg:text-xs font-medium tracking-wider uppercase text-primary/80 mb-1 lg:mb-2 block">
                  {item.category}
                </span>
                <h3 className="font-display text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
        
        {/* End spacer with CTA */}
        <div className="flex-shrink-0 w-[200px] md:w-[250px] lg:w-[320px] xl:w-[400px] h-[240px] md:h-[280px] lg:h-[340px] xl:h-[400px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4 lg:mb-6 text-sm lg:text-lg">Want to see more?</p>
            <a 
              href="#contact" 
              className="inline-flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 bg-foreground text-background rounded-full font-medium text-sm lg:text-base hover:glow-primary transition-all"
            >
              Let's Connect
            </a>
          </div>
        </div>
      </div>
    </section>
  );
});

HorizontalGallery.displayName = 'HorizontalGallery';

export default HorizontalGallery;
