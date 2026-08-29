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
      // threshold 0, not a fraction of the element. A ratio can never be reached
      // by anything taller than the viewport divided by it — at 0.14 an element
      // more than ~7 viewports tall never fires and stays invisible for good,
      // which is what happened to every long article body. Firing on first
      // contact behaves the same for a card and is the only form that holds for
      // an element of any height; the negative bottom margin is what keeps the
      // reveal from starting right at the edge of the screen.
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
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
