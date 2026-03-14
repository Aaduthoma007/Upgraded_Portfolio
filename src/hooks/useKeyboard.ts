'use client';

import { useEffect, useRef, useState } from 'react';

interface KeyState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  shift: boolean;
  tab: boolean;
  enter: boolean;
  escape: boolean;
}

export function useKeyboard() {
  const [keys, setKeys] = useState<KeyState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false,
    tab: false,
    enter: false,
    escape: false,
  });

  const tabPressedRef = useRef(false);

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        if (!tabPressedRef.current) {
          tabPressedRef.current = true;
          setKeys((prev) => ({ ...prev, tab: true }));
        }
        return;
      }

      const key = e.key.toLowerCase();
      setKeys((prev) => {
        const next = { ...prev };
        if (key === 'w' || key === 'arrowup') next.forward = true;
        if (key === 's' || key === 'arrowdown') next.backward = true;
        if (key === 'a' || key === 'arrowleft') next.left = true;
        if (key === 'd' || key === 'arrowright') next.right = true;
        if (key === 'shift') next.shift = true;
        if (key === 'enter') next.enter = true;
        if (key === 'escape') next.escape = true;
        return next;
      });
    };

    const handleUp = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        tabPressedRef.current = false;
        setKeys((prev) => ({ ...prev, tab: false }));
        return;
      }

      const key = e.key.toLowerCase();
      setKeys((prev) => {
        const next = { ...prev };
        if (key === 'w' || key === 'arrowup') next.forward = false;
        if (key === 's' || key === 'arrowdown') next.backward = false;
        if (key === 'a' || key === 'arrowleft') next.left = false;
        if (key === 'd' || key === 'arrowright') next.right = false;
        if (key === 'shift') next.shift = false;
        if (key === 'enter') next.enter = false;
        if (key === 'escape') next.escape = false;
        return next;
      });
    };

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  return keys;
}
