import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MagneticWrapperProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
}

// Simplified - removed magnetic physics for performance
const MagneticWrapper = ({ children, className }: MagneticWrapperProps) => {
  return (
    <div className={cn("relative inline-block", className)}>
      {children}
    </div>
  );
};

export default MagneticWrapper;