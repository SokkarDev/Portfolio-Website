import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ContactForm } from '../components/ContactForm';
import { useAppReady } from '../App';

const InteractiveOrb = lazy(() => import('../components/InteractiveOrb').then(m => ({ default: m.InteractiveOrb })));
const IconSphere = lazy(() => import('../components/IconSphere').then(m => ({ default: m.IconSphere })));

function IconSpherePlaceholder() {
  return (
    <div className="relative flex w-full max-w-[28rem] md:max-w-[32rem] aspect-square mx-auto items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="flex flex-col items-center gap-4">
        <div className="w-32 h-32 bg-purple-500/20 rounded-full blur-[50px] animate-pulse" />
        <div className="w-24 h-24 bg-indigo-500/30 rounded-full blur-[40px] animate-pulse absolute" />
      </div>
    </div>
  );
}

function OrbPlaceholder() {
  return (
    <div className="w-full h-[400px] relative flex items-center justify-center">
      <div className="w-48 h-48 bg-purple-500/20 rounded-full blur-[60px] animate-pulse" />
      <div className="absolute w-36 h-36 bg-indigo-500/30 rounded-full blur-[50px] animate-pulse" />
    </div>
  );
}

// Project data with dark gradient backgrounds for premium dark theme
const projects = [
  {
    id: 1,
    number: '01',
    title: 'Elev8Fitness Gym',
    description: 'Local gym website with class schedules, membership options, and a simple booking flow.',
    clientType: 'Local fitness studio',
    clientGoal: 'Get more trial signups and recurring memberships',
    outcome: 'Clear timetables and calls to action made it easier for visitors to pick a plan and book a first session.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop&auto=format&q=70',
    tags: ['HTML', 'CSS', 'WordPress', 'JavaScript'],
    gradient: 'from-indigo-900/60 to-purple-900/60',
    liveUrl: 'https://elev8fitness.wuaze.com/',
    isFlagship: true,
    stackSummary: 'Custom WordPress theme with booking integration',
  },
  {
    id: 2,
    number: '02',
    title: 'Fashion E-Commerce',
    description: 'Modern Shopify storefront with product filters, collections, and smooth checkout.',
    clientType: 'Growing fashion brand',
    clientGoal: 'Launch an online store that feels on-brand and easy to shop',
    outcome: 'A clean layout and fast product pages made browsing feel effortless, helping turn more visitors into paying customers.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&auto=format&q=70',
    tags: ['Shopify', 'Liquid', 'JavaScript', 'Custom Theme'],
    gradient: 'from-purple-900/60 to-fuchsia-900/60',
    liveUrl: null,
    stackSummary: 'Custom Shopify theme tailored to the brand',
  },
  {
    id: 3,
    number: '03',
    title: 'Corporate Website',
    description: 'Consulting website with clear service pages and trust-building content layout.',
    clientType: 'B2B consulting firm',
    clientGoal: 'Look more credible to corporate clients and simplify enquiry flow',
    outcome: 'Structured pages and clear next steps helped visitors quickly understand services and reach out.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&auto=format&q=70',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    gradient: 'from-blue-900/60 to-indigo-900/60',
    liveUrl: null,
    stackSummary: 'Static marketing site built with Next.js',
  },
  {
    id: 4,
    number: '04',
    title: 'Creative Portfolio',
    description: 'Photographer portfolio with galleries, categories, and a simple enquiry form.',
    clientType: 'Independent photographer',
    clientGoal: 'Showcase work beautifully and make it easy to request shoots',
    outcome: 'Large imagery and focused contact sections encouraged more visitors to reach out.',
    image: 'https://images.unsplash.com/photo-1545665277-5ac240ac9aed?w=800&h=600&fit=crop&auto=format&q=70',
    tags: ['React', 'Framer Motion', 'CSS Grid'],
    gradient: 'from-emerald-900/60 to-teal-900/60',
    liveUrl: null,
    stackSummary: 'Single-page React portfolio with gallery lightbox',
  },
];

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

