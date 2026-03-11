'use client';

import { useEffect, useRef, useState } from 'react';

interface MousePos {
  x: number; // -1 to 1
  y: number; // -1 to 1
  clientX: number;
  clientY: number;
}

export function useMouseTracker() {
  const [mouse, setMouse] = useState<MousePos>({ x: 0, y: 0, clientX: 0, clientY: 0 });
  const rafRef = useRef<number>(0);
  const latestRef = useRef<MousePos>({ x: 0, y: 0, clientX: 0, clientY: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      latestRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
        clientX: e.clientX,
        clientY: e.clientY,
      };
    };

    const update = () => {
      setMouse({ ...latestRef.current });
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener('mousemove', handleMove);
    rafRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return mouse;
}
