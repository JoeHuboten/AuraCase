'use client';

import dynamic from 'next/dynamic';
import { ReactNode, Suspense } from 'react';

// Lazy load the ScrollAnimation component with GSAP
const LazyScrollAnimation = dynamic(() => import('./ScrollAnimation'), {
  ssr: false,
  loading: () => null, // Render nothing during load - the content will still be visible
});

const LazyStaggerAnimation = dynamic(
  () => import('./ScrollAnimation').then((mod) => ({ default: mod.StaggerAnimation })),
  {
    ssr: false,
    loading: () => null,
  }
);

interface ScrollAnimationProps {
  children: ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleUp' | 'slideUpStagger';
  delay?: number;
  duration?: number;
  trigger?: string;
  className?: string;
}

interface StaggerAnimationProps {
  children: ReactNode[];
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleUp';
  stagger?: number;
  duration?: number;
  className?: string;
}

/**
 * Lazy-loaded ScrollAnimation wrapper
 * Uses dynamic import to defer loading of GSAP until needed
 * This reduces the initial bundle size
 */
export function ScrollAnimationLazy({
  children,
  className = '',
  ...props
}: ScrollAnimationProps) {
  return (
    <Suspense fallback={<div className={className}>{children}</div>}>
      <LazyScrollAnimation className={className} {...props}>
        {children}
      </LazyScrollAnimation>
    </Suspense>
  );
}

export function StaggerAnimationLazy({
  children,
  className = '',
  ...props
}: StaggerAnimationProps) {
  return (
    <Suspense fallback={<div className={className}>{children}</div>}>
      <LazyStaggerAnimation className={className} {...props}>
        {children}
      </LazyStaggerAnimation>
    </Suspense>
  );
}

// Re-export the lazy versions as default for easy migration
export default ScrollAnimationLazy;
