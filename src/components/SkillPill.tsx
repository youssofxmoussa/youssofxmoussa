import { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface SkillPillProps {
  skill: string;
  Icon: LucideIcon;
  index: number;
}

const SkillPill = forwardRef<HTMLDivElement, SkillPillProps>(({ skill, Icon }, ref) => {
  return (
    <div
      ref={ref}
      className="skill-pill px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-border bg-card/50 text-foreground font-medium text-xs sm:text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-110 transition-all duration-300 cursor-default flex items-center gap-2 backdrop-blur-sm"
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      {skill}
    </div>
  );
});

SkillPill.displayName = 'SkillPill';

export default SkillPill;