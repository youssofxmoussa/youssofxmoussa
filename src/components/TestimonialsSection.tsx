import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import GlitchText from './GlitchText';
import MagneticWrapper from './MagneticWrapper';
import { useSound } from '@/contexts/SoundContext';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "CEO",
    company: "TechVision Inc",
    content: "Working with Youssof was an absolute game-changer. The attention to detail and the creativity brought to our project exceeded all expectations. The animations are buttery smooth!",
    avatar: "SC",
    rating: 5
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Product Manager",
    company: "InnovateLab",
    content: "I've never seen such meticulous craftsmanship in web development. Every interaction feels intentional, every animation tells a story. Truly exceptional work.",
    avatar: "MJ",
    rating: 5
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Creative Director",
    company: "DesignForge",
    content: "The level of creativity and technical skill is unmatched. Our website went from ordinary to extraordinary. Users can't stop talking about the experience!",
    avatar: "ER",
    rating: 5
  },
  {
    id: 4,
    name: "David Park",
    role: "Founder",
    company: "StartupX",
    content: "Youssof doesn't just build websites, he crafts digital experiences. The attention to micro-interactions and the overall polish is phenomenal.",
    avatar: "DP",
    rating: 5
  }
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { playClick, playHover } = useSound();

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    playClick();
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    playClick();
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleDotClick = (index: number) => {
    playClick();
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45,
    }),
  };

  const currentTestimonial = testimonials[activeIndex];

  return (
    <section className="py-20 sm:py-28 md:py-40 px-4 sm:px-6 md:px-12 relative overflow-hidden" id="testimonials">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4 block">
            <GlitchText text="What They Say" continuous />
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            <GlitchText text="Client Stories" glitchOnHover />
          </h2>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative perspective-1000">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 },
                rotateY: { duration: 0.4 },
              }}
              className="relative"
            >
              <div className="max-w-4xl mx-auto">
                {/* Main Card */}
                <motion.div
                  className="relative bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-8 sm:p-10 md:p-14"
                  whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Quote Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="absolute -top-6 left-8 sm:left-12"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                      <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
                    </div>
                  </motion.div>

                  {/* Stars */}
                  <motion.div 
                    className="flex gap-1 mb-6 sm:mb-8 justify-center sm:justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                      >
                        <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-primary text-primary" />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Content */}
                  <motion.p
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground font-light leading-relaxed mb-8 sm:mb-10 text-center sm:text-left"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    "{currentTestimonial.content}"
                  </motion.p>

                  {/* Author */}
                  <motion.div
                    className="flex flex-col sm:flex-row items-center gap-4"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <motion.div
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-primary-foreground font-bold text-lg sm:text-xl"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {currentTestimonial.avatar}
                      </motion.div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-background" />
                    </div>
                    
                    <div className="text-center sm:text-left">
                      <h4 className="font-display text-lg sm:text-xl font-bold text-foreground">
                        {currentTestimonial.name}
                      </h4>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        {currentTestimonial.role} at{' '}
                        <span className="text-primary">{currentTestimonial.company}</span>
                      </p>
                    </div>
                  </motion.div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-bl from-primary/10 to-transparent rounded-3xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-tr from-primary/5 to-transparent rounded-3xl" />
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="flex justify-center gap-4 mt-8 sm:mt-12">
            <MagneticWrapper strength={0.3}>
              <motion.button
                onClick={handlePrev}
                onMouseEnter={playHover}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>
            </MagneticWrapper>

            <MagneticWrapper strength={0.3}>
              <motion.button
                onClick={handleNext}
                onMouseEnter={playHover}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>
            </MagneticWrapper>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-6 sm:mt-8">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => handleDotClick(index)}
                onMouseEnter={playHover}
                className={`relative h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {index === activeIndex && (
                  <motion.div
                    className="absolute inset-0 bg-primary rounded-full"
                    layoutId="activeDot"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 sm:mt-20 md:mt-28"
        >
          {[
            { value: "50+", label: "Happy Clients" },
            { value: "100+", label: "Projects Done" },
            { value: "5+", label: "Years Experience" },
            { value: "100%", label: "Satisfaction" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-2xl bg-card/30 border border-border/30 backdrop-blur-sm"
              whileHover={{ scale: 1.05, borderColor: "hsl(var(--primary) / 0.5)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.span
                className="block font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gradient mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.2 + index * 0.1 }}
              >
                {stat.value}
              </motion.span>
              <span className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
