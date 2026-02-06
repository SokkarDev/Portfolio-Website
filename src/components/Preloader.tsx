import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { preloadParticleSphere } from './InteractiveOrb';

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  const finishLoading = useCallback(() => {
    sessionStorage.setItem('sokkar-loaded', 'true');
    setProgress(100);
    setTimeout(() => {
      setIsVisible(false);
    }, 400);
  }, []);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('sokkar-loaded');
    if (hasLoaded) {
      setShouldRender(false);
      onComplete();
      return;
    }

    let currentProgress = 0;
    let rafId: number;
    let isComplete = false;

    const updateProgress = (target: number) => {
      if (isComplete) return;
      const increment = (target - currentProgress) * 0.1;
      currentProgress = Math.min(target, currentProgress + Math.max(increment, 0.5));
      setProgress(Math.floor(currentProgress));
      if (currentProgress < target) {
        rafId = requestAnimationFrame(() => updateProgress(target));
      }
    };

    if (document.readyState === 'loading') {
      updateProgress(20);
      document.addEventListener('DOMContentLoaded', () => updateProgress(40));
    } else {
      currentProgress = 40;
      setProgress(40);
    }

    const checkStylesLoaded = () => {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          updateProgress(55);
        });
      } else {
        updateProgress(55);
      }
    };
    setTimeout(checkStylesLoaded, 50);

    // Start preloading 3D scene
    const preload3D = async () => {
      try {
        updateProgress(60);
        await preloadParticleSphere();
        updateProgress(85);
      } catch {
        updateProgress(85);
      }
    };
    
    setTimeout(preload3D, 200);

    const handleLoad = () => {
      updateProgress(90);
    };

    if (document.readyState === 'complete') {
      setTimeout(() => updateProgress(90), 100);
    } else {
      window.addEventListener('load', handleLoad);
    }

    const completeLoading = () => {
      isComplete = true;
      cancelAnimationFrame(rafId);
      finishLoading();
    };

    const scheduleComplete = () => {
      if ('requestIdleCallback' in window) {
        (window as Window).requestIdleCallback(completeLoading, { timeout: 1500 });
      } else {
        setTimeout(completeLoading, 300);
      }
    };

    const minDisplayTime = 1200;
    const startTime = performance.now();

    const onReady = () => {
      const elapsed = performance.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsed);
      setTimeout(scheduleComplete, remainingTime);
    };

    if (document.readyState === 'complete') {
      onReady();
    } else {
      window.addEventListener('load', onReady);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('load', onReady);
    };
  }, [finishLoading, onComplete]);

  const handleExitComplete = () => {
    setShouldRender(false);
    onComplete();
  };

  if (!shouldRender) return null;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-indigo-900/10" />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative flex flex-col items-center"
          >
            <div className="flex items-center gap-1 mb-8">
              <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Sokkar
              </span>
              <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                .Dev
              </span>
            </div>
            <div className="w-48 md:w-56 h-[2px] bg-white/10 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-sm text-white/60 font-light tracking-wide"
            >
              Brewing your experience
            </motion.p>
          </motion.div>
          <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-white/5 rounded-tl-lg" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-white/5 rounded-br-lg" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
