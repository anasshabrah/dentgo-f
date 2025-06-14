// src/hooks/useAutoResizeTextarea.ts
import { useLayoutEffect, useRef } from 'react';

export default function useAutoResizeTextarea<T extends HTMLTextAreaElement>() {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const resize = () => {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    };
    resize();
    el.addEventListener('input', resize);
    return () => el.removeEventListener('input', resize);
  }, []);

  return ref;
}
