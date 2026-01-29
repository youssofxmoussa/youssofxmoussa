import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SkillPill from './SkillPill';
import {
  Atom,
  FileCode2,
  Triangle,
  Server,
  Sparkles,
  Film,
  Gamepad2,
  Palette,
  Database,
  Diamond,
  Cloud,
  Container,
  Figma,
  GitBranch,
  Plug,
  Zap,
  Wand2,
  Rocket,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  name: string;
  Icon: LucideIcon;
}

const skills: Skill[] = [
  { name: 'React', Icon: Atom },
  { name: 'TypeScript', Icon: FileCode2 },
  { name: 'Next.js', Icon: Triangle },
  { name: 'Node.js', Icon: Server },
  { name: 'GSAP', Icon: Sparkles },
  { name: 'Framer Motion', Icon: Film },
  { name: 'Three.js', Icon: Gamepad2 },
  { name: 'Tailwind CSS', Icon: Palette },
  { name: 'PostgreSQL', Icon: Database },
  { name: 'GraphQL', Icon: Diamond },
  { name: 'AWS', Icon: Cloud },
  { name: 'Docker', Icon: Container },
  { name: 'Figma', Icon: Figma },
  { name: 'Git', Icon: GitBranch },
  { name: 'REST APIs', Icon: Plug },
  { name: 'WebGL', Icon: Zap },
  { name: 'CSS Animations', Icon: Wand2 },
  { name: 'Vercel', Icon: Rocket },
];

const SkillsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    
    if (!sectionRef.current) return;

    // Heading animation
    if (headingRef.current) {
      const headingTrigger = ScrollTrigger.create({
        trigger: headingRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(
            headingRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
          );
        },
        once: true,
      });
      triggers.push(headingTrigger);
    }

    // Skill pills staggered animation
    if (pillsRef.current) {
      const pills = pillsRef.current.querySelectorAll('.skill-pill');
      
      gsap.set(pills, { opacity: 0, y: 30, scale: 0.8 });
      
      const pillsTrigger = ScrollTrigger.create({
        trigger: pillsRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(pills, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: {
              each: 0.05,
              from: 'random',
            },
            ease: 'back.out(1.5)',
          });
        },
        once: true,
      });
      triggers.push(pillsTrigger);
    }

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-20 sm:py-28 md:py-40 px-4 sm:px-6 md:px-12" 
      id="skills"
    >
      <div className="max-w-6xl mx-auto">
        <div ref={headingRef}>
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4 sm:mb-6 block">
            Tech Stack
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-10 sm:mb-16 md:mb-20 text-foreground">
            Skills & Technologies
          </h2>
        </div>

        <div 
          ref={pillsRef}
          className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center"
        >
          {skills.map((skill, index) => (
            <SkillPill 
              key={skill.name} 
              skill={skill.name} 
              Icon={skill.Icon}
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;