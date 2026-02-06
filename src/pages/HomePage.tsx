import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContactForm } from '../components/ContactForm';
import { useAppReady } from '../App';

// Tech Stack data with business value tooltips
const skillsRow1 = [
  { name: 'React', icon: '⚛️', value: 'Interactive UIs that keep users engaged' },
  { name: 'Next.js', icon: '▲', value: 'Blazing fast load speeds for better SEO' },
  { name: 'TypeScript', icon: 'TS', value: 'Fewer bugs, more reliable code' },
  { name: 'JavaScript', icon: 'JS', value: 'Dynamic functionality that converts' },
  { name: 'Tailwind CSS', icon: '✦', value: 'Rapid development, consistent design' },
  { name: 'HTML', icon: '</>', value: 'Semantic structure for accessibility' },
];

const skillsRow2 = [
  { name: 'CSS', icon: '🎨', value: 'Pixel-perfect, responsive layouts' },
  { name: 'Python', icon: '🐍', value: 'Automation & backend flexibility' },
  { name: 'Shopify', icon: '🛒', value: 'E-commerce stores that drive sales' },
  { name: 'WordPress', icon: 'W', value: 'Easy content management for clients' },
  { name: 'Figma', icon: '◈', value: 'Design-to-code precision' },
  { name: 'SEO', icon: '📈', value: 'Higher rankings, more organic traffic' },
];

// Skill Card Component
function SkillCard({ skill, isHovered, onHover, onLeave }: {
  skill: typeof skillsRow1[0];
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      className="relative flex-shrink-0"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Tooltip */}
      <div
        className={`absolute -top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-200 ${
          isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
        }`}
      >
        <div className="bg-gray-900/95 backdrop-blur-xl border border-indigo-500/30 rounded-xl px-4 py-2 shadow-xl shadow-purple-500/10 whitespace-nowrap">
          <p className="text-sm text-gray-200">{skill.value}</p>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900/95 border-r border-b border-indigo-500/30 rotate-45" />
        </div>
      </div>

      {/* Skill Card */}
      <div
        className={`flex items-center gap-3 px-5 py-3 md:px-6 md:py-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
          isHovered
            ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/50 shadow-lg shadow-purple-500/20 scale-105'
            : 'bg-white/5 border-white/10 hover:border-white/20'
        }`}
      >
        <span className={`text-lg md:text-xl font-bold transition-all duration-300 ${
          isHovered ? 'text-indigo-400' : 'text-gray-400'
        }`}>
          {skill.icon}
        </span>
        <span className={`font-medium text-sm md:text-base transition-colors duration-300 ${
          isHovered ? 'text-white' : 'text-gray-300'
        }`}>
          {skill.name}
        </span>
      </div>
    </div>
  );
}

