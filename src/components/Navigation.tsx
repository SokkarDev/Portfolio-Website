import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', href: '#home', sections: ['home'] },
  { name: 'About', href: '#about', sections: ['about', 'career'] },
  { name: 'Projects', href: '#projects', sections: ['projects'] },
  { name: 'Skills', href: '#skills', sections: ['skills'] },
  { name: 'Contact', href: '#contact', sections: ['testimonials', 'contact'] },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'career', 'projects', 'skills', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          if (scrollPosition >= offsetTop) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((href: string) => {
    const id = href.replace('#', '');
    setIsOpen(false);
    
    requestAnimationFrame(() => {
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const navHeight = 100;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - navHeight,
            behavior: 'smooth',
          });
        }
      }, 50);
    });
  }, []);

  const isActive = (link: typeof navLinks[0]) => {
    return link.sections.includes(activeSection);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3 px-4 sm:py-4 md:py-6 md:px-8">
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center justify-center relative max-w-7xl mx-auto">
        {/* LEFT: Logo */}
        <div className="absolute left-0">
          <button
            onClick={() => scrollToSection('#home')}
            className="relative h-14 rounded-full liquid-glass flex items-center justify-center px-6 transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-xl shadow-black/10"
            aria-label="Scroll to top"
          >
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">Sokkar</span>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">.Dev</span>
            </span>
          </button>
        </div>

        {/* CENTER: Nav Links Pill */}
        <nav className="flex items-center gap-1 liquid-glass rounded-full shadow-xl shadow-black/10 h-14 px-4 md:px-6">
          {navLinks.map((link) => {
            const active = isActive(link);
            return (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="relative text-sm font-semibold rounded-full transition-colors duration-300 cursor-pointer flex items-center px-4 md:px-6 py-2.5"
              >
                {active && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-full bg-purple-500/10 border border-purple-500/30"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors duration-300 ${
                    active ? 'text-gray-100' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {link.name}
                </span>
              </button>
            );
          })}
        </nav>

        {/* RIGHT: Start your project */}
        <div className="absolute right-0">
          <button
            onClick={() => scrollToSection('#contact')}
            className="liquid-glass rounded-full shadow-xl shadow-black/10 flex items-center gap-2 text-sm font-semibold transition-transform duration-300 hover:scale-105 h-14 px-6 text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6" />
              <path d="M10 14L21 3" />
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            </svg>
            <span>Start your project</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between">
          <button
            onClick={() => scrollToSection('#home')}
            className="flex items-center space-x-1"
            aria-label="Scroll to top"
          >
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">Sokkar</span>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">.Dev</span>
            </span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="liquid-glass rounded-full shadow-xl shadow-black/10 p-3.5 relative z-[60]"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <div className="w-5 h-4 flex flex-col justify-between relative">
              <span className={`block h-0.5 w-5 rounded-full bg-white transition-all duration-300 origin-center ${isOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${isOpen ? 'opacity-0 scale-0' : 'opacity-100'}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-white transition-all duration-300 origin-center ${isOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </div>
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="overflow-visible relative z-50"
              >
                <div className="liquid-glass rounded-2xl shadow-xl shadow-black/10 mt-4 p-4">
                  <div className="flex flex-col gap-2">
                    {navLinks.map((link) => {
                      const active = isActive(link);
                      return (
                        <button
                          key={link.href}
                          onClick={() => scrollToSection(link.href)}
                          className={`text-sm font-semibold rounded-full transition-all duration-300 cursor-pointer text-center py-3 px-6 ${
                            active
                              ? 'text-gray-100 bg-purple-500/10 border border-purple-500/30'
                              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          {link.name}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => scrollToSection('#contact')}
                      className="flex items-center justify-center gap-2 text-sm font-semibold rounded-full transition-transform duration-300 mt-2 hover:scale-[1.02] py-3 px-6 text-white border border-white/10 bg-gradient-to-r from-indigo-500/20 to-purple-600/20"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h6v6" />
                        <path d="M10 14L21 3" />
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      </svg>
                      <span>Start your project</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
