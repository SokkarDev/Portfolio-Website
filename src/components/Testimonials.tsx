import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Quote, Star, ArrowLeft, ArrowRight } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
  keypoint: string;
  results: string[];
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Founder, online coaching brand',
    text: "I came in with a rough idea and a list of frustrations. Hamza turned it into a clean, fast website that actually gets people to book calls. Clear communication, no tech overwhelm.",
    rating: 5,
    keypoint: 'More bookings & clear communication',
    results: ['More bookings', 'Clear communication', 'No tech overwhelm'],
  },
  {
    id: 2,
    name: 'Ahmed Hassan',
    role: 'Owner, local service business',
    text: "Other developers over-complicated everything. Hamza kept it simple, explained options in plain language, and delivered on time. Customers now tell me they found us because the site was easy to use.",
    rating: 5,
    keypoint: 'Simple, on time & easy to use',
    results: ['Delivered on time', 'Easy to use', 'More customers'],
  },
  {
    id: 3,
    name: 'Emily Chen',
    role: 'Founder, Shopify store',
    text: "Hamza built my Shopify store from scratch and captured my brand perfectly. The site feels modern, loads quickly, and makes it easy for shoppers to find what they need. I finally feel confident sending people to my store.",
    rating: 5,
    keypoint: 'Modern store that converts',
    results: ['Built from scratch', 'Fast loading', 'Brand-perfect design'],
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 600 : -600,
    opacity: 0,
    scale: 0.92,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 600 : -600,
    opacity: 0,
    scale: 0.92,
  }),
};

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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
    const timer = setInterval(() => {
      nextTestimonial();
    }, 6000);
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

  const current = testimonials[currentIndex];
  const initials = current.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main Testimonial Card */}
      <div className="relative min-h-[380px] sm:min-h-[340px] md:min-h-[300px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.35 },
              scale: { duration: 0.35 },
            }}
            className="absolute inset-0"
          >
            <div className="relative h-full rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-5 sm:p-8 md:p-10 overflow-visible group hover:border-indigo-500/20 transition-colors duration-500">
              {/* Subtle animated gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-purple-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Quote icon - top right */}
              <motion.div
                className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-[0.12]"
                animate={{ rotate: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Quote className="w-10 h-10 sm:w-14 sm:h-14 text-indigo-400" />
              </motion.div>

              <div className="relative z-10 h-full flex flex-col md:flex-row items-start md:items-center gap-5 sm:gap-6 md:gap-8">
                {/* Left: Author info */}
                <div className="flex-shrink-0 flex flex-row md:flex-col items-center md:items-center gap-3 md:gap-0 md:text-center md:min-w-[140px]">
                  {/* Avatar */}
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-indigo-500/40 to-purple-600/40 border border-white/15 flex items-center justify-center">
                      <span className="text-sm sm:text-lg md:text-xl font-bold text-white/90">{initials}</span>
                    </div>
                    {/* Pulse ring */}
                    <motion.div
                      className="absolute inset-0 border border-indigo-400/20 rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 0, 0.4],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </motion.div>

                  {/* Name & role - beside avatar on mobile, below on desktop */}
                  <div className="md:mt-3">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-white" style={{ lineHeight: '1.3' }}>
                      {current.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                      {current.role}
                    </p>

                    {/* Stars - visible on mobile inline, on desktop below */}
                    <div className="flex gap-0.5 mt-1.5 md:mt-2 md:justify-center">
                      {[...Array(current.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
                        >
                          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Quote + Results */}
                <div className="flex-1 flex flex-col gap-4 sm:gap-5">
                  {/* Testimonial text */}
                  <motion.blockquote
                    className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    "{current.text}"
                  </motion.blockquote>

                  {/* Results pills */}
                  <div className="flex flex-wrap gap-2">
                    {current.results.map((result, i) => (
                      <motion.span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] sm:text-xs font-medium text-indigo-300"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                      >
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className="flex justify-center items-center gap-4 sm:gap-6 mt-6 sm:mt-8">
        <motion.button
          onClick={handlePrev}
          className="p-2.5 sm:p-3 rounded-full bg-white/[0.05] border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          type="button"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>

        {/* Dots */}
        <div className="flex gap-2 sm:gap-3">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-7 sm:w-8 h-2 sm:h-2.5 bg-gradient-to-r from-indigo-500 to-purple-600'
                  : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/20 hover:bg-white/40'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              type="button"
            />
          ))}
        </div>

        <motion.button
          onClick={handleNext}
          className="p-2.5 sm:p-3 rounded-full bg-white/[0.05] border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
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
