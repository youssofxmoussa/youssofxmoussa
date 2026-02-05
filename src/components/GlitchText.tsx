import { cn } from '@/lib/utils';

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchOnHover?: boolean;
  continuous?: boolean;
}

// Simplified - no continuous glitch animation for performance
const GlitchText = ({ text, className }: GlitchTextProps) => {
  return (
    <span className={cn("relative inline-block", className)}>
      {text}
    </span>
  );
};

export default GlitchText;