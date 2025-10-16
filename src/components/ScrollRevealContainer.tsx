import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import clsx from 'clsx';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
  stagger?: boolean;
  from?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
    rotationX?: number;
    rotationY?: number;
  };
  to?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
    rotationX?: number;
    rotationY?: number;
  };
}

const ScrollRevealContainer = ({
  children,
  className = '',
  threshold = 0.1,
  delay = 0,
  stagger = false,
  from = { opacity: 0, y: 50 },
  to = { opacity: 1, y: 0 }
}: ScrollRevealProps) => {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = revealRef.current;
    if (!container || typeof window === 'undefined') {
      // Fallback: ensure visibility even if effect doesn't run
      if (container) {
        container.style.opacity = '1';
        container.style.transform = 'none';
      }
      return;
    }

    const reduceMotionQuery = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    const prefersReducedMotion = reduceMotionQuery?.matches ?? false;

    if (prefersReducedMotion) {
      gsap.set(container, { opacity: 1, clearProps: 'transform' });

      if (stagger && container.children.length) {
        gsap.set(container.children, { opacity: 1, clearProps: 'transform' });
      }
      return;
    }

    // Fallback timeout to ensure visibility after 2 seconds regardless of scroll position
    const fallbackTimer = setTimeout(() => {
      if (container) {
        gsap.to(container, {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.3,
          clearProps: 'transform',
        });
        if (stagger && container.children.length) {
          gsap.to(container.children, {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.3,
            clearProps: 'transform',
          });
        }
      }
    }, 2000);

    const scrollerElement = container.closest('[data-scroll]') as HTMLElement | null;

    const ctx = gsap.context(() => {
      const triggerBase = {
        trigger: container,
        start: `top bottom-=${threshold * 100}%`,
        once: true,
        ...(scrollerElement ? { scroller: scrollerElement } : {}),
      };

      if (stagger && container.children.length) {
        gsap.set(container.children, { ...from });

        ScrollTrigger.create({
          ...triggerBase,
          onEnter: () => {
            clearTimeout(fallbackTimer);
            gsap.to(container.children, {
              ...to,
              stagger: 0.1,
              duration: 0.7,
              ease: 'power2.out',
              delay,
            });
          },
        });
      } else {
        gsap.set(container, { ...from });

        ScrollTrigger.create({
          ...triggerBase,
          onEnter: () => {
            clearTimeout(fallbackTimer);
            gsap.to(container, {
              ...to,
              duration: 0.7,
              ease: 'power2.out',
              delay,
            });
          },
        });
      }

      window.requestAnimationFrame(() => ScrollTrigger.refresh());
    }, revealRef);

    return () => {
      clearTimeout(fallbackTimer);
      ctx.revert();
    };
  }, [threshold, delay, stagger, from, to]);
  
  return (
    <div 
      ref={revealRef} 
      className={clsx(
        stagger ? 'reveal-stagger' : 'reveal', 
        className
      )}
      style={{ willChange: 'opacity, transform' }}
      aria-hidden="false"
    >
      {children}
    </div>
  );
};

export default ScrollRevealContainer; 
