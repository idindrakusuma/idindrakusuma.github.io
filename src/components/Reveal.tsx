'use client';

import { createElement, useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

/**
 * Fades + slides an element in the first time it enters the viewport.
 *
 * One shared IntersectionObserver serves every instance on the page rather than
 * one per element. Children are passed through untouched, so server components
 * can be wrapped without becoming client components themselves.
 */

type RevealCallback = () => void;

let observer: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, RevealCallback>();

function getObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return null;
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          callbacks.get(entry.target)?.();
          callbacks.delete(entry.target);
          observer?.unobserve(entry.target);
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
    );
  }
  return observer;
}

type RevealProps = {
  as?: ElementType;
  /** Stagger, in ms, applied as an animation-delay. */
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
} & Record<string, unknown>;

export default function Reveal({ as = 'div', delay = 0, className, style, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    const io = getObserver();
    if (!io) {
      setVisible(true);
      return;
    }

    callbacks.set(el, () => setVisible(true));
    io.observe(el);

    return () => {
      callbacks.delete(el);
      io.unobserve(el);
    };
  }, [visible]);

  return createElement(
    as,
    {
      ...rest,
      ref,
      className: className ? `ik-reveal ${className}` : 'ik-reveal',
      'data-visible': visible ? 'true' : undefined,
      style: delay ? { ...style, animationDelay: `${delay}ms` } : style,
    },
    children,
  );
}
