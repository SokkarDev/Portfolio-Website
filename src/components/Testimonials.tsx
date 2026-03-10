import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Quote, Star, ArrowLeft, ArrowRight } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
  results: string[];
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Founder, online coaching brand',
    text: "I came in with a rough idea and a list of frustrations. Hamza turned it into a clean, fast website that actually gets people to book calls. Clear communication, no tech overwhelm.",
    rating: 5,
    results: ['More bookings', 'Clear communication', 'No tech overwhelm'],
  },
  {
    id: 2,
    name: 'Ahmed Hassan',
    role: 'Owner, local service business',
    text: "Other developers over-complicated everything. Hamza kept it simple, explained options in plain language, and delivered on time. Customers now tell me they found us because the site was easy to use.",
    rating: 5,
    results: ['Delivered on time', 'Easy to use', 'More customers'],
  },
  {
    id: 3,
    name: 'Emily Chen',
    role: 'Founder, Shopify store',
    text: "Hamza built my Shopify store from scratch and captured my brand perfectly. The site feels modern, loads quickly, and makes it easy for shoppers to find what they need. I finally feel confident sending people to my store.",
    rating: 5,
    results: ['Built from scratch', 'Fast loading', 'Brand-perfect design'],
  },
];

const SWIPE_THRESHOLD = 50;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 400 : -400,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 400 : -400,
    opacity: 0,
    scale: 0.95,
  }),
};

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextTestimonial = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(nextTestimonial, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextTestimonial]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    prevTestimonial();
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    nextTestimonial();
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Touch / drag swipe handler
  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const { offset, velocity } = info;
    const swipe = Math.abs(offset.x) * velocity.x;

    if (offset.x < -SWIPE_THRESHOLD || swipe < -500) {
      setIsAutoPlaying(false);
      nextTestimonial();
    } else if (offset.x > SWIPE_THRESHOLD || swipe > 500) {
      setIsAutoPlaying(false);
      prevTestimonial();
    }
  };

  const current = testimonials[currentIndex];
  const initials = current.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="relative max-w-4xl mx-auto" ref={containerRef}>
      {/* Swipe hint on mobile */}
      <div className="flex items-center justify-center gap-1.5 mb-2.5 sm:mb-4 sm:hidden">
        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        <span className="text-[9px] text-gray-500">Swipe to navigate</span>
        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>

      {/* Main Testimonial Card */}
      <div
        className="relative min-h-[240px] sm:min-h-[300px] md:min-h-[280px] touch-pan-y"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 280, damping: 28 },
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 },
            }}
            className="absolute inset-0"
            // Enable drag (swipe) — primarily for mobile but works on desktop too
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
          >
            <div className="relative h-full rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-3.5 sm:p-6 md:p-10 overflow-visible group hover:border-indigo-500/20 transition-colors duration-500 select-none">
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-purple-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Quote icon */}
              <motion.div
                className="absolute top-3 right-3 sm:top-6 sm:right-6 opacity-[0.12]"
                animate={{ rotate: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Quote className="w-7 h-7 sm:w-10 sm:h-10 md:w-14 md:h-14 text-indigo-400" />
              </motion.div>

              <div className="relative z-10 h-full flex flex-col md:flex-row items-start md:items-center gap-3 sm:gap-5 md:gap-8 pointer-events-none">
                {/* Left: Author */}
                <div className="flex-shrink-0 flex flex-row md:flex-col items-center md:items-center gap-2.5 sm:gap-3 md:gap-0 md:text-center md:min-w-[140px]">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-indigo-500/40 to-purple-600/40 border border-white/15 flex items-center justify-center">
                      <span className="text-xs sm:text-base md:text-xl font-bold text-white/90">{initials}</span>
                    </div>
                    <motion.div
                      className="absolute inset-0 border border-indigo-400/20 rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 0, 0.4],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </div>

                  {/* Name & role */}
                  <div className="md:mt-3">
                    <h3 className="text-xs sm:text-sm md:text-lg font-bold text-white" style={{ lineHeight: '1.3' }}>
                      {current.name}
                    </h3>
                    <p className="text-[9px] sm:text-[11px] md:text-xs text-gray-500 mt-0.5">
                      {current.role}
                    </p>
                    {/* Stars */}
                    <div className="flex gap-0.5 mt-1 sm:mt-1.5 md:mt-2 md:justify-center">
                      {[...Array(current.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
                        >
                          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 fill-amber-400 text-amber-400" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Quote + Results */}
                <div className="flex flex-col gap-2 sm:gap-4 md:gap-5">
                  <motion.blockquote
                    className="text-[11px] sm:text-sm md:text-lg text-gray-300 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    &ldquo;{current.text}&rdquo;
                  </motion.blockquote>

                  {/* Result pills */}
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
                    {current.results.map((result, i) => (
                      <motion.span
                        key={i}
                        className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[8px] sm:text-[10px] md:text-xs font-medium text-indigo-300"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                      >
                        <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {result}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center gap-3 sm:gap-6 mt-4 sm:mt-8">
        {/* Left arrow — hidden on small mobile, visible on sm+ */}
        <motion.button
          onClick={handlePrev}
          className="hidden sm:flex p-2.5 sm:p-3 rounded-full bg-white/[0.05] border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          type="button"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>

        {/* Dots — tiny & minimalist */}
        <div className="flex gap-1.5 sm:gap-2">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-2 h-2 sm:w-5 sm:h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600'
                  : 'w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 bg-white/20 hover:bg-white/40'
              }`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Right arrow — hidden on small mobile, visible on sm+ */}
        <motion.button
          onClick={handleNext}
          className="hidden sm:flex p-2.5 sm:p-3 rounded-full bg-white/[0.05] border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          type="button"
        >
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      </div>
    </div>
  );
}
