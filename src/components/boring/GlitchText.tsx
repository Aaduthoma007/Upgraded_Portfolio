'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useMouseTracker } from '@/hooks/useMouseTracker';

export default function GlitchText() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useMouseTracker();
  const isHoveringResume = useRef(false);
  const animRef = useRef<number>(0);

  const checkHover = useCallback(() => {
    const resumeEl = document.getElementById('resume-page');
    if (!resumeEl) return;
    const rect = resumeEl.getBoundingClientRect();
    isHoveringResume.current =
      mouse.clientX >= rect.left &&
      mouse.clientX <= rect.right &&
      mouse.clientY >= rect.top &&
      mouse.clientY <= rect.bottom;
  }, [mouse.clientX, mouse.clientY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      checkHover();

      if (isHoveringResume.current) {
        canvas.classList.add('active');

        const cx = mouse.clientX;
        const cy = mouse.clientY;
        const radius = 120;

        // RGB Shift effect - chromatic aberration
        const shift = 3 + Math.sin(Date.now() * 0.005) * 1.5;

        // Red channel - offset left
        ctx.globalCompositeOperation = 'screen';
        const gradR = ctx.createRadialGradient(cx - shift, cy, 0, cx - shift, cy, radius);
        gradR.addColorStop(0, 'rgba(255, 40, 40, 0.12)');
        gradR.addColorStop(0.5, 'rgba(255, 40, 40, 0.04)');
        gradR.addColorStop(1, 'rgba(255, 40, 40, 0)');
        ctx.fillStyle = gradR;
        ctx.fillRect(cx - radius - shift, cy - radius, radius * 2, radius * 2);

        // Blue channel - offset right
        const gradB = ctx.createRadialGradient(cx + shift, cy, 0, cx + shift, cy, radius);
        gradB.addColorStop(0, 'rgba(40, 40, 255, 0.12)');
        gradB.addColorStop(0.5, 'rgba(40, 40, 255, 0.04)');
        gradB.addColorStop(1, 'rgba(40, 40, 255, 0)');
        ctx.fillStyle = gradB;
        ctx.fillRect(cx - radius + shift, cy - radius, radius * 2, radius * 2);

        // Vertex jitter - small random noise dots
        ctx.globalCompositeOperation = 'source-over';
        const jitterCount = 15;
        for (let i = 0; i < jitterCount; i++) {
          const jx = cx + (Math.random() - 0.5) * radius * 1.5;
          const jy = cy + (Math.random() - 0.5) * radius * 1.5;
          const dist = Math.sqrt((jx - cx) ** 2 + (jy - cy) ** 2);
          if (dist > radius) continue;

          const opacity = 0.08 * (1 - dist / radius);
          ctx.fillStyle = `rgba(${Math.random() > 0.5 ? 255 : 0}, ${Math.random() > 0.5 ? 255 : 0}, ${Math.random() > 0.5 ? 255 : 0}, ${opacity})`;
          ctx.fillRect(jx, jy, Math.random() * 4 + 1, 1);
        }

        // Scan line artifact
        if (Math.random() > 0.92) {
          const scanY = cy + (Math.random() - 0.5) * 60;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
          ctx.fillRect(cx - radius, scanY, radius * 2, 1);
        }
      } else {
        canvas.classList.remove('active');
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [mouse.clientX, mouse.clientY, checkHover]);

  return <canvas ref={canvasRef} className="glitch-canvas" />;
}
