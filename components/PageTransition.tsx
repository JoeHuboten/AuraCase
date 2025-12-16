'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isTransitioning 
          ? 'opacity-0 translate-y-2' 
          : 'opacity-100 translate-y-0'
      }`}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
