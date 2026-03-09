import { useState, lazy, Suspense } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ContactForm } from '../components/ContactForm';
import { useAppReady } from '../App';
import { SkillsMarquee } from '../components/SkillsMarquee';
import { Testimonials } from '../components/Testimonials';

const InteractiveOrb = lazy(() => import('../components/InteractiveOrb').then(m => ({ default: m.InteractiveOrb })));

function OrbPlaceholder() {
  return (
    <div className="w-full h-[300px] lg:h-[400px] relative flex items-center justify-center">
      <div className="w-48 h-48 bg-purple-500/20 rounded-full blur-[60px] animate-pulse" />
      <div className="absolute w-36 h-36 bg-indigo-500/30 rounded-full blur-[50px] animate-pulse" />
    </div>
  );
}

const project = {
  id: 1,
  title: 'Elev8Fitness Gym',
  description: 'Local gym website with class schedules, membership options, and a simple booking flow.',
  outcome: 'Clear timetables and calls to action made it easier for visitors to pick a plan and book a first session.',
  image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop&auto=format&q=70',
  tags: ['HTML', 'CSS', 'WordPress', 'JavaScript'],
  liveUrl: 'https://elev8fitness.wuaze.com/',
};

const experiences = [
  {
    role: 'Freelance Web Developer',
    company: 'Self-Employed',
    location: 'Remote, Worldwide',
    period: '2025 - Present',
    highlights: [
      'Building custom websites for clients using Next.js, TypeScript, React, and modern technologies',
      'Developing high-converting e-commerce stores on Shopify and WordPress platforms',
      'Creating responsive, performance-optimized websites with stunning UI/UX designs',
      'Working directly with clients to deliver tailored solutions that meet their business goals',
    ],
    tags: ['Next.js', 'TypeScript', 'React', 'Shopify', 'WordPress'],
  },
  {
    role: 'E-commerce & UI/UX Specialist',
    company: 'Self-Taught & Freelance',
    location: 'Remote',
    period: '2024 - 2025',
    highlights: [
      'Mastered e-commerce website development with Shopify and WordPress',
      'Focused on creating beautiful animations and polished user interfaces',
      'Developed expertise in UI/UX design principles and user-centered design',
      'Built and customized online stores with seamless shopping experiences',
    ],
    tags: ['Shopify', 'WordPress', 'UI/UX', 'Animations', 'E-commerce'],
  },
  {
    role: 'Self-Taught Developer',
    company: 'Learning & Building',
    location: 'Egypt',
    period: '2023 - 2024',
    highlights: [
      'Started web development journey learning Python, HTML, and CSS through Udemy courses',
      'Applied learned skills by building projects in VS Code and experimenting with WordPress',
      'Gained hands-on experience with Shopify theme customization and development',
      'Built a strong foundation in web fundamentals through self-directed learning',
    ],
    tags: ['Python', 'HTML', 'CSS', 'WordPress', 'Shopify'],
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export function HomePage() {
  const appReady = useAppReady();
  const shouldReduceMotion = useReducedMotion();
  const [emailCopied, setEmailCopied] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navHeight,
        behavior: 'smooth',
      });
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('hamzasokkardev@gmail.com').then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    });
  };

  return (
    <div className="overflow-x-clip">
      {/* ===== Hero Section ===== */}
      <section id="home" className="min-h-[100svh] relative flex items-center pt-20 md:pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="z-10"
          >
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
              style={{ lineHeight: '1.2' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              Websites that turn visitors into{' '}
              <span className="text-gradient-shimmer">clients & sales</span>
            </motion.h1>
            <motion.p 
              className="text-gray-400 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
            >
              I help non‑technical founders, local businesses, and online brands get websites that look premium, load fast, and bring in more enquiries, bookings, and sales.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              <button
                onClick={() => scrollToSection('contact')}
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-500 text-center text-sm sm:text-base"
              >
                Start your project
              </button>
              <button
                onClick={() => scrollToSection('projects')}
                className="px-6 sm:px-8 py-3.5 sm:py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/5 transition-all duration-500 text-center text-sm sm:text-base"
              >
                View client work
              </button>
            </motion.div>
          </motion.div>
          
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: shouldReduceMotion ? 0 : 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
            <motion.div
              animate={shouldReduceMotion ? undefined : { y: [0, 12, 0] }}
              transition={shouldReduceMotion ? undefined : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* ===== About Section ===== */}
      <section id="about" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-transparent to-purple-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-10 sm:mb-16"
          >
            <span className="text-indigo-400 font-medium mb-3 sm:mb-4 block text-sm sm:text-base">About Me</span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4" style={{ lineHeight: '1.3', padding: '0.1em 0' }}>
              Building Digital <span className="text-gradient-shimmer">Experiences</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              Partnering with clients to plan, design, and ship websites that feel premium and perform for their business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeInUp}
              transition={{ duration: 0.8 }}
            >
              <p className="text-gray-300 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                I'm Hamza, a web developer who helps small businesses, founders, and online brands turn vague ideas into clear, high-performing websites. You bring the goals and rough vision—I handle the tech, structure, and details.
              </p>
              <p className="text-gray-400 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                From first call to launch, I guide you through each step: clarifying what the site should do, choosing the right stack, and building a clean, responsive experience that's easy for your customers to use.
              </p>
              <p className="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                Clients work with me because I communicate clearly, meet deadlines, and care about the results—more leads, more bookings, and a brand presence that feels like you.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
              className="grid grid-cols-2 gap-3 sm:gap-4"
            >
              {[
                { label: 'Experience', value: '3+ Years', icon: '📅' },
                { label: 'Location', value: 'Egypt (Remote)', icon: '📍' },
                { label: 'Main Stack', value: 'React / Next.js', icon: '⚛️' },
                { label: 'Specialty', value: 'Web & E-commerce', icon: '🎯' },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  variants={fadeInUp}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:border-indigo-500/30 transition-all duration-500"
                >
                  <span className="text-xl sm:text-2xl mb-2 sm:mb-3 block">{item.icon}</span>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">{item.label}</p>
                  <p className="text-white font-semibold text-sm sm:text-base">{item.value}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Career Journey Section ===== */}
      <section id="career" className="py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-10 sm:mb-16"
          >
            <span className="text-indigo-400 font-medium mb-3 sm:mb-4 block text-sm sm:text-base">Career Journey</span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4" style={{ lineHeight: '1.3', padding: '0.1em 0' }}>
              Professional <span className="text-gradient-shimmer">Experience</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              A timeline of my professional growth and key contributions
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent hidden md:block" />
            
            <div className="space-y-8 sm:space-y-12">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeInUp}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`relative grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 ${
                    index % 2 === 0 ? '' : 'md:direction-rtl'
                  }`}
                >
                  <div className={`${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:order-2 md:pl-12 md:text-left'}`}>
                    <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-indigo-500/30 transition-all duration-500">
                      <div className="mb-3 sm:mb-4 text-left">
                        <h3 className="text-lg sm:text-xl font-bold text-white" style={{ lineHeight: '1.3' }}>{exp.role}</h3>
                        <p className="text-indigo-400 font-medium text-xs sm:text-sm mt-1">{exp.company}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{exp.location} • {exp.period}</p>
                      </div>
                      
                      <ul className="space-y-2 mb-3 sm:mb-4">
                        {exp.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-400 text-xs sm:text-sm">
                            <span className="text-indigo-400 mt-0.5 shrink-0">▹</span>
                            <span className="text-left">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {exp.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex absolute left-1/2 top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 border-4 border-dark z-10" />
                  
                  <div className={`${index % 2 === 0 ? 'md:order-2' : ''} hidden md:block`} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Featured Project Section ===== */}
      <section id="projects" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-purple-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="mb-10 md:mb-14 flex flex-col items-center gap-4 sm:gap-6"
          >
            <div className="flex items-center w-full max-w-2xl">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div className="border border-white/15 bg-white/10 backdrop-blur-xl z-10 rounded-full px-3 sm:px-4 py-1 mx-3 sm:mx-4">
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.18em] text-gray-200">
                  Portfolio
                </span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/15 to-transparent" />
            </div>
            <div className="flex flex-col gap-2 sm:gap-3 items-center text-center">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold" style={{ lineHeight: '1.3', padding: '0.1em 0' }}>
                My Latest <span className="text-gradient-shimmer">Build</span>
              </h2>
              <p className="text-gray-400 max-w-xl text-sm sm:text-base">
                A recent client project showcasing clean design, clear structure, and real business results.
              </p>
            </div>
          </motion.div>

          {/* Single Project Card */}
          <motion.article
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mx-auto"
          >
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-visible hover:border-indigo-500/40 hover:shadow-[0_0_32px_-12px_rgba(129,140,248,0.7)] transition-all duration-300">
              {/* Image */}
              <div className="relative w-full bg-dark/40 overflow-hidden rounded-t-2xl">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-48 sm:h-56 md:h-64 object-cover object-top transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-3 sm:gap-4 p-5 sm:p-7">
                <h3 className="text-xl sm:text-2xl font-bold text-white" style={{ lineHeight: '1.3' }}>
                  {project.title}
                </h3>

                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  {project.description}
                </p>
                <p className="text-xs sm:text-sm text-indigo-200/80 leading-relaxed">
                  {project.outcome}
                </p>

                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs sm:text-sm font-medium text-gray-100 hover:bg-white/10 hover:border-indigo-400/70 transition-colors"
                >
                  <span>View live project</span>
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 text-[11px] sm:text-xs rounded-full border border-white/10 bg-white/5 text-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* ===== Skills Section ===== */}
      <section id="skills" className="py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <span className="text-indigo-400 font-medium mb-3 sm:mb-4 block text-sm sm:text-base">Tech Stack</span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4" style={{ lineHeight: '1.3', padding: '0.1em 0' }}>
              My <span className="text-gradient-shimmer">Skills</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              Hover over any skill to highlight it
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <SkillsMarquee />
        </motion.div>
      </section>

      {/* ===== Testimonials Section ===== */}
      <section id="testimonials" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-purple-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-10 sm:mb-14"
          >
            <span className="text-indigo-400 font-medium mb-3 sm:mb-4 block text-sm sm:text-base">Testimonials</span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4" style={{ lineHeight: '1.3', padding: '0.1em 0' }}>
              What People <span className="text-gradient-shimmer">Say</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              Feedback from clients I've had the pleasure of working with
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-2 sm:mt-3">
              Working with clients worldwide across coaching, services, and online stores.
            </p>
          </motion.div>

          <Testimonials />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 sm:mt-14 text-center space-y-3 sm:space-y-4"
          >
            <p className="text-gray-300 text-sm sm:text-base">
              Want results like this for your business?
            </p>
            <button
              onClick={() => scrollToSection('contact')}
              className="inline-flex px-6 sm:px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-500 text-sm sm:text-base"
              type="button"
            >
              Start your project
            </button>
          </motion.div>
        </div>
      </section>

      {/* ===== Contact Section — Identity Card + Glassmorphic Form ===== */}
      <section id="contact" className="py-16 sm:py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <span className="text-indigo-400 font-medium mb-3 sm:mb-4 block text-sm sm:text-base">Get In Touch</span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4" style={{ lineHeight: '1.3', padding: '0.1em 0' }}>
              Let's Work <span className="text-gradient-shimmer">Together</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              Have a project in mind? Share a few details and I'll come back with a clear, jargon-free plan to move it forward.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 max-w-5xl mx-auto items-start">
            
            {/* ===== LEFT: Identity Card Sidebar ===== */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeInUp}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <div className="glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-6 sm:space-y-8">
                {/* Logo */}
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <div>
                    <span className="text-lg sm:text-xl font-bold tracking-tight block leading-tight">
                      <span className="text-white">Sokkar</span>
                      <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">.Dev</span>
                    </span>
                    <span className="text-gray-500 text-xs">Web Developer & Designer</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Status */}
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-indigo-400 to-purple-500 shadow-[0_0_8px_2px_rgba(139,92,246,0.5)]"></span>
                  </span>
                  <span className="text-sm sm:text-base text-gray-200 font-medium">Available for new work</span>
                </div>

                {/* Email with Copy */}
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-medium">Email</p>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm sm:text-base font-medium break-all flex-1">
                      hamzasokkardev@gmail.com
                    </span>
                    <button
                      onClick={copyEmail}
                      className="shrink-0 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 flex items-center gap-1.5"
                    >
                      {emailCopied ? (
                        <>
                          <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-green-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth={2} />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth={2} />
                          </svg>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-medium">Location</p>
                  <p className="text-gray-200 text-sm sm:text-base">
                    📍 Egypt · Working remotely worldwide
                  </p>
                </div>

                {/* Response Time */}
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-medium">Response Time</p>
                  <p className="text-gray-200 text-sm sm:text-base">
                    ⚡ Typically within 24 hours
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Social Links */}
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-3 font-medium">Connect</p>
                  <div className="flex items-center gap-3">
                    {/* GitHub */}
                    <a
                      href="https://github.com/SokkarDev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300"
                      aria-label="GitHub"
                    >
                      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    {/* LinkedIn */}
                    <a
                      href="https://www.linkedin.com/in/hamza-sokkar?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    {/* Instagram */}
                    <a
                      href="https://www.instagram.com/sokkar.dev?igsh=OTFtZ210djl4aWZr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300"
                      aria-label="Instagram"
                    >
                      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    {/* Email */}
                    <a
                      href="mailto:hamzasokkardev@gmail.com"
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300"
                      aria-label="Email"
                    >
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ===== RIGHT: Glassmorphic Contact Form ===== */}
            <motion.div 
              className="lg:col-span-3 glass-form rounded-2xl sm:rounded-3xl p-5 sm:p-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeInUp}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
