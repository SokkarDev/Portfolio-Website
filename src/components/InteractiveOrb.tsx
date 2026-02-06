import { useState, useEffect, lazy, Suspense, useCallback, useRef } from 'react';
import { mousePosition } from './ParticleSphere';
import { useAppReady } from '../App';

const Canvas = lazy(() => import('@react-three/fiber').then(m => ({ default: m.Canvas })));
const ParticleSphere = lazy(() => import('./ParticleSphere'));

function OrbPlaceholder() {
  return (
    <div className="w-full h-[320px] relative flex items-center justify-center">
      <div className="w-32 h-32 bg-purple-500/20 rounded-full blur-[50px] animate-pulse" />
      <div className="absolute w-24 h-24 bg-indigo-500/30 rounded-full blur-[40px] animate-pulse" />
    </div>
  );
}

let preloadStarted = false;
let preloadComplete = false;

export function preloadParticleSphere() {
  if (preloadStarted) return Promise.resolve();
  preloadStarted = true;
  
  return Promise.all([
    import('@react-three/fiber'),
    import('three'),
    import('./ParticleSphere')
  ]).then(() => {
    preloadComplete = true;
  }).catch(() => {
    preloadComplete = true;
  });
}

if (typeof window !== 'undefined') {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => preloadParticleSphere(), { timeout: 2000 });
  } else {
    setTimeout(() => preloadParticleSphere(), 100);
  }
}

export function InteractiveOrb() {
  const [shouldRender, setShouldRender] = useState(false);
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
      className="w-full h-[320px] relative"
    >
      {/* Glow background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-40 h-40 bg-purple-500/20 rounded-full blur-[60px]" />
        <div className="absolute w-32 h-32 bg-indigo-500/25 rounded-full blur-[50px]" />
      </div>
      
      <Suspense fallback={<OrbPlaceholder />}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          style={{ background: 'transparent' }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <ParticleSphere />
          </Suspense>
        </Canvas>
      </Suspense>
    </div>
  );
}