const reviews = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Founder, online coaching brand',
    text: "I came in with a rough idea and a list of frustrations. Hamza turned it into a clean, fast website that actually gets people to book calls. Clear communication, no tech overwhelm.",
  },
  {
    id: 2,
    name: 'Ahmed Hassan',
    role: 'Owner, local service business',
    text: "Other developers over-complicated everything. Hamza kept it simple, explained options in plain language, and delivered on time. Customers now tell me they found us because the site was easy to use.",
  },
  {
    id: 3,
    name: 'Emily Chen',
    role: 'Founder, Shopify store',
    text: "Hamza built my Shopify store from scratch and captured my brand perfectly. The site feels modern, loads quickly, and makes it easy for shoppers to find what they need. I finally feel confident sending people to my store.",
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

  const [currentReview, setCurrentReview] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Projects carousel state for mobile
  const [currentProject, setCurrentProject] = useState(0);

  useEffect(() => {
    if (!isAutoPlaying || shouldReduceMotion) return;
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, shouldReduceMotion]);

  const nextReview = () => {
    setIsAutoPlaying(false);
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setIsAutoPlaying(false);
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const nextProject = () => {
    setCurrentProject((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section id="home" className="min-h-screen relative flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="z-10"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-indigo-400 font-medium mb-4"
            >
              Web developer for small businesses & e‑commerce brands
            </motion.p>
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Websites that turn visitors into{' '}
              <span className="text-gradient-shimmer">clients & sales</span>
            </motion.h1>
            <motion.p 
              className="text-gray-400 text-lg md:text-xl mb-8 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              I help non‑technical founders, local businesses, and online brands get websites that look premium, load fast, and bring in more enquiries, bookings, and sales.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button
                onClick={() => scrollToSection('contact')}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-500 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
              >
                Start your project
              </button>
              <button
                onClick={() => scrollToSection('projects')}
                className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/5 transition-all duration-500 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
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
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
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

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-b from-transparent to-purple-900/10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-indigo-400 font-medium mb-4 block">About Me</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Building Digital <span className="text-gradient-shimmer">Experiences</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Partnering with clients to plan, design, and ship websites that feel premium and perform for their business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ duration: 0.8 }}
            >
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                I'm Hamza, a web developer who helps small businesses, founders, and online brands turn vague ideas into clear, high-performing websites. You bring the goals and rough vision—I handle the tech, structure, and details.
              </p>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                From first call to launch, I guide you through each step: clarifying what the site should do, choosing the right stack, and building a clean, responsive experience that’s easy for your customers to use.
              </p>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Clients work with me because I communicate clearly, meet deadlines, and care about the results—more leads, more bookings, and a brand presence that feels like you.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-2 gap-4"
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
                  className="glass-effect rounded-2xl p-6 text-center hover:border-indigo-500/30 transition-all duration-500"
                >
                  <span className="text-2xl mb-3 block">{item.icon}</span>
                  <p className="text-gray-400 text-sm mb-1">{item.label}</p>
                  <p className="text-white font-semibold">{item.value}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Career Journey Section */}
      <section id="career" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-indigo-400 font-medium mb-4 block">Career Journey</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Professional <span className="text-gradient-shimmer">Experience</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A timeline of my professional growth and key contributions
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent hidden md:block" />
            
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeInUp}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 ${
                    index % 2 === 0 ? '' : 'md:direction-rtl'
                  }`}
                >
                  <div className={`${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:order-2 md:pl-12 md:text-left'}`}>
                    <div className="glass-effect rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-500">
                      {/* Title and info stacked below - all left aligned */}
                      <div className="mb-4 text-left">
                        <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                        <p className="text-indigo-400 font-medium text-sm mt-1">{exp.company}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{exp.location} • {exp.period}</p>
                      </div>
                      
                      <ul className="space-y-2 mb-4">
                        {exp.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                            <span className="text-indigo-400 mt-1">▹</span>
                            <span className="text-left">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="flex flex-wrap gap-2">
                        {exp.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="hidden md:flex absolute left-1/2 top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 border-4 border-dark" />
                  
                  <div className={`${index % 2 === 0 ? 'md:order-2' : ''} hidden md:block`} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section - Premium Cards Grid */}
      <section id="projects" className="py-24 bg-gradient-to-b from-purple-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="mb-12 md:mb-16 flex flex-col items-center gap-6"
          >
            <div className="flex items-center w-full max-w-2xl">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div className="border border-white/15 bg-white/10 backdrop-blur-xl z-10 rounded-full px-4 py-1 mx-4">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-gray-200">
                  Portfolio
                </span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/15 to-transparent" />
            </div>
            <div className="flex flex-col gap-3 items-center text-center">
              <h2 className="text-3xl md:text-5xl font-bold">
                Featured <span className="text-gradient-shimmer">Projects</span>
              </h2>
              <p className="text-gray-400 max-w-2xl">
                A selection of case-study style client work across fitness, fashion, consulting, and creative services.
              </p>
              <p className="text-gray-500 text-sm">
                Each project is designed to be clear, fast, and focused on business results.
              </p>
            </div>
          </motion.div>

          {/* Desktop Grid (Hidden on Mobile) */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 gap-6 auto-rows-fr max-w-5xl mx-auto">
            {projects.map((project, index) => {
              const meta = `${project.clientType} • ${project.clientGoal}`;
              const benefitCopy = `${project.description} ${project.outcome}`;

              return (
                <motion.article
                  key={project.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  variants={fadeInUp}
                  transition={{ duration: 0.7, delay: index * 0.08 }}
                  className="flex h-full"
                >
                  <div className="flex flex-col h-full w-full rounded-2xl border border-white/10 bg-white/5/80 backdrop-blur-xl overflow-hidden hover:border-indigo-500/40 hover:shadow-[0_0_32px_-12px_rgba(129,140,248,0.7)] transition-all duration-300">
                    {/* Media */}
                    <div className="relative w-full overflow-hidden bg-dark/40">
                      <div className="absolute inset-0 bg-gradient-to-br opacity-60 mix-blend-screen pointer-events-none" />
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-48 object-cover object-top transition-transform duration-700 hover:scale-105"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <header className="flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-1">
                          <h3 className="text-lg font-semibold text-white">
                            {project.title}
                          </h3>
                          <p className="text-xs font-medium uppercase tracking-[0.16em] text-indigo-200/80">
                            {meta}
                          </p>
                        </div>
                        <span className="text-sm font-mono text-gray-500">
                          {project.number.padStart(2, '0')}
                        </span>
                      </header>

                      <p className="text-sm text-gray-300 leading-relaxed line-clamp-4">
                        {benefitCopy}
                      </p>

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-gray-100 hover:bg-white/10 hover:border-indigo-400/70 transition-colors"
                        >
                          <span>View live project</span>
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 text-[11px] rounded-full border border-white/12 bg-white/5 text-gray-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Mobile Carousel (Visible on Mobile) */}
          <div className="md:hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                {/* Mobile Card */}
                <div
                  className={`relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden shadow-lg`}
                >
                  <div className="relative">
                    <img
                      src={projects[currentProject].image}
                      alt={projects[currentProject].title}
                      loading="lazy"
                      className="w-full h-40 object-cover object-top"
                    />
                  </div>

                  <div className="p-5 flex flex-col gap-3 bg-gradient-to-b from-dark/40 via-transparent to-transparent">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">
                          {projects[currentProject].title}
                        </h3>
                        <span className="text-xs font-mono text-gray-500">
                          {projects[currentProject].number.padStart(2, '0')}
                        </span>
                      </div>
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-indigo-200/90">
                        {projects[currentProject].clientType} • {projects[currentProject].clientGoal}
                      </p>
                    </div>

                    <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                      {projects[currentProject].description}
                    </p>
                    <p className="text-xs text-indigo-100/90 line-clamp-3">
                      {projects[currentProject].outcome}
                    </p>

                    {projects[currentProject].liveUrl && (
                      <a
                        href={projects[currentProject].liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/15 mt-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Live
                      </a>
                    )}

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {projects[currentProject].tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 text-[11px] rounded-full border border-white/12 bg-white/5 text-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Mobile Navigation */}
            <div className="flex items-center justify-between mt-8 px-2">
              <button
                onClick={prevProject}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex gap-2">
                {projects.map((_, index) => (
                  <div 
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentProject 
                        ? 'w-6 bg-indigo-500' 
                        : 'w-1.5 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextProject}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Skills Section - Interactive 3D Icon Sphere */}
      <section id="skills" className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <span className="text-indigo-400 font-medium mb-4 block">Tech Stack</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              My <span className="text-gradient-shimmer">Skills</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Drag to rotate, hover over any skill to see its business value
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <Suspense fallback={<IconSpherePlaceholder />}>
            <IconSphere />
          </Suspense>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-purple-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <span className="text-indigo-400 font-medium mb-4 block">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              What People <span className="text-gradient-shimmer">Say</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Feedback from clients I've had the pleasure of working with
            </p>
            <p className="text-gray-500 text-sm mt-3">
              Working with clients worldwide across coaching, services, and online stores.
            </p>
          </motion.div>

          {/* Carousel testimonials */}
          <div className="relative max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentReview}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="glass-effect rounded-3xl p-8 md:p-12"
                style={{ minHeight: '280px' }}
              >
                <div className="flex flex-col justify-between h-full">
                  <p className="text-gray-300 dark:text-gray-300 text-lg md:text-xl leading-relaxed text-center mb-8">
                    "{reviews[currentReview].text}"
                  </p>
                  <div className="text-center">
                    <p className="font-semibold text-white text-lg">— {reviews[currentReview].name}</p>
                    <p className="text-sm text-gray-400 mt-1">{reviews[currentReview].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={prevReview}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Dots indicator */}
              <div className="flex gap-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentReview(index);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark ${
                      index === currentReview 
                        ? 'w-8 bg-gradient-to-r from-indigo-500 to-purple-600' 
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    type="button"
                  />
                ))}
              </div>

              <button
                onClick={nextReview}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-12 text-center space-y-4">
            <p className="text-gray-300">
              Want results like this for your business?
            </p>
            <button
              onClick={() => scrollToSection('contact')}
              className="inline-flex px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
              type="button"
            >
              Start your project
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-indigo-400 font-medium mb-4 block">Get In Touch</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Let's Work <span className="text-gradient-shimmer">Together</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Have a project in mind? Share a few details and I’ll come back with a clear, jargon-free plan to move it forward.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ duration: 0.8 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '📧', label: 'Email', value: 'hamzasokkardev@gmail.com' },
                  { icon: '📍', label: 'Location', value: 'Egypt (Remote)' },
                  { icon: '🟢', label: 'Availability', value: 'Open for projects' },
                  { icon: '⏰', label: 'Response Time', value: 'Within 24 hours' },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    variants={fadeInUp}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="glass-effect rounded-xl p-4"
                  >
                    <span className="text-xl mb-2 block">{item.icon}</span>
                    <p className="text-gray-400 text-sm mb-1">{item.label}</p>
                    <p className="text-white font-medium text-sm">{item.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="glass-effect rounded-3xl p-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
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
