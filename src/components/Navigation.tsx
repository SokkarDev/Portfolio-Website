import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dock, DockIcon } from './Dock';
import { cn } from '../cn';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'career', 'projects', 'skills', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const isActive = (href: string) => {
    const id = href.replace('#', '');
    return activeSection === id;
  };

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_24px_-8px_rgba(0,0,0,0.3)]">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 sm:py-3">
        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={() => scrollToSection('#home')} 
            className="flex items-center space-x-1 group shrink-0"
            aria-label="Scroll to top of page"
          >
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-white">Sokkar</span>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">.Dev</span>
            </span>
            <motion.div
              className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </button>

          <div className="hidden md:flex items-center flex-1 justify-center">
            <Dock className="pointer-events-auto relative h-11 px-3 py-2 w-fit flex items-center gap-2 rounded-2xl">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <DockIcon
                    key={link.href}
                    className={cn(
                      'cursor-pointer rounded-xl text-xs font-medium transition-colors',
                      active
                        ? 'bg-gradient-to-r from-indigo-500/80 to-purple-600/80 text-white border border-indigo-400/30 shadow-[0_0_12px_-4px_rgba(129,140,248,0.5)]'
                        : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/15'
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => scrollToSection(link.href)}
                      className="flex h-full w-full items-center justify-center px-4 py-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
                    >
                      <span>{link.name}</span>
                    </button>
                  </DockIcon>
                );
              })}
            </Dock>
          </div>

          <button
            onClick={() => scrollToSection('#contact')}
            className="hidden md:block shrink-0 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
          >
            Start your project
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark rounded-full"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden border-t border-white/10 bg-white/5 backdrop-blur-xl"
          >
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`block w-full text-left text-sm font-medium transition-colors duration-500 ${
                    isActive(link.href)
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.name}
                </button>
              ))}
              <button
                onClick={() => scrollToSection('#contact')}
                className="block w-full text-center px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
              >
                Start your project
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
