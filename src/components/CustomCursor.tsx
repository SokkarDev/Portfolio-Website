import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isClicking, setIsClicking] = useState(false);
  
  useEffect(() => {
    // Don't show custom cursor on touch devices
    if ('ontouchstart' in window) return;
    
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsHidden(false);
      
      // Check if hovering over clickable element
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        !!target.closest('a') ||
        !!target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(isClickable);
    };
    
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);
    
    window.addEventListener('mousemove', updatePosition, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Add global style to hide cursor on all elements
    const style = document.createElement('style');
    style.id = 'custom-cursor-style';
    style.textContent = '*, *::before, *::after { cursor: none !important; }';
    document.head.appendChild(style);
    
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.body.style.cursor = 'auto';
      document.getElementById('custom-cursor-style')?.remove();
    };
  }, []);
  
  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }
  
  return (
    <>
      {/* Main cursor blob - bright gradient */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        animate={{
          x: position.x - (isPointer ? 16 : 8),
          y: position.y - (isPointer ? 16 : 8),
          scale: isClicking ? 0.7 : isPointer ? 1.4 : 1,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 800,
          damping: 35,
          mass: 0.3,
        }}
      >
        <div 
          className={`rounded-full transition-all duration-150 ${
            isPointer ? 'w-8 h-8' : 'w-4 h-4'
          }`}
          style={{
            background: isPointer 
              ? 'linear-gradient(135deg, #818cf8 0%, #a855f7 50%, #ec4899 100%)'
              : 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
            boxShadow: isPointer 
              ? '0 0 25px rgba(168, 85, 247, 0.8), 0 0 50px rgba(99, 102, 241, 0.5), 0 0 15px rgba(236, 72, 153, 0.4)' 
              : '0 0 15px rgba(168, 85, 247, 0.7), 0 0 30px rgba(99, 102, 241, 0.4)',
          }}
        />
      </motion.div>
      
      {/* Inner bright core */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        animate={{
          x: position.x - (isPointer ? 6 : 3),
          y: position.y - (isPointer ? 6 : 3),
          scale: isClicking ? 0.5 : 1,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 900,
          damping: 40,
          mass: 0.2,
        }}
      >
        <div 
          className={`rounded-full bg-white transition-all duration-150 ${
            isPointer ? 'w-3 h-3' : 'w-1.5 h-1.5'
          }`}
          style={{
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.9), 0 0 20px rgba(168, 85, 247, 0.6)',
          }}
        />
      </motion.div>
      
      {/* Outer ring on hover - bright */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        animate={{
          x: position.x - 20,
          y: position.y - 20,
          scale: isPointer ? 1 : 0,
          opacity: isHidden ? 0 : isPointer ? 0.8 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 600,
          damping: 30,
        }}
      >
        <div 
          className="w-10 h-10 rounded-full"
          style={{
            border: '1.5px solid rgba(168, 85, 247, 0.7)',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.4), inset 0 0 10px rgba(99, 102, 241, 0.2)',
          }}
        />
      </motion.div>
    </>
  );
}
