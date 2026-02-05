import { ReactNode, forwardRef } from 'react';
import { useSound } from '@/contexts/SoundContext';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ children, className = '', onClick }, ref) => {
    const { playClick } = useSound();

    const handleClick = () => {
      playClick();
      onClick?.();
    };

    return (
      <button
        ref={ref}
        className={`relative overflow-hidden ${className}`}
        onClick={handleClick}
      >
        {children}
      </button>
    );
  }
);

MagneticButton.displayName = 'MagneticButton';

export default MagneticButton;