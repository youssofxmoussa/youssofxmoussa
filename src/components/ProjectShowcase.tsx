import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ArrowRight, ExternalLink } from 'lucide-react';

import projectEcommerce from '@/assets/project-ecommerce.jpg';
import projectSaas from '@/assets/project-saas.jpg';
import projectPortfolio from '@/assets/project-portfolio.jpg';
import projectMobile from '@/assets/project-mobile.jpg';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  technologies: string[];
  year: string;
  image: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    category: 'Full Stack Development',
    description: 'A modern e-commerce solution with real-time inventory and beautiful animations.',
    longDescription: 'Built from the ground up with performance and user experience in mind. Features include real-time inventory management, seamless payment processing with Stripe, and buttery-smooth animations that guide users through their shopping journey.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'GSAP'],
    year: '2024',
    image: projectEcommerce,
  },
  {
    id: 2,
    title: 'SaaS Dashboard',
    category: 'Frontend Architecture',
    description: 'Interactive analytics dashboard with data visualization and smooth transitions.',
    longDescription: 'A comprehensive analytics platform that transforms complex data into actionable insights. Features real-time data streaming, customizable widgets, and an intuitive drag-and-drop interface that makes data exploration a pleasure.',
    technologies: ['Next.js', 'TypeScript', 'D3.js', 'WebSocket', 'Tailwind'],
    year: '2024',
    image: projectSaas,
  },
  {
    id: 3,
    title: 'Creative Portfolio',
    category: 'Design & Development',
    description: 'Award-winning portfolio with immersive WebGL experiences.',
    longDescription: 'A showcase of creative possibilities, blending cutting-edge 3D graphics with intuitive navigation. Every interaction is crafted to leave a lasting impression, from the particle-based hero section to the scroll-driven storytelling.',
    technologies: ['Three.js', 'React Three Fiber', 'Framer Motion', 'GSAP'],
    year: '2023',
    image: projectPortfolio,
  },
  {
    id: 4,
    title: 'Mobile App UI',
    category: 'UI/UX Design',
    description: 'Cross-platform mobile application with gesture-based navigation.',
    longDescription: 'Designed for the modern mobile user, this application features fluid gesture controls, haptic feedback integration, and a design system that adapts seamlessly across iOS and Android while maintaining brand consistency.',
    technologies: ['React Native', 'Reanimated', 'Figma', 'Lottie'],
    year: '2023',
    image: projectMobile,
  },
];

const ProjectShowcase = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    
    // Clear previous triggers
    triggersRef.current.forEach((t) => t.kill());
    triggersRef.current = [];
    
    projectRefs.current.forEach((ref) => {
      if (!ref) return;

      const tween = gsap.fromTo(
        ref,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref,
            start: 'top 90%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
      
      if (tween.scrollTrigger) {
        triggersRef.current.push(tween.scrollTrigger);
      }

      // Only add hover effects on non-touch devices
      if (!isMobile) {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = ref.getBoundingClientRect();
          const x = (e.clientX - rect.left - rect.width / 2) / 25;
          const y = (e.clientY - rect.top - rect.height / 2) / 25;
          
          gsap.to(ref, {
            rotateY: x,
            rotateX: -y,
            duration: 0.5,
            ease: 'power2.out',
          });
        };

        const handleMouseLeave = () => {
          gsap.to(ref, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.5,
            ease: 'power2.out',
          });
        };

        ref.addEventListener('mousemove', handleMouseMove);
        ref.addEventListener('mouseleave', handleMouseLeave);
      }
    });

    return () => {
      // Only kill our own triggers
      triggersRef.current.forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {projects.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => (projectRefs.current[index] = el)}
            className="group relative cursor-pointer"
            onClick={() => setSelectedProject(project)}
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
          >
            <div className="relative h-[280px] sm:h-[320px] md:h-[380px] lg:h-[400px] rounded-xl sm:rounded-2xl border border-border overflow-hidden transition-all duration-500 group-hover:border-primary/50">
              {/* Project Image */}
              <img 
                src={project.image} 
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

              {/* Project number */}
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 text-5xl sm:text-6xl md:text-7xl font-display font-bold text-foreground/10 group-hover:text-foreground/20 transition-colors">
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
                <span className="text-[10px] sm:text-xs font-medium tracking-wider uppercase text-primary/80 mb-1 sm:mb-2 block">
                  {project.category}
                </span>
                <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                {/* Arrow indicator */}
                <div className="mt-4 sm:mt-6 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                  <span className="text-xs sm:text-sm font-medium">View Case Study</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full-screen case study modal - Simple, fast */}
      {selectedProject && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          />
          
          {/* Modal Content */}
          <div
            className="fixed inset-4 sm:inset-8 z-50 bg-card border border-border rounded-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:text-primary hover:border-primary transition-colors z-10 bg-card"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 sm:p-10 lg:p-16 max-w-5xl mx-auto">
              {/* Header */}
              <div className="mb-8 sm:mb-12">
                <span className="text-xs sm:text-sm font-medium tracking-wider uppercase text-primary mb-2 sm:mb-4 block">
                  {selectedProject.category} — {selectedProject.year}
                </span>
                <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6">
                  {selectedProject.title}
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl">
                  {selectedProject.longDescription}
                </p>
              </div>

              {/* Project image */}
              <div className="w-full h-[40vh] sm:h-[50vh] rounded-xl sm:rounded-2xl border border-border mb-8 sm:mb-12 overflow-hidden">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Technologies */}
              <div className="mb-8 sm:mb-12">
                <h3 className="text-xs sm:text-sm font-medium tracking-wider uppercase text-primary mb-4 sm:mb-6">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {selectedProject.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-border text-xs sm:text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-4">
                <button className="px-6 py-3 sm:px-8 sm:py-4 bg-primary text-primary-foreground rounded-full font-medium text-sm sm:text-lg transition-all inline-flex items-center gap-2 hover:opacity-90">
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                  Visit Live Site
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProjectShowcase;