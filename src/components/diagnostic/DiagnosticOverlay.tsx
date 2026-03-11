'use client';

import React, { useRef, useEffect } from 'react';
import { githubStats } from '@/data/resume';

const langColors: Record<string, string> = {
  Python: '#E8A87C',
  Java: '#6C9BCF',
  C: '#D35F5F',
  JavaScript: '#EAD94C',
  Other: '#6B7280',
};

interface DiagnosticOverlayProps {
  active: boolean;
}

export default function DiagnosticOverlay({ active }: DiagnosticOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const columnsRef = useRef<number[]>([]);

  // Matrix rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF{}[]<>/\\|;:.,!@#$%^&*()+=~`';
    const fontSize = 12;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cols = Math.floor(canvas.width / fontSize);
      columnsRef.current = Array(cols).fill(0).map(() => Math.random() * canvas.height / fontSize);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.fillStyle = 'rgba(11, 14, 23, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#E8A87C';
      ctx.font = `${fontSize}px monospace`;

      columnsRef.current.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;

        // Vary color subtly
        if (Math.random() > 0.9) {
          ctx.fillStyle = '#6C9BCF';
        } else if (Math.random() > 0.95) {
          ctx.fillStyle = '#D35F5F';
        } else {
          ctx.fillStyle = `rgba(232, 168, 124, ${0.4 + Math.random() * 0.4})`;
        }

        ctx.fillText(char, x, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          columnsRef.current[i] = 0;
        }
        columnsRef.current[i] += 0.6;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    if (active) {
      animRef.current = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return (
    <>
      {/* Matrix rain canvas */}
      <canvas
        ref={canvasRef}
        className={`matrix-canvas ${active ? 'active' : ''}`}
      />

      {/* Stats panel */}
      <div className={`diagnostic-overlay ${active ? 'active' : ''}`}>
        <div className="diag-header">⌘ DIAGNOSTIC MODE</div>

        <div className="diag-section" style={{ marginBottom: 28 }}>
          <h3>System Operator</h3>
          <div style={{ fontSize: 13, marginBottom: 4, color: 'var(--accent-warm)' }}>
            @{githubStats.username}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {githubStats.totalCommits} commits tracked
          </div>
        </div>

        <div className="diag-section" style={{ marginBottom: 28 }}>
          <h3>Language Distribution</h3>
          {Object.entries(githubStats.languages).map(([lang, pct]) => (
            <div className="lang-bar" key={lang}>
              <span className="label">{lang}</span>
              <div className="track">
                <div
                  className="fill"
                  style={{
                    width: active ? `${pct}%` : '0%',
                    background: langColors[lang] || '#6B7280',
                    transitionDelay: `${Object.keys(githubStats.languages).indexOf(lang) * 100}ms`,
                  }}
                />
              </div>
              <span className="pct">{pct}%</span>
            </div>
          ))}
        </div>

        <div className="diag-section" style={{ marginBottom: 28 }}>
          <h3>Active Repositories</h3>
          {githubStats.topRepos.map((repo) => (
            <div key={repo} style={{
              fontSize: 11,
              padding: '6px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              color: 'var(--text-primary)',
            }}>
              <span style={{ color: 'var(--accent-cool)' }}>●</span>{' '}
              {repo}
            </div>
          ))}
        </div>

        <div className="diag-section">
          <h3>Render Info</h3>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.8 }}>
            Engine: Three.js r172<br />
            Renderer: WebGL 2.0<br />
            Framework: Next.js 15<br />
            State: Zustand<br />
            Audio: Web Audio API
          </div>
        </div>

        <div style={{
          marginTop: 24,
          fontSize: 9,
          color: 'var(--text-muted)',
          textAlign: 'center',
          letterSpacing: 1,
        }}>
          PRESS TAB TO EXIT
        </div>
      </div>
    </>
  );
}
