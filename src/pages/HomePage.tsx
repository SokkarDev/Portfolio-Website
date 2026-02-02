import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ContactForm } from '../components/ContactForm';
import { useAppReady } from '../App';

// Lazy load the heavy 3D orb
const InteractiveOrb = lazy(() => import('../components/InteractiveOrb').then(m => ({ default: m.InteractiveOrb })));

const services = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: 'Website Development',
    description: 'Building fast, modern, and scalable websites with cutting-edge technologies.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'Website Redesign',
    description: 'Transform your existing website into a faster, more modern, and user-friendly experience.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    title: 'E-commerce Solutions',
    description: 'Creating powerful online stores with custom or Shopify solutions that drive sales.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Performance Optimization',
    description: 'Making your website lightning fast with optimized code, caching, and best practices.',
  },
];

const reviews = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    company: 'TechVenture Inc.',
    avatar: 'SM',
    rating: 5,
    text: 'Working with Sokkar.Dev was an absolute pleasure. The website exceeded our expectations - fast, beautiful, and exactly what we envisioned. Our conversions increased by 40% after launch!',
  },
  {
    id: 2,
    name: 'Ahmed Hassan',
    company: 'Desert Oasis Travel',
    avatar: 'AH',
    rating: 5,
    text: 'Hamza transformed our outdated website into a modern masterpiece. The attention to detail and performance optimization made a huge difference. Highly recommended!',
  },
  {
    id: 3,
    name: 'Emily Chen',
    company: 'Bloom Boutique',
    avatar: 'EC',
    rating: 5,
    text: 'Our Shopify store looks incredible and runs flawlessly. The checkout experience is seamless and our customers love it. Sales have doubled since the redesign!',
  },
  {
    id: 4,
    name: 'Marcus Johnson',
    company: 'FitLife Coaching',
    avatar: 'MJ',
    rating: 4,
    text: 'Great communication throughout the project. The landing page captures our brand perfectly and loads incredibly fast. Would definitely work together again.',
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    company: 'Creative Studios',
    avatar: 'LA',
    rating: 5,
    text: 'Exceptional work! The website is not just visually stunning but also incredibly functional. Every detail was crafted with care. A true professional.',
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

// Placeholder for the orb while loading
function OrbPlaceholder() {
  return (
    <div className="w-full h-[320px] relative flex items-center justify-center">
      <div className="w-40 h-40 bg-purple-500/20 rounded-full blur-[50px] animate-pulse" />
      <div className="absolute w-32 h-32 bg-indigo-500/30 rounded-full blur-[40px] animate-pulse" />
    </div>
  );
}

export function HomePage() {
  const [currentReview, setCurrentReview] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const appReady = useAppReady();
  
  // Use appReady from preloader to trigger animations
  const isHydrated = appReady;

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextReview = () => {
    setIsAutoPlaying(false);
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setIsAutoPlaying(false);
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Slower, smoother animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  return (
    <div>
      {/* Hero Section - Text renders immediately, animations are subtle */}
      <section className="min-h-screen relative flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero text - renders immediately without waiting for animations */}
          <div className="z-10">
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              initial={isHydrated ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Design That Feels.{' '}
              <span className="gradient-text">Experiences That Resonate.</span>
            </motion.h1>
            <motion.p 
              className="text-gray-400 text-lg md:text-xl mb-8 max-w-xl"
              initial={isHydrated ? { opacity: 0, y: 15 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              I blend creativity, emotion, and innovation to craft digital experiences 
              that captivate and inspire. Every pixel tells a story, every website performs.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={isHydrated ? { opacity: 0, y: 15 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Link
                to="/contact"
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-500 text-center"
              >
                Let's Talk
              </Link>
              <Link
                to="/projects"
                className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/5 transition-all duration-500 text-center"
              >
                View Work
              </Link>
            </motion.div>
          </div>
          
          {/* 3D Orb - Only loaded after preloader completes */}
          <div className="hidden lg:block">
            {appReady ? (
              <Suspense fallback={<OrbPlaceholder />}>
                <InteractiveOrb />
              </Suspense>
            ) : (
              <OrbPlaceholder />
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gradient-to-b from-transparent to-purple-900/10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What I Do</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From concept to creation, I offer comprehensive web development solutions that transform ideas into reality.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {services.map((service) => (
              <motion.div
                key={service.title}
                variants={fadeInUp}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -8, transition: { duration: 0.5, ease: "easeOut" } }}
                className="p-6 rounded-2xl glass-effect hover-glow transition-all duration-500 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center mb-4 text-indigo-400">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="text-indigo-400 font-medium mb-4 block">About Me</span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Crafting Digital <span className="gradient-text">Excellence</span>
              </h2>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                I'm Hamza, a passionate web developer based in Egypt who believes that great websites 
                are born from the perfect blend of <span className="text-white font-medium">creativity</span>, 
                <span className="text-white font-medium"> technical expertise</span>, and 
                <span className="text-white font-medium"> genuine care</span> for the user experience.
              </p>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Every project I take on is an opportunity to create something meaningful. I don't just 
                build websites—I craft digital experiences that help businesses grow and leave lasting impressions.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
                  🎯 Detail-Oriented
                </div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
                  ⚡ Performance Focused
                </div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
                  💬 Clear Communication
                </div>
              </div>

              <Link
                to="/services"
                className="inline-flex items-center text-indigo-400 font-medium hover:text-indigo-300 transition-colors duration-500"
              >
                Explore my services
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative"
            >
              {/* Abstract decorative element instead of image */}
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 p-8 relative overflow-hidden">
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-6 grid-rows-6 h-full w-full gap-2 p-4">
                    {[...Array(36)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="rounded-lg bg-gradient-to-br from-indigo-500/30 to-purple-600/30"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.015, ease: "easeOut" }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Center content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center">
                  <motion.div 
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6"
                    animate={{ 
                      boxShadow: [
                        "0 0 30px rgba(99, 102, 241, 0.3)",
                        "0 0 60px rgba(99, 102, 241, 0.5)",
                        "0 0 30px rgba(99, 102, 241, 0.3)"
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="text-5xl font-bold">H</span>
                  </motion.div>
                  <div className="text-center">
                    <p className="text-2xl font-bold mb-1">Hamza Sokkar</p>
                    <p className="text-gray-400">Web Developer</p>
                  </div>
                  
                  {/* Floating elements */}
                  <motion.div 
                    className="absolute top-8 right-8 w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 backdrop-blur-sm flex items-center justify-center"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="text-2xl">💻</span>
                  </motion.div>
                  <motion.div 
                    className="absolute bottom-12 left-8 w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-sm flex items-center justify-center"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  >
                    <span className="text-xl">🚀</span>
                  </motion.div>
                  <motion.div 
                    className="absolute top-1/3 left-4 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-sm flex items-center justify-center"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <span className="text-lg">✨</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-gradient-to-b from-purple-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What Clients Say</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Don't just take my word for it—hear from the people I've worked with.
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Main Review Card */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReview}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="glass-effect rounded-3xl p-8 md:p-12"
                >
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold">{reviews[currentReview].avatar}</span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <StarRating rating={reviews[currentReview].rating} />
                      <p className="text-gray-300 text-lg mt-4 mb-6 leading-relaxed">
                        "{reviews[currentReview].text}"
                      </p>
                      <div>
                        <p className="font-semibold text-white">{reviews[currentReview].name}</p>
                        <p className="text-gray-400 text-sm">{reviews[currentReview].company}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={prevReview}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors duration-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentReview(index);
                    }}
                    className={`h-2 rounded-full transition-all duration-400 ${
                      index === currentReview 
                        ? 'w-8 bg-gradient-to-r from-indigo-500 to-purple-600' 
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextReview}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors duration-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Let's Create Something <span className="gradient-text">Amazing</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Ready to start your next project? I'd love to hear from you. 
                Fill out the form and I'll get back to you within 24 hours.
              </p>

              <div className="space-y-6">
                <motion.div 
                  className="flex items-center space-x-4"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white">Hamzasokkardev@gmail.com</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center space-x-4"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-white">+20 1118777654</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center space-x-4"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-white">Egypt <span className="text-indigo-400">• Working Remotely</span></p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="glass-effect rounded-3xl p-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
