import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Volume2, VolumeX } from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';

const Navigation = () => {
  const navItems = ['About', 'Work', 'Skills', 'Contact'];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { playClick, playHover, playWhoosh, soundEnabled, toggleSound } = useSound();

  const handleNavClick = () => {
    playClick();
    setIsMenuOpen(false);
  };

  const handleMenuToggle = () => {
    playWhoosh();
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-12 py-4 sm:py-6 bg-background/80 backdrop-blur-lg"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.a 
            href="#"
            className="font-display text-lg sm:text-xl font-bold text-foreground z-50"
            whileHover={{ scale: 1.05 }}
            onMouseEnter={playHover}
            onClick={playClick}
          >
            YM<span className="text-muted-foreground">.</span>
          </motion.a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors animated-underline tracking-wide"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                onMouseEnter={playHover}
                onClick={playClick}
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* Sound Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <motion.button
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => {
                playClick();
                toggleSound();
              }}
              onMouseEnter={playHover}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </motion.button>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden z-50 p-2 text-foreground"
              onClick={handleMenuToggle}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop CTA Button */}
          <motion.a
            href="#contact"
            className="hidden md:block px-6 py-2 bg-foreground text-background rounded-full font-medium text-sm hover:glow-primary transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={playHover}
            onClick={playClick}
          >
            Let's Talk
          </motion.a>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={handleNavClick}
                  onMouseEnter={playHover}
                  className="text-3xl font-display font-bold text-foreground hover:text-primary transition-colors"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {item}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={handleNavClick}
                onMouseEnter={playHover}
                className="mt-8 px-8 py-4 bg-foreground text-background rounded-full font-medium text-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                Let's Talk
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
