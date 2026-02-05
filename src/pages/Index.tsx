import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import NoiseBackground from '@/components/NoiseBackground';
import AnimatedSVG from '@/components/AnimatedSVG';
import CustomCursor from '@/components/CustomCursor';
import ScrambleText from '@/components/ScrambleText';
import Marquee from '@/components/Marquee';
import ScrollReveal from '@/components/ScrollReveal';
import MagneticButton from '@/components/MagneticButton';
import ProjectShowcase from '@/components/ProjectShowcase';
import TextReveal from '@/components/TextReveal';
import HorizontalGallery from '@/components/HorizontalGallery';
import SkillsSection from '@/components/SkillsSection';
import ParallaxSection from '@/components/ParallaxSection';
import Footer from '@/components/Footer';
import useSmoothScroll from '@/hooks/useSmoothScroll';
import { ArrowDown, Send, MessageCircle } from 'lucide-react';
import CinematicPreloader from '@/components/CinematicPreloader';
import InteractiveParticles from '@/components/InteractiveParticles';
import GlitchText from '@/components/GlitchText';
import MorphingText from '@/components/MorphingText';
import MagneticWrapper from '@/components/MagneticWrapper';
import ScrollRevealSection from '@/components/ScrollRevealSection';
import TestimonialsSection from '@/components/TestimonialsSection';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const [showPreloader, setShowPreloader] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
    setContentReady(true);
  };

  useSmoothScroll();

  useEffect(() => {
    // Clear previous triggers
    triggersRef.current.forEach((t) => t.kill());
    triggersRef.current = [];

    if (titleRef.current && heroRef.current) {
      const titleTween = gsap.to(titleRef.current, {
        y: -100,
        opacity: 0.3,
        scale: 0.95,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
      
      if (titleTween.scrollTrigger) {
        triggersRef.current.push(titleTween.scrollTrigger);
      }
    }

    gsap.fromTo(
      '.hero-letter',
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.03,
        duration: 1,
        ease: 'power4.out',
        delay: 0.5,
      }
    );

    return () => {
      triggersRef.current.forEach((t) => t.kill());
    };
  }, []);

  const marqueeItems = [
    'REACT', 'TYPESCRIPT', 'GSAP', 'THREE.JS', 'NEXT.JS', 'FRAMER MOTION',
    'NODE.JS', 'TAILWIND', 'WEBGL', 'ANIMATIONS'
  ];

  const nameLetters = 'Youssof'.split('');
  const surnameLetters = 'Moussa'.split('');

  const roles = ['Developer', 'Designer', 'Creator', 'Innovator'];

  return (
    <div className="relative bg-background text-foreground overflow-x-hidden">
      {/* Cinematic Preloader */}
      {showPreloader && <CinematicPreloader onComplete={handlePreloaderComplete} />}
      
      {/* Interactive Particles Background */}
      <InteractiveParticles />
      
      <CustomCursor />
      <NoiseBackground />
      <Navigation />

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 pt-20 sm:pt-0"
        id="about"
      >
        <AnimatedSVG />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Tagline with Glitch Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={contentReady ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 sm:mb-6 md:mb-8"
          >
            <MagneticWrapper strength={0.2}>
              <span className="inline-block px-3 py-2 sm:px-5 sm:py-2.5 rounded-full border border-primary/20 text-primary text-xs sm:text-sm font-medium tracking-widest">
                <GlitchText text="CREATIVE DEVELOPER" glitchOnHover continuous />
              </span>
            </MagneticWrapper>
          </motion.div>

          {/* Main Title with letter animation */}
          <h1 ref={titleRef} className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] font-bold leading-[0.85] mb-4 sm:mb-6 md:mb-8 tracking-tight">
            <span className="block overflow-hidden">
              {nameLetters.map((letter, i) => (
                <span key={i} className="hero-letter inline-block text-foreground">
                  {letter}
                </span>
              ))}
            </span>
            <span className="block overflow-hidden">
              {surnameLetters.map((letter, i) => (
                <span key={i} className="hero-letter inline-block text-gradient">
                  {letter}
                </span>
              ))}
            </span>
          </h1>

          {/* Subtitle with Morphing Text */}
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-14 font-light px-4 sm:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={contentReady ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            I'm a <MorphingText words={roles} className="text-foreground font-medium" /> crafting{' '}
            <span className="text-foreground font-medium">immersive digital experiences</span> with 
            silky-smooth animations and pixel-perfect precision.
          </motion.p>

          {/* CTA Buttons with Magnetic Effect */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={contentReady ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <MagneticWrapper strength={0.4}>
              <MagneticButton className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-foreground text-background rounded-full font-medium text-sm sm:text-base hover:glow-primary transition-all">
                <GlitchText text="View My Work" glitchOnHover />
              </MagneticButton>
            </MagneticWrapper>
            <MagneticWrapper strength={0.4}>
              <MagneticButton className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 border border-primary/30 rounded-full font-medium text-sm sm:text-base text-foreground hover:border-foreground transition-all">
                <GlitchText text="Get In Touch" glitchOnHover />
              </MagneticButton>
            </MagneticWrapper>
          </motion.div>
        </div>

        {/* Scroll indicator - hide on mobile */}
        <motion.div
          className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 hidden sm:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-3 text-muted-foreground"
          >
            <span className="text-xs uppercase tracking-[0.3em] font-light">Scroll</span>
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* Marquee Section */}
      <section className="py-12 sm:py-16 md:py-24 border-y border-border/50">
        <Marquee 
          items={marqueeItems} 
          speed={40} 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-bold text-muted/20 hover:text-muted/40 transition-colors" 
        />
        <Marquee 
          items={marqueeItems} 
          speed={30} 
          direction="right"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-bold text-foreground/5 hover:text-foreground/10 transition-colors mt-2 sm:mt-4" 
        />
      </section>

      {/* About Section with Projects - Dramatic Reveal */}
      <section className="py-20 sm:py-28 md:py-40 px-4 sm:px-6 md:px-12" id="work">
        <div className="max-w-6xl mx-auto">
          <ScrollRevealSection effect="glitch">
            <TextReveal 
              text="Building the future of the web with meticulous attention to detail and unwavering commitment to craft."
              className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-foreground mb-8 sm:mb-12 md:mb-16"
            />
          </ScrollRevealSection>
          
          <ScrollRevealSection effect="curtain" className="mb-12 sm:mb-16 md:mb-24">
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl font-light leading-relaxed">
              With years of experience in crafting digital experiences, I specialize in creating 
              websites and applications that not only look stunning but perform exceptionally. 
              Every pixel, every animation, every interaction is thoughtfully designed to 
              leave a lasting impression.
            </p>
          </ScrollRevealSection>

          {/* Projects Grid */}
          <ScrollRevealSection effect="zoom">
            <ProjectShowcase />
          </ScrollRevealSection>
        </div>
      </section>

      {/* Horizontal Gallery Section */}
      <HorizontalGallery />

      {/* Parallax Features Section */}
      <ParallaxSection />

      {/* Skills Section */}
      <SkillsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Section - Epic Reveal */}
      <section className="py-20 sm:py-28 md:py-40 px-4 sm:px-6 md:px-12 border-t border-border/50" id="contact">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollRevealSection effect="split">
            <span className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4 sm:mb-6 block">
              <GlitchText text="Let's Connect" continuous />
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 md:mb-10 text-foreground">
              <GlitchText text="Got a project in mind?" glitchOnHover />
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-10 sm:mb-12 md:mb-16 max-w-2xl mx-auto font-light px-4 sm:px-0">
              I'm always excited to collaborate on innovative projects. 
              Whether you have a detailed brief or just a spark of an idea, let's make it happen.
            </p>
          </ScrollRevealSection>

          {/* Contact Links */}
          <ScrollRevealSection effect="curtain">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
              <a 
                href="https://t.me/youssofxmoussa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto group px-6 sm:px-8 py-3 sm:py-4 border border-primary/30 rounded-full font-medium text-sm sm:text-base text-foreground hover:bg-foreground hover:text-background transition-all inline-flex items-center justify-center gap-3"
              >
                <Send className="w-4 h-4" />
                Telegram
              </a>
              <a 
                href="https://instagram.com/youssof.moussa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto group px-6 sm:px-8 py-3 sm:py-4 border border-primary/30 rounded-full font-medium text-sm sm:text-base text-foreground hover:bg-foreground hover:text-background transition-all inline-flex items-center justify-center gap-3"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
              <a 
                href="https://wa.me/96171463532" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto group px-6 sm:px-8 py-3 sm:py-4 border border-primary/30 rounded-full font-medium text-sm sm:text-base text-foreground hover:bg-foreground hover:text-background transition-all inline-flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </ScrollRevealSection>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;