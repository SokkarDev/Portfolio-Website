import { createContext, useContext, useRef, type ReactNode } from 'react';
import {
  motion,
  type MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { cn } from '../cn';

interface DockProps {
  className?: string;
  children: ReactNode;
  magnification?: number;
  distance?: number;
}

interface DockIconProps {
  className?: string;
  children?: ReactNode;
}

const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 100;
const BASE_SIZE = 40;
const BASE_ICON_SIZE = 20;
const ICON_SIZE_RATIO = 0.5;
const SPRING = { mass: 0.1, stiffness: 150, damping: 12 };

interface DockContextValue {
  mouseX: MotionValue<number>;
  magnification: number;
  distance: number;
  reducedMotion: boolean;
}

const DockContext = createContext<DockContextValue | null>(null);

export const Dock = ({
  className,
  children,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
}: DockProps) => {
  const mouseX = useMotionValue(Infinity);
  const reducedMotion = useReducedMotion();

  return (
    <DockContext.Provider value={{ mouseX, magnification, distance, reducedMotion: reducedMotion ?? false }}>
      <motion.div
        onMouseMove={(event) => {
          if (reducedMotion) return;
          mouseX.set(event.pageX);
        }}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(
          'mx-auto w-max h-full flex items-end justify-center overflow-visible rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_20px_-8px_rgba(99,102,241,0.15)]',
          className,
        )}
      >
        {children}
      </motion.div>
    </DockContext.Provider>
  );
};

export const DockIcon = ({ className, children }: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const context = useContext(DockContext);

  if (!context) {
    throw new Error('DockIcon must be used within a Dock component');
  }

  const { mouseX, magnification, distance, reducedMotion } = context;

  const distanceCalc = useTransform(mouseX, (value: number) => {
    if (reducedMotion) return -distance - 1;
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return value - bounds.x - bounds.width / 2;
  });

  const containerScale = useTransform(distanceCalc, [-distance, 0, distance], [BASE_SIZE, magnification, BASE_SIZE]);
  const iconScale = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [BASE_ICON_SIZE, magnification * ICON_SIZE_RATIO, BASE_ICON_SIZE],
  );

  const containerSize = useSpring(containerScale, SPRING);
  const iconSize = useSpring(iconScale, SPRING);

  return (
    <motion.div
      ref={ref}
      style={{ width: containerSize, height: containerSize }}
      className={cn(
        'relative flex aspect-square items-center justify-center rounded-full shrink-0 transition-colors',
        className,
      )}
    >
      <motion.div
        style={{ width: iconSize, height: iconSize }}
        className="flex items-center justify-center"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export type { DockProps, DockIconProps };
