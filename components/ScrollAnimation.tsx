'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollAnimationProps {
  children: ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleUp' | 'slideUpStagger';
  delay?: number;
  duration?: number;
  trigger?: string;
  className?: string;
}

export default function ScrollAnimation({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 1,
  trigger,
  className = ''
}: ScrollAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    
    // Set initial state based on animation type
    switch (animation) {
      case 'fadeIn':
        gsap.set(element, { opacity: 0, y: 30 });
        break;
      case 'slideUp':
        gsap.set(element, { opacity: 0, y: 50 });
        break;
      case 'slideLeft':
        gsap.set(element, { opacity: 0, x: -50 });
        break;
      case 'slideRight':
        gsap.set(element, { opacity: 0, x: 50 });
        break;
      case 'scaleUp':
        gsap.set(element, { opacity: 0, scale: 0.8 });
        break;
      case 'slideUpStagger':
        gsap.set(element, { opacity: 0, y: 30 });
        break;
    }

    // Check if element is already in view on load
    const rect = element.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isInView) {
      // If already in view, show immediately
      gsap.set(element, { opacity: 1, y: 0, x: 0, scale: 1 });
    }

    // Create animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger ? trigger : element,
        start: 'top 90%',
        end: 'bottom 10%',
        toggleActions: 'play none none reverse'
      }
    });

    // Add animation based on type
    switch (animation) {
      case 'fadeIn':
        tl.to(element, { opacity: 1, y: 0, duration, delay, ease: 'power2.out' });
        break;
      case 'slideUp':
        tl.to(element, { opacity: 1, y: 0, duration, delay, ease: 'power2.out' });
        break;
      case 'slideLeft':
        tl.to(element, { opacity: 1, x: 0, duration, delay, ease: 'power2.out' });
        break;
      case 'slideRight':
        tl.to(element, { opacity: 1, x: 0, duration, delay, ease: 'power2.out' });
        break;
      case 'scaleUp':
        tl.to(element, { opacity: 1, scale: 1, duration, delay, ease: 'back.out(1.7)' });
        break;
      case 'slideUpStagger':
        tl.to(element, { opacity: 1, y: 0, duration, delay, ease: 'power2.out' });
        break;
    }

    return () => {
      tl.kill();
    };
  }, [animation, delay, duration, trigger]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

// Stagger animation component for multiple elements
interface StaggerAnimationProps {
  children: ReactNode[];
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleUp';
  stagger?: number;
  duration?: number;
  className?: string;
}

export function StaggerAnimation({
  children,
  animation = 'fadeIn',
  stagger = 0.1,
  duration = 0.8,
  className = ''
}: StaggerAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.children;
    
    // Set initial state for all children
    gsap.set(elements, {
      opacity: 0,
      y: animation === 'slideUp' ? 50 : animation === 'slideLeft' ? -50 : animation === 'slideRight' ? 50 : 30,
      x: animation === 'slideLeft' ? -50 : animation === 'slideRight' ? 50 : 0,
      scale: animation === 'scaleUp' ? 0.8 : 1
    });

    // Check if container is already in view on load
    const rect = containerRef.current.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isInView) {
      // If already in view, show immediately
      gsap.set(elements, { opacity: 1, y: 0, x: 0, scale: 1 });
    }

    // Create stagger animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 90%',
        end: 'bottom 10%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.to(elements, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration,
      stagger,
      ease: animation === 'scaleUp' ? 'back.out(1.7)' : 'power2.out'
    });

    return () => {
      tl.kill();
    };
  }, [animation, stagger, duration]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
