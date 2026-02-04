import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

const InteractiveParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false });
  const animationRef = useRef<number>();

  const createParticle = useCallback((x: number, y: number): Particle => ({
    x,
    y,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.5 + 0.2,
    hue: Math.random() * 60 + 200, // Blue-purple range
  }), []);

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const particles: Particle[] = [];
    const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      ));
    }
    
    particlesRef.current = particles;
  }, [createParticle]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    particles.forEach((p, i) => {
      // Mouse interaction - attraction/repulsion
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 200 && mouse.isMoving) {
        const force = (200 - dist) / 200;
        // Particles follow mouse with delay
        p.vx += dx * force * 0.02;
        p.vy += dy * force * 0.02;
      }

      // Apply velocity with friction
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;
      p.vy *= 0.98;

      // Boundary wrap
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw particle with glow
      ctx.save();
      ctx.globalAlpha = p.opacity;
      
      // Glow effect
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      gradient.addColorStop(0, `hsla(${p.hue}, 70%, 60%, 0.8)`);
      gradient.addColorStop(0.5, `hsla(${p.hue}, 70%, 60%, 0.3)`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, 1)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();

      // Draw connections
      particles.slice(i + 1).forEach(p2 => {
        const dx2 = p.x - p2.x;
        const dy2 = p.y - p2.y;
        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        
        if (dist2 < 120) {
          ctx.save();
          ctx.globalAlpha = (1 - dist2 / 120) * 0.15;
          ctx.strokeStyle = `hsl(${(p.hue + p2.hue) / 2}, 60%, 50%)`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.restore();
        }
      });
    });

    // Mouse trail effect
    if (mouse.isMoving) {
      const gradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, 100
      );
      gradient.addColorStop(0, 'hsla(var(--primary), 0.1)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2);
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, isMoving: true };
      
      // Add new particles occasionally on mouse move
      if (Math.random() > 0.9 && particlesRef.current.length < 100) {
        particlesRef.current.push(createParticle(e.clientX, e.clientY));
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.isMoving = false;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, createParticle, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default InteractiveParticles;
