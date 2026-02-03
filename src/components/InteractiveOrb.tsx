import { useState, useEffect, lazy, Suspense, useCallback, useRef } from 'react';
import { mousePosition, orbHoverState } from './OrbScene';
import { useAppReady } from '../App';

const Canvas = lazy(() => import('@react-three/fiber').then(m => ({ default: m.Canvas })));
const OrbScene = lazy(() => import('./OrbScene'));

function OrbPlaceholder() {
  return (
    <div className="w-full h-[280px] relative flex items-center justify-center">
      <div className="w-32 h-32 bg-purple-500/20 rounded-full blur-[50px] animate-pulse" />
      <div className="absolute w-24 h-24 bg-indigo-500/30 rounded-full blur-[40px] animate-pulse" />
    </div>
  );
}

let preloadStarted = false;
let preloadComplete = false;

function preloadOrb() {
  if (preloadStarted) return;
  preloadStarted = true;
  
  Promise.all([
    import('@react-three/fiber'),
    import('@react-three/drei'),
    import('./OrbScene')
  ]).then(() => {
    preloadComplete = true;
  }).catch(() => {});
}

if (typeof window !== 'undefined') {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(preloadOrb, { timeout: 2000 });
  } else {
    setTimeout(preloadOrb, 100);
  }
}

export function InteractiveOrb() {
  const [shouldRender, setShouldRender] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const appReady = useAppReady();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mousePosition.x = (e.clientX - centerX) / (rect.width / 2);
    mousePosition.y = -(e.clientY - centerY) / (rect.height / 2);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    orbHoverState.isHovered = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    orbHoverState.isHovered = false;
  }, []);

  useEffect(() => {
    if (!appReady) return;

    if (preloadComplete) {
      setShouldRender(true);
      return;
    }

    const checkReady = setInterval(() => {
      if (preloadComplete) {
        setShouldRender(true);
        clearInterval(checkReady);
      }
    }, 100);

    const fallback = setTimeout(() => {
      setShouldRender(true);
      clearInterval(checkReady);
    }, 500);

    return () => {
      clearInterval(checkReady);
      clearTimeout(fallback);
    };
  }, [appReady]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  if (!shouldRender) {
    return <OrbPlaceholder />;
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[280px] relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-500">
        <div className={`rounded-full blur-[50px] transition-all duration-500 ${
          isHovered ? 'w-44 h-44 bg-purple-500/30' : 'w-32 h-32 bg-purple-500/20'
        }`} />
        <div className={`absolute rounded-full blur-[40px] transition-all duration-500 ${
          isHovered ? 'w-36 h-36 bg-indigo-500/40' : 'w-24 h-24 bg-indigo-500/30'
        }`} />
      </div>
      
      <Suspense fallback={<OrbPlaceholder />}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          style={{ background: 'transparent' }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <OrbScene />
          </Suspense>
        </Canvas>
      </Suspense>
      
      <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-500 transition-opacity duration-500 ${
        isHovered ? 'opacity-0' : 'opacity-50'
      }`}>
        Hover to interact
      </div>
    </div>
  );
}
