'use client';
import { useEffect, useRef } from 'react';

export function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let animId: number;
    const particles = Array.from({ length: 12 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1.5,
      speedY: Math.random() * 0.4 + 0.2,
      opacity: Math.random() * 0.4,
      rotation: Math.random() * Math.PI * 2,
    }));

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.y -= p.speedY;
        p.rotation += 0.015;
        if (p.y < -10) {
          particles[i] = { x: Math.random() * canvas.width, y: canvas.height + 10, size: Math.random() * 3 + 1.5, speedY: Math.random() * 0.4 + 0.2, opacity: 0, rotation: Math.random() * Math.PI * 2 };
          return;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity * 0.7;
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
        g.addColorStop(0, '#FCD34D');
        g.addColorStop(1, '#D97706');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.5 }} />
      <div className="fixed top-[-120px] right-[-120px] w-[500px] h-[500px] rounded-full pointer-events-none z-0 animate-pulse" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.1), transparent)', filter: 'blur(100px)', animationDuration: '8s' }} />
      <div className="fixed bottom-[100px] left-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none z-0 animate-pulse" style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.08), transparent)', filter: 'blur(100px)', animationDuration: '7s', animationDelay: '2s' }} />
    </>
  );
}