// Pure CSS Infinite Scrolling Marquee Component - No lag
function TechMarquee({ skills, direction = 'left', duration = 25 }: { 
  skills: typeof skillsRow1; 
  direction?: 'left' | 'right';
  duration?: number;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Duplicate items for seamless loop (only need 2x for CSS animation)
  const duplicatedSkills = [...skills, ...skills];

  return (
    <div 
      className="relative overflow-hidden py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setHoveredSkill(null);
      }}
    >
      {/* Gradient masks for edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-dark to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-dark to-transparent z-10 pointer-events-none" />
      
      <div
        className={`flex gap-4 md:gap-6 ${
          direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
        } ${isPaused ? 'marquee-paused' : ''}`}
        style={{ 
          '--marquee-duration': `${duration}s`,
        } as React.CSSProperties}
      >
        {duplicatedSkills.map((skill, index) => (
          <SkillCard
            key={`${skill.name}-${index}`}
            skill={skill}
            isHovered={hoveredSkill === `${skill.name}-${index}`}
            onHover={() => setHoveredSkill(`${skill.name}-${index}`)}
            onLeave={() => setHoveredSkill(null)}
          />
        ))}
      </div>
    </div>
  );
}

const InteractiveOrb = lazy(() => import('../components/InteractiveOrb').then(m => ({ default: m.InteractiveOrb })));

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
    description: 'Dynamic fitness platform with class schedules, membership plans, and integrated booking system.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
    tags: ['HTML', 'CSS', 'WordPress', 'JavaScript'],
    gradient: 'from-indigo-900/60 to-purple-900/60',
    liveUrl: 'https://elev8fitness.wuaze.com/',
  },
  {
    id: 2,
    number: '02',
    title: 'Fashion E-Commerce',
    description: 'Full-featured Shopify store with custom theme, product filtering, and seamless checkout.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    tags: ['Shopify', 'Liquid', 'JavaScript', 'Custom Theme'],
    gradient: 'from-purple-900/60 to-fuchsia-900/60',
    liveUrl: null,
  },
  {
    id: 3,
    number: '03',
    title: 'Corporate Website',
    description: 'Professional consulting firm website with modern design and SEO optimization.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    gradient: 'from-blue-900/60 to-indigo-900/60',
    liveUrl: null,
  },
  {
    id: 4,
    number: '04',
    title: 'Creative Portfolio',
    description: 'Stunning photographer portfolio with smooth animations and gallery lightbox.',
    image: 'https://images.unsplash.com/photo-1545665277-5ac240ac9aed?w=800&h=600&fit=crop',
    tags: ['React', 'Framer Motion', 'CSS Grid'],
    gradient: 'from-emerald-900/60 to-teal-900/60',
    liveUrl: null,
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
    text: "I wasn't sure what to expect at first, but Hamza really surprised me. He listened to what I wanted and delivered something even better than I imagined. Super easy to work with and very professional!",
  },
  {
    id: 2,
    name: 'Ahmed Hassan',
    text: "Honestly, I've worked with other developers before and it was always a headache. Hamza made the whole process smooth and stress-free. My website looks amazing and my customers love it!",
  },
  {
    id: 3,
    name: 'Emily Chen',
    text: "Hamza built my Shopify store from scratch and I couldn't be happier. He really understood my brand and created something that feels exactly like me. Highly recommend his work!",
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
  const [currentReview, setCurrentReview] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Projects carousel state for mobile
  const [currentProject, setCurrentProject] = useState(0);

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
              Hi, I'm Hamza Sokkar
            </motion.p>
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Web Developer{' '}
              <span className="gradient-text">&amp; Digital Craftsman</span>
            </motion.h1>
            <motion.p 
              className="text-gray-400 text-lg md:text-xl mb-8 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              I craft exceptional digital experiences through elegant code and thoughtful design. 
              Specializing in React, TypeScript, and modern web technologies.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button
                onClick={() => scrollToSection('contact')}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-500 text-center"
              >
                Let's Talk
              </button>
              <button
                onClick={() => scrollToSection('projects')}
                className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/5 transition-all duration-500 text-center"
              >
                View Projects
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
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
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
              Building Digital <span className="gradient-text">Experiences</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Passionate about creating seamless user experiences and high-performance websites
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
                I'm a web developer with a passion for building beautiful, performant websites 
                that help businesses succeed online. My journey in tech started 3 years ago, and 
                since then, I've had the privilege of working with clients from different 
                industries worldwide.
              </p>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                I specialize in modern React frameworks and have a strong foundation in both 
                frontend development and e-commerce solutions. When I'm not coding, you'll find 
                me exploring new technologies and learning about design.
              </p>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Currently, I'm focused on building accessible, high-converting websites and 
                Shopify stores that help businesses establish a strong online presence and 
                increase their revenue.
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
              Professional <span className="gradient-text">Experience</span>
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

      {/* Projects Section - Premium Bento Grid */}
      <section id="projects" className="py-24 bg-gradient-to-b from-purple-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-20"
          >
            <span className="text-indigo-400 font-medium mb-4 block">Portfolio</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A selection of websites I've built for clients across various industries
            </p>
          </motion.div>

          {/* Desktop Grid (Hidden on Mobile) */}
          <div className="hidden md:grid grid-cols-2 gap-8 gap-y-20">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="group relative"
              >
                {/* Floating Header - Positioned Absolute Above */}
                <div className="absolute -top-12 left-0 z-10 flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white/40 to-white/10 group-hover:from-white/60 group-hover:to-white/30 transition-all duration-500">
                    {project.number}
                  </span>
                  <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors duration-300">
                    {project.title}
                  </h3>
                </div>

                {/* Card - Fixed Height for Uniformity */}
                <div className={`relative h-[500px] w-full rounded-[32px] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 bg-gradient-to-br ${project.gradient}`}>
                  {/* Content Layer */}
                  <div className="relative z-10 p-8 h-full flex flex-col">
                    <p className="text-white/90 text-lg font-light leading-relaxed mb-6 line-clamp-3">
                      {project.description}
                    </p>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-fit px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium hover:bg-white/20 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                      >
                        <span>View Live</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                    
                    {/* Browser Mockup - Anchored to bottom, fixed size */}
                    <div className="absolute bottom-0 left-8 right-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="bg-slate-900 rounded-t-xl p-2 pb-0 shadow-2xl border border-white/10 border-b-0">
                        {/* Browser Chrome */}
                        <div className="flex gap-1.5 mb-2 px-2 opacity-50">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        </div>
                        {/* Image Container */}
                        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-slate-800">
                           <img
                            src={project.image}
                            alt={project.title}
                            loading="lazy"
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Gradient Overlay for Depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* External Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm rounded-full border border-white/10 text-gray-400 group-hover:border-indigo-500/50 group-hover:text-white transition-colors duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
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
                {/* Mobile Header */}
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white/5">
                    {projects[currentProject].number}
                  </span>
                  <h3 className="text-2xl font-bold text-white -mt-3">
                    {projects[currentProject].title}
                  </h3>
                </div>

                {/* Mobile Card */}
                <div 
                  className={`relative bg-gradient-to-br ${projects[currentProject].gradient} rounded-[24px] p-5 pt-6 pb-0 overflow-hidden shadow-xl border border-white/5`}
                  style={{ minHeight: '280px' }}
                >
                  <div className="absolute inset-0 bg-dark/20 backdrop-blur-[1px]" />
                  
                  <div className="relative z-10">
                    <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
                      {projects[currentProject].description}
                    </p>

                    {projects[currentProject].liveUrl && (
                      <a
                        href={projects[currentProject].liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white text-sm font-medium rounded-full mb-6 border border-white/10"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Live
                      </a>
                    )}
                  </div>

                  <div className="relative mt-auto z-10">
                    <div className="relative mx-auto max-w-[90%] translate-y-2">
                      <div className="bg-[#1e1e2e] rounded-t-lg pt-2 px-2 shadow-lg border border-white/5 border-b-0">
                        <div className="flex gap-1 mb-1.5">
                          <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                          <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                          <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                        </div>
                      </div>
                      <div className="overflow-hidden">
                        <img
                          src={projects[currentProject].image}
                          alt={projects[currentProject].title}
                          loading="lazy"
                          className="w-full h-32 object-cover object-top opacity-90"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile External Tags */}
                <div className="flex flex-wrap gap-2 mt-4 pl-1">
                  {projects[currentProject].tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs rounded-full bg-transparent text-gray-400 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
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

      {/* Skills Section - Infinite Marquee */}
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
              My <span className="gradient-text">Skills</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Hover over any skill to see its business value
            </p>
          </motion.div>
        </div>

        {/* Full-width marquee container */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <TechMarquee skills={skillsRow1} direction="left" duration={20} />
          <TechMarquee skills={skillsRow2} direction="right" duration={25} />
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
              What People <span className="gradient-text">Say</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Feedback from clients I've had the pleasure of working with
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
                  <p className="font-semibold text-white text-center text-lg">— {reviews[currentReview].name}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={prevReview}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors duration-300"
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
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentReview 
                        ? 'w-8 bg-gradient-to-r from-indigo-500 to-purple-600' 
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextReview}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors duration-300"
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
              Let's Work <span className="gradient-text">Together</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Have a project in mind? Let's create something amazing together
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
