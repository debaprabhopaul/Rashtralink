'use client';

import React, { useEffect, useRef } from 'react';
import { useApp } from '@/lib/store-context';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  color: string;
  pulseSpeed: number;
  pulsePhase: number;
}

interface Ripple {
  x: number;
  y: number;
  r: number;
  maxR: number;
  alpha: number;
  color: string;
  speed: number;
}

export const InteractiveBackground: React.FC = () => {
  const { personalization } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mouse physics with velocity & smooth lerp
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    vx: 0,
    vy: 0,
    radius: 220,
    active: false,
  });

  const ripplesRef = useRef<Ripple[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    const handleClick = (e: MouseEvent) => {
      const colors = [
        'rgba(232, 93, 4, 0.65)',   // Saffron
        'rgba(16, 185, 129, 0.65)', // Viksit Green
        'rgba(255, 183, 3, 0.65)',  // Royal Gold
        'rgba(59, 130, 246, 0.55)', // Sovereign Indigo
      ];
      const chosenColor = colors[Math.floor(Math.random() * colors.length)];

      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        r: 8,
        maxR: 240,
        alpha: 0.9,
        color: chosenColor,
        speed: 4,
      });

      // Spawn secondary micro-ripple
      setTimeout(() => {
        ripplesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          r: 5,
          maxR: 160,
          alpha: 0.7,
          color: chosenColor,
          speed: 3,
        });
      }, 100);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    // Generate Sovereign Constellation Nodes
    let particles: Particle[] = [];
    const initParticles = () => {
      particles = [];
      const count = Math.min(60, Math.floor((width * height) / 18000));
      const particleColors = [
        'rgba(232, 93, 4, 0.5)',   // Saffron
        'rgba(16, 185, 129, 0.5)', // Viksit Green
        'rgba(255, 183, 3, 0.45)', // Gold
        'rgba(59, 130, 246, 0.4)', // Blue
      ];

      for (let i = 0; i < count; i++) {
        const baseAlpha = Math.random() * 0.4 + 0.2;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          size: Math.random() * 2.8 + 1.2,
          alpha: baseAlpha,
          baseAlpha,
          color: particleColors[Math.floor(Math.random() * particleColors.length)],
          pulseSpeed: Math.random() * 0.03 + 0.015,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    initParticles();

    let time = 0;
    let chakraRotation = 0;

    const render = () => {
      time += 0.006;
      chakraRotation += 0.0008;

      // Physics lerp for mouse
      const prevX = mouseRef.current.x;
      const prevY = mouseRef.current.y;
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.09;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.09;
      mouseRef.current.vx = mouseRef.current.x - prevX;
      mouseRef.current.vy = mouseRef.current.y - prevY;

      ctx.clearRect(0, 0, width, height);

      const isDark = personalization.theme === 'dark';

      // 1. Subtle High-Tech Cyber Dot Grid (Illuminates near cursor)
      const gridSize = 48;
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(8, 29, 52, 0.04)';
      for (let x = gridSize / 2; x < width; x += gridSize) {
        for (let y = gridSize / 2; y < height; y += gridSize) {
          let dotSize = 1;
          let dotAlpha = isDark ? 0.04 : 0.03;

          // Flashlight spotlight near cursor
          if (mouseRef.current.active) {
            const dist = Math.hypot(x - mouseRef.current.x, y - mouseRef.current.y);
            if (dist < 200) {
              const boost = (1 - dist / 200) * 0.15;
              dotAlpha += boost;
              dotSize = 1 + (1 - dist / 200) * 1.5;
            }
          }

          ctx.fillStyle = isDark
            ? `rgba(255, 255, 255, ${dotAlpha})`
            : `rgba(8, 29, 52, ${dotAlpha})`;
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Atmospheric Multi-Spectrum Nebulae
      // Nebula A: Saffron Solar Aura
      const orb1X = width * 0.22 + Math.sin(time * 0.7) * 90;
      const orb1Y = height * 0.28 + Math.cos(time * 0.5) * 70;
      const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 0, orb1X, orb1Y, 400);
      grad1.addColorStop(0, isDark ? 'rgba(232, 93, 4, 0.12)' : 'rgba(232, 93, 4, 0.07)');
      grad1.addColorStop(0.5, isDark ? 'rgba(232, 93, 4, 0.04)' : 'rgba(232, 93, 4, 0.02)');
      grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.arc(orb1X, orb1Y, 400, 0, Math.PI * 2);
      ctx.fill();

      // Nebula B: Viksit Emerald Growth Aura
      const orb2X = width * 0.78 + Math.cos(time * 0.6) * 100;
      const orb2Y = height * 0.68 + Math.sin(time * 0.8) * 80;
      const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, 420);
      grad2.addColorStop(0, isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.06)');
      grad2.addColorStop(0.5, isDark ? 'rgba(16, 185, 129, 0.03)' : 'rgba(16, 185, 129, 0.015)');
      grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.arc(orb2X, orb2Y, 420, 0, Math.PI * 2);
      ctx.fill();

      // Nebula C: Royal Gold Macroeconomic Center
      const orb3X = width * 0.5 + Math.sin(time * 0.4) * 60;
      const orb3Y = height * 0.5 + Math.cos(time * 0.6) * 60;
      const grad3 = ctx.createRadialGradient(orb3X, orb3Y, 0, orb3X, orb3Y, 320);
      grad3.addColorStop(0, isDark ? 'rgba(255, 183, 3, 0.06)' : 'rgba(255, 183, 3, 0.04)');
      grad3.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad3;
      ctx.beginPath();
      ctx.arc(orb3X, orb3Y, 320, 0, Math.PI * 2);
      ctx.fill();

      // 3. Faint Sovereign Mandala Wheel in Background
      const centerX = width / 2;
      const centerY = height / 2;
      const chakraRadius = Math.min(width, height) * 0.38;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(chakraRotation);
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(8, 29, 52, 0.02)';
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.arc(0, 0, chakraRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, chakraRadius * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      // 24 Sovereign Spokes
      for (let s = 0; s < 24; s++) {
        const angle = (s * Math.PI * 2) / 24;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * chakraRadius, Math.sin(angle) * chakraRadius);
        ctx.stroke();
      }
      ctx.restore();

      // 4. Interactive Magnetic Cursor Trailing Halo
      if (mouseRef.current.active && mouseRef.current.x > 0 && mouseRef.current.y > 0) {
        const speed = Math.hypot(mouseRef.current.vx, mouseRef.current.vy);
        const haloRadius = Math.min(300, 200 + speed * 4);

        const mouseGrad = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          haloRadius
        );
        mouseGrad.addColorStop(0, isDark ? 'rgba(232, 93, 4, 0.16)' : 'rgba(232, 93, 4, 0.1)');
        mouseGrad.addColorStop(0.4, isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.04)');
        mouseGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = mouseGrad;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, haloRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Constellation Network Nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Drift
        p.x += p.vx;
        p.y += p.vy;

        // Boundary wrap
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Cursor Physics
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouseRef.current.radius && dist > 0) {
            const force = (mouseRef.current.radius - dist) / mouseRef.current.radius;
            p.x -= (dx / dist) * force * 2.2;
            p.y -= (dy / dist) * force * 2.2;
          }
        }

        // Pulse alpha
        p.pulsePhase += p.pulseSpeed;
        p.alpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.15;

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 125) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / 125) * 0.18;
            ctx.strokeStyle = isDark
              ? `rgba(255, 255, 255, ${lineAlpha})`
              : `rgba(8, 29, 52, ${lineAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // 6. Interactive Click Ripples
      for (let k = ripplesRef.current.length - 1; k >= 0; k--) {
        const rip = ripplesRef.current[k];
        rip.r += rip.speed;
        rip.alpha -= 0.016;

        if (rip.alpha <= 0 || rip.r >= rip.maxR) {
          ripplesRef.current.splice(k, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.strokeStyle = rip.color.replace(/[\d\.]+\)$/, `${rip.alpha})`);
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('click', handleClick);
    };
  }, [personalization.theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      style={{ opacity: 1 }}
    />
  );
};
