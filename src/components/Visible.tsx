'use client';
// A box that knows whether it is on screen (data-on), so CSS can pause animation nobody can see.
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

export function Visible({ className, style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.toggleAttribute('data-on', e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={className} style={style}>{children}</div>;
}
