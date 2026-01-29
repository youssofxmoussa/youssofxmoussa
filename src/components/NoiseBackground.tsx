import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const NoiseBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      canvas.width = width;
      canvas.height = height;
      createNoise();
    };

    // Create subtle noise texture
    const createNoise = () => {
      if (canvas.width <= 0 || canvas.height <= 0) return;
      
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 15;
        data[i] = noise;
        data[i + 1] = noise;
        data[i + 2] = noise;
        data[i + 3] = 20; // Very subtle opacity
      }

      ctx.putImageData(imageData, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // Animate gradient orbs
    if (gradientRef.current) {
      const orbs = gradientRef.current.querySelectorAll('.gradient-orb');
      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          x: gsap.utils.random(-100, 100),
          y: gsap.utils.random(-100, 100),
          duration: gsap.utils.random(10, 20),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 2,
        });
      });
    }

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Base black background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Subtle gradient orbs */}
      <div ref={gradientRef} className="absolute inset-0 overflow-hidden">
        <div className="gradient-orb absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-[radial-gradient(circle,hsl(40_20%_92%/0.03)_0%,transparent_70%)]" />
        <div className="gradient-orb absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[radial-gradient(circle,hsl(40_20%_92%/0.02)_0%,transparent_70%)]" />
        <div className="gradient-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,hsl(40_20%_92%/0.01)_0%,transparent_50%)]" />
      </div>

      {/* Noise texture overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 mix-blend-overlay opacity-50"
      />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(0_0%_2%)_100%)]" />
    </div>
  );
};

export default NoiseBackground;
