import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  {
    name: 'Home',
    href: '#home',
    sections: ['home'],
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    name: 'About',
    href: '#about',
    sections: ['about', 'career'],
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    name: 'Projects',
    href: '#projects',
    sections: ['projects'],
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
      </svg>
    ),
  },
  {
    name: 'Skills',
    href: '#skills',
    sections: ['skills'],
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 2 7l10 5 10-5-10-5Z" />
        <path d="m2 17 10 5 10-5" />
        <path d="m2 12 10 5 10-5" />
      </svg>
    ),
  },
  {
    name: 'Contact',
    href: '#contact',
    sections: ['testimonials', 'contact'],
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const scrollToSection = useCallback((href: string) => {
    const id = href.replace('#', '');
    setMobileOpen(false);
    requestAnimationFrame(() => {
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const navHeight = 80;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - navHeight,
            behavior: 'smooth',
          });
        }
      }, 100);
    });
  }, []);

  const isActive = (link: typeof navLinks[0]) => {
    return link.sections.includes(activeSection);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4">
      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto">
        <div className="liquid-glass rounded-2xl px-3 sm:px-4 md:px-5 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <button
              onClick={() => scrollToSection('#home')}
              className="flex items-center gap-1.5 shrink-0 group"
              aria-label="Scroll to top"
            >
              <span className="text-lg sm:text-xl font-bold tracking-tight">
                <span className="text-white">Sokkar</span>
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">.Dev</span>
              </span>
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </button>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-0.5 bg-white/[0.03] rounded-full px-1.5 py-1 border border-white/[0.04]">
              {navLinks.map((link) => {
                const active = isActive(link);
                return (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className="relative flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300"
                  >
                    {active && (
                      <motion.span
                        layoutId="desktopActiveNav"
                        className="absolute inset-0 rounded-full bg-purple-500/10 border border-purple-500/20"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span
                      className={`relative z-10 transition-colors duration-300 ${
                        active ? 'text-purple-300' : 'text-gray-400 hover:text-purple-300'
                      }`}
                    >
                      {link.icon}
                    </span>
                    <span
                      className={`relative z-10 transition-colors duration-300 hidden lg:inline ${
                        active ? 'text-gray-100' : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {link.name}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <button
              onClick={() => scrollToSection('#contact')}
              className="hidden md:flex items-center gap-2 shrink-0 px-4 lg:px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6" />
                <path d="M10 14L21 3" />
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
              <span>Get Your Website</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white transition-all duration-300 hover:bg-white/[0.08]"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <div className="w-[18px] h-[14px] flex flex-col justify-between">
                <span
                  className={`block h-[1.5px] w-full rounded-full bg-white transition-all duration-300 origin-center ${
                    mobileOpen ? 'rotate-45 translate-y-[6.25px]' : ''
                  }`}
                />
                <span
                  className={`block h-[1.5px] w-full rounded-full bg-white transition-all duration-300 ${
                    mobileOpen ? 'opacity-0 scale-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`block h-[1.5px] w-full rounded-full bg-white transition-all duration-300 origin-center ${
                    mobileOpen ? '-rotate-45 -translate-y-[6.25px]' : ''
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Mobile Dropdown */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="md:hidden overflow-hidden"
              >
                <div className="pt-3 pb-2 border-t border-white/[0.06] mt-3">
                  <div className="flex flex-col gap-1">
                    {navLinks.map((link) => {
                      const active = isActive(link);
                      return (
                        <button
                          key={link.href}
                          onClick={() => scrollToSection(link.href)}
                          className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                            active
                              ? 'bg-purple-500/10 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                          }`}
                        >
                          <span className={`transition-colors duration-300 ${active ? 'text-purple-400' : 'text-gray-500'}`}>
                            {link.icon}
                          </span>
                          <span>{link.name}</span>
                          {active && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_2px_rgba(168,85,247,0.5)]" />
                          )}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => scrollToSection('#contact')}
                      className="flex items-center justify-center gap-2 mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h6v6" />
                        <path d="M10 14L21 3" />
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      </svg>
                      <span>Get Your Website</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
